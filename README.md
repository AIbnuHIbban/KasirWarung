# KasirWarung - POS Application for Small Food Stalls

KasirWarung is a simple and modern point-of-sale (POS) application for small food stalls or street food vendors. This application is built using React, TypeScript, and Tailwind CSS with a focus on ease of use and performance.

## ✨ Key Features

- 🔒 Authentication system with login/logout
- 📊 Interactive dashboard with sales summaries
- 🍲 Food and beverage menu management
- 💰 Fast transaction processing
- 📈 Sales reports and analytics
- 📱 Responsive design (mobile-friendly)
- 🌓 Light and dark mode

## 🔌 Offline Support

KasirWarung fully supports offline operation, allowing you to:
- Process transactions even without an internet connection
- Manage menu items offline
- View dashboard and reports offline

This is made possible through the use of IndexedDB (via Dexie.js), which provides a reliable client-side storage solution.

## 🛠️ Technologies

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Database**: Dexie.js (IndexedDB wrapper)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (version 16 or newer)
- pnpm (preferred package manager)

## 🚀 Installation

1. Clone this repository
   ```bash
   git clone https://github.com/username/kasirWarung.git
   cd kasirWarung
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Run the development server
   ```bash
   pnpm dev
   ```

4. Open the application in your browser
   ```
   http://localhost:5173
   ```

## 📝 Usage

### Login
- Use demo credentials to login:
  - Username: `admin`
  - Password: `admin123`

### Dashboard
The dashboard displays today's sales summary, recent transactions, best-selling items, and a sales graph for the last 7 days.

### Menu
This page allows you to manage your food stall menu:
- Add new menu items
- Edit existing items
- Delete items
- View low stock alerts (automatic warnings)

### Transactions
Process sales transactions with:
- Available menu item selection
- Item quantity adjustment
- Automatic total calculation
- Transaction history storage

### Reports
View and analyze sales data:
- Daily or monthly reports
- Export data to CSV
- Summary of total sales and transaction counts


## 📁 Project Structure

```
kasirWarung/
├── src/
│   ├── assets/        # Images and static assets
│   ├── components/    # Reusable UI components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── menu/        # Menu management components
│   │   ├── reports/     # Report components
│   │   └── transaction/ # Transaction components
│   ├── db/            # Database configuration (Dexie.js)
│   ├── layout/        # Main application layouts
│   ├── pages/         # Main pages
│   ├── stores/        # State management with Zustand
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Helper functions
├── public/           # Public static assets
└── ...              # Configuration files
```

## 🧪 Development

### Scripts

- `pnpm dev` - Run the development server
- `pnpm build` - Build the application for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview the production build

## 🤝 Contribution

Contributions are always welcome! Please create a pull request or open an issue for feature suggestions or bug fixes.

## 📄 License

MIT

---

Made with ❤️