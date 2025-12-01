# Supermarket Calc 📊

> **Transform your Supermarket Simulator gameplay into actionable business intelligence**

A real-time collaborative web dashboard designed specifically for **Steam Supermarket Simulator** players who want to track, analyze, and optimize their virtual store performance like a real business owner.

![Supermarket Calc Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Real--Time](https://img.shields.io/badge/Real--Time-Sync-orange)

---

## 🎯 Why Supermarket Calc?

### The Problem
Playing Supermarket Simulator is fun, but tracking your store's financial performance across multiple game sessions is challenging. Spreadsheets are tedious, and the in-game metrics don't give you the big picture. You need a way to:
- **See trends** across days and weeks
- **Compare performance** between different strategies
- **Share progress** with friends or co-op partners
- **Make data-driven decisions** about inventory, pricing, and staffing

### The Solution
Supermarket Calc bridges the gap between casual gameplay and serious business simulation. It provides a **professional-grade analytics dashboard** that turns your daily game stats into meaningful insights, helping you:

✅ **Identify your most profitable days** and understand what made them successful  
✅ **Spot negative trends early** before they tank your virtual business  
✅ **Calculate real profit margins** including COGS and operating expenses  
✅ **Track customer behavior** with average basket size and traffic patterns  
✅ **Collaborate in real-time** with friends playing the same save file  
✅ **Learn business fundamentals** through gamified financial tracking  

---

## 🎨 Design Philosophy

Supermarket Calc was built with inspiration from **leading data-heavy dashboard UX patterns** used by enterprise SaaS platforms, fintech applications, and professional analytics tools. The design prioritizes:

### Visual Hierarchy
- **Color-coded KPI cards** with distinct left borders (blue for sales, green for profit, purple for customers, orange for period totals)
- **Large, bold numbers** for at-a-glance comprehension
- **Contextual secondary metrics** (7-day averages, margins) for deeper insight
- **Gradient backgrounds** and soft shadows for depth without clutter

### Data Visualization
- **Interactive Recharts** with hover tooltips showing detailed breakdowns
- **Dual-axis line charts** comparing sales vs. net profit trends
- **Stacked bar charts** revealing the relationship between COGS, expenses, and profit
- **Responsive chart sizing** that adapts from mobile to desktop screens

### User Experience
- **Single-page scrollable layout** - no navigation confusion, all data in one view
- **Sticky header** with live status indicator and date range selector
- **Form-first design** - daily entry panel is the hero section for quick data input
- **Real-time feedback** - green pulsing dot shows live synchronization status
- **Mobile-optimized inputs** - touch-friendly form fields and responsive grid layouts

### Color Psychology
- **Green** for positive metrics (profit, growth)
- **Red** for negative indicators (losses, expenses)
- **Blue** for neutral data (sales, revenue)
- **Purple/Orange** for secondary metrics (customers, aggregates)
- **Gradient backgrounds** (blue-to-purple) create a modern, energetic feel

### Professional Polish
- **shadcn/ui components** for consistent, accessible interactions
- **Tailwind CSS 4** for rapid, maintainable styling
- **Smooth animations** on chart updates and data changes
- **Empty states** with helpful guidance for new users
- **Loading skeletons** to prevent jarring content shifts

---

## ✨ Features

### 📊 Real-Time Dashboard
- **Live Data Synchronization**: All connected users see updates within 5 seconds
- **KPI Summary Cards**: 
  - Today's Sales with 7-day average comparison
  - Today's Net Profit with margin percentage
  - Customer Count with average basket size
  - Period Net Profit with overall margin
- **Interactive Charts**: 
  - Daily Sales Trend (line chart with sales and net profit)
  - Profit vs Expenses Breakdown (stacked bar chart)
- **Date Range Filters**: Today, Last 7 Days, This Month, All Time

### 💼 Business Intelligence
- **Profit & Loss Summary**: 
  - Total Revenue, COGS, Gross Profit
  - Operating Expenses, Net Profit
  - Average Daily Sales, Average Net Margin
  - Days Tracked counter
- **Day-by-Day Activity Table**: 
  - Complete sales history with all metrics
  - Color-coded profit/loss indicators
  - Sortable columns (coming soon)
  - Notes field for tracking events/promotions
- **Calculated Metrics**: 
  - Gross Profit = Total Sales - COGS
  - Net Profit = Gross Profit - Operating Expenses
  - Profit Margin % = (Net Profit / Total Sales) × 100
  - Average Basket Size = Total Sales / Customer Count

### 📱 Mobile-Friendly Design
- **Fully responsive layout** tested on phones, tablets, and desktops
- **Touch-optimized input forms** with large tap targets
- **Adaptive charts** that stack vertically on mobile
- **Collapsible tables** with horizontal scroll on small screens
- **Readable typography** at all screen sizes

### 🔄 Real-Time Collaboration
- **Multi-user support**: Multiple people can view and edit the same data
- **Automatic sync**: Changes propagate to all connected clients within 5 seconds
- **Live status indicator**: Green pulsing dot shows active synchronization
- **Conflict-free updates**: Last-write-wins strategy for simultaneous edits
- **No login required**: Public access for easy sharing (authentication can be added)

---

## 🛠️ Tech Stack

**Frontend**
- React 19 (latest features including React Compiler)
- TypeScript (full type safety)
- Tailwind CSS 4 (modern utility-first styling)
- Recharts (responsive data visualization)
- shadcn/ui + Radix UI (accessible component library)
- Wouter (lightweight routing)

**Backend**
- Express 4 (Node.js web framework)
- tRPC 11 (end-to-end type-safe APIs)
- Superjson (automatic Date/BigInt serialization)

**Database**
- MySQL/TiDB (relational database)
- Drizzle ORM (type-safe SQL queries)

**Developer Experience**
- Vite (lightning-fast dev server and builds)
- Vitest (unit testing)
- pnpm (efficient package management)
- ESLint + Prettier (code quality)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ (LTS recommended)
- pnpm 10+ (or npm/yarn)
- MySQL database (local or cloud)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/SuperiorNetworks/supermarket-calc.git
cd supermarket-calc
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```env
DATABASE_URL=mysql://user:password@host:port/database
```

4. **Initialize the database:**
```bash
pnpm db:push
```

This command generates and applies the database schema automatically.

5. **Start the development server:**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

---

## 📖 Usage Guide

### Daily Sales Entry

1. **Select the date** you want to track (defaults to today)
2. **Enter your daily metrics** from the game:
   - **Total Sales**: Your total revenue for the day
   - **COGS**: Cost of Goods Sold (what you paid for inventory)
   - **Other Expenses**: Wages, utilities, rent, etc.
   - **Refunds/Discounts**: Any negative adjustments
   - **Customer Count**: Number of customers served
   - **Notes**: Optional field for tracking events (e.g., "Weekend sale", "Restocked produce")
3. **Click "Save Day"** to store the data

The dashboard will automatically update with new calculations and charts.

### Viewing Analytics

- **Date Range Selector**: Filter data by Today, Last 7 Days, This Month, or All Time
- **KPI Cards**: Quick overview of key metrics at the top
- **Charts**: Visual trends in the middle section
  - Hover over data points for detailed tooltips
  - Charts auto-scale based on your data range
- **P&L Summary**: Financial overview for the selected period
- **Activity Table**: Detailed day-by-day breakdown at the bottom

### Real-Time Collaboration

- **Share the URL** with friends or co-op partners
- **Everyone sees the same data** automatically
- **Changes sync within 5 seconds** (watch the green "Live" indicator)
- **No conflicts**: Last person to save a date wins

---

## 📊 Database Schema

The application uses a single `sales_data` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-incrementing primary key |
| `date` | VARCHAR(10) | Sales date in YYYY-MM-DD format (unique) |
| `totalSales` | INT | Total revenue in dollars |
| `cogs` | INT | Cost of goods sold in dollars |
| `expensesOther` | INT | Operating expenses (wages, utilities, rent) |
| `refundsOrDiscounts` | INT | Negative adjustments in dollars |
| `customerCount` | INT | Number of customers served |
| `notes` | TEXT | Optional notes about the day |
| `createdAt` | TIMESTAMP | Record creation timestamp |
| `updatedAt` | TIMESTAMP | Last update timestamp |

**Design Decisions:**
- `date` is stored as a string for simplicity and uniqueness
- All monetary values are stored as integers (cents can be added later)
- `notes` field allows tracking of events, promotions, or anomalies

---

## 🔌 API Reference

The application uses **tRPC** for type-safe API calls. All endpoints are automatically typed and validated.

### `sales.list`
**Type:** Query  
**Description:** Retrieves all sales records, ordered by date (descending)  
**Returns:** `Array<SalesData>`

### `sales.upsert`
**Type:** Mutation  
**Description:** Creates a new sales record or updates an existing one for the given date  
**Input:**
```typescript
{
  date: string;           // YYYY-MM-DD
  totalSales: number;
  cogs: number;
  expensesOther: number;
  refundsOrDiscounts: number;
  customerCount: number;
  notes?: string;
}
```
**Returns:** `SalesData | undefined`

### `sales.delete`
**Type:** Mutation  
**Description:** Deletes a sales record by date  
**Input:** `{ date: string }`  
**Returns:** `{ success: boolean }`

---

## 🧪 Testing

Run the test suite with:
```bash
pnpm test
```

**Test Coverage:**
- ✅ Sales data creation and updates
- ✅ Data retrieval and filtering
- ✅ Record deletion
- ✅ Authentication flow (logout)

Tests use **Vitest** with an in-memory database for fast, isolated execution.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Ideas for Contributions
- Export to CSV/Excel functionality
- Category breakdown charts (Produce, Drinks, Snacks)
- User authentication and multi-store support
- Dark mode toggle
- Advanced filtering and sorting in the activity table
- Mobile app (React Native)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Steam Supermarket Simulator** community for inspiration
- **UI/UX Design Inspiration** from:
  - Ran Liu (enterprise SaaS dashboards)
  - Ana Vadillo (financial dashboards)
  - Lazarev Agency (B2B fintech design patterns)
- **Open Source Libraries**: React, tRPC, Tailwind, Recharts, shadcn/ui

---

## 📞 Support

For issues, questions, or feature requests:
- **Open an issue** on GitHub
- **Check existing issues** before creating duplicates
- **Provide details**: screenshots, error messages, steps to reproduce

---

## 🎮 About Supermarket Simulator

This is a **companion tool** for the Steam game *Supermarket Simulator*. It is **not affiliated** with the game's developers and is provided as-is for the community.

**Game Link**: [Supermarket Simulator on Steam](https://store.steampowered.com/)

---

**Built with ❤️ for the Supermarket Simulator community**
