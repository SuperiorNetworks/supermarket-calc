# Supermarket Calc

A real-time collaborative web dashboard for tracking daily sales performance in **Steam Supermarket Simulator**. Multiple users can view and update the same sales data simultaneously across different devices.

![Supermarket Calc Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### 📊 Real-Time Dashboard
- **Live Data Synchronization**: All users see updates within 5 seconds
- **KPI Summary Cards**: Today's Sales, Net Profit, Profit Margin, Customer Count
- **Interactive Charts**: Daily sales trends and profit vs expenses breakdowns
- **Date Range Filters**: Today, Last 7 Days, This Month, All Time

### 💼 Business Intelligence
- **Profit & Loss Summary**: Comprehensive financial overview
- **Day-by-Day Activity Table**: Complete sales history with sorting
- **Calculated Metrics**: Gross profit, net profit, margins, average basket size
- **Trend Analysis**: 7-day moving averages and performance indicators

### 📱 Mobile-Friendly Design
- Fully responsive layout for phones, tablets, and desktops
- Touch-optimized input forms
- Adaptive charts and tables

### 🎨 Professional UI
- Vibrant color-coded KPI cards
- Clean, modern design inspired by leading dashboard UX patterns
- Visual indicators for profit/loss performance
- Live status indicator

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Charts**: Recharts
- **UI Components**: shadcn/ui, Radix UI

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/supermarket-calc.git
cd supermarket-calc
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file with your database connection:
```env
DATABASE_URL=mysql://user:password@host:port/database
```

4. Push database schema:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Usage

### Daily Sales Entry
1. Select the date you want to track
2. Enter your daily metrics:
   - Total Sales
   - Cost of Goods Sold (COGS)
   - Other Expenses (wages, utilities, rent)
   - Refunds/Discounts
   - Customer Count
   - Notes (optional)
3. Click "Save Day" to store the data

### Viewing Analytics
- Use the date range selector to filter data
- View KPI cards for quick insights
- Analyze trends with interactive charts
- Review detailed history in the activity table

### Real-Time Collaboration
- Multiple users can access the dashboard simultaneously
- Changes are synced automatically every 5 seconds
- Green "Live" indicator shows active synchronization

## Database Schema

The application uses a single `sales_data` table:

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| date | VARCHAR(10) | Sales date (YYYY-MM-DD) |
| totalSales | INT | Total revenue |
| cogs | INT | Cost of goods sold |
| expensesOther | INT | Operating expenses |
| refundsOrDiscounts | INT | Negative adjustments |
| customerCount | INT | Number of customers |
| notes | TEXT | Optional notes |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

## API Endpoints

The application uses tRPC for type-safe API calls:

- `sales.list` - Get all sales records
- `sales.upsert` - Create or update a sales record
- `sales.delete` - Delete a sales record by date

## Testing

Run the test suite:
```bash
pnpm test
```

Tests cover:
- Sales data creation and updates
- Data retrieval and filtering
- Record deletion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built for the Steam Supermarket Simulator community
- UI design inspired by leading data dashboard patterns
- Powered by modern web technologies

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This is a companion tool for Steam Supermarket Simulator and is not affiliated with the game's developers.
