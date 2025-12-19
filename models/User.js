const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false }, // only for parents
    password: { type: String, required: true },
    role: { type: String, enum: ['parent', 'child'], required: true },
    balance: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Password hashing method (bcrypt)
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
