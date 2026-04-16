// UPDATED: Get potential matches with fuzzy skill matching
exports.getPotentialMatches = async (req, res) => {
    try {
        const db = require('../config/db');
        const RequestModel = require('../models/requestModel');
        const SkillModel = require('../models/skillModel');
        
        const userRequests = await RequestModel.findByUser(req.session.userId);
        
        const potentialMatches = [];
        
        for (const request of userRequests) {
            // Get the request skill details
            const requestSkill = await SkillModel.findById(request.skill_id);
            const requestSkillName = requestSkill?.skill_name || '';
            
            // Find matching offers using fuzzy search
            const [offers] = await db.execute(`
                SELECT 
                    o.offer_id,
                    o.user_id,
                    o.description,
                    u.full_name,
                    u.username,
                    u.reputation_score,
                    s.skill_name,
                    s.skill_id
                FROM offers o
                JOIN users u ON o.user_id = u.user_id
                JOIN skills s ON o.skill_id = s.skill_id
                WHERE (
                    -- Exact match
                    LOWER(s.skill_name) = LOWER(?)
                    OR
                    -- Partial match (skill contains keyword)
                    LOWER(s.skill_name) LIKE CONCAT('%', LOWER(?), '%')
                    OR
                    -- Keyword contains skill name
                    LOWER(?) LIKE CONCAT('%', LOWER(s.skill_name), '%')
                    OR
                    -- Word-by-word matching for multi-word skills
                    LOWER(s.skill_name) REGEXP REPLACE(LOWER(?), ' ', '|')
                )
                AND o.user_id != ?
                AND NOT EXISTS (
                    SELECT 1 FROM matches 
                    WHERE offer_id = o.offer_id AND request_id = ?
                )
                ORDER BY 
                    CASE 
                        WHEN LOWER(s.skill_name) = LOWER(?) THEN 1
                        WHEN LOWER(s.skill_name) LIKE CONCAT('%', LOWER(?), '%') THEN 2
                        ELSE 3
                    END
            `, [
                requestSkillName, 
                requestSkillName, 
                requestSkillName,
                requestSkillName,
                req.session.userId, 
                request.request_id,
                requestSkillName,
                requestSkillName
            ]);
            
            if (offers.length > 0) {
                potentialMatches.push({
                    request: request,
                    offers: offers
                });
            }
        }
        
        res.render('potentialMatches', { 
            potentialMatches, 
            user: req.session.user 
        });
        
    } catch (err) {
        console.error('Error loading potential matches:', err);
        res.status(500).send('Error loading potential matches: ' + err.message);
    }
};