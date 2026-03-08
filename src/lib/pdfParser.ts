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
  phoneNumber: string;
  emailAddress: string;
  provider: string;
  statementPeriod: string;
  dateRange: { from: string; to: string };
  validationError?: string;
}

function parseUGXAmount(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function categorize(description: string, transactionType: string, direction: "sent" | "received"): string {
  const text = (description + " " + transactionType).toUpperCase();
  if (text.includes("AIRTEL") || text.includes("MTN UGANDA LIMITED") || text.includes("AIRTIME") || text.includes("DATA BUNDLE") || text.includes("BUNDLE") || text.includes("PREPAID MC PREPAID")) return "Airtime/Data";
  if (text.includes("UMEME") || text.includes("ELECTRICITY") || text.includes("NWSC") || text.includes("WATER") || text.includes("YAKA")) return "Utilities";
  if (text.includes("ABSA") || text.includes("STANBIC") || text.includes("EQUITY") || text.includes("KCB") || text.includes("POST BANK")) return "Bank Payment";
  if (text.includes("JUMIA") || text.includes("FOOD") || text.includes("RESTAURANT") || text.includes("ROLEX") || text.includes("JUMOWORLD")) return "Food";
  if (text.includes("CASH OUT") || text.includes("WITHDRAW")) return "Cash Withdrawal";
  if (text.includes("FOREX")) return "Forex/Exchange";
  if (text.includes("INTEREST PAYOUT")) return "Interest Earned";
  if (text.includes("WORLD REMIT")) return "Remittance";
  if (direction === "received" && (text.includes("TRANSFER") || text.includes("RECEIVED"))) return "Transfer Received";
  if (text.includes("SENT MONEY") || text.includes("PAYMENT")) return "Payment";
  return "Other";
}

// ============ PROVIDER DETECTION ============

function detectProvider(text: string): string {
  const lower = text.toLowerCase();

  // Strong MTN indicators first (to avoid false Airtel matches from merchant names like "Payment for Airtel")
  const hasMTNMarkers =
    lower.includes("mtn") ||
    lower.includes("mobile money") ||
    lower.includes("momo") ||
    lower.includes("transaction id") ||
    lower.includes("amount(ugx)") ||
    lower.includes("fees(ugx)") ||
    lower.includes("taxes(ugx)") ||
    lower.includes("balance(ugx)");

  // Airtel parser-specific markers
  const hasAirtelMarkers =
    lower.includes("airtel money") ||
    lower.includes("transaction successful") ||
    lower.includes(" credit ") ||
    lower.includes(" debit ");

  if (hasMTNMarkers) return "MTN MoMo";
  if (hasAirtelMarkers) return "Airtel Money";
  if (lower.includes("equity")) return "Equity Bank";
  if (lower.includes("stanbic")) return "Stanbic Bank";
  return "Unknown";
}

// ============ ACCOUNT HOLDER DETECTION ============

function detectAccountHolder(text: string): string {
  const patterns = [
    /(?:Customer\s*Name|Account\s*Name|Subscriber\s*Name|Name)\s*[:\-]?\s*([A-Z][A-Za-z\s]{2,30}?)(?:\s*(?:Mobile|Phone|Email|Account|$|\d))/im,
    /(?:Statement\s+for|Subscriber)\s*[:\-]?\s*([A-Z][A-Z\s]{3,})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1].trim().length > 1) return m[1].trim();
  }
  return "";
}

// Extract account holder from the most frequent "From" name in transactions
function detectAccountHolderFromTransactions(transactions: ParsedTransaction[]): string {
  const fromCounts: Record<string, number> = {};
  for (const t of transactions) {
    if (t.from && t.from.length > 1) {
      fromCounts[t.from] = (fromCounts[t.from] || 0) + 1;
    }
  }
  let best = "";
  let bestCount = 0;
  for (const [name, count] of Object.entries(fromCounts)) {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  }
  return best;
}

function detectPhoneNumber(text: string): string {
  const patterns = [
    // "Mobile Number 256760325115" or "Phone Number: +256..."
    /(?:Mobile|Phone|MSISDN|Tel)\s*(?:Number|No\.?)?\s*[:\-]?\s*((?:\+?256)\d{9})/i,
    /(?:Mobile|Phone|MSISDN|Tel)\s*(?:Number|No\.?)?\s*[:\-]?\s*(0\d{9})/i,
    /(?:Mobile|Phone|MSISDN|Tel)\s*[:\-]?\s*(\d{10,15})/i,
    // Standalone patterns
    /((?:\+256|256)\d{9})/,
    /(07[0-9]\d{7})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].replace(/[\s\-]/g, "").trim();
  }
  return "";
}

function detectEmail(text: string): string {
  const m = text.match(/(?:Email|E-mail)\s*(?:Address)?\s*[:\-]?\s*([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})/i);
  if (m) return m[1].trim();
  // Fallback: find any email
  const fallback = text.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/);
  return fallback ? fallback[0] : "";
}

function detectStatementPeriod(text: string): string {
  const patterns = [
    /(?:Statement\s*Period|Period|Date\s*Range|From)\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\s*(?:to|[-–])\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:From)\s*[:\-]?\s*(\d{1,2}\s+\w+\s+\d{4})\s*(?:to|[-–])\s*(\d{1,2}\s+\w+\s+\d{4})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return `${m[1]} to ${m[2]}`;
  }
  return "";
}

function detectStatementDate(text: string): string {
  const m = text.match(/(?:Date\s+of\s+Statement|Statement\s+Date)\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/i);
  return m ? m[1].trim() : "";
}

// ============ MAIN PARSE FUNCTION ============

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

  const provider = detectProvider(fullText);
  const accountHolder = detectAccountHolder(fullText);
  const phoneNumber = detectPhoneNumber(fullText);
  const emailAddress = detectEmail(fullText);
  const statementPeriod = detectStatementPeriod(fullText);

  let transactions: ParsedTransaction[] = [];

  if (provider === "Airtel Money") {
    transactions = parseAirtel(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseMTN(fullText, accountHolder);
  } else {
    transactions = parseMTN(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseAirtel(fullText, accountHolder);
  }

  // Compute totals
  let totalIn = 0, totalOut = 0, totalFees = 0, totalTaxes = 0;
  let incomingCount = 0, outgoingCount = 0;

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

  const dates = transactions.map(t => t.date);
  const dateRange = { from: dates[0] || "", to: dates[dates.length - 1] || "" };
  const resolvedPeriod = statementPeriod || (dateRange.from && dateRange.to ? `${dateRange.from} to ${dateRange.to}` : "");

  let validationError: string | undefined;
  if (pdf.numPages > 1 && transactions.length < 10) {
    validationError = `Parsing error — only ${transactions.length} transactions found from a ${pdf.numPages}-page PDF. Please check the PDF format.`;
  }

  return {
    transactions, totalIn, totalOut, totalFees, totalTaxes,
    netBalance: totalIn - totalOut,
    incomingCount, outgoingCount, accountHolder, phoneNumber, emailAddress,
    provider, statementPeriod: resolvedPeriod, dateRange, validationError,
  };
}

// ============ AIRTEL MONEY PARSER ============
// Format: TransactionID  DD-MM-YY HH:MM AM/PM  Description  Amount  Credit/Debit  Fee  Balance

function parseAirtel(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  // Airtel transaction IDs are long numbers (12+ digits) followed by date
  // Pattern: <txId> <DD-MM-YY> <HH:MM AM/PM> <description> <amount> <Credit|Debit> <fee> <balance>
  const txRegex = /(\d{12,15})\s+(\d{2}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}\s*[APap][Mm])\s+/g;

  const starts: { index: number; txId: string; date: string; time: string }[] = [];
  let match;
  while ((match = txRegex.exec(fullText)) !== null) {
    starts.push({
      index: match.index,
      txId: match[1],
      date: match[2],
      time: match[3].trim(),
    });
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const endIdx = i + 1 < starts.length ? starts[i + 1].index : fullText.length;
    const block = fullText.substring(start.index + start.txId.length, endIdx).trim();

    // Remove date+time from block start
    let rest = block;
    const dtMatch = rest.match(/^\s*\d{2}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s*[APap][Mm]\s*/);
    if (dtMatch) rest = rest.substring(dtMatch[0].length);

    // Detect Credit or Debit
    const isCredit = /\bCredit\b/i.test(rest);
    const isDebit = /\bDebit\b/i.test(rest);
    const type: "sent" | "received" = isCredit ? "received" : "sent";

    // Extract amounts - find all decimal numbers (amount, fee, balance)
    const amounts: number[] = [];
    const amtRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2}))/g;
    let am;
    while ((am = amtRegex.exec(rest)) !== null) {
      amounts.push(parseUGXAmount(am[1]));
    }

    const amount = amounts[0] || 0;
    const fees = amounts[1] || 0;
    const balance = amounts[2] || 0;

    if (amount === 0) continue;

    // Extract description: text before "Transaction Successful" or before amounts
    let description = rest;
    // Remove Credit/Debit, amounts, "Transaction Successful", and trailing data
    description = description
      .replace(/Transaction\s+Successful/gi, "")
      .replace(/\b(Credit|Debit)\b/gi, "")
      .replace(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})/g, "")
      .replace(/\d{12,15}/g, "") // remove next tx ID
      .replace(/\d{2}-\d{2}-\d{2}/g, "") // remove dates
      .replace(/\d{1,2}:\d{2}\s*[APap][Mm]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Parse from/to from description
    let from = "", to = "";
    const receivedMatch = description.match(/Received\s+(?:Money\s+)?[Ff]rom\s+(\d+)[\s,]*(.+)?/i);
    const sentMatch = description.match(/Sent\s+Money\s+to\s+(\d+)\s+(.+)/i);

    if (receivedMatch) {
      from = ((receivedMatch[1] || "") + " " + (receivedMatch[2] || "")).trim();
      to = accountHolder || "Self";
    } else if (sentMatch) {
      to = ((sentMatch[1] || "") + " " + (sentMatch[2] || "")).trim();
      from = accountHolder || "Self";
    }

    // Determine transaction type from description
    let transactionType = "Transfer";
    const descUpper = description.toUpperCase();
    if (descUpper.includes("RECEIVED")) transactionType = "Cash In";
    if (descUpper.includes("SENT MONEY")) transactionType = "Transfer";
    if (descUpper.includes("CASH OUT") || descUpper.includes("WITHDRAW")) transactionType = "Cash Out";
    if (descUpper.includes("PAYMENT") || descUpper.includes("PAY BILL")) transactionType = "Payment";

    // Convert DD-MM-YY to DD-MM-YYYY
    const dateParts = start.date.split("-");
    const fullDate = `${dateParts[0]}-${dateParts[1]}-20${dateParts[2]}`;

    const category = categorize(description, transactionType, type);

    transactions.push({
      date: fullDate,
      time: start.time,
      transactionType,
      description: description || transactionType,
      transactionId: start.txId,
      from, to,
      amount, fees,
      taxes: 0, // Airtel doesn't show separate taxes
      balance,
      type,
      category,
    });
  }

  return transactions;
}

// ============ MTN MOMO PARSER ============

function parseMTN(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  // Support multiple date formats: DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, YYYY/MM/DD
  const txStartRegex = /(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4}[\/-]\d{2}[\/-]\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)/g;

  const starts: { index: number; date: string; time: string }[] = [];
  let match;
  while ((match = txStartRegex.exec(fullText)) !== null) {
    starts.push({ index: match.index, date: match[1], time: match[2].trim() });
  }

  // If no date+time found, try date-only pattern
  if (starts.length === 0) {
    const dateOnlyRegex = /(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4}[\/-]\d{2}[\/-]\d{2})/g;
    while ((match = dateOnlyRegex.exec(fullText)) !== null) {
      starts.push({ index: match.index, date: match[1], time: "" });
    }
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].index : fullText.length;
    const block = fullText.substring(start.index, end);

    // Remove the date+time prefix
    const prefixLen = start.date.length + (start.time ? 1 + start.time.length : 0);
    let rest = block.substring(prefixLen).trim();

    // Transaction Type
    let transactionType = "";
    const typePatterns = [
      "Cash Out", "Cash In", "Payment", "Incoming Transfer", "Outgoing Transfer",
      "Transfer", "Agent Commission", "Commission", "Reversal",
      "Bill Payment", "Merchant Payment", "Deposit", "Withdrawal",
      "Mobile Money", "Send Money", "Receive Money", "Buy Airtime",
      "Pay Bill", "Third Party", "Interest Payout"
    ];
    for (const tp of typePatterns) {
      if (rest.toUpperCase().startsWith(tp.toUpperCase())) {
        transactionType = tp;
        rest = rest.substring(tp.length).trim();
        break;
      }
    }
    if (!transactionType) {
      const wordMatch = rest.match(/^([A-Za-z\s]+?)(?=\s+[A-Z0-9])/);
      if (wordMatch) {
        transactionType = wordMatch[1].trim();
        rest = rest.substring(wordMatch[0].length).trim();
      }
    }

    // Transaction ID - MTN IDs can vary (try multiple patterns)
    const txIdMatch = rest.match(/\b(\d{10,15})\b/);
    const transactionId = txIdMatch ? txIdMatch[1] : "";

    let description = "";
    if (txIdMatch && txIdMatch.index !== undefined) {
      description = rest.substring(0, txIdMatch.index).trim();
      rest = rest.substring(txIdMatch.index + txIdMatch[0].length).trim();
    } else {
      // Find where amounts start
      const firstAmountIdx = rest.search(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d{2}/);
      if (firstAmountIdx > 0) {
        description = rest.substring(0, firstAmountIdx).trim();
        rest = rest.substring(firstAmountIdx).trim();
      } else {
        description = rest.trim();
        rest = "";
      }
    }

    // From/To
    let from = "", to = "";
    const fromToMatch = description.match(/(.+?)\s+(?:to|TO)\s+(.+)/i);
    if (fromToMatch) {
      from = fromToMatch[1].trim();
      to = fromToMatch[2].trim();
    } else {
      from = description;
    }

    // UGX amounts - support both comma-separated and plain decimals
    const ugxAmounts: number[] = [];
    const amountRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+\.\d{2})/g;
    let amtMatch;
    while ((amtMatch = amountRegex.exec(rest)) !== null) {
      const val = parseUGXAmount(amtMatch[1]);
      if (val > 0) ugxAmounts.push(val);
    }

    const amount = ugxAmounts[0] || 0;
    const fees = ugxAmounts[1] || 0;
    const taxes = ugxAmounts[2] || 0;
    const balance = ugxAmounts[3] || 0;

    if (amount === 0 && fees === 0) continue;

    // Normalize date to DD-MM-YYYY
    let normalizedDate = start.date.replace(/\//g, "-");
    // If YYYY-MM-DD format, convert to DD-MM-YYYY
    if (/^\d{4}-/.test(normalizedDate)) {
      const parts = normalizedDate.split("-");
      normalizedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Direction
    const holderNorm = accountHolder.replace(/\s+/g, "").toUpperCase();
    const fromNorm = from.replace(/\s+/g, "").toUpperCase();
    const toNorm = to.replace(/\s+/g, "").toUpperCase();
    const typeLower = transactionType.toLowerCase();
    const descLower = description.toLowerCase();

    let type: "sent" | "received" = "sent";
    if (typeLower.includes("cash in") || typeLower.includes("incoming") || typeLower.includes("receive") || typeLower.includes("deposit")) type = "received";
    else if (typeLower.includes("interest")) type = "received";
    else if (typeLower.includes("cash out") || typeLower.includes("payment") || typeLower.includes("withdrawal") || typeLower.includes("send")) type = "sent";
    else if (descLower.includes("received") || descLower.includes("from")) type = "received";
    else if (descLower.includes("sent") || descLower.includes("paid")) type = "sent";
    else if (holderNorm && holderNorm.length >= 6 && toNorm.includes(holderNorm.substring(0, 6))) type = "received";
    else if (holderNorm && holderNorm.length >= 6 && fromNorm.includes(holderNorm.substring(0, 6))) type = "sent";

    const category = categorize(description, transactionType, type);

    transactions.push({
      date: normalizedDate, time: start.time, transactionType,
      description: description || transactionType,
      transactionId, from, to, amount, fees, taxes, balance, type, category,
    });
  }

  return transactions;
}
