import * as pdfjsLib from "pdfjs-dist";

// Set worker source
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
}

const INCOMING_TYPES = [
  "cash in", "transfer received", "incoming transfer", "money received",
  "deposit", "reversal credit", "commission received"
];

const OUTGOING_TYPES = [
  "cash out", "payment", "transfer sent", "outgoing transfer",
  "withdrawal", "airtime", "bill payment", "merchant payment",
  "bundle purchase", "tax deduction"
];

function categorize(description: string, transactionType: string): string {
  const text = (description + " " + transactionType).toLowerCase();
  if (text.includes("airtime") || text.includes("data bundle") || text.includes("bundle")) return "Airtime";
  if (text.includes("food") || text.includes("jumia") || text.includes("restaurant") || text.includes("rolex") || text.includes("cafe")) return "Food";
  if (text.includes("safeboda") || text.includes("bolt") || text.includes("uber") || text.includes("transport") || text.includes("fuel") || text.includes("boda")) return "Transport";
  if (text.includes("umeme") || text.includes("nwsc") || text.includes("electricity") || text.includes("water") || text.includes("dstv") || text.includes("bill") || text.includes("yaka") || text.includes("tv subscription")) return "Bills";
  if (text.includes("saving") || text.includes("savings")) return "Savings";
  if (text.includes("entertainment") || text.includes("bet") || text.includes("cinema") || text.includes("game")) return "Entertainment";
  return "Other";
}

function isIncoming(transactionType: string, from: string, to: string, accountHolder: string): boolean {
  const typeLower = transactionType.toLowerCase();
  if (INCOMING_TYPES.some(t => typeLower.includes(t))) return true;
  if (accountHolder && to.toLowerCase().includes(accountHolder.toLowerCase().substring(0, 6))) return true;
  return false;
}

function isOutgoing(transactionType: string, from: string, to: string, accountHolder: string): boolean {
  const typeLower = transactionType.toLowerCase();
  if (OUTGOING_TYPES.some(t => typeLower.includes(t))) return true;
  if (accountHolder && from.toLowerCase().includes(accountHolder.toLowerCase().substring(0, 6))) return true;
  return false;
}

function parseAmount(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

function detectAccountHolder(fullText: string): string {
  // Try to find account holder name from the statement header
  const patterns = [
    /(?:Account\s*(?:Name|Holder)|Name)\s*[:\-]?\s*([A-Z][A-Z\s]+)/i,
    /(?:Statement\s+for|Subscriber)\s*[:\-]?\s*([A-Z][A-Z\s]+)/i,
    /(?:Dear|Mr\.|Mrs\.|Ms\.)\s+([A-Z][A-Z\s]+)/i,
  ];
  for (const p of patterns) {
    const m = fullText.match(p);
    if (m) return m[1].trim();
  }
  return "";
}

export async function parsePDF(file: File): Promise<ParsedStatement> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Extract ALL pages
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  const accountHolder = detectAccountHolder(fullText);
  const provider = detectProvider(fullText);

  // Parse transactions from the text
  const transactions = extractTransactions(fullText, accountHolder);

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
  };
}

function detectProvider(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("mtn") || lower.includes("mobile money") || lower.includes("momo")) return "MTN MoMo";
  if (lower.includes("airtel")) return "Airtel Money";
  if (lower.includes("equity")) return "Equity Bank";
  if (lower.includes("stanbic")) return "Stanbic Bank";
  return "Unknown";
}

function extractTransactions(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  // MTN MoMo Uganda format: date patterns followed by transaction data
  // Common date formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY, DD Mon YYYY
  const lines = fullText.split(/\n/);

  // Try to parse as tabular data - look for rows with date patterns
  const dateRegex = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/;
  const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)/;
  const amountRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;

  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    if (!dateMatch) continue;

    const date = dateMatch[1];
    const timeMatch = line.match(timeRegex);
    const time = timeMatch ? timeMatch[1] : "";

    // Extract all numbers from the line (potential amounts)
    const amounts: number[] = [];
    let amountMatch;
    const amountSearchRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;
    const afterDate = line.substring(line.indexOf(date) + date.length);
    while ((amountMatch = amountSearchRegex.exec(afterDate)) !== null) {
      const val = parseAmount(amountMatch[1]);
      if (val >= 100) { // Filter out small numbers that are likely IDs or noise
        amounts.push(val);
      }
    }

    if (amounts.length === 0) continue;

    // Try to extract meaningful parts from the line
    // Remove date, time, and amounts to get description text
    let textPart = line;
    textPart = textPart.replace(dateRegex, "").replace(timeRegex, "");

    // Look for transaction ID patterns
    const txIdMatch = textPart.match(/([A-Z0-9]{8,})/);
    const transactionId = txIdMatch ? txIdMatch[1] : "";

    // Try to detect From/To fields
    const fromMatch = textPart.match(/(?:from|sender)[:\s]*([^\d,]+)/i);
    const toMatch = textPart.match(/(?:to|recipient|receiver)[:\s]*([^\d,]+)/i);
    const from = fromMatch ? fromMatch[1].trim() : "";
    const to = toMatch ? toMatch[1].trim() : "";

    // Extract transaction type keywords
    const typeKeywords = [
      "Cash In", "Cash Out", "Transfer", "Payment", "Airtime",
      "Bundle", "Bill Payment", "Merchant", "Withdrawal", "Deposit",
      "Commission", "Reversal", "Agent", "P2P", "Tax"
    ];
    let transactionType = "";
    for (const kw of typeKeywords) {
      if (textPart.toLowerCase().includes(kw.toLowerCase())) {
        transactionType = kw;
        break;
      }
    }

    // Clean description - remove numbers and extra spaces
    let description = textPart
      .replace(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g, "")
      .replace(/[A-Z0-9]{8,}/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!description && transactionType) description = transactionType;
    if (!description) description = "Transaction";

    // Determine amounts: usually Amount, Fees, Taxes, Balance in order
    const amount = amounts[0] || 0;
    const fees = amounts.length > 2 ? amounts[1] || 0 : 0;
    const taxes = amounts.length > 3 ? amounts[2] || 0 : 0;
    const balance = amounts.length > 1 ? amounts[amounts.length - 1] || 0 : 0;

    // Determine direction
    let type: "sent" | "received" = "sent";
    if (isIncoming(transactionType, from, to, accountHolder)) {
      type = "received";
    } else if (isOutgoing(transactionType, from, to, accountHolder)) {
      type = "sent";
    }

    const category = categorize(description, transactionType);

    transactions.push({
      date,
      time,
      transactionType,
      description,
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

  // If no structured parsing worked, try a more aggressive approach
  if (transactions.length === 0) {
    return fallbackParse(fullText, accountHolder);
  }

  return transactions;
}

function fallbackParse(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  
  // Split by any date pattern and parse chunks
  const chunks = fullText.split(/(?=\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/);
  
  for (const chunk of chunks) {
    if (chunk.trim().length < 10) continue;
    
    const dateMatch = chunk.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/);
    if (!dateMatch) continue;
    
    const timeMatch = chunk.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    const amounts: number[] = [];
    const amountRegex = /(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?)/g;
    let m;
    while ((m = amountRegex.exec(chunk)) !== null) {
      amounts.push(parseAmount(m[1]));
    }
    
    if (amounts.length === 0) continue;
    
    const description = chunk
      .replace(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/g, "")
      .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, "")
      .replace(/\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 100) || "Transaction";
    
    let transactionType = "";
    const typeKeywords = ["Cash In", "Cash Out", "Transfer", "Payment", "Airtime", "Bundle", "Bill", "Deposit", "Withdrawal"];
    for (const kw of typeKeywords) {
      if (chunk.toLowerCase().includes(kw.toLowerCase())) {
        transactionType = kw;
        break;
      }
    }
    
    const type: "sent" | "received" = isIncoming(transactionType, "", "", accountHolder) ? "received" : "sent";
    
    transactions.push({
      date: dateMatch[1],
      time: timeMatch ? timeMatch[1] : "",
      transactionType,
      description,
      transactionId: "",
      from: "",
      to: "",
      amount: amounts[0] || 0,
      fees: amounts.length > 2 ? amounts[1] : 0,
      taxes: amounts.length > 3 ? amounts[2] : 0,
      balance: amounts.length > 1 ? amounts[amounts.length - 1] : 0,
      type,
      category: categorize(description, transactionType),
    });
  }
  
  return transactions;
}
