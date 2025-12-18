# Milestone 2 & 3 Code Organization

## Team Members & Features

| # | Name | ID | Feature | Files |
|---|------|----|---------| ------|
| 1 | Moaz Abdelaleem | 13007327 | User Authentication | Login.jsx, Register.jsx, authRoutes.js |
| 2 | Eyad Ahmed | 13005578 | Visual Budget Tracker | BudgetTracker.jsx, analyticsRoutes.js (budget) |
| 3 | Omar Khaled | 13003972 | Wallet Top-Up | TopUpModal.jsx, TransferModal.jsx, walletRoutes.js |
| 4 | Omar Samer | 13001857 | Transaction History | TransactionHistory.jsx, ExpenseModal.jsx, transactionRoutes.js |
| 5 | Omar Mahmoud | 13006696 | Smart Daily Calculator | DailyCalculator.jsx, analyticsRoutes.js (forecast) |
| 6 | Bahaa Ahmed | 13002233 | Child Accounts | AddChildModal.jsx, ChildDashboard.jsx, authRoutes.js (create-child) |

## Milestone 2 - Static Frontend Components
Each team member creates their React components with **hard-coded data** (no API calls).

## Milestone 3 - Full-Stack Integration  
Each team member integrates their components with backend API routes.

## Directory Structure

```
milestone_2/
├── 01_moaz_authentication.jsx          # Login + Register components (static)
├── 02_eyad_budget_tracker.jsx          # Budget component (static)
├── 03_omar_khaled_wallet_topup.jsx     # TopUp + Transfer modals (static)
├── 04_omar_samer_transactions.jsx      # Transaction History (static)
├── 05_omar_mahmoud_calculator.jsx      # Daily Calculator (static)
└── 06_bahaa_child_accounts.jsx         # Add Child + Child Dashboard (static)

milestone_3/
├── 01_moaz_authentication.js           # Auth backend routes
├── 02_eyad_budget_tracker.js           # Budget analytics routes
├── 03_omar_khaled_wallet_topup.js      # Wallet routes (deposit/transfer)
├── 04_omar_samer_transactions.js       # Transaction CRUD routes
├── 05_omar_mahmoud_calculator.js       # Forecast analytics routes
└── 06_bahaa_child_accounts.js          # Child account creation routes
```

## Submission Instructions

Each team member should:
1. Copy their milestone_2 file → `frontend/src/components/`
2. Copy their milestone_3 file → `backend/routes/`
3. Push to GitHub with commit message: "Milestone 2 & 3: [Feature Name]"
