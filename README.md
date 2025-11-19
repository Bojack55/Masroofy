# Masroofy
A fintech application links each parent with his children to deposit pocket money for each child and keeping track of their spendings and balances


## 1. Team Members
| Name | ID | Feature |
| :--- | :--- | :--- |
| Moaz Abdelaleem | 13007327 | User Authentication & Hierarchy |
| Eyad ahmed saeed | 13005578 | Visual Budget Tracker |
| Omar khaled | 13003972| Wallet Top-Up | 
| Omar Samer | 13001857 | Transaction History & Audit |
| Omar Mahmoud | 13006696 | Smart Daily Calculator |
| Bahaa Aldin Ahmed | 13002233 | User Authentication & Hierarchy |

## 2. Idea Definition
**Masroofy** is a closed-loop financial education wallet designed for families. It allows parents to manage allowances digitally, simulating a banking environment for their children. The goal is to promote financial literacy by giving children a safe environment to receive, manage, and track their "pocket money" while giving parents full oversight.

### Full Feature Breakdown (Brainstorming)
* User Authentication (Login/Register)
* Parent/Child Account Linking
* Wallet Top-Up (Bank Simulation)
* P2P Transfers (Allowance distribution)
* Expense Logging (Children recording purchases)
* Automated Monthly Allowance (Recurring)
* Savings Goals (Virtual Jars)
* Transaction History/Statement
* Visual Analytics (Progress bars/Charts)
* Daily Spending Advisor (Algorithm)

### Selected Core Use Cases (5-6 Implemented Features)
We have selected the following distinct use cases to be implemented for this course.

1.  **User Authentication & Hierarchy (Mandatory):** Registration for Parents, creation of Child accounts linked to that Parent, and secure Login.
2.  **Wallet Top-Up (Bank Simulation):** Ability for the Parent to manually "deposit" funds from an external source (simulated) into their digital wallet balance.
3.  **Allowance Transfer (P2P):** Parent transferring funds from their wallet balance to a specific Child's wallet balance.
4.  **Smart Daily Calculator (Analytics):** A dynamic calculator that analyzes the Child's current balance and remaining days in the month to recommend a "Safe Daily Spending Amount."
5.  **Visual Budget Tracker:** A visual progress bar component that calculates the percentage of allowance used vs. total limit.
6.  **Transaction History & Auditing:** A comprehensive list view allowing Parents to see all family transactions and Children to see only their own history.

## 3. Data Modeling (Initial Mongoose Schemas)

### User Model (`User.js`)
Handles both Parents and Children, linked via `parentId`.

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // FinTech Core Data
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'EGP' },
  
  // Role Management
  role: { type: String, enum: ['parent', 'child'], default: 'parent' },
  
  // Hierarchy Linking (If role is child)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

```
### Transaction Model (Transaction.js)
Records every movement of money (Deposit, Transfer, or Expense).

```

JavaScript

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // The person who initiated the action
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The person receiving money (Same as sender if it's a Deposit)
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'transfer', 'expense'], required: true },
  description: { type: String },
  
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
```

