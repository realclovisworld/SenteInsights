# SenteInsights - Mobile Money Financial Intelligence

SenteInsights is an AI-powered financial analysis platform designed for African mobile money users. Upload your MTN MoMo or Airtel Money statements and get instant, actionable insights into your spending patterns, income sources, and financial habits.

## Features

- **Statement Upload & Parsing**: Securely upload and analyze mobile money statements as PDF files
- **AI-Powered Insights**: Get intelligent analysis of your spending patterns, top expense categories, and income sources
- **Visual Analytics**: Interactive charts and graphs showing spending trends, income breakdown, and savings goals
- **Transaction Analysis**: Detailed transaction tables with categorization and filtering
- **Spending Reports**: Comprehensive monthly trend analysis and spending breakdown
- **Savings Goals**: Track and manage your savings objectives
- **Multi-statement History**: Upload and compare multiple statements over time
- **Batch Processing**: Upload multiple statements at once for faster analysis
- **Tiered Plans**: Free plan for basic analysis plus premium plans for advanced features
- **Admin Dashboard**: Manage users, payments, and platform statistics
- **Secure Authentication**: Built with Clerk for secure user management
- **Privacy-First**: All data is encrypted and user-controlled

## Technology Stack

This project is built with:

- **Frontend**: React + TypeScript
- **UI Components**: shadcn-ui + Radix UI
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Clerk
- **Backend**: Supabase (PostgreSQL database + RLS)
- **PDF Parsing**: Custom PDF parser for statement extraction
- **State Management**: TanStack React Query
- **Animations**: Framer Motion
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js (v16+ recommended) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Bun (for package management) or npm/yarn

### Installation

```sh
# Clone the repository
git clone <https://github.com/realclovisworld/SenteInsights.git>

# Navigate to project directory
cd SenteInsights

# Install dependencies
bun install 
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Scripts

```sh
bun run dev          # Start dev server
bun run build        # Build for production
bun run build:dev    # Build for development
bun run lint         # Run ESLint
bun run test         # Run tests
bun run test:watch   # Run tests in watch mode
bun run preview      # Preview production build
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── admin/          # Admin dashboard components
│   └── ui/             # shadcn-ui components
├── pages/              # Page components (routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── pdfParser.ts    # PDF statement parsing logic
│   ├── plans.ts        # Subscription plan definitions
│   └── supabase-helpers.ts  # Database operations
├── integrations/       # Third-party integrations
│   └── supabase/      # Supabase configuration
└── App.tsx            # Main app component
```

## Environment Setup

Create a `.env.local` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Authentication

The app uses Clerk for authentication. Users can:
- Sign up with email
- Log in securely
- Access personalized dashboards
- Subscribe to premium plans

## Database (Supabase)

The application uses Supabase for data storage with:
- User profiles and authentication
- Statement storage and history
- Transaction records
- User settings and preferences
- Admin management tables

### Running Migrations

```sh
# Migrations are in supabase/migrations/
# Apply migrations via Supabase dashboard or CLI
```

## Admin Features

The admin dashboard allows administrators to:
- View user statistics and activity
- Manage user accounts
- Process and track payments
- Monitor platform usage
- Set maintenance modes
- Ban/unban users

Access: `/admin` (admin role required)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For issues, feature requests, or questions, please open an issue in the repository.
