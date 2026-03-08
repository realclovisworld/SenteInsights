import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ParsedTransaction {
  date: string;
  time: string;
  transactionType: string;
  description: string;
  transactionId: string;
  from: string;
  to: string;
  amount: number;
  fees: number;
  taxes: number;
  balance: number;
  type: "sent" | "received";
  category: string;
}

export interface ParsedStatement {
  transactions: ParsedTransaction[];
  totalIn: number;
  totalOut: number;
  totalFees: number;
  totalTaxes: number;
  netBalance: number;
  incomingCount: number;
  outgoingCount: number;
  accountHolder: string;
  provider: string;
  dateRange: { from: string; to: string };
  validationError?: string;
}

// Step 6: Auto-detect account holder name
function detectAccountHolder(text: string): string {
  // Look for "Account Name" followed by a name, before "Mobile Number"
  const m = text.match(/Account\s*Name\s*[:\-]?\s*([A-Z][A-Z\s]+?)(?:\s*Mobile|\s*Phone|\s*Email|\s*\d)/i);
  if (m) return m[1].trim();
  // Fallback patterns
  const m2 = text.match(/(?:Statement\s+for|Subscriber|Name)\s*[:\-]?\s*([A-Z][A-Z\s]{3,})/i);
  if (m2) return m2[1].trim();
  return "";
}

function detectProvider(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("mtn") || lower.includes("mobile money") || lower.includes("momo")) return "MTN MoMo";
  if (lower.includes("airtel")) return "Airtel Money";
  if (lower.includes("equity")) return "Equity Bank";
  if (lower.includes("stanbic")) return "Stanbic Bank";
  return "Unknown";
}

// Step 7: Categorize each transaction
function categorize(description: string, transactionType: string, direction: "sent" | "received"): string {
  const text = (description + " " + transactionType).toUpperCase();

  if (text.includes("AIRTEL") || text.includes("MTN UGANDA LIMITED") || text.includes("AIRTIME") || text.includes("DATA BUNDLE") || text.includes("BUNDLE")) return "Airtime/Data";
  if (text.includes("UMEME") || text.includes("ELECTRICITY") || text.includes("NWSC") || text.includes("WATER") || text.includes("YAKA")) return "Utilities";
  if (text.includes("ABSA") || text.includes("STANBIC") || text.includes("EQUITY") || text.includes("KCB") || text.includes("POST BANK")) return "Bank Payment";
  if (text.includes("JUMIA") || text.includes("FOOD") || text.includes("RESTAURANT") || text.includes("ROLEX")) return "Food";
  if (transactionType.toUpperCase().includes("CASH OUT")) return "Cash Withdrawal";
  if (text.includes("FOREX")) return "Forex/Exchange";
  if (text.includes("INTEREST PAYOUT")) return "Interest Earned";
  if (text.includes("WORLD REMIT")) return "Remittance";
  if (transactionType.toUpperCase().includes("TRANSFER") && direction === "received") return "Transfer Received";
  return "Other";
}

function parseUGXAmount(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, "");
  return parseInt(cleaned, 10) || 0;
}

// Step 5: Determine direction
function determineDirection(
  transactionType: string,
  from: string,
  to: string,
  accountHolder: string
): "sent" | "received" {
  const typeLower = transactionType.toLowerCase();
  const holderNormalized = accountHolder.replace(/\s+/g, "").toUpperCase();
  const fromNormalized = from.replace(/\s+/g, "").toUpperCase();
  const toNormalized = to.replace(/\s+/g, "").toUpperCase();

  // Cash In is always incoming
  if (typeLower.includes("cash in")) return "received";
  // Cash Out / Payment is always outgoing
  if (typeLower.includes("cash out") || typeLower.includes("payment")) return "sent";

  // Cross-check with account holder name
  if (holderNormalized && toNormalized.includes(holderNormalized.substring(0, 6))) return "received";
  if (holderNormalized && fromNormalized.includes(holderNormalized.substring(0, 6))) return "sent";

  // Transfer direction by from/to
  if (typeLower.includes("transfer")) {
    if (holderNormalized && fromNormalized.includes(holderNormalized.substring(0, 6))) return "sent";
    if (holderNormalized && toNormalized.includes(holderNormalized.substring(0, 6))) return "received";
  }

  return "sent"; // default
}

export async function parsePDF(file: File): Promise<ParsedStatement> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Step 1: Extract all text from ALL pages
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  // Step 6: Detect account holder
  const accountHolder = detectAccountHolder(fullText);
  const provider = detectProvider(fullText);

  // Step 2: Skip header — find the first date pattern DD-MM-YYYY
  const firstDateMatch = fullText.match(/\d{2}-\d{2}-\d{4}/);
  const dataText = firstDateMatch
    ? fullText.substring(fullText.indexOf(firstDateMatch[0]))
    : fullText;

  // Step 3: Split into transaction blocks by date+time pattern
  const txStartRegex = /(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2}:\d{2})/g;
  const starts: { index: number; date: string; time: string }[] = [];
  let match;
  while ((match = txStartRegex.exec(dataText)) !== null) {
    starts.push({ index: match.index, date: match[1], time: match[2] });
  }

  const transactions: ParsedTransaction[] = [];

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].index : dataText.length;
    const block = dataText.substring(start.index, end);

    // Step 4: Extract fields from each transaction block
    const date = start.date;
    const time = start.time;

    // Remove the date+time prefix
    let rest = block.substring(date.length + 1 + time.length).trim();

    // Transaction Type: first keyword(s) after datetime
    let transactionType = "";
    const typePatterns = [
      "Cash Out", "Cash In", "Payment", "Transfer",
      "Incoming Transfer", "Outgoing Transfer",
      "Agent Commission", "Commission", "Reversal",
      "Bill Payment", "Merchant Payment"
    ];
    for (const tp of typePatterns) {
      if (rest.toUpperCase().startsWith(tp.toUpperCase())) {
        transactionType = tp;
        rest = rest.substring(tp.length).trim();
        break;
      }
    }
    // If no exact match, grab first word(s) as type
    if (!transactionType) {
      const wordMatch = rest.match(/^([A-Za-z\s]+?)(?=\s+[A-Z0-9])/);
      if (wordMatch) {
        transactionType = wordMatch[1].trim();
        rest = rest.substring(wordMatch[0].length).trim();
      }
    }

    // Transaction ID: MTN IDs start with 34 or 35, 11-12 digits
    const txIdMatch = rest.match(/\b(3[45]\d{9,10})\b/);
    const transactionId = txIdMatch ? txIdMatch[1] : "";

    // Description: text before the transaction ID
    let description = "";
    if (txIdMatch && txIdMatch.index !== undefined) {
      description = rest.substring(0, txIdMatch.index).trim();
      rest = rest.substring(txIdMatch.index + txIdMatch[0].length).trim();
    } else {
      // No TX ID found, description is everything before amounts
      const firstAmountIdx = rest.search(/\d{1,3}(?:,\d{3})+/);
      if (firstAmountIdx > 0) {
        description = rest.substring(0, firstAmountIdx).trim();
        rest = rest.substring(firstAmountIdx).trim();
      } else {
        description = rest.trim();
        rest = "";
      }
    }

    // Extract From and To from the description
    let from = "";
    let to = "";
    // Try to detect "From: ... To: ..." or just names separated by patterns
    const fromToMatch = description.match(/(.+?)\s+(?:to|TO)\s+(.+)/i);
    if (fromToMatch) {
      from = fromToMatch[1].trim();
      to = fromToMatch[2].trim();
    } else {
      // The full description might contain sender/receiver info
      from = description;
    }

    // Extract UGX amounts: Amount, Fees, Taxes, Balance
    const ugxAmounts: number[] = [];
    const amountRegex = /(\d{1,3}(?:,\d{3})*)/g;
    let amtMatch;
    while ((amtMatch = amountRegex.exec(rest)) !== null) {
      const val = parseUGXAmount(amtMatch[1]);
      if (val > 0) ugxAmounts.push(val);
    }

    const amount = ugxAmounts[0] || 0;
    const fees = ugxAmounts[1] || 0;
    const taxes = ugxAmounts[2] || 0;
    const balance = ugxAmounts[3] || 0;

    // Skip if no meaningful amount
    if (amount === 0 && fees === 0) continue;

    // Step 5: Determine direction
    const type = determineDirection(transactionType, from, to, accountHolder);

    // Step 7: Categorize
    const category = categorize(description, transactionType, type);

    transactions.push({
      date,
      time,
      transactionType,
      description: description || transactionType,
      transactionId,
      from,
      to,
      amount,
      fees,
      taxes,
      balance,
      type,
      category,
    });
  }

  // Compute totals
  let totalIn = 0;
  let totalOut = 0;
  let totalFees = 0;
  let totalTaxes = 0;
  let incomingCount = 0;
  let outgoingCount = 0;

  for (const t of transactions) {
    if (t.type === "received") {
      totalIn += t.amount;
      incomingCount++;
    } else {
      totalOut += t.amount;
      outgoingCount++;
    }
    totalFees += t.fees;
    totalTaxes += t.taxes;
  }

  // Date range
  const dates = transactions.map(t => t.date);
  const dateRange = {
    from: dates[0] || "",
    to: dates[dates.length - 1] || "",
  };

  // Step 8: Validation
  let validationError: string | undefined;
  if (pdf.numPages > 1 && transactions.length < 10) {
    validationError = `Parsing error — only ${transactions.length} transactions found from a ${pdf.numPages}-page PDF. Please check the PDF format.`;
  }

  return {
    transactions,
    totalIn,
    totalOut,
    totalFees,
    totalTaxes,
    netBalance: totalIn - totalOut,
    incomingCount,
    outgoingCount,
    accountHolder,
    provider,
    dateRange,
    validationError,
  };
}
