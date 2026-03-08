import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ParsedTransaction {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM or ""
  transactionType: string;
  description: string;
  transactionId: string;
  from: string;
  to: string;
  accountName: string;
  reference: string;
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

// ============ DATE UTILITIES ============

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_PATTERN = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

/**
 * Parse any date string to YYYY-MM-DD
 */
export function parseDateToISO(dateStr: string): string {
  if (!dateStr) return "";
  const s = dateStr.trim();

  // Handle date+time by stripping time first (e.g. "31 Dec 2025 22:14")
  const withTimeNamed = s.match(/^(.+?)\s+\d{1,2}:\d{2}(?::\d{2})?$/);
  const normalizedInput = withTimeNamed ? withTimeNamed[1].trim() : s;

  // YYYY-MM-DD
  const iso = normalizedInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return normalizedInput;

  // DD-MM-YYYY or DD/MM/YYYY
  const dmy = normalizedInput.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;

  // DD-MM-YY
  const dmy2 = normalizedInput.match(/^(\d{2})[\/-](\d{2})[\/-](\d{2})$/);
  if (dmy2) return `20${dmy2[3]}-${dmy2[2]}-${dmy2[1]}`;

  // D MMM YYYY or DD MMM YYYY
  const named = normalizedInput.match(/^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i);
  if (named) {
    const day = named[1].padStart(2, "0");
    const month = MONTH_MAP[named[2].charAt(0).toUpperCase() + named[2].slice(1).toLowerCase()] || "01";
    return `${named[3]}-${month}-${day}`;
  }

  return normalizedInput;
}

/**
 * Format YYYY-MM-DD as "DD MMM YYYY" for display
 */
export function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  const monthIdx = parseInt(m, 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return isoDate;
  return `${parseInt(d, 10)} ${MONTH_ABBR[monthIdx]} ${y}`;
}

// ============ HELPERS ============

function parseUGXAmount(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function categorize(description: string, transactionType: string, direction: "sent" | "received"): string {
  const text = (description + " " + transactionType).toUpperCase();
  if (text.includes("AIRTEL") || text.includes("MTN UGANDA LIMITED") || text.includes("AIRTIME") || text.includes("DATA BUNDLE") || text.includes("BUNDLE") || text.includes("PREPAID MC PREPAID")) return "Airtime/Data";
  if (text.includes("UMEME") || text.includes("ELECTRICITY") || text.includes("NWSC") || text.includes("WATER") || text.includes("YAKA")) return "Utilities";
  if (text.includes("ABSA") || text.includes("STANBIC") || text.includes("EQUITY") || text.includes("KCB") || text.includes("POST BANK") || text.includes("BANK")) return "Bank Payment";
  if (text.includes("JUMIA") || text.includes("FOOD") || text.includes("RESTAURANT") || text.includes("ROLEX") || text.includes("JUMOWORLD")) return "Food";
  if (text.includes("CASH OUT") || text.includes("WITHDRAW")) return "Cash Withdrawal";
  if (text.includes("FOREX")) return "Forex/Exchange";
  if (text.includes("INTEREST PAYOUT")) return "Interest Earned";
  if (text.includes("WORLD REMIT")) return "Remittance";
  if (direction === "received" && (text.includes("TRANSFER") || text.includes("RECEIVED"))) return "Transfer Received";
  if (text.includes("SENT MONEY") || text.includes("PAYMENT")) return "Payment";
  return "Other";
}

// ============ PROVIDER / ACCOUNT DETECTION ============

function detectProvider(text: string): string {
  const lower = text.toLowerCase();
  const hasMTNMarkers =
    lower.includes("mtn") || lower.includes("mobile money") || lower.includes("momo") ||
    lower.includes("transaction id") || lower.includes("amount(ugx)") || lower.includes("fees(ugx)") ||
    lower.includes("taxes(ugx)") || lower.includes("balance(ugx)") || lower.includes("payment type");
  const hasAirtelMarkers =
    lower.includes("airtel money") || lower.includes("transaction successful") ||
    lower.includes(" credit ") || lower.includes(" debit ");
  if (hasMTNMarkers) return "MTN MoMo";
  if (hasAirtelMarkers) return "Airtel Money";
  return "Unknown";
}

type StatementFormat = "FORMAT_1" | "FORMAT_2";

function detectStatementFormat(text: string): StatementFormat {
  if (text.includes("Payment Type") || text.includes("To/From")) return "FORMAT_2";
  if (text.includes("Amount(UGX)") && text.includes("Fees(UGX)")) return "FORMAT_1";
  return "FORMAT_1";
}

function detectAccountHolder(text: string): string {
  const patterns = [
    /(?:Account\s*holder|Customer\s*Name|Account\s*Name|Subscriber\s*Name|Name)\s*[:\-]?\s*([A-Z][A-Za-z\s]{2,30}?)(?:\s*(?:Mobile|Phone|Wallet|Email|Account|$|\d))/im,
    /(?:Statement\s+for|Subscriber)\s*[:\-]?\s*([A-Z][A-Z\s]{3,})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1].trim().length > 1) return m[1].trim();
  }
  return "";
}

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
    /(?:Wallet|Mobile|Phone|MSISDN|Tel)\s*(?:Number|number|No\.?)?\s*[:\-]?\s*((?:\+?256)\d{9})/i,
    /(?:Wallet|Mobile|Phone|MSISDN|Tel)\s*(?:Number|number|No\.?)?\s*[:\-]?\s*(0\d{9})/i,
    /(?:Wallet|Mobile|Phone|MSISDN|Tel)\s*[:\-]?\s*(\d{10,15})/i,
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
  const fallback = text.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/);
  return fallback ? fallback[0] : "";
}

function detectStatementPeriod(text: string): string {
  const patterns = [
    /(?:Statement\s*Period|Period|Date\s*Range|From)\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\s*(?:to|[-–])\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:From)\s*[:\-]?\s*(\d{1,2}\s+\w+\s+\d{4})\s*(?:to|[-–])\s*(\d{1,2}\s+\w+\s+\d{4})/i,
    /From\s+date\s*[:\-]?\s*(\d{1,2}\s+\w+\s+\d{4})\s+To\s+date\s*[:\-]?\s*(\d{1,2}\s+\w+\s+\d{4})/i,
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

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  const provider = detectProvider(fullText);
  const format = detectStatementFormat(fullText);
  let accountHolder = detectAccountHolder(fullText);
  const phoneNumber = detectPhoneNumber(fullText);
  const emailAddress = detectEmail(fullText);
  const statementPeriod = detectStatementPeriod(fullText);
  const statementDate = detectStatementDate(fullText);

  let transactions: ParsedTransaction[] = [];

  if (provider === "Airtel Money") {
    transactions = parseAirtel(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseMTNNewFormat(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseMTN(fullText, accountHolder);
  } else if (format === "FORMAT_2") {
    transactions = parseMTNNewFormat(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseMTN(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseAirtel(fullText, accountHolder);
  } else {
    transactions = parseMTN(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseMTNNewFormat(fullText, accountHolder);
    if (transactions.length === 0) transactions = parseAirtel(fullText, accountHolder);
  }

  if (!accountHolder && transactions.length > 0) {
    accountHolder = detectAccountHolderFromTransactions(transactions);
  }

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

  // Sort transactions by date ascending
  transactions.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const dates = transactions.map(t => t.date);
  const dateRange = { from: dates[0] || "", to: dates[dates.length - 1] || "" };
  const resolvedPeriod = statementPeriod || statementDate || (dateRange.from && dateRange.to ? `${formatDateDisplay(dateRange.from)} to ${formatDateDisplay(dateRange.to)}` : "");

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

function parseAirtel(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const txRegex = /(\d{12,15})\s+(\d{2}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}\s*[APap][Mm])\s+/g;

  const starts: { index: number; txId: string; date: string; time: string }[] = [];
  let match;
  while ((match = txRegex.exec(fullText)) !== null) {
    starts.push({ index: match.index, txId: match[1], date: match[2], time: match[3].trim() });
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const endIdx = i + 1 < starts.length ? starts[i + 1].index : fullText.length;
    const block = fullText.substring(start.index + start.txId.length, endIdx).trim();

    let rest = block;
    const dtMatch = rest.match(/^\s*\d{2}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s*[APap][Mm]\s*/);
    if (dtMatch) rest = rest.substring(dtMatch[0].length);

    const isCredit = /\bCredit\b/i.test(rest);
    const type: "sent" | "received" = isCredit ? "received" : "sent";

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

    let description = rest
      .replace(/Transaction\s+Successful/gi, "")
      .replace(/\b(Credit|Debit)\b/gi, "")
      .replace(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})/g, "")
      .replace(/\d{12,15}/g, "")
      .replace(/\d{2}-\d{2}-\d{2}/g, "")
      .replace(/\d{1,2}:\d{2}\s*[APap][Mm]/g, "")
      .replace(/\s+/g, " ")
      .trim();

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

    let transactionType = "Transfer";
    const descUpper = description.toUpperCase();
    if (descUpper.includes("RECEIVED")) transactionType = "Cash In";
    if (descUpper.includes("SENT MONEY")) transactionType = "Transfer";
    if (descUpper.includes("CASH OUT") || descUpper.includes("WITHDRAW")) transactionType = "Cash Out";
    if (descUpper.includes("PAYMENT") || descUpper.includes("PAY BILL")) transactionType = "Payment";

    // Convert DD-MM-YY to YYYY-MM-DD
    const dateParts = start.date.split("-");
    const fullDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const category = categorize(description, transactionType, type);

    transactions.push({
      date: fullDate,
      time: start.time,
      transactionType,
      description: description || transactionType,
      transactionId: start.txId,
      from, to,
      accountName: "",
      reference: "",
      amount, fees,
      taxes: 0,
      balance,
      type,
      category,
    });
  }

  return transactions;
}

// ============ MTN MOMO NEW FORMAT PARSER (FORMAT_2) ============
// Handles dates like "2 Jan 2026 01:01" with +/- signed amounts
// Columns: Date & Time | Payment Type | To/From | Account Name | Amount | Transaction ID | Fees | Tax | Balance | Reference

function parseMTNNewFormat(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  const dateRegex = new RegExp(`(\\d{1,2}\\s+(?:${MONTHS_PATTERN})\\s+\\d{4})\\s+(\\d{1,2}:\\d{2})`, "gi");

  const starts: { index: number; date: string; time: string; matchLen: number }[] = [];
  let match;
  while ((match = dateRegex.exec(fullText)) !== null) {
    // Skip header dates (From date, To date)
    const before = fullText.substring(Math.max(0, match.index - 30), match.index);
    if (/(?:From|To)\s+date/i.test(before)) continue;
    starts.push({ index: match.index, date: match[1], time: match[2], matchLen: match[0].length });
  }

  if (starts.length === 0) return [];

  const paymentTypes = [
    "MOMO TO BANK", "INTERNET BUNDLE", "VOICE BUNDLE", "MERCHANT PAYMENT",
    "BUNDLE PURCHASE", "MOMO USER", "CASH OUT", "CASH IN",
    "AIRTIME", "DEBIT", "PAYMENT", "OTHER", "YANGE",
  ];

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const endIdx = i + 1 < starts.length ? starts[i + 1].index : fullText.length;
    let rest = fullText.substring(start.index + start.matchLen, endIdx).trim();

    // Strip disclaimer/footer text
    const disclaimerIdx = rest.indexOf("Disclaimer");
    if (disclaimerIdx !== -1) rest = rest.substring(0, disclaimerIdx).trim();
    const pageIdx = rest.indexOf("Page ");
    if (pageIdx !== -1 && pageIdx < rest.length - 20) {
      const afterPage = rest.substring(pageIdx);
      if (/^Page\s+\d+\s+of\s+\d+/i.test(afterPage)) {
        rest = rest.substring(0, pageIdx).trim();
      }
    }

    // Match payment type
    let transactionType = "";
    const restUpper = rest.toUpperCase();
    for (const pt of paymentTypes) {
      if (restUpper.startsWith(pt)) {
        transactionType = pt;
        rest = rest.substring(pt.length).trim();
        break;
      }
    }
    if (!transactionType) continue;

    // Find signed amount (+/- prefix)
    const amountMatch = rest.match(/([+-]\d+(?:\.\d{1,2})?)/);
    if (!amountMatch || amountMatch.index === undefined) continue;
    const rawAmount = parseFloat(amountMatch[1]);
    if (rawAmount === 0) continue;

    const amount = Math.abs(rawAmount);
    // Format 2: + means IN, - means OUT
    const type: "sent" | "received" = rawAmount > 0 ? "received" : "sent";

    // Text before signed amount = To/From phone + Account Name
    const beforeAmount = rest.substring(0, amountMatch.index).trim();
    // Text after signed amount
    const afterAmount = rest.substring(amountMatch.index + amountMatch[0].length).trim();

    // Extract Account Name: remove phone numbers and leading digit IDs
    let accountName = beforeAmount
      .replace(/\+256[\s\d]+/g, "") // remove +256 phone numbers
      .replace(/^\d{1,3}\s+/, "")    // remove leading digit IDs (1, 4, etc.)
      .replace(/\s+/g, " ")
      .trim();

    // Clean up: remove any trailing digits that might be phone fragments
    accountName = accountName.replace(/\s+\d{1,2}$/, "").trim();

    // Extract phone number from beforeAmount
    const phoneMatch = beforeAmount.match(/(\+256[\s\d]+)/);
    const phone = phoneMatch ? phoneMatch[1].replace(/\s/g, "") : "";

    // Set from/to based on direction
    let from = "", to = "";
    if (type === "received") {
      from = accountName || phone || "Unknown";
      to = accountHolder || "Self";
    } else {
      to = accountName || phone || "Unknown";
      from = accountHolder || "Self";
    }

    // Transaction ID (10-12 digit number)
    const txIdMatch = afterAmount.match(/\b(\d{10,12})\b/);
    const transactionId = txIdMatch ? txIdMatch[1] : "";

    // Extract fees and balance from text after transaction ID
    let afterTxnId = "";
    if (txIdMatch) {
      const txIdPos = afterAmount.indexOf(txIdMatch[1]);
      afterTxnId = afterAmount.substring(txIdPos + txIdMatch[1].length).trim();
    } else {
      afterTxnId = afterAmount;
    }

    // UGX-prefixed values for fees
    const ugxValues: number[] = [];
    const ugxRegex = /UGX\s+(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;
    let um;
    while ((um = ugxRegex.exec(afterTxnId)) !== null) {
      ugxValues.push(parseUGXAmount(um[1]));
    }

    const fees = ugxValues[0] || 0;

    // Balance: prefer last large comma-separated number
    let balance = ugxValues.length >= 2 ? ugxValues[ugxValues.length - 1] : 0;
    if (balance === 0) {
      const bareBalanceMatches = afterTxnId.match(/(\d{1,3}(?:,\d{3})+\.\d{2})/g);
      if (bareBalanceMatches) {
        const lastBare = bareBalanceMatches[bareBalanceMatches.length - 1];
        balance = parseUGXAmount(lastBare);
      }
    }

    // Reference: extract from end of afterTxnId
    let reference = afterTxnId
      .replace(/\b\d{10,12}\b/g, "")
      .replace(/UGX\s+\d[\d,.]*/g, "")
      .replace(/\d{1,3}(?:,\d{3})+\.\d{2}/g, "")
      .replace(/[-–]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // Filter out noise (very short or just numbers)
    if (reference.length < 2 || /^\d+$/.test(reference)) reference = "";

    // Convert date to YYYY-MM-DD
    const dateParts = start.date.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/);
    let normalizedDate = start.date;
    if (dateParts) {
      const day = dateParts[1].padStart(2, "0");
      const monthKey = dateParts[2].charAt(0).toUpperCase() + dateParts[2].slice(1).toLowerCase();
      const month = MONTH_MAP[monthKey] || "01";
      normalizedDate = `${dateParts[3]}-${month}-${day}`;
    }

    const category = categorize(
      (accountName || beforeAmount) + " " + transactionType,
      transactionType,
      type,
    );

    transactions.push({
      date: normalizedDate,
      time: start.time,
      transactionType,
      description: accountName || beforeAmount || transactionType,
      transactionId,
      from,
      to,
      accountName: accountName || "",
      reference: reference || "",
      amount,
      fees,
      taxes: 0,
      balance,
      type,
      category,
    });
  }

  return transactions;
}

// ============ MTN MOMO PARSER (FORMAT_1) ============

function parseMTN(fullText: string, accountHolder: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  const txStartRegex = /(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4}[\/-]\d{2}[\/-]\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)/g;

  const starts: { index: number; date: string; time: string }[] = [];
  let match;
  while ((match = txStartRegex.exec(fullText)) !== null) {
    starts.push({ index: match.index, date: match[1], time: match[2].trim() });
  }

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

    const prefixLen = start.date.length + (start.time ? 1 + start.time.length : 0);
    let rest = block.substring(prefixLen).trim();

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

    const txIdMatch = rest.match(/\b(\d{10,15})\b/);
    const transactionId = txIdMatch ? txIdMatch[1] : "";

    let description = "";
    if (txIdMatch && txIdMatch.index !== undefined) {
      description = rest.substring(0, txIdMatch.index).trim();
      rest = rest.substring(txIdMatch.index + txIdMatch[0].length).trim();
    } else {
      const firstAmountIdx = rest.search(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d{2}/);
      if (firstAmountIdx > 0) {
        description = rest.substring(0, firstAmountIdx).trim();
        rest = rest.substring(firstAmountIdx).trim();
      } else {
        description = rest.trim();
        rest = "";
      }
    }

    let from = "", to = "";
    const fromToMatch = description.match(/(.+?)\s+(?:to|TO)\s+(.+)/i);
    if (fromToMatch) {
      from = fromToMatch[1].trim();
      to = fromToMatch[2].trim();
    } else {
      from = description;
    }

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

    // Normalize date to YYYY-MM-DD
    let normalizedDate = start.date.replace(/\//g, "-");
    if (/^\d{4}-/.test(normalizedDate)) {
      // Already YYYY-MM-DD
    } else {
      // DD-MM-YYYY → YYYY-MM-DD
      const parts = normalizedDate.split("-");
      if (parts.length === 3) {
        normalizedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

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
      transactionId, from, to,
      accountName: "",
      reference: "",
      amount, fees, taxes, balance, type, category,
    });
  }

  return transactions;
}
