# Invoice Management System (Gestion de Facturation)

A modern, professional invoice management application built with Next.js, TypeScript, and Shadcn UI.

## Features

- ✨ **Modern UI**: Beautiful, responsive interface built with Shadcn UI and Tailwind CSS
- 📄 **Invoice Creation**: Create professional invoices with client details and line items
- 📊 **Dynamic Calculations**: Automatic calculation of subtotals, taxes, and totals
- 📋 **Invoice Management**: View, edit, and manage all your invoices in one place
- 🔍 **Search & Filter**: Find invoices quickly with search and status filtering
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ✅ **Form Validation**: Comprehensive form validation with real-time feedback
- 🎨 **Professional Styling**: Clean, modern design suitable for business use

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Attafii/Invoiceapp.git
cd Invoiceapp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── invoice/          # Invoice-specific components
│       ├── invoice-form.tsx
│       ├── invoice-list.tsx
│       ├── invoice-display.tsx
│       ├── invoice-summary.tsx
│       └── line-items.tsx
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   ├── invoice-utils.ts # Invoice-specific utilities
│   └── validations.ts   # Zod validation schemas
└── types/               # TypeScript type definitions
    └── invoice.ts       # Invoice-related types
```

## Features Overview

### Invoice Creation
- Client information (name and address)
- Invoice and due dates with date picker
- Dynamic line items with add/remove functionality
- Automatic calculations for quantities, prices, and totals
- Configurable tax rates
- Real-time invoice summary

### Invoice Management
- List view with search and filtering
- Status tracking (Draft, Sent, Paid, Overdue)
- Quick actions (View, Edit, Download)
- Summary statistics and metrics

### Form Validation
- Required field validation
- Number validation for quantities and prices
- Date validation (due date must be after invoice date)
- Real-time error feedback

## Usage

### Creating an Invoice

1. Click "Create Invoice" or "New Invoice"
2. Fill in client information
3. Set invoice and due dates
4. Add line items with descriptions, quantities, and prices
5. Set tax rate if applicable
6. Save as draft or send directly

### Managing Invoices

- Use the search bar to find specific invoices
- Filter by status (Draft, Sent, Paid, Overdue)
- Click action buttons to view, edit, or download invoices
- Monitor key metrics in the dashboard cards

## Customization

### Currency and Localization
The application is currently configured for EUR currency and French locale. You can modify this in `src/lib/invoice-utils.ts`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and Shadcn UI
