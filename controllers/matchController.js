const MatchModel = require('../models/matchModel');
const RequestModel = require('../models/requestModel');
const OfferModel = require('../models/offerModel');
const ReviewModel = require('../models/reviewModel');

exports.getMatches = async (req, res) => {
    try {
        const matches = await MatchModel.findByUser(req.session.userId);
        res.render('matches', { matches, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading matches');
    }
};

exports.getPotentialMatches = async (req, res) => {
    try {
        // Get user's requests
        const userRequests = await RequestModel.findByUser(req.session.userId);
        
        // For each request, find potential matches
        const potentialMatches = [];
        for (const request of userRequests) {
            const matches = await MatchModel.findMatchesForRequest(request.request_id);
            potentialMatches.push({
                request,
                offers: matches
            });
        }
        
        res.render('potentialMatches', { potentialMatches, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading potential matches');
    }
};

exports.createMatch = async (req, res) => {
    const { offerId, requestId } = req.body;
    
    try {
        // Check if match already exists
        const existingMatch = await MatchModel.findByOfferAndRequest(offerId, requestId);
        if (existingMatch) {
            return res.status(400).send('Match already exists');
        }
        
        await MatchModel.create(offerId, requestId);
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating match');
    }
};

exports.acceptMatch = async (req, res) => {
    const { matchId } = req.params;
    try {
        await MatchModel.updateStatus(matchId, 'accepted');
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error accepting match');
    }
};

exports.completeMatch = async (req, res) => {
    const { matchId } = req.params;
    try {
        await MatchModel.updateStatus(matchId, 'completed');
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error completing match');
    }
};

exports.getReviewForm = async (req, res) => {
    const { matchId } = req.params;
    try {
        const match = await MatchModel.findById(matchId);
        if (!match) {
            return res.status(404).send('Match not found');
        }
        res.render('reviewForm', { match, user: req.session.user, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading review form');
    }
};


// Add this method to controllers/matchController.js

exports.rejectMatch = async (req, res) => {
    const { matchId } = req.params;
    try {
        const MatchModel = require('../models/matchModel');
        await MatchModel.rejectMatch(matchId);
        res.redirect('/matches');
    } catch (err) {
        console.error('Error rejecting match:', err);
        res.status(500).send('Error rejecting match');
    }
};

exports.submitReview = async (req, res) => {
    const { matchId } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
        try {
            const match = await MatchModel.findById(matchId);
            return res.render('reviewForm', { 
                match, 
                user: req.session.user, 
                error: 'Please provide a rating between 1 and 5' 
            });
        } catch (err) {
            return res.status(500).send('Error');
        }
    }
    
    try {
        await ReviewModel.create(matchId, rating, comment);
        
        // Update user reputation
        const match = await MatchModel.findById(matchId);
        await ReviewModel.updateUserReputation(match.offer_user_id);
        if (match.offer_user_id !== match.request_user_id) {
            await ReviewModel.updateUserReputation(match.request_user_id);
        }
        
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting review');
    }
};