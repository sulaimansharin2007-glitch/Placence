const Student = require('../models/Student');
const generateToken = require('../utils/generateToken');

// @desc    Register/Activate a student account using college email pre-added by faculty
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await Student.findOne({ email });

        // --- Faculty registration (no restriction on pre-add) ---
        if (role === 'faculty') {
            if (existingUser) {
                return res.status(400).json({ message: 'An account with this email already exists' });
            }
            const user = await Student.create({ name, email, password, role: 'faculty', isActivated: true });
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }

        // --- Student activation flow ---
        if (!email.endsWith('@sonatech.ac.in')) {
            return res.status(400).json({ message: 'Student email must end with @sonatech.ac.in' });
        }

        if (!existingUser) {
            return res.status(400).json({ 
                message: 'Your email has not been registered by a faculty member yet. Please contact your Class Counselor to get added first.' 
            });
        }

        if (existingUser.isActivated) {
            return res.status(400).json({ 
                message: 'This email has already been registered. Please use the Login page or reset your password.' 
            });
        }

        // Activate the student account with the provided password
        existingUser.password = password;
        existingUser.isActivated = true;
        if (name) existingUser.name = name; // allow name update if not set
        await existingUser.save();

        res.status(201).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token: generateToken(existingUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Student.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Block non-activated students from logging in
        if (user.role === 'student' && !user.isActivated) {
            return res.status(401).json({ 
                message: 'Account not activated. Please use the Register page to set your password first.' 
            });
        }

        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify if user email exists for forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password using email
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
