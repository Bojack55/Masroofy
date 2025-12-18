# 📖 Masroofy User Guide

Welcome to **Masroofy** - Your Family Wallet Management System! This guide will help you understand how to use all features of the application.

## 👥 User Types

Masroofy has two types of users:
- **Parents**: Can manage their wallet, add children, and transfer money
- **Children**: Can view their balance, track spending, and monitor budgets

---

## 🚀 Getting Started

### For Parents

#### 1️⃣ Create Your Account

1. Visit the Masroofy homepage
2. Click **"Register as Parent"** link
3. Fill in the registration form:
   - **Email**: Your email address (e.g., parent@example.com)
   - **Username**: Choose a username (e.g., JohnDoe)
   - **Password**: Create a secure password
   - **Confirm Password**: Re-enter your password
4. Click **"Register"**
5. You'll be redirected to the login page

#### 2️⃣ Login to Your Account

1. Enter your **email or username**
2. Enter your **password**
3. Click **"Sign In"**
4. You'll be taken to the Parent Dashboard

---

## 👨‍👩‍👧‍👦 Parent Features

### 💼 Parent Dashboard Overview

When you login as a parent, you'll see:
- **Your current balance** (top of the page)
- **Quick action buttons** (Top Up, Transfer, Add Child)
- **List of your children** with their balances
- **Recent transactions**

### 💰 Top Up Your Wallet

**Purpose**: Add money to your wallet (simulated payment)

**Steps**:
1. Click **"Top Up Wallet"** button
2. Enter the amount you want to add (e.g., 1000)
3. Select payment method (Credit Card, Debit Card, Bank Transfer - simulated)
4. Click **"Top Up"**
5. Your balance will update immediately

**Notes**:
- This is a simulated payment (no real money involved)
- You can top up any amount
- Balance updates in real-time

### 👶 Add a Child Account

**Purpose**: Create an account for your child

**Steps**:
1. Click **"Add Child"** button
2. Fill in the child's information:
   - **Username**: Child's username (e.g., Sarah123)
   - **Password**: Create a password for the child
   - **Confirm Password**: Re-enter the password
   - **Initial Balance** (optional): Starting money for the child
3. Click **"Create Child Account"**
4. The child will appear in your children list

**Notes**:
- Each child needs a unique username
- The child will use this username and password to login
- You can add multiple children
- Initial balance is optional (defaults to 0)

### 💸 Transfer Money to Child

**Purpose**: Send allowance or pocket money to your child

**Steps**:
1. Click **"Transfer to Child"** button
2. Select the child from the dropdown menu
3. Enter the transfer amount
4. Add a description (optional, e.g., "Weekly allowance")
5. Click **"Transfer"**

**Validation**:
- ❌ Cannot transfer more than your current balance
- ❌ Cannot transfer negative amounts
- ❌ Must select a child
- ✅ Balance updates for both parent and child instantly

### 📊 View Children's Activity

**What you can see**:
- Each child's current balance
- Each child's spending patterns
- Transaction history for each child

**How to access**:
- Children cards are displayed on your dashboard
- Click on a child card to see detailed view
- View their transaction history in the transactions section

### 📜 View Transaction History

**Purpose**: See all your financial activity

**What you'll see**:
- **Deposits**: When you topped up your wallet
- **Transfers**: Money sent to children
- **Date & Time**: When each transaction occurred
- **Amount**: How much was transferred
- **Description**: What the transaction was for

**Filter Options**:
- **All Transactions**: See everything
- **Income**: Only deposits
- **Expenses**: Only transfers to children

**Steps to filter**:
1. Go to Transaction History section
2. Click filter dropdown
3. Select: All / Income / Expense
4. Transactions will update automatically

---

## 👧👦 Child Features

### 🎯 Child Dashboard Overview

When you login as a child, you'll see:
- **Your current balance**
- **Parent's name** who manages your account
- **Daily spending calculator**
- **Budget tracker**
- **Transaction history**

### 💵 View Your Balance

**Location**: Top of the dashboard

**Information shown**:
- Current available balance
- Last transaction date
- Parent information

### 📊 Smart Daily Calculator

**Purpose**: Shows how much you can safely spend each day without running out of money before the end of the month

**How it works**:
1. Takes your current balance
2. Calculates days remaining in the month
3. Shows recommended daily spending

**Example**:
- Current balance: 300 EGP
- Days left in month: 15 days
- **Safe daily spend**: 20 EGP/day

**Display**:
```
💡 Safe Daily Spend
20 EGP per day

You have 300 EGP for the next 15 days
```

**Benefits**:
- Helps you budget your money
- Prevents running out of money early
- Teaches financial planning

### 📈 Visual Budget Tracker

**Purpose**: Show your monthly budget usage with color-coded warnings

**How to read it**:

**🟢 Green (0-50% used)**:
- You're doing great!
- Plenty of money left
- Keep up the good spending habits

**🟡 Orange (51-80% used)**:
- Watch out!
- More than half your budget is gone
- Start being more careful with spending

**🔴 Red (81-100% used)**:
- Budget limit reached!
- Very little money remaining
- Avoid unnecessary spending

**Example Display**:
```
Monthly Budget: 500 EGP
Used: 350 EGP (70%) 🟡
Remaining: 150 EGP

[==============--------]  70%
```

### 📜 View Your Transactions

**What you'll see**:
- Money received from your parent
- When you received it
- Descriptions/notes from parent

**Information per transaction**:
- Date: December 15, 2024
- Type: Received from Parent
- Amount: +100 EGP
- Description: Weekly allowance
- Balance after: 350 EGP

---

## 🔐 Security Features

### Password Safety
- Passwords are encrypted (hashed) in the database
- Never share your password with anyone
- Use a strong password with letters, numbers, and symbols

### Session Management
- You'll be automatically logged out after inactivity
- Use the **Logout** button when finished
- Your session is protected with JWT tokens

### Data Privacy
- Only you can see your balance
- Parents can only see their children's data
- Children cannot see other children's information

---

## 🎨 Interface Tips

### Navigation
- **Dashboard**: Main page after login
- **Transaction History**: View all transactions
- **Profile**: View/edit your information
- **Logout**: Sign out securely

### Notifications
- ✅ **Green**: Success messages
- ⚠️ **Orange**: Warning messages
- ❌ **Red**: Error messages
- ℹ️ **Blue**: Information messages

### Responsive Design
- Works on desktop computers
- Works on tablets
- Works on mobile phones
- Automatically adjusts to screen size

---

## ❓ Frequently Asked Questions (FAQ)

### For Parents

**Q: Can I delete a child account?**  
A: Currently, this feature is not available. Contact support if needed.

**Q: Can I transfer money between children?**  
A: No, you can only transfer from parent to child. Each child has their own wallet.

**Q: Is there a limit to how many children I can add?**  
A: No limit! Add as many children as you need.

**Q: Can I set recurring allowances?**  
A: This feature is coming soon in future updates.

**Q: What happens if I transfer more than I have?**  
A: The system will show an error and prevent the transfer.

### For Children

**Q: Can I transfer money back to my parent?**  
A: No, transfers only go from parent to child.

**Q: Can I transfer money to my siblings?**  
A: No, this feature is not currently available.

**Q: Can I spend money directly in the app?**  
A: This is a wallet management system. Actual spending happens outside the app, but you should manually track it.

**Q: How do I ask my parent for money?**  
A: Contact your parent directly. They can send you money via the app.

---

## 🐛 Troubleshooting

### Cannot Login
1. Check if username/email is correct
2. Verify password (case-sensitive)
3. Clear browser cache and try again
4. Try resetting your password

### Balance Not Updating
1. Refresh the page (F5)
2. Check your internet connection
3. Logout and login again

### Cannot Add Child
1. Ensure username is unique
2. Check password matches confirmation
3. Verify you're logged in as a parent

### Transaction Not Showing
1. Refresh the transaction history
2. Check if filter is applied (All/Income/Expense)
3. Wait a few seconds and refresh

---

## 📱 Mobile Usage

### Install as App (PWA - Coming Soon)
1. Open Masroofy in Chrome/Safari
2. Click "Add to Home Screen"
3. Use like a native app

### Mobile Tips
- Use landscape mode for better view on small screens
- Tap to open modals
- Swipe to navigate (some areas)

---

## 🎓 Educational Benefits

### For Children
- **Financial Literacy**: Learn money management early
- **Budgeting Skills**: Understand daily spending limits
- **Responsibility**: Manage your own virtual wallet
- **Math Skills**: Calculate budgets and track spending

### For Parents
- **Teaching Tool**: Educate children about money
- **Transparency**: See children's spending patterns
- **Control**: Manage allowances digitally
- **Convenience**: No need for physical cash

---

## 📞 Support & Contact

### Need Help?
- Check this user guide first
- Review FAQ section
- Contact your course instructor
- Check GitHub repository for updates

### Report a Bug
- Go to GitHub Issues
- Describe the problem
- Include screenshots if possible
- Mention your user type (parent/child)

---

## 🔄 Updates & Features Coming Soon

- [ ] Email notifications for transactions
- [ ] Recurring allowances (weekly/monthly)
- [ ] Spending categories and tags
- [ ] Export transaction history to CSV
- [ ] Parent approval for child withdrawals
- [ ] Multi-currency support
- [ ] Savings goals for children
- [ ] Rewards system

---

## 🎉 Conclusion

Congratulations! You now know how to use Masroofy effectively. 

**Key Takeaways**:
- **Parents**: Top up, add children, transfer money, monitor activity
- **Children**: View balance, use smart calculator, track budget, see transactions
- **Everyone**: Secure, easy-to-use, educational financial tool

**Happy Money Managing! 💰**

---

*Last updated: December 2024*  
*Version: 1.0*  
*Masroofy - Teaching Financial Literacy, One Family at a Time*
