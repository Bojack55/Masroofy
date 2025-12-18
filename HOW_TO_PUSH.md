# 📤 How to Push Your Milestone Files to GitHub

## 🎯 Quick Overview

Each team member needs to push 2 types of files:
- **Milestone 2**: Your frontend React component(s) (.jsx files)
- **Milestone 3**: Your backend API routes (.js file)

---

## 📋 Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell

Navigate to the project folder:

```bash
cd "d:/GIU/5th Semester/E-Business Development/EBD Proj/EBD Proj"
```

---

### Step 2: Check Which Files You Need to Push

Find your files in the tables below based on your name:

#### Moaz Abdelaleem (13007327)
```bash
git add milestone_2/01_moaz_Login_milestone2.jsx
git add milestone_2/01_moaz_Register_milestone2.jsx
git add milestone_3/01_moaz_authentication_milestone3.js
git commit -m "Milestone 2 & 3: User Authentication - Moaz Abdelaleem"
git push origin main
```

#### Eyad Ahmed (13005578)
```bash
git add milestone_2/02_eyad_BudgetTracker_milestone2.jsx
git add milestone_3/02_eyad_budget_tracker_milestone3.js
git commit -m "Milestone 2 & 3: Visual Budget Tracker - Eyad Ahmed"
git push origin main
```

#### Omar Khaled (13003972)
```bash
git add milestone_2/03_omar_khaled_TopUpModal_milestone2.jsx
git add milestone_2/03_omar_khaled_TransferModal_milestone2.jsx
git add milestone_3/03_omar_khaled_wallet_topup_milestone3.js
git commit -m "Milestone 2 & 3: Wallet Top-Up - Omar Khaled"
git push origin main
```

#### Omar Samer (13001857)
```bash
git add milestone_2/04_omar_samer_TransactionHistory_milestone2.jsx
git add milestone_2/04_omar_samer_ExpenseModal_milestone2.jsx
git add milestone_3/04_omar_samer_transactions_milestone3.js
git commit -m "Milestone 2 & 3: Transaction History - Omar Samer"
git push origin main
```

#### Omar Mahmoud (13006696)
```bash
git add milestone_2/05_omar_mahmoud_DailyCalculator_milestone2.jsx
git add milestone_3/05_omar_mahmoud_calculator_milestone3.js
git commit -m "Milestone 2 & 3: Smart Daily Calculator - Omar Mahmoud"
git push origin main
```

#### Bahaa Ahmed (13002233)
```bash
git add milestone_2/06_bahaa_AddChildModal_milestone2.jsx
git add milestone_2/06_bahaa_ChildDashboard_milestone2.jsx
git add milestone_3/06_bahaa_child_accounts_milestone3.js
git commit -m "Milestone 2 & 3: Child Accounts - Bahaa Ahmed"
git push origin main
```

---

## 🚀 Alternative: Push All at Once (One Person)

If one person wants to push all milestone files together:

```bash
# Navigate to project
cd "d:/GIU/5th Semester/E-Business Development/EBD Proj/EBD Proj"

# Add all milestone files
git add milestone_2/ milestone_3/

# Commit
git commit -m "Milestones 2 & 3: All team member features complete"

# Push
git push origin main
```

---

## 🔍 Verify Your Files Were Pushed

After pushing, check GitHub:
1. Go to your repository: https://github.com/Bojack55/Masroofy
2. Look for the `milestone_2/` and `milestone_3/` folders
3. Verify your files are there

---

## ❓ Troubleshooting

### Error: "Permission denied"
**Solution**: Make sure you're added as a collaborator on the repository.

### Error: "Updates were rejected"
**Solution**: Pull first, then push:
```bash
git pull origin main
git push origin main
```

### Error: "Not a git repository"
**Solution**: Make sure you're in the correct directory:
```bash
cd "d:/GIU/5th Semester/E-Business Development/EBD Proj/EBD Proj"
```

---

## 📝 What Each Command Does

| Command | What It Does |
|---------|-------------|
| `git add <file>` | Stages your file for commit |
| `git commit -m "message"` | Creates a commit with your changes |
| `git push origin main` | Uploads your commit to GitHub |
| `git pull origin main` | Downloads latest changes from GitHub |

---

## ✅ Checklist

Before pushing, make sure:
- [ ] You're in the correct directory
- [ ] You've added YOUR files (not someone else's)
- [ ] Your commit message includes your name and feature
- [ ] You've pushed to the correct branch (main)

---

## 🎯 Summary for Quick Reference

**Everyone follows this pattern**:

```bash
# 1. Navigate to project
cd "d:/GIU/5th Semester/E-Business Development/EBD Proj/EBD Proj"

# 2. Stage your files
git add milestone_2/<your_files>
git add milestone_3/<your_file>

# 3. Commit with message
git commit -m "Milestone 2 & 3: <Your Feature> - <Your Name>"

# 4. Push to GitHub
git push origin main
```

---

**Need Help?** Copy the exact commands for your name from above! 🚀
