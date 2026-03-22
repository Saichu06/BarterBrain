require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));

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
app.use('/user', userRoutes);
app.use('/', authRoutes);
app.use('/offers', offerRoutes);
app.use('/requests', requestRoutes);
app.use('/matches', matchRoutes);
app.use('/availability', availabilityRoutes);
app.use('/api', apiRoutes);
app.use('/profile', profileRoutes);
app.use('/search', searchRoutes);

// Home route – redirect to dashboard or login
// Home route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.render('home');
    }
});


app.get('/about', (req, res) => {
    res.render('about');
});
 
// Features  →  views/features.ejs
app.get('/features', (req, res) => {
    res.render('features');
});
 
// Terms of Service  →  views/terms.ejs
app.get('/terms', (req, res) => {
    res.render('terms');
});
 
// Privacy Policy  →  views/privacy.ejs
app.get('/privacy', (req, res) => {
    res.render('privacy');
});
 
// Cookie Policy  →  views/cookie-policy.ejs
app.get('/cookie-policy', (req, res) => {
    res.render('cookie-policy');
});
 
// Help Center  →  views/help.ejs
app.get('/help', (req, res) => {
    res.render('help');
});



// Dashboard
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    // Fetch user data and recent offers/requests/matches
    // For now, just render dashboard
    res.render('dashboard', { user: req.session.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));