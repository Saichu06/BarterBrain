require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration - WORKS FOR BOTH LOCAL AND PRODUCTION
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,  // Only trust proxy in production
    cookie: { 
        secure: isProduction,  // Only secure in production (HTTPS)
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',  // 'none' for cross-site, 'lax' for local
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    },
    name: 'barterbrain.sid'
}));

// Debug middleware
app.use((req, res, next) => {
    console.log('=== DEBUG ===');
    console.log('URL:', req.url);
    console.log('Session ID:', req.sessionID);
    console.log('User ID in session:', req.session.userId);
    console.log('Cookies received:', req.cookies);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('=============');
    next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
const offerRoutes = require('./routes/offerRoutes');
const requestRoutes = require('./routes/requestRoutes');
const matchRoutes = require('./routes/matchRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');
const profileRoutes = require('./routes/profileRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Register routes
app.use('/user', userRoutes);
app.use('/', authRoutes);
app.use('/offers', offerRoutes);
app.use('/requests', requestRoutes);
app.use('/matches', matchRoutes);
app.use('/availability', availabilityRoutes);
app.use('/api', apiRoutes);
app.use('/profile', profileRoutes);
app.use('/search', searchRoutes);

// Home route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.render('home');
    }
});

// Dashboard
app.get('/dashboard', (req, res) => {
    console.log('Dashboard route hit, userId:', req.session.userId);
    console.log('Session ID:', req.sessionID);
    
    if (!req.session.userId) {
        console.log('No userId in session, redirecting to login');
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

// Static pages
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/features', (req, res) => {
    res.render('features');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.get('/cookie-policy', (req, res) => {
    res.render('cookie-policy');
});

app.get('/help', (req, res) => {
    res.render('help');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));