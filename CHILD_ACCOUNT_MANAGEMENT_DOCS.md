# Child Account Management Feature Documentation
## Masroofy Wallet Project - Feature 6

**Developer**: Bahaa Ahmed (ID: 13002233)  
**Feature**: Child Account Management  
**Dependencies**: Extends Moaz's Authentication System

---

## 📋 Overview

The Child Account Management feature allows parents to create, view, update, and delete child accounts. Children can then log in using their credentials to manage their own allowance. This feature creates a **parent-child hierarchy** within the wallet system.

### Key Capabilities

✅ Parents can create multiple child accounts  
✅ Each child has their own username, password, and balance  
✅ Parent-child relationship tracking via `parentId`  
✅ Full CRUD operations on child accounts  
✅ View child transaction history  
✅ Children can log in independently  
✅ Role-based access control  

---

## 🗂️ File Structure

### Backend File
```
Masroofy/
└── 06_bahaa_ahmed_child_accounts.js    # Child CRUD routes
```

### Frontend Files
```
frontend/src/components/
└── 06_bahaa_ahmed_ChildAccounts.jsx    # Child management component
```

---

## 🔧 Backend Implementation

### File: `06_bahaa_ahmed_child_accounts.js`

This file contains all the API routes for managing child accounts.

---

### 1. Setup & Dependencies

```javascript
const express = require('express');
const router = express.Router();
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');
```

**Explanation**:
- `express.Router()`: Creates modular route handlers
- `User`: Mongoose model (shared with Moaz's auth)
- `authMiddleware`: Verifies JWT token and attaches user to `req.user`

---

### 2. CREATE CHILD ACCOUNT

#### Route: `POST /api/auth/create-child`

**Purpose**: Allow parents to create child accounts

**Complete Code**:
```javascript
router.post('/create-child', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. AUTHORIZATION CHECK - Only parents can create children
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can create child accounts'
            });
        }

        // 2. VALIDATION - Check for required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password for the child'
            });
        }

        // 3. UNIQUENESS CHECK - Username must be unique across ALL users
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // 4. CREATE CHILD USER
        const child = new User({
            username,
            password,              // Will be hashed automatically by User model
            role: 'child',         // Set role to child
            parentId: req.user._id, // Link to parent
            balance: 0             // Start with zero balance
        });

        await child.save();

        // 5. UPDATE PARENT'S CHILDREN ARRAY
        await User.findByIdAndUpdate(req.user._id, {
            $push: { children: child._id }  // Add child ID to parent's array
        });

        // 6. RETURN SUCCESS RESPONSE
        res.status(201).json({
            success: true,
            message: 'Child account created successfully',
            child: {
                id: child._id,
                username: child.username,
                role: child.role,
                balance: child.balance
            }
        });
    } catch (error) {
        console.error('Create child error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating child account'
        });
    }
});
```

**Step-by-Step Breakdown**:

| Step | Code | Explanation |
|------|------|-------------|
| 1 | `if (req.user.role !== 'parent')` | **Authorization**: Only parents can create children |
| 2 | `if (!username \|\| !password)` | **Validation**: Both fields required |
| 3 | `User.findOne({ username })` | **Uniqueness**: Check if username is available |
| 4 | `new User({ role: 'child', parentId: req.user._id })` | **Create**: New child with parent link |
| 5 | `$push: { children: child._id }` | **Link**: Add child to parent's array |
| 6 | `res.status(201)` | **Response**: Return created child data |

**Key MongoDB Concepts**:
- `$push`: MongoDB operator that adds an element to an array
- `parentId`: ObjectId reference linking child to parent
- `children`: Array of ObjectIds stored on parent document

**Security Features**:
- Password automatically hashed by User model's pre-save hook
- JWT authentication required (via middleware)
- Role verification prevents children from creating other children

---

### 3. GET ALL CHILDREN

#### Route: `GET /api/auth/children`

**Purpose**: Retrieve all children belonging to the authenticated parent

**Complete Code**:
```javascript
router.get('/children', authMiddleware, async (req, res) => {
    try {
        // 1. AUTHORIZATION CHECK
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can view children'
            });
        }

        // 2. FETCH PARENT WITH POPULATED CHILDREN
        const parent = await User.findById(req.user._id)
            .populate('children', 'username balance createdAt');

        // 3. RETURN CHILDREN ARRAY
        res.json({
            success: true,
            children: parent.children,
            count: parent.children.length
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching children'
        });
    }
});
```

**Mongoose Concept - `.populate()`**:
```javascript
.populate('children', 'username balance createdAt')
```
- **What it does**: Replaces child ObjectIds with actual child documents
- **First parameter**: Field name to populate (`'children'`)
- **Second parameter**: Fields to include (`'username balance createdAt'`)
- **Without populate**: Returns `[ObjectId1, ObjectId2, ObjectId3]`
- **With populate**: Returns full child objects with selected fields

**Response Example**:
```json
{
    "success": true,
    "children": [
        {
            "_id": "507f1f77bcf86cd799439012",
            "username": "child1",
            "balance": 150,
            "createdAt": "2025-12-20T10:30:00Z"
        },
        {
            "_id": "507f1f77bcf86cd799439013",
            "username": "child2",
            "balance": 75,
            "createdAt": "2025-12-20T11:45:00Z"
        }
    ],
    "count": 2
}
```

---

### 4. GET SINGLE CHILD

#### Route: `GET /api/auth/children/:childId`

**Purpose**: Get detailed information about a specific child

**Complete Code**:
```javascript
router.get('/children/:childId', authMiddleware, async (req, res) => {
    try {
        // 1. AUTHORIZATION CHECK
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can view child details'
            });
        }

        // 2. FETCH CHILD
        const child = await User.findById(req.params.childId)
            .select('-password');  // Exclude password field

        // 3. NOT FOUND CHECK
        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // 4. OWNERSHIP VERIFICATION
        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

        // 5. RETURN CHILD DATA
        res.json({ success: true, child });
    } catch (error) {
        console.error('Get child error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching child'
        });
    }
});
```

**Security Highlight - Ownership Verification**:
```javascript
if (child.parentId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: 'This is not your child account'
    });
}
```
- **Why needed**: Prevents parents from accessing other parents' children
- `.toString()`: Converts ObjectId to string for comparison
- **Returns 403 Forbidden**: If parent doesn't own this child

---

### 5. UPDATE CHILD

#### Route: `PUT /api/auth/children/:childId`

**Purpose**: Update child's username or password

**Complete Code**:
```javascript
router.put('/children/:childId', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. AUTHORIZATION CHECK
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can update child accounts'
            });
        }

        // 2. FETCH CHILD
        const child = await User.findById(req.params.childId);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // 3. OWNERSHIP VERIFICATION
        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

        // 4. UPDATE USERNAME (with uniqueness check)
        if (username && username !== child.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
            child.username = username;
        }

        // 5. UPDATE PASSWORD
        if (password) {
            child.password = password;  // Will be hashed on save
        }

        // 6. SAVE CHANGES
        await child.save();

        // 7. RETURN UPDATED DATA
        res.json({
            success: true,
            message: 'Child account updated successfully',
            child: {
                id: child._id,
                username: child.username,
                role: child.role,
                balance: child.balance
            }
        });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating child'
        });
    }
});
```

**Update Logic Explained**:

**Username Update**:
```javascript
if (username && username !== child.username) {
    // Check if new username is available
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }
    child.username = username;
}
```
- Only updates if new username is provided AND different from current
- Checks uniqueness before updating

**Password Update**:
```javascript
if (password) {
    child.password = password;  // Model will hash on save
}
```
- Direct assignment triggers the pre-save hook
- Password gets hashed automatically when `child.save()` is called

---

### 6. DELETE CHILD

#### Route: `DELETE /api/auth/children/:childId`

**Purpose**: Remove a child account completely

**Complete Code**:
```javascript
router.delete('/children/:childId', authMiddleware, async (req, res) => {
    try {
        // 1. AUTHORIZATION CHECK
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can delete child accounts'
            });
        }

        // 2. FETCH CHILD
        const child = await User.findById(req.params.childId);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // 3. OWNERSHIP VERIFICATION
        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

        // 4. REMOVE FROM PARENT'S CHILDREN ARRAY
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { children: child._id }
        });

        // 5. DELETE CHILD DOCUMENT
        await User.findByIdAndDelete(req.params.childId);

        // 6. RETURN SUCCESS
        res.json({
            success: true,
            message: 'Child account deleted successfully'
        });
    } catch (error) {
        console.error('Delete child error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting child'
        });
    }
});
```

**Two-Step Deletion Process**:

**Step 1 - Remove from Parent's Array**:
```javascript
await User.findByIdAndUpdate(req.user._id, {
    $pull: { children: child._id }
});
```
- `$pull`: MongoDB operator that removes matching elements from array
- Removes the child's ID from parent's `children` array

**Step 2 - Delete Child Document**:
```javascript
await User.findByIdAndDelete(req.params.childId);
```
- Completely removes the child user from database
- **Note**: Also deletes all associated transactions (via cascade if configured)

---

## 🎨 Frontend Implementation

### Component: `06_bahaa_ahmed_ChildAccounts.jsx`

This React component provides the UI for managing child accounts.

---

### Component State

```javascript
const [children, setChildren] = useState([]);           // Array of child objects
const [loading, setLoading] = useState(true);           // Loading indicator
const [error, setError] = useState('');                 // Error message
const [newChild, setNewChild] = useState({              // Form data
    username: '', 
    password: '' 
});
const [creating, setCreating] = useState(false);        // Create button state
const [showAddForm, setShowAddForm] = useState(false);  // Toggle form visibility
const [selectedChild, setSelectedChild] = useState(null); // For transaction modal
```

---

### 1. Fetch Children on Mount

```javascript
useEffect(() => {
    fetchChildren();
}, []);

const fetchChildren = async () => {
    try {
        const res = await authAPI.getChildren();
        if (res.data.success) {
            setChildren(res.data.children || []);
        } else {
            setError(res.data.message || 'Failed to load children');
        }
    } catch (e) {
        console.error(e);
        setError('Server error while loading children');
    } finally {
        setLoading(false);
    }
};
```

**React useEffect Hook**:
- Empty dependency array `[]` means it runs once when component mounts
- Calls `fetchChildren()` to load data from backend
- Sets `loading` to false when done (success or error)

---

### 2. Handle Form Input

```javascript
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prev) => ({ ...prev, [name]: value }));
};
```

**Explanation**:
- `e.target.name`: Field name (username or password)
- `e.target.value`: Current input value
- `{...prev, [name]: value}`: Spread operator copies existing state and updates specific field

**Example Flow**:
```
User types in username field:
1. name = "username", value = "john"
2. newChild = { username: "john", password: "" }
```

---

### 3. Create Child

```javascript
const handleCreate = async (e) => {
    e.preventDefault();              // Prevent page reload
    setCreating(true);               // Show loading state
    setError('');                    // Clear previous errors
    
    try {
        const res = await authAPI.createChild(newChild);
        if (res.data.success) {
            // Add new child to local state
            setChildren((prev) => [...prev, res.data.child]);
            
            // Reset form
            setNewChild({ username: '', password: '' });
            setShowAddForm(false);
        } else {
            setError(res.data.message || 'Failed to create child');
        }
    } catch (e) {
        console.error(e);
        setError(e.response?.data?.message || 'Server error');
    } finally {
        setCreating(false);
    }
};
```

**Optimistic UI Update**:
```javascript
setChildren((prev) => [...prev, res.data.child]);
```
- Adds new child to existing array immediately
- User sees update without page refresh
- Keeps UI responsive

---

### 4. Display Children List

```javascript
{children.length > 0 ? (
    <ul className="children-list">
        {children.map((child) => (
            <li
                key={child.id || child._id}
                className="child-item"
                onClick={() => setSelectedChild(child)}
                style={{ cursor: 'pointer' }}
            >
                <div className="child-username">
                    {child.username}
                    <span>📊 View History</span>
                </div>
                <div className="child-balance">
                    EGP {(child.balance || 0).toFixed(2)}
                </div>
            </li>
        ))}
    </ul>
) : (
    <div className="empty-state">
        <div className="empty-state-icon">👶</div>
        <h3>No Children Added Yet</h3>
        <p>Create child accounts to start managing allowance</p>
    </div>
)}
```

**React Concepts**:
- `.map()`: Iterates over children array and creates JSX for each
- `key` prop: React needs unique key for list items (performance)
- Conditional rendering: Shows list if children exist, empty state if not
- `onClick`: Sets selected child for transaction modal

---

### 5. Add Child Form

```javascript
{!showAddForm ? (
    // Show "Add New Child" button
    <button onClick={() => setShowAddForm(true)}>
        ➕ Add New Child
    </button>
) : (
    // Show form
    <div className="card">
        <form onSubmit={handleCreate}>
            <input
                type="text"
                name="username"
                value={newChild.username}
                onChange={handleInputChange}
                required
            />
            <input
                type="password"
                name="password"
                value={newChild.password}
                onChange={handleInputChange}
                required
            />
            <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
            </button>
            <button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Child'}
            </button>
        </form>
    </div>
)}
```

**Controlled Components**:
- `value={newChild.username}`: Form value controlled by React state
- `onChange={handleInputChange}`: Updates state on every keystroke
- Two-way binding between state and input fields

---

## 🔄 Complete User Flow

### Creating a Child Account

```
1. Parent logs in → JWT token stored
2. Parent navigates to dashboard
3. Clicks "Add New Child" button → showAddForm = true
4. Form appears with username/password fields
5. Parent enters: username="child1", password="pass123"
6. Parent clicks "Create Child"
7. Frontend calls: authAPI.createChild({ username: "child1", password: "pass123" })
8. Backend receives request with JWT token
9. Middleware verifies token → req.user = parent
10. Route checks: req.user.role === 'parent' ✅
11. Creates new User with role='child', parentId=parent._id
12. Password gets hashed by User model
13. Updates parent.children array with new child ID
14. Returns child data to frontend
15. Frontend adds child to state
16. UI shows new child in list
17. Form closes automatically
```

### Viewing Children

```
1. Component mounts → useEffect triggered
2. Calls authAPI.getChildren()
3. Backend finds parent by ID
4. Uses .populate() to get full child objects
5. Returns array of children with username, balance
6. Frontend displays each child as clickable card
7. Shows child username and current balance
```

### Child Login (Separate Flow)

```
1. Child navigates to /login page
2. Enters username="child1", password="pass123"
3. Calls authAPI.login({ username, password })
4. Backend finds user with username
5. Compares hashed password
6. Generates JWT token with role='child'
7. Child redirected to /child-dashboard
8. Child sees their own balance and transactions
```

---

## 📊 Database Schema

### User Collection

```javascript
{
    _id: ObjectId("507f1f77bcf86cd799439011"),
    username: "parent1",
    email: "parent@example.com",
    password: "$2a$10$hashed...",           // bcrypt hash
    role: "parent",
    balance: 1000,
    children: [                            // Array of child IDs
        ObjectId("507f1f77bcf86cd799439012"),
        ObjectId("507f1f77bcf86cd799439013")
    ]
}

{
    _id: ObjectId("507f1f77bcf86cd799439012"),
    username: "child1",
    email: null,                           // Children don't need email
    password: "$2a$10$hashed...",
    role: "child",
    balance: 150,
    parentId: ObjectId("507f1f77bcf86cd799439011"),  // Reference to parent
    children: []                           // Empty for children
}
```

---

## 🔒 Security Features

### 1. Role-Based Access Control
```javascript
if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Only parents allowed' });
}
```

### 2. Ownership Verification
```javascript
if (child.parentId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your child' });
}
```

### 3. Password Security
- Automatically hashed by User model
- Never returned in API responses
- Excluded with `.select('-password')`

### 4. JWT Authentication
- All routes protected with `authMiddleware`
- Token required in Authorization header
- Token contains user ID and role

---

## 📝 API Endpoints Summary

| Method | Endpoint | Description | Auth | Role Required |
|--------|----------|-------------|------|---------------|
| POST | `/api/auth/create-child` | Create child account | ✅ | Parent |
| GET | `/api/auth/children` | List all children | ✅ | Parent |
| GET | `/api/auth/children/:id` | Get single child | ✅ | Parent |
| PUT | `/api/auth/children/:id` | Update child | ✅ | Parent |
| DELETE | `/api/auth/children/:id` | Delete child | ✅ | Parent |

---

## 🧪 Testing with Postman

### 1. Create Parent (First)
```
POST http://localhost:5000/api/auth/register
Body: {
    "username": "parent1",
    "email": "parent@test.com",
    "password": "123456"
}
Response: { token: "eyJhbG..." }
```

### 2. Create Child
```
POST http://localhost:5000/api/auth/create-child
Headers: Authorization: Bearer <parent_token>
Body: {
    "username": "child1",
    "password": "kidpass123"
}
```

### 3. Get All Children
```
GET http://localhost:5000/api/auth/children
Headers: Authorization: Bearer <parent_token>
```

### 4. Update Child
```
PUT http://localhost:5000/api/auth/children/507f1f77bcf86cd799439012
Headers: Authorization: Bearer <parent_token>
Body: {
    "username": "child1_updated"
}
```

### 5. Delete Child
```
DELETE http://localhost:5000/api/auth/children/507f1f77bcf86cd799439012
Headers: Authorization: Bearer <parent_token>
```

---

## ✅ Feature Checklist

- [x] Create child accounts
- [x] Link children to parents via parentId
- [x] List all children with balances
- [x] Update child username/password
- [x] Delete child accounts
- [x] Ownership verification
- [x] Role-based access control
- [x] Password hashing
- [x] Frontend UI component
- [x] Error handling
- [x] Empty state handling

---

## 👥 Integration with Other Features

This feature integrates with:

1. **Moaz's Authentication**: Uses same User model and JWT system
2. **Omar Khaled's Transfers**: Parents can transfer money to children
3. **Omar Samer's Transactions**: Children can record their own expenses
4. **Dashboard Components**: Child accounts shown on parent dashboard

---

## 🎓 Key Learning Points

1. **Parent-Child Relationships**: Using ObjectId references
2. **MongoDB Operators**: `$push`, `$pull` for array operations
3. **Mongoose Populate**: Replacing IDs with full documents
4. **Role-Based Authorization**: Checking user roles before actions
5. **Ownership Verification**: Ensuring parents only access their children
6. **React State Management**: Controlled components and optimistic updates
7. **RESTful API Design**: CRUD operations with proper HTTP methods

---

**Developer**: Bahaa Ahmed (13002233)  
**Feature**: Complete child account management system enabling parent-child wallet relationships
