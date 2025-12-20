# Authentication Feature Documentation
## Masroofy Wallet Project - Feature 1

**Developer**: Moaz Abdelaleem (ID: 13007327)  
**Feature**: User Authentication & Account Hierarchy  
**Stack**: JWT + bcrypt + MongoDB

---

## 📋 Overview

The Authentication feature provides secure user registration, login, and role-based access control for the Masroofy wallet system. It supports two user roles: **Parent** and **Child**, with a hierarchical relationship where parents can create and manage child accounts.

### Key Capabilities

✅ Parent account registration with email  
✅ Secure password hashing using bcrypt  
✅ JWT token-based authentication  
✅ Role-based authorization (Parent/Child)  
✅ Session management with 7-day token expiration  
✅ Child account creation and management by parents  
✅ Protected routes requiring authentication  

---

## 🗂️ File Structure

### Backend Files

```
Masroofy/
├── 01_moaz_abdelaleem_auth.js          # Authentication routes
├── middleware/
│   └── authMiddleware.js                # JWT verification middleware
└── models/
    └── User.js                          # User schema with password hashing
```

### Frontend Files

```
frontend/src/
├── components/
│   ├── Login.jsx                        # Login page
│   └── Register.jsx                     # Registration page
└── api.js                               # API client with axios
```

---

## 🔧 Backend Implementation

### 1. User Model (`models/User.js`)

**Purpose**: Defines the user schema with automatic password hashing

**Schema Fields**:
- `username` (String, required, unique): User's login name
- `email` (String, optional): Email address (only for parents)
- `password` (String, required): Hashed password
- `role` (String, enum): Either "parent" or "child"
- `balance` (Number, default: 0): Account balance
- `parentId` (ObjectId): Reference to parent user (for children)
- `children` (Array of ObjectIds): References to child accounts (for parents)

**Key Features**:
```javascript
// Automatic password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
```

**Security**:
- Passwords are never stored in plain text
- Uses bcrypt with salt rounds (10) for strong hashing
- Password validation method for secure login

---

### 2. Authentication Middleware (`middleware/authMiddleware.js`)

**Purpose**: Protects routes by verifying JWT tokens

**Flow**:
1. Extract token from Authorization header (`Bearer <token>`)
2. Verify token using JWT_SECRET
3. Fetch user from database using userId from token
4. Attach user object to request (`req.user`)
5. Allow request to proceed to protected route

**Usage Example**:
```javascript
router.get('/profile', authMiddleware, async (req, res) => {
    // req.user is now available
    const user = req.user;
});
```

**Error Handling**:
- Returns 401 if no token provided
- Returns 401 if token is invalid or expired
- Returns 401 if user not found in database

---

### 3. Authentication Routes (`01_moaz_abdelaleem_auth.js`)

#### **POST /api/auth/register**
**Purpose**: Create a new parent account

**Request Body**:
```json
{
    "username": "parent1",
    "email": "parent@example.com",
    "password": "secure123"
}
```

**Validation**:
- All fields required (username, email, password)
- Username must be unique
- Email must be unique

**Response (Success - 201)**:
```json
{
    "success": true,
    "message": "Parent account created successfully",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "parent1",
        "email": "parent@example.com",
        "role": "parent",
        "balance": 0
    }
}
```

**Process**:
1. Check if all required fields are provided
2. Verify username/email don't already exist
3. Create user with role "parent" and balance 0
4. Hash password automatically (via User model pre-save hook)
5. Generate JWT token with 7-day expiration
6. Return token and user data (excluding password)

---

#### **POST /api/auth/login**
**Purpose**: Authenticate existing user (parent or child)

**Request Body**:
```json
{
    "username": "parent1",
    "password": "secure123"
}
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "parent1",
        "email": "parent@example.com",
        "role": "parent",
        "balance": 500
    }
}
```

**Process**:
1. Find user by username
2. Compare provided password with hashed password
3. Generate JWT token if password matches
4. Return token and user data
5. Frontend stores token in localStorage

**Error Responses**:
- 400: Missing username or password
- 401: Invalid credentials (user not found or wrong password)
- 500: Server error

---

#### **GET /api/auth/profile**
**Purpose**: Get authenticated user's profile

**Headers**:
```
Authorization: Bearer <token>
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "parent1",
        "email": "parent@example.com",
        "role": "parent",
        "balance": 500,
        "children": [
            {
                "id": "507f1f77bcf86cd799439012",
                "username": "child1",
                "balance": 100
            }
        ]
    }
}
```

**Features**:
- Requires authentication (protected by middleware)
- Excludes password from response
- Populates children array with basic child info

---

#### **POST /api/auth/create-child**
**Purpose**: Create a child account (parent only)

**Headers**:
```
Authorization: Bearer <parent_token>
```

**Request Body**:
```json
{
    "username": "child1",
    "password": "child123"
}
```

**Authorization**:
- Only parents can create child accounts
- Returns 403 if requester is a child

**Response (Success - 201)**:
```json
{
    "success": true,
    "message": "Child account created successfully",
    "child": {
        "id": "507f1f77bcf86cd799439012",
        "username": "child1",
        "role": "child",
        "balance": 0
    }
}
```

**Process**:
1. Verify requester is a parent
2. Check username availability
3. Create child user with parentId reference
4. Add child to parent's children array
5. Return child account info

---

#### **GET /api/auth/children**
**Purpose**: Get all children of authenticated parent

**Response**:
```json
{
    "success": true,
    "children": [
        {
            "id": "507f1f77bcf86cd799439012",
            "username": "child1",
            "balance": 100,
            "createdAt": "2025-12-20T10:30:00Z"
        }
    ],
    "count": 1
}
```

---

#### **GET /api/auth/children/:childId**
**Purpose**: Get details of a specific child

**Authorization**: Parent must own the child account

---

#### **PUT /api/auth/children/:childId**
**Purpose**: Update child account (username/password)

**Request Body**:
```json
{
    "username": "child1_updated",
    "password": "newpassword123"
}
```

---

#### **DELETE /api/auth/children/:childId**
**Purpose**: Delete a child account

**Authorization**: Parent must own the child account

---

## 🎨 Frontend Implementation

### 1. Login Component (`Login.jsx`)

**Features**:
- Username and password input fields
- Form validation
- Error message display
- Loading state during authentication
- Redirect to appropriate dashboard based on role

**State Management**:
```javascript
const [formData, setFormData] = useState({
    username: '',
    password: ''
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

**Authentication Flow**:
1. User submits login form
2. Call `authAPI.login()` with credentials
3. On success:
   - Store token in localStorage
   - Store user data (id, role, username)
   - Redirect to `/dashboard` (parent) or `/child-dashboard` (child)
4. On error:
   - Display error message
   - Keep user on login page

**LocalStorage Data**:
```javascript
localStorage.setItem('token', response.data.token);
localStorage.setItem('userId', response.data.user.id);
localStorage.setItem('userRole', response.data.user.role);
localStorage.setItem('username', response.data.user.username);
```

---

### 2. Register Component (`Register.jsx`)

**Features**:
- Username, email, password, and confirm password fields
- Client-side validation (password length, password match)
- Error message display
- Automatic login after successful registration

**Validation Rules**:
```javascript
// Password must be at least 6 characters
if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
}

// Passwords must match
if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
}
```

---

### 3. API Client (`api.js`)

**Configuration**:
```javascript
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add token to all requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Auth Methods**:
```javascript
export const authAPI = {
    login: (credentials) => API.post('/auth/login', credentials),
    register: (userData) => API.post('/auth/register', userData),
    profile: () => API.get('/auth/profile'),
    createChild: (childData) => API.post('/auth/create-child', childData),
    getChildren: () => API.get('/auth/children')
};
```

---

## 🔐 Security Features

### 1. Password Security
- **Hashing**: bcrypt with salt rounds (10)
- **Never stored in plain text**: Automatic hashing on save
- **Secure comparison**: Using bcrypt.compare()

### 2. JWT Tokens
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Payload**: `{ userId, role }`
- **Secret**: Stored in environment variable

### 3. Token Transmission
- **Format**: `Authorization: Bearer <token>`
- **Storage**: localStorage (client-side)
- **Validation**: On every protected route request

### 4. Authorization Checks
- **Role-based**: Middleware verifies user role
- **Ownership**: Parents can only access their own children
- **Protected routes**: All sensitive operations require authentication

---

## 🔄 Authentication Flow

### Registration Flow
```
User fills form → Frontend validates → POST /auth/register
         ↓
Backend validates uniqueness → Create user → Hash password
         ↓
Generate JWT token → Return token + user data
         ↓
Frontend stores token → Redirect to dashboard
```

### Login Flow
```
User enters credentials → POST /auth/login
         ↓
Backend finds user → Compare passwords
         ↓
Generate JWT token → Return token + user data
         ↓
Frontend stores token → Check role → Redirect:
                                      - Parent → /dashboard
                                      - Child → /child-dashboard
```

### Protected Route Access
```
Frontend request → Add token to Authorization header
         ↓
Backend middleware → Verify token → Fetch user
         ↓
Attach user to request → Route handler processes → Response
```

---

## 📝 Testing

### Postman Test Cases

**1. Register Parent**
```
POST http://localhost:5000/api/auth/register
Body: {
    "username": "parent1",
    "email": "parent@test.com",
    "password": "123456"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Body: {
    "username": "parent1",
    "password": "123456"
}
```

**3. Get Profile**
```
GET http://localhost:5000/api/auth/profile
Headers: Authorization: Bearer <token>
```

**4. Create Child**
```
POST http://localhost:5000/api/auth/create-child
Headers: Authorization: Bearer <parent_token>
Body: {
    "username": "child1",
    "password": "child123"
}
```

---

## 🌐 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wallet-system
JWT_SECRET=supersecretkey12345
```

---

## 🚀 How to Run

### Backend
```bash
cd Masroofy
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## ✅ Feature Status

- [x] Parent registration with email
- [x] Parent and child login
- [x] JWT token generation
- [x] Password hashing with bcrypt
- [x] Protected routes with middleware
- [x] Child account creation
- [x] Child account management (CRUD)
- [x] Role-based authorization
- [x] Session persistence (7 days)
- [x] Automatic password hashing
- [x] Error handling and validation

---

## 📚 Technologies Used

**Backend**:
- Express.js - Web framework
- Mongoose - MongoDB ODM
- jsonwebtoken - JWT implementation
- bcryptjs - Password hashing
- dotenv - Environment variables

**Frontend**:
- React - UI framework
- React Router - Navigation
- Axios - HTTP client
- localStorage - Token storage

---

## 👤 Developer Notes

**By**: Moaz Abdelaleem  
**Student ID**: 13007327  
**Feature**: Authentication & Account Hierarchy  

This feature forms the foundation of the Masroofy wallet system by providing:
- Secure user authentication
- Parent-child account relationships
- Role-based access control
- Token-based session management

All passwords are securely hashed, tokens have proper expiration, and authorization checks ensure users can only access their own data.
