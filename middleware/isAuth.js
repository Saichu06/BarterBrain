// middleware/isAuth.js
console.log('Loading isAuth middleware');

const isAuth = (req, res, next) => {
    console.log('isAuth middleware executed for:', req.path);
    if (!req.session || !req.session.userId) {
        console.log('Auth failed - redirecting to login');
        return res.redirect('/login');
    }
    console.log('Auth successful for user:', req.session.userId);
    next();
};

console.log('isAuth middleware loaded, type:', typeof isAuth);
module.exports = isAuth;