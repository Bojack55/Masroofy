# Masroofy - Team Contributions

## Project Overview
**Masroofy** is a fintech application that links parents with their children to manage pocket money, track spending, and monitor balances. This document outlines each team member's contributions across all project milestones.

---

## Team Members & Features

### 01. Moaz Abdelaleem
**Feature:** User Authentication & Hierarchy

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `01_moaz_abdelaleem_auth.js` | Backend authentication routes design |
| M2 | `01_moaz_Login_milestone2.jsx` | Login page React component |
| M2 | `01_moaz_Register_milestone2.jsx` | Registration page React component |
| M3 | `01_moaz_authentication_milestone3.js` | Full authentication backend with JWT tokens and bcrypt password hashing |

**Key Implementations:**
- Parent account registration and login
- JWT token-based authentication
- Password encryption with bcrypt
- User profile management

---

### 02. Eyad Ahmed Saeed
**Feature:** Visual Budget Tracker

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `02_eyad_ahmed_budget_tracker.js` | Budget tracking logic design |
| M2 | `02_eyad_ahmed_BudgetTracker_milestone2.jsx` | Budget tracker React component with progress bar |
| M3 | `02_eyad_ahmed_budget_milestone3.js` | Budget analytics backend with MongoDB aggregation |

**Key Implementations:**
- Visual progress bar showing budget usage percentage
- Color-coded status indicators (green/orange/red)
- Monthly spending calculations
- Budget vs. spending analytics

---

### 03. Khaled Magdy
**Feature:** Wallet Top-Up System

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `03_khaled_magdy_wallet_topup.js` | Wallet top-up logic design |
| M2 | `03_khaled_magdy_TopUpModal_milestone2.jsx` | Top-up modal React component |
| M2 | `03_khaled_magdy_TransferModal_milestone2.jsx` | Transfer modal React component |
| M3 | `03_khaled_magdy_wallet_topup_milestone3.js` | Wallet operations backend routes |

**Key Implementations:**
- Parent wallet deposit functionality
- Parent-to-child money transfers
- Balance management
- Transaction recording

---

### 04. Omar Samer
**Feature:** Transaction History & Expense Recording

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `04_omar_samer_transaction_history.js` | Transaction tracking design |
| M2 | `04_omar_samer_ExpenseModal_milestone2.jsx` | Expense recording modal component |
| M2 | `04_omar_samer_TransactionHistory_milestone2.jsx` | Transaction history list component |
| M3 | `04_omar_samer_transactions_milestone3.js` | Transaction CRUD backend routes |

**Key Implementations:**
- Expense recording with categories
- Transaction history display with filtering
- All transactions stored in MongoDB
- Income/expense categorization

---

### 05. Omar Mahmoud
**Feature:** Smart Daily Calculator

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `05_omar_mahmoud_smart_calculator.js` | Calculator logic design |
| M2 | `05_omar_mahmoud_DailyCalculator_milestone2.jsx` | Daily calculator React component |
| M3 | `05_omar_mahmoud_calculator_milestone3.js` | Calculator analytics backend |

**Key Implementations:**
- Daily spending limit recommendations
- Balance distribution calculations
- Spending projections
- Smart budgeting suggestions

---

### 06. Bahaa Ahmed
**Feature:** Child Account Management

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `06_bahaa_ahmed_child_accounts.js` | Child accounts system design |

**Key Implementations:**
- Child account creation by parents
- Parent-child relationship linking
- Child dashboard functionality

---

## Git & GitHub Usage

### Repository Setup
- **Repository:** [github.com/Bojack55/Masroofy](https://github.com/Bojack55/Masroofy)
- **Branch:** `main` (single branch workflow)

### Workflow
1. **Initial Setup:** Repository created and team members added as collaborators
2. **Code Organization:** Files organized by milestone folders:
   - Root: Milestone 1 files (backend route designs)
   - `milestone_2/`: React frontend components
   - `milestone_3/`: Backend integration with database

### Git Commands Used
```bash
# Clone repository
git clone https://github.com/Bojack55/Masroofy.git

# Configure user identity
git config user.name "username"
git config user.email "email@example.com"

# Stage and commit changes
git add <filename>
git commit -m "Commit message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Check status
git status
```

### Collaboration Process
1. Each team member configured their Git identity before pushing
2. Regular pulls before pushing to avoid conflicts
3. Descriptive commit messages for tracking changes
4. Files named with format: `XX_name_feature_milestoneX.ext`

---

## Project Structure
```
Masroofy/
├── README.md
├── CONTRIBUTIONS.md
├── EBD_Wallet_API.postman_collection.json
│
├── [Milestone 1 - Root]
│   ├── 01_moaz_abdelaleem_auth.js
│   ├── 02_eyad_ahmed_budget_tracker.js
│   ├── 03_khaled_magdy_wallet_topup.js
│   ├── 04_omar_samer_transaction_history.js
│   ├── 05_omar_mahmoud_smart_calculator.js
│   └── 06_bahaa_ahmed_child_accounts.js
│
├── milestone_2/
│   ├── 01_moaz_Login_milestone2.jsx
│   ├── 01_moaz_Register_milestone2.jsx
│   ├── 02_eyad_ahmed_BudgetTracker_milestone2.jsx
│   ├── 03_khaled_magdy_TopUpModal_milestone2.jsx
│   ├── 03_khaled_magdy_TransferModal_milestone2.jsx
│   ├── 04_omar_samer_ExpenseModal_milestone2.jsx
│   ├── 04_omar_samer_TransactionHistory_milestone2.jsx
│   └── 05_omar_mahmoud_DailyCalculator_milestone2.jsx
│
└── milestone_3/
    ├── 01_moaz_authentication_milestone3.js
    ├── 02_eyad_ahmed_budget_milestone3.js
    ├── 03_khaled_magdy_wallet_topup_milestone3.js
    ├── 04_omar_samer_transactions_milestone3.js
    └── 05_omar_mahmoud_calculator_milestone3.js
```

---

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Version Control:** Git, GitHub
- **API Testing:** Postman
