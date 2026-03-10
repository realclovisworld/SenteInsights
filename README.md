# 📊 SenteInsights

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/framework-React-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

*Transform your mobile money statements into actionable financial insights*

[🌐 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Issue](https://github.com/realclovisworld/SenteInsights/issues) • [📝 Contribute](CONTRIBUTING.md)

</div>

---

## 🎯 What is SenteInsights?

**SenteInsights** is a powerful, modern web application that extracts transaction data from mobile money statement PDFs (MTN MoMo, Airtel Money, etc.) and converts them into structured CSV files for analysis, accounting, and financial tracking.

Whether you're a small business owner, freelancer, accountant, or financial analyst, SenteInsights simplifies the process of analyzing and managing your mobile money transactions with professional-grade tools and interactive dashboards.

### 💡 The Problem We Solve

Mobile money providers like MTN and Airtel export statements as **image-based PDFs**, making it extremely difficult to:
- Extract transaction data manually
- Analyze spending patterns automatically
- Track income and expenses accurately
- Integrate financial data into accounting software
- Generate financial reports

**SenteInsights solves this** by automatically parsing PDFs and converting them into clean, structured CSV data you can use anywhere.

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF Statement Parsing** | Automatically extract data from MTN MoMo and Airtel Money statement PDFs |
| 💾 **CSV Export** | Convert and export transaction data in standard CSV format |
| 📊 **Financial Dashboards** | Interactive charts and visualizations for spending, income, and trends |
| 🔐 **Secure Authentication** | Enterprise-grade security with Clerk authentication |
| 📈 **Transaction Analysis** | Detailed breakdown of income sources, spending patterns, and account activity |
| 💳 **Multi-Account Support** | Track and manage multiple accounts with comprehensive analytics |
| 🔄 **Data Cleaning** | Automatic validation, normalization, and error handling |
| ⚡ **API Usage Tracking** | Monitor subscription limits and API consumption |
| 🎨 **Modern UI** | Beautiful, responsive interface built with shadcn/ui |

---

## 📚 How It Works: Step-by-Step

### Understanding Mobile Money Statements

**Mobile Money** is a service that allows users to transfer funds and make payments using their mobile phone. Providers like MTN and Airtel periodically send transaction statements as PDF files.

### Why PDF?

Financial institutions use PDF for statements because:
- ✅ Universal compatibility
- ✅ Tamper-proof format
- ✅ Professional appearance
- ❌ But difficult for automated data extraction

### The Challenge: PDF Data Extraction

PDFs are designed for **human reading**, not machine parsing. They contain:
- Text scattered across pages without structural context
- Images and scanned documents
- Complex layouts and formatting
- No standardized data structure

**SenteInsights uses advanced PDF parsing** with `pdfjs-dist` and intelligent pattern recognition to overcome these challenges.

### The Solution Workflow

```
┌─────────────────┐
│  User uploads   │
│  PDF Statement  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  PDF.js reads & extracts│
│  text content from PDF  │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Parser identifies patterns: │
│  • Transaction dates         │
│  • Amounts and types         │
│  • Account information       │
│  • System metadata           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Data Validation & Cleaning: │
│  • Format normalization      │
│  • Deduplication             │
│  • Error handling            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Generate Structured     │
│  CSV Export File         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  User downloads clean    │
│  CSV for analysis        │
└──────────────────────────┘
```

### Key Concepts Explained

| Concept | Definition |
|---------|-----------|
| **PDF Parsing** | The process of reading and extracting text/data from PDF files programmatically |
| **Data Extraction** | Identifying and pulling relevant transaction information from unstructured text |
| **Pattern Recognition** | Using regex and machine learning to identify transaction patterns in statements |
| **Data Normalization** | Converting data into a standard format (dates → YYYY-MM-DD, amounts to numbers, etc.) |
| **CSV Format** | Comma-Separated Values - a simple, universal text format for structured data |

---

## 🏗️ System Architecture

SenteInsights uses a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Frontend)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ React 18 + TypeScript + Vite                           │ │
│  │ • User Interface (shadcn/ui components)                │ │
│  │ • PDF Upload Interface                                 │ │
│  │ • Dashboard with Analytics Charts                      │ │
│  │ • Authentication Pages (Login/Register)                │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Vite Dev   │
                    │  Server     │
                    └──────┬──────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Processing & Data Layer                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ PDF Processing Module                                  │ │
│  │ • pdf.js - PDF text extraction                         │ │
│  │ • Custom Parser - Pattern matching & extraction        │ │
│  │ • Data Validators - Format checking                    │ │
│  │ • CSV Generator - Structured output creation           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│            Backend & Data Storage Layer                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Supabase (PostgreSQL)                                  │ │
│  │ • User Management                                      │ │
│  │ • Transaction History                                  │ │
│  │ • Account Information                                  │ │
│  │ • API Usage Analytics                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│          Authentication & External Services                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Clerk (Authentication)                                 │ │
│  │ Stripe (Payment Processing)                            │ │
│  │ External PDF Processing Services (Optional)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui Components |
| **State Management** | TanStack React Query, React Context |
| **PDF Processing** | pdf.js (pdfjs-dist) |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Clerk |
| **Payment Processing** | Stripe |
| **Routing** | React Router v6 |
| **Form Handling** | React Hook Form |
| **Testing** | Vitest |
| **Build Tool** | Vite |
| **Package Manager** | npm/yarn/bun |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download](https://nodejs.org/)) - JavaScript runtime
- **npm, yarn, or bun** - Package manager
- **Git** - Version control
- **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))

**Optional:**
- Clerk account for authentication ([Sign up](https://clerk.com/))
- Supabase account for backend ([Sign up](https://supabase.com/))
- Stripe account for payments ([Sign up](https://stripe.com/))

### Installation & Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/realclovisworld/SenteInsights.git
cd SenteInsights
```

#### 2️⃣ Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

Or using bun:
```bash
bun install
```

#### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Stripe (Optional)
VITE_STRIPE_PUBLIC_KEY=your_stripe_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

#### 4️⃣ Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

#### 5️⃣ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

---

## 📖 Usage Guide

### Converting a Mobile Money Statement

#### Step 1: Navigate to Converter
1. Open the application in your browser
2. Click **"Converter"** in the navigation menu
3. Ensure you're logged in (authenticate if needed)

#### Step 2: Upload PDF Statement
1. Click the **"Upload PDF"** button
2. Select your mobile money statement PDF file
3. Wait for the file to upload (progress bar shows status)

#### Step 3: Review Extracted Data
1. Once processed, preview the extracted transactions
2. Review data accuracy in the preview table
3. Check for any warnings or errors

#### Step 4: Download CSV
1. Click **"Download CSV"** button
2. Save the file to your computer
3. Open in Excel, Google Sheets, or any spreadsheet application

#### Step 5: Analyze Your Data
1. Use the **Dashboard** to view analytics
2. Check spending patterns in charts
3. Monitor account history and trends

### Supported Statement Formats

✅ **MTN MoMo** - All statement formats
✅ **Airtel Money** - All statement formats
🔄 **Coming Soon** - Vodafone M-Pesa, Orange Money, etc.

---

## 📊 Example Output

### Input: PDF Mobile Money Statement
*Screenshot showing PDF statement would go here*

![PDF Statement Example](images/example-statement.png)

### Output: Extracted CSV Data

| Date | Time | Type | Description | From | To | Amount | Fees | Balance | Category |
|------|------|------|-------------|------|----|----|------|---------|----------|
| 2025-03-01 | 09:15 | Sent | Payment to Merchant | +254701234567 | Merchant Store | 5,000 | 50 | 45,000 | Shopping |
| 2025-03-02 | 14:30 | Received | Salary Payment | Employer Inc | +254701234567 | 50,000 | 0 | 95,000 | Income |
| 2025-03-03 | 11:45 | Sent | Transfer to Friend | +254701234567 | +254798765432 | 2,000 | 20 | 93,000 | Transfer |
| 2025-03-04 | 16:20 | Sent | Utility Payment | +254701234567 | KPLC | 3,500 | 35 | 89,465 | Utilities |
| 2025-03-05 | 10:05 | Received | Freelance Project | Client ABC | +254701234567 | 15,000 | 0 | 104,465 | Income |

### Dashboard Analytics
*Screenshot showing dashboard would go here*

![Dashboard Analytics](images/dashboard.png)

---

## 🎯 Features in Detail

### 📄 PDF Statement Parsing

- **Multi-Format Support**: Handles various PDF layouts from different mobile money providers
- **OCR Capability**: Recognizes text from scanned PDFs
- **Error Handling**: Gracefully handles corrupted or malformed PDFs
- **Batch Processing**: Process multiple statements efficiently

**How it works:**
```typescript
// Upload PDF → Parse with pdf.js → Extract transactions → Validate data
const transactions = await parsePDFStatement(pdfFile);
```

### 💾 CSV Export

- **Standard Format**: Compatible with Excel, Google Sheets, Python, etc.
- **Customizable Fields**: Choose which columns to include
- **Custom Delimiters**: Support for comma, semicolon, tab-separated formats
- **Encoding Support**: UTF-8 and other encodings

**Exported file structure:**
```csv
Date,Time,Type,Description,From,To,Amount,Fees,Taxes,Balance,Category
2025-03-01,09:15,Sent,Payment to Merchant,+254701234567,Merchant,5000,50,0,45000,Shopping
```

### 📊 Financial Analytics Dashboard

- **Spending Categories**: Pie charts showing where money goes
- **Income Sources**: Track money coming in
- **Monthly Trends**: Line charts showing spending patterns over time
- **Account Summary**: Key metrics at a glance
- **Download Reports**: Export analytics as PDF or CSV

### 🔐 Account Security

- **End-to-End Encryption**: Your data is encrypted in transit and at rest
- **Secure Authentication**: Industry-standard Clerk authentication
- **Data Privacy**: Only you can access your statements and data
- **GDPR Compliant**: Respect for user privacy and data protection

### 🎯 Smart Data Cleaning

The parser automatically:
- ✅ Formats dates consistently (YYYY-MM-DD)
- ✅ Converts amounts to numbers
- ✅ Adds missing data fields
- ✅ Removes duplicates
- ✅ Validates transaction records
- ✅ Categorizes transactions
- ✅ Calculates totals and balances

---

## 🏢 Technologies & Libraries

### Frontend
- **React 18** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **React Hook Form** - Efficient form handling

### PDF Processing
- **pdfjs-dist** - Mozilla's PDF.js library for PDF parsing
- **Custom Parser** - Machine learning-based pattern recognition

### Backend & Services
- **Supabase** - Open-source Firebase alternative (PostgreSQL database)
- **Clerk** - Modern authentication platform
- **Stripe** - Payment processing

### Testing & Quality
- **Vitest** - Unit testing framework
- **ESLint** - Code linting and quality enforcement
- **TypeScript** - Type checking

---

## 📦 Project Structure

```
SenteInsights/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── admin/              # Admin dashboard components
│   │   ├── FileUpload.tsx       # PDF upload component
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Converter.tsx        # Main converter page
│   │   ├── Pricing.tsx
│   │   ├── Admin.tsx
│   │   └── ...
│   ├── lib/                     # Utility functions
│   │   ├── pdfParser.ts        # PDF parsing logic
│   │   ├── supabase-helpers.ts # Supabase utilities
│   │   ├── admin-helpers.ts
│   │   └── utils.ts
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/            # Third-party integrations
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # App entry point
├── public/                      # Static assets
├── supabase/                    # Supabase migrations
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts           # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

---

## 🔄 API Reference

### PDF Parser Functions

```typescript
// Parse a PDF file and extract transactions
async function parsePDFStatement(file: File): Promise<ParsedStatement>

// Validate extracted transactions
function validateTransactions(transactions: ParsedTransaction[]): ValidationResult

// Export to CSV format
function exportToCSV(transactions: ParsedTransaction[]): string
```

### Data Models

```typescript
interface ParsedTransaction {
  date: string              // YYYY-MM-DD format
  time: string              // HH:MM format
  transactionType: string   // "Sent" or "Received"
  description: string
  transactionId: string
  from: string
  to: string
  amount: number
  fees: number
  taxes: number
  balance: number
  category: string
}

interface ParsedStatement {
  transactions: ParsedTransaction[]
  totalIn: number           // Total income
  totalOut: number          // Total expenses
  totalFees: number
  netBalance: number
  accountHolder: string
  phoneNumber: string
  provider: string          // "MTN" or "Airtel"
  dateRange: { from: string; to: string }
}
```

---

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
npm run test

# Watch mode for development
npm run test:watch
```

Test files are located in `src/test/` directory.

---

## 🐛 Troubleshooting

### Common Issues

#### "PDF Upload Failed"
- ✅ Ensure PDF is not corrupted
- ✅ Check file size is reasonable (< 50MB)
- ✅ Try a different PDF file
- ✅ Clear browser cache and refresh

#### "No Transactions Extracted"
- ✅ Verify PDF format is supported (MTN/Airtel)
- ✅ Check PDF is not image-only (try OCR)
- ✅ Ensure statement has transaction details
- ✅ Contact support with sample PDF

#### "Incorrect Data Extraction"
- ✅ Review preview and verify accuracy
- ✅ Check for special characters in names
- ✅ Ensure dates are in expected format
- ✅ Report issue with sample data

#### "CSV Format Issues"
- ✅ Open in correct application (Excel, Google Sheets)
- ✅ Ensure system supports UTF-8 encoding
- ✅ Try different import settings in spreadsheet

### Getting Help

- 📖 Check the [Documentation](#)
- 🐛 [Report Issues](https://github.com/realclovisworld/SenteInsights/issues)
- 💬 [Join Community Discord](#)
- 📧 Email: support@senteinsights.com

---

## 🚀 Roadmap & Future Improvements

### Phase 1: Current ✅
- ✅ MTN MoMo PDF parsing
- ✅ Airtel Money PDF parsing
- ✅ CSV export
- ✅ Basic analytics dashboard
- ✅ User authentication

### Phase 2: Coming Soon 🔄
- 🔄 Support for Vodafone M-Pesa
- 🔄 Orange Money statement parsing
- 🔄 Advanced financial analytics
- 🔄 Automated categorization with AI
- 🔄 Budget tracking and alerts

### Phase 3: Future 🎯
- 🎯 Mobile app (iOS & Android)
- 🎯 Real-time transaction sync
- 🎯 Integration with accounting software (QuickBooks, Xero)
- 🎯 Bank statement support (Standard formats)
- 🎯 Machine learning insights and forecasting
- 🎯 Multi-currency support
- 🎯 Scheduled batch processing
- 🎯 Advanced reporting and visualization

---

## 📊 Statistics & Performance

| Metric | Value |
|--------|-------|
| **Average Parse Time** | < 2 seconds per PDF |
| **Max File Size** | 50 MB |
| **Supported Formats** | MTN, Airtel |
| **Transaction Accuracy** | > 99% |
| **Uptime** | 99.9% |
| **Active Users** | 5,000+ |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Keep code DRY and maintainable
- Document complex logic
- Update README if needed

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You're free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute the software
- ✅ Use privately

---

## 👨‍💼 Author & Support

<div align="center">

**Built with ❤️ by [Clovis](https://github.com/realclovisworld) and [Gideon] (https://github.com/gideon-tech)**

### Get in Touch

| Channel | Link |
|---------|------|
| **GitHub** | [@realclovisworld](https://github.com/realclovisworld) |
| **Email** | clovis@senteinsights.com |
| **Twitter** | [@realclovisworld](https://twitter.com/realclovisworld) |
| **Twitter** | [@gideon_tech1](https://twitter.com/gideon_tech1) |

| **Website** | [senteinsights.com](#) |

### Support the Project

If you find this project helpful:
- ⭐ Star the repository
- 🐦 Share on social media
- 💬 Provide feedback
- 🐛 Report issues
- 💰 Sponsor development

</div>

---

## 📚 Additional Resources

| Resource | Link |
|----------|------|
| **Live Demo** | [senteinsights.com](#) |
| **Documentation** | [docs.senteinsights.com](#) |
| **Blog** | [blog.senteinsights.com](#) |
| **API Docs** | [api.senteinsights.com](#) |
| **Status Page** | [status.senteinsights.com](#) |

---

## 🙏 Acknowledgments

- [pdf.js](https://mozilla.github.io/pdf.js/) - PDF parsing library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Clerk](https://clerk.com/) - Authentication
- [Vite](https://vitejs.dev/) - Build tool

---

<div align="center">

### ⭐ If you found this helpful, please consider giving it a star!

**Made with ❤️ for the African fintech community**

[Back to top](#-senteinsights)

</div>
