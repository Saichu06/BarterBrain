// controllers/userController.js
const UserModel = require('../models/userModel');
const OfferModel = require('../models/offerModel');
const RequestModel = require('../models/requestModel');
const ReviewModel = require('../models/reviewModel');

exports.viewUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('Viewing profile for user ID:', userId);
        console.log('Requested by user ID:', req.session.userId);
        
        // Get user details (public info only)
        const user = await UserModel.findByIdPublic(userId);
        
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).send('User not found');
        }
        
        console.log('User found:', user.full_name);
        
        // Get user's offers
        const offers = await OfferModel.findByUser(userId) || [];
        
        // Get user's requests
        const requests = await RequestModel.findByUser(userId) || [];
        
        // Get user's reviews (as a teacher)
        const reviewsAsTeacher = await ReviewModel.getUserReviewsAsTeacher(userId) || [];
        
        // Get user's reviews (as a learner)
        const reviewsAsLearner = await ReviewModel.getUserReviewsAsLearner(userId) || [];
        
        // Calculate average rating
        let avgRating = await ReviewModel.getAverageForUser(userId);
        avgRating = parseFloat(avgRating) || 0;
        
        console.log('User profile loaded:', {
            name: user.full_name,
            avgRating,
            offersCount: offers.length,
            requestsCount: requests.length,
            teacherReviews: reviewsAsTeacher.length,
            learnerReviews: reviewsAsLearner.length
        });
        
        res.render('userProfile', {
            profileUser: user,
            offers,
            requests,
            reviewsAsTeacher,
            reviewsAsLearner,
            avgRating,
            user: req.session.user // logged in user
        });
        
    } catch (err) {
        console.error('Error viewing user profile:', err);
        res.status(500).send('Error loading user profile: ' + err.message);
    }
};