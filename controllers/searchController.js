const db = require('../config/db');
const UserModel = require('../models/userModel');
const OfferModel = require('../models/offerModel');
const RequestModel = require('../models/requestModel');
const ReviewModel = require('../models/reviewModel');

// Get search page
// Get search page
exports.getSearchPage = async (req, res) => {
    try {
        // Get trending skills for suggestions
        const [trendingSkills] = await db.execute(`
            SELECT s.skill_name, 
                   COUNT(DISTINCT o.offer_id) + COUNT(DISTINCT r.request_id) as mention_count
            FROM skills s
            LEFT JOIN offers o ON s.skill_id = o.skill_id
            LEFT JOIN requests r ON s.skill_id = r.skill_id
            GROUP BY s.skill_id, s.skill_name
            ORDER BY mention_count DESC
            LIMIT 10
        `);

        // Get recent users for suggestions - ensure reputation is a number
        const [recentUsersRaw] = await db.execute(`
            SELECT user_id, full_name, username, reputation_score, created_at,
                   (SELECT COUNT(*) FROM offers WHERE user_id = users.user_id) as offer_count,
                   (SELECT COUNT(*) FROM requests WHERE user_id = users.user_id) as request_count
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        `);
        
        // Format recent users
        const recentUsers = recentUsersRaw.map(user => ({
            ...user,
            reputation_score: parseFloat(user.reputation_score) || 0,
            offer_count: parseInt(user.offer_count) || 0,
            request_count: parseInt(user.request_count) || 0,
            created_at: user.created_at
        }));

        res.render('search', {
            user: req.session.user,
            trendingSkills,
            recentUsers,
            searchResults: null,
            searchQuery: null
        });
    } catch (err) {
        console.error('Error loading search page:', err);
        res.status(500).send('Error loading search page');
    }
};
// Search users
// Search users
exports.searchUsers = async (req, res) => {
    try {
        const { q, skill, category } = req.query;
        
        let query = `
            SELECT DISTINCT 
                u.user_id,
                u.full_name,
                u.username,
                u.reputation_score,
                u.created_at,
                (SELECT COUNT(*) FROM offers WHERE user_id = u.user_id) as offer_count,
                (SELECT COUNT(*) FROM requests WHERE user_id = u.user_id) as request_count,
                GROUP_CONCAT(DISTINCT s.skill_name) as skills
            FROM users u
            LEFT JOIN offers o ON u.user_id = o.user_id
            LEFT JOIN skills s ON o.skill_id = s.skill_id
            WHERE u.user_id != ?
        `;
        
        const params = [req.session.userId];
        
        // Add search conditions
        if (q && q.trim()) {
            query += ` AND (u.full_name LIKE ? OR u.username LIKE ?)`;
            const searchTerm = `%${q.trim()}%`;
            params.push(searchTerm, searchTerm);
        }
        
        if (skill && skill.trim()) {
            query += ` AND s.skill_name LIKE ?`;
            params.push(`%${skill.trim()}%`);
        }
        
        if (category && category.trim()) {
            query += ` AND s.category_id = ?`;
            params.push(category);
        }
        
        query += ` GROUP BY u.user_id ORDER BY u.reputation_score DESC LIMIT 50`;
        
        const [results] = await db.execute(query, params);
        
        // Format the results - ensure reputation_score is a number
        const formattedResults = results.map(user => ({
            ...user,
            reputation_score: parseFloat(user.reputation_score) || 0,
            skills: user.skills ? user.skills.split(',') : [],
            memberSince: new Date(user.created_at).toLocaleDateString(),
            offer_count: parseInt(user.offer_count) || 0,
            request_count: parseInt(user.request_count) || 0
        }));
        
        res.json({
            success: true,
            users: formattedResults,
            count: formattedResults.length
        });
        
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ success: false, error: 'Search failed' });
    }
};
// View user profile
exports.viewUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Don't allow viewing your own profile through this route
        if (parseInt(userId) === req.session.userId) {
            return res.redirect('/profile');
        }
        
        // Get user details
        const user = await UserModel.findByIdPublic(userId);
        
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        // Get user's offers
        const offers = await OfferModel.findByUser(userId);
        
        // Get user's requests
        const requests = await RequestModel.findByUser(userId);
        
        // Get user's reviews (as a teacher)
        const reviewsAsTeacher = await ReviewModel.getUserReviewsAsTeacher(userId);
        
        // Get user's reviews (as a learner)
        const reviewsAsLearner = await ReviewModel.getUserReviewsAsLearner(userId);
        
        // Calculate average rating
        let avgRating = await ReviewModel.getAverageForUser(userId);
        avgRating = parseFloat(avgRating) || 0;
        
        // Check if current user has any matches with this user
        const [existingMatch] = await db.execute(`
            SELECT m.* 
            FROM matches m
            LEFT JOIN offers o ON m.offer_id = o.offer_id
            LEFT JOIN requests r ON m.request_id = r.request_id
            WHERE (o.user_id = ? AND r.user_id = ?)
               OR (o.user_id = ? AND r.user_id = ?)
            LIMIT 1
        `, [userId, req.session.userId, req.session.userId, userId]);
        
        res.render('viewUserProfile', {
            profileUser: user,
            offers,
            requests,
            reviewsAsTeacher,
            reviewsAsLearner,
            avgRating,
            existingMatch: existingMatch[0],
            user: req.session.user
        });
        
    } catch (err) {
        console.error('Error viewing user profile:', err);
        res.status(500).send('Error loading user profile: ' + err.message);
    }
};