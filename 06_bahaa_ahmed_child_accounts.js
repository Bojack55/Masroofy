/*
 * Bahaa Aldin Ahmed - 13002233
 * Feature: User Authentication & Hierarchy (Child Accounts)
 * 
 * Handles child account creation and management
 * Parents can add/edit/delete their kids accounts
 */

const express = require('express');
const router = express.Router();
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');

// create child account - parent only
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

        // add to parent's children list
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

// get all children
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

// get single child
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

// update child
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

// delete child
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
 * POSTMAN:
 * POST /api/auth/create-child - { "username": "kid1", "password": "123456" }
 * GET /api/auth/children
 * GET /api/auth/children/:childId
 * PUT /api/auth/children/:childId - { "username": "newname" }
 * DELETE /api/auth/children/:childId
 * all need parent token
 */
