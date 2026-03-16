const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuth = require('../middleware/isAuth');

// Get user reputation score
router.get('/user/reputation', isAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT reputation_score FROM users WHERE user_id = ?',
            [req.session.userId]
        );
        
        if (rows.length > 0) {
            res.json({ score: rows[0].reputation_score || 0 });
        } else {
            res.json({ score: 0 });
        }
    } catch (err) {
        console.error('Error fetching reputation:', err);
        res.status(500).json({ error: 'Failed to fetch reputation' });
    }
});

// Get recent offers for the user
router.get('/user/recent-offers', isAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT o.*, s.skill_name 
             FROM offers o
             JOIN skills s ON o.skill_id = s.skill_id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC
             LIMIT 3`,
            [req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching recent offers:', err);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// Get recent requests for the user
router.get('/user/recent-requests', isAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT r.*, s.skill_name 
             FROM requests r
             JOIN skills s ON r.skill_id = s.skill_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC
             LIMIT 3`,
            [req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching recent requests:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Get pending matches for the user
router.get('/user/pending-matches', isAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT m.*, 
                    s.skill_name,
                    CASE 
                        WHEN o.user_id = ? THEN u_request.full_name
                        ELSE u_offer.full_name
                    END as other_user
             FROM matches m
             JOIN offers o ON m.offer_id = o.offer_id
             JOIN requests req ON m.request_id = req.request_id
             JOIN users u_offer ON o.user_id = u_offer.user_id
             JOIN users u_request ON req.user_id = u_request.user_id
             JOIN skills s ON o.skill_id = s.skill_id
             WHERE (o.user_id = ? OR req.user_id = ?)
             AND m.status = 'pending'
             ORDER BY m.created_at DESC
             LIMIT 3`,
            [req.session.userId, req.session.userId, req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching pending matches:', err);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});


// Get contact information for a match (only available after match is accepted)
router.get('/match/:matchId/contact', isAuth, async (req, res) => {
    try {
        const { matchId } = req.params;
        const userId = req.session.userId;
        
        console.log(`Fetching contact info for match ${matchId} by user ${userId}`);
        
        // First, get the match details to see who's involved
        const [matchRows] = await db.execute(
            `SELECT m.*, 
                    o.user_id as offer_user_id,
                    r.user_id as request_user_id,
                    o.offer_id, r.request_id
             FROM matches m
             JOIN offers o ON m.offer_id = o.offer_id
             JOIN requests r ON m.request_id = r.request_id
             WHERE m.match_id = ?`,
            [matchId]
        );
        
        if (matchRows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        
        const match = matchRows[0];
        
        // Check if user is part of this match
        if (match.offer_user_id !== userId && match.request_user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to view this contact info' });
        }
        
        // Check if match is accepted or completed (only then show contact info)
        if (match.status !== 'accepted' && match.status !== 'completed') {
            return res.status(403).json({ error: 'Contact info only available for accepted or completed matches' });
        }
        
        // Determine which other user's info to return
        const otherUserId = match.offer_user_id === userId ? match.request_user_id : match.offer_user_id;
        
        // Get the other user's contact info
        const [userRows] = await db.execute(
            'SELECT full_name, email, phone_number FROM users WHERE user_id = ?',
            [otherUserId]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const otherUser = userRows[0];
        
        res.json({
            name: otherUser.full_name,
            email: otherUser.email,
            phone: otherUser.phone_number || 'Not provided'
        });
        
    } catch (err) {
        console.error('Error fetching contact info:', err);
        res.status(500).json({ error: 'Failed to fetch contact information' });
    }
});

// Add this to apiRoutes.js for testing
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;