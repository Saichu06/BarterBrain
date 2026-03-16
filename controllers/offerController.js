// controllers/offerController.js
// REMOVE these top-level requires:
// const OfferModel = require('../models/offerModel');
// const SkillModel = require('../models/skillModel');

exports.getOffers = async (req, res) => {
    try {
        // Load model inside the function
        const OfferModel = require('../models/offerModel');
        const offers = await OfferModel.findByUser(req.session.userId);
        res.render('offers', { offers, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading offers');
    }
};

exports.getAllOffers = async (req, res) => {
    try {
        // Load model inside the function
        const OfferModel = require('../models/offerModel');
        const offers = await OfferModel.findAllWithDetails();
        res.render('allOffers', { offers, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading offers');
    }
};

exports.getNewOffer = async (req, res) => {
    try {
        // Load model inside the function
        const SkillModel = require('../models/skillModel');
        const skills = await SkillModel.getAll();
        res.render('newOffer', { skills, error: null, user: req.session.user });        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading form');
    }
};

exports.postNewOffer = async (req, res) => {
    const { skill_id, description } = req.body;

    if (!skill_id) {
        try {
            // Load model inside the function
            const SkillModel = require('../models/skillModel');
            const skills = await SkillModel.getAll();
            return res.render('newOffer', {
                skills,
                error: 'Please select a skill',
                user: req.session.user
            });
        } catch (err) {
            return res.status(500).send('Error');
        }
    }

    try {
        // Load models inside the function
        const OfferModel = require('../models/offerModel');
        await OfferModel.create(req.session.userId, skill_id, description);
        res.redirect('/offers');
    } catch (err) {
        console.error(err);
        try {
            // Load model inside the function
            const SkillModel = require('../models/skillModel');
            const skills = await SkillModel.getAll();
            res.render('newOffer', {
                skills,
                error: 'Failed to create offer',
                user: req.session.user
            });
        } catch (err2) {
            res.status(500).send('Failed to create offer');
        }
    }
};

exports.deleteOffer = async (req, res) => {
    const { offerId } = req.params;
    try {
        // Load model inside the function
        const OfferModel = require('../models/offerModel');
        const deleted = await OfferModel.delete(offerId);
        if (deleted) {
            res.redirect('/offers');
        } else {
            res.status(404).send('Offer not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting offer');
    }
};