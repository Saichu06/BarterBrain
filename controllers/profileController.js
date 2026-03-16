// controllers/profileController.js
const UserModel = require('../models/userModel');
const OfferModel = require('../models/offerModel');
const RequestModel = require('../models/requestModel');
const ReviewModel = require('../models/reviewModel');
const MatchModel = require('../models/matchModel');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try {
        console.log('Loading profile for user ID:', req.session.userId);
        
        // Get user data
        const user = await UserModel.findById(req.session.userId);
        
        if (!user) {
            console.error('User not found:', req.session.userId);
            return res.status(404).send('User not found');
        }
        
        console.log('User data retrieved:', {
            id: user.user_id,
            name: user.full_name,
            email: user.email,
            username: user.username
        });
        
        // Get related data
        const offers = await OfferModel.findByUser(req.session.userId) || [];
        const requests = await RequestModel.findByUser(req.session.userId) || [];
        const reviews = await ReviewModel.getUserReviews(req.session.userId) || [];
        const matches = await MatchModel.findByUser(req.session.userId) || [];
        
        console.log('Related data counts:', {
            offers: offers.length,
            requests: requests.length,
            reviews: reviews.length,
            matches: matches.length
        });
        
        // Create a user object with all needed properties
        const userData = {
            id: user.user_id,
            name: user.full_name,
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            reputation_score: user.reputation_score || 0,
            created_at: user.created_at
        };
        
        res.render('profile', { 
            user: userData,
            offers, 
            requests, 
            reviews,
            matches,
            userSession: {
                id: req.session.userId,
                name: user.full_name,
                email: user.email
            },
            error: null,
            success: null
        });
        
    } catch (err) {
        console.error('Error loading profile:', err);
        res.status(500).send('Error loading profile: ' + err.message);
    }
};

// ... rest of your controller methods remain the same
exports.updateProfile = async (req, res) => {
    const { full_name, username, email, phone_number } = req.body;
    
    try {
        console.log('Updating profile for user:', req.session.userId);
        
        await UserModel.update(req.session.userId, {
            full_name,
            username,
            email,
            phone_number
        });
        
        // Update session
        req.session.user = { 
            id: req.session.userId, 
            name: full_name, 
            email: email 
        };
        
        res.redirect('/profile?success=Profile updated successfully');
    } catch (err) {
        console.error('Error updating profile:', err);
        
        // Reload data for the page
        try {
            const user = await UserModel.findById(req.session.userId);
            const offers = await OfferModel.findByUser(req.session.userId);
            const requests = await RequestModel.findByUser(req.session.userId);
            const reviews = await ReviewModel.getUserReviews(req.session.userId);
            const matches = await MatchModel.findByUser(req.session.userId);
            
            res.render('profile', { 
                user, 
                offers, 
                requests, 
                reviews,
                matches,
                userSession: req.session.user,
                error: 'Failed to update profile: ' + err.message,
                success: null
            });
        } catch (err2) {
            res.status(500).send('Failed to update profile');
        }
    }
};

exports.changePassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;
    
    try {
        console.log('Changing password for user:', req.session.userId);
        
        if (new_password !== confirm_password) {
            const user = await UserModel.findById(req.session.userId);
            const offers = await OfferModel.findByUser(req.session.userId);
            const requests = await RequestModel.findByUser(req.session.userId);
            const reviews = await ReviewModel.getUserReviews(req.session.userId);
            const matches = await MatchModel.findByUser(req.session.userId);
            
            return res.render('profile', { 
                user, 
                offers, 
                requests, 
                reviews,
                matches,
                userSession: req.session.user,
                error: 'New passwords do not match',
                success: null
            });
        }
        
        const user = await UserModel.findById(req.session.userId);
        const validPassword = await bcrypt.compare(current_password, user.password);
        
        if (!validPassword) {
            const userData = await UserModel.findById(req.session.userId);
            const userOffers = await OfferModel.findByUser(req.session.userId);
            const userRequests = await RequestModel.findByUser(req.session.userId);
            const userReviews = await ReviewModel.getUserReviews(req.session.userId);
            const userMatches = await MatchModel.findByUser(req.session.userId);
            
            return res.render('profile', { 
                user: userData, 
                offers: userOffers, 
                requests: userRequests, 
                reviews: userReviews,
                matches: userMatches,
                userSession: req.session.user,
                error: 'Current password is incorrect',
                success: null
            });
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await UserModel.updatePassword(req.session.userId, hashedPassword);
        
        // Get fresh data after password change
        const updatedUser = await UserModel.findById(req.session.userId);
        const updatedOffers = await OfferModel.findByUser(req.session.userId);
        const updatedRequests = await RequestModel.findByUser(req.session.userId);
        const updatedReviews = await ReviewModel.getUserReviews(req.session.userId);
        const updatedMatches = await MatchModel.findByUser(req.session.userId);
        
        res.render('profile', { 
            user: updatedUser, 
            offers: updatedOffers, 
            requests: updatedRequests, 
            reviews: updatedReviews,
            matches: updatedMatches,
            userSession: req.session.user,
            error: null,
            success: 'Password changed successfully'
        });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).send('Error changing password: ' + err.message);
    }
};