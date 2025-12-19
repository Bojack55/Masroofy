/*
 * Moaz Abdelaleem - 13007327
 * Feature: User Authentication & Hierarchy
 * 
 * My part handles login/register for parents
 * Uses JWT for tokens, bcrypt for passwords
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');

// Register new parent account
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        const user = new User({
            username,
            email,
            password,
            role: 'parent',
            balance: 0,
            children: []
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Parent account created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get profile - needs token
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('children', 'username balance');

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

// ========================================
// Child Account Management Routes (Bahaa)
// ========================================

// Create child account - parent only
router.post('/create-child', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can create child accounts'
            });
        }

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password for the child'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        const child = new User({
            username,
            password,
            role: 'child',
            parentId: req.user._id,
            balance: 0
        });

        await child.save();

        // Add to parent's children list
        await User.findByIdAndUpdate(req.user._id, {
            $push: { children: child._id }
        });

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

// Get all children
router.get('/children', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can view children'
            });
        }

        const parent = await User.findById(req.user._id)
            .populate('children', 'username balance createdAt');

        res.json({
            success: true,
            children: parent.children || [],
            count: parent.children ? parent.children.length : 0
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching children'
        });
    }
});

// Get single child
router.get('/children/:childId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can view child details'
            });
        }

        const child = await User.findById(req.params.childId).select('-password');

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

        res.json({ success: true, child });
    } catch (error) {
        console.error('Get child error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching child'
        });
    }
});

// Update child
router.put('/children/:childId', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can update child accounts'
            });
        }

        const child = await User.findById(req.params.childId);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

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

        if (password) {
            child.password = password;
        }

        await child.save();

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

// Delete child
router.delete('/children/:childId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can delete child accounts'
            });
        }

        const child = await User.findById(req.params.childId);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        if (child.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This is not your child account'
            });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { children: child._id }
        });

        await User.findByIdAndDelete(req.params.childId);

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

module.exports = router;

/*
 * POSTMAN TESTS:
 * 
 * 1. POST /api/auth/register
 *    Body: { "username": "parent1", "email": "parent@test.com", "password": "123456" }
 * 
 * 2. POST /api/auth/login
 *    Body: { "username": "parent1", "password": "123456" }
 * 
 * 3. GET /api/auth/profile
 *    Header: Authorization: Bearer <token>
 */
