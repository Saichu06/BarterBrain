const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        // Store user in session
        req.session.userId = user.user_id;
        req.session.user = { id: user.user_id, name: user.full_name, email: user.email };
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Something went wrong' });
    }
};

exports.getRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.postRegister = async (req, res) => {
    const { full_name, username, email, phone_number, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        return res.render('register', { error: 'Passwords do not match' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            full_name,
            username,
            email,
            phone_number,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Registration failed. Email or username may already exist.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};