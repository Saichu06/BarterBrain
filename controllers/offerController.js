// controllers/offerController.js
const CategoryModel = require('../models/categoryModel');

exports.getOffers = async (req, res) => {
    try {
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
        const categories = await CategoryModel.getAll();
        res.render('newOffer', { categories, error: null, user: req.session.user, formData: {} });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading form');
    }
};

exports.postNewOffer = async (req, res) => {
    const { skill_name, category_id, description } = req.body;

    if (!skill_name || skill_name.trim() === '') {
        try {
            const categories = await CategoryModel.getAll();
            return res.render('newOffer', {
                categories,
                error: 'Please enter a skill name',
                user: req.session.user,
                formData: req.body
            });
        } catch (err) {
            return res.status(500).send('Error');
        }
    }

    try {
        const SkillModel = require('../models/skillModel');
        const OfferModel = require('../models/offerModel');
        
        // Convert empty string or undefined to null
        const finalCategoryId = category_id && category_id !== '' ? parseInt(category_id) : null;
        
        const skillId = await SkillModel.findOrCreate(skill_name, finalCategoryId);
        await OfferModel.create(req.session.userId, skillId, description);
        res.redirect('/offers');
    } catch (err) {
        console.error(err);
        try {
            const categories = await CategoryModel.getAll();
            res.render('newOffer', {
                categories,
                error: 'Failed to create offer: ' + err.message,
                user: req.session.user,
                formData: req.body
            });
        } catch (err2) {
            res.status(500).send('Failed to create offer');
        }
    }
};

exports.deleteOffer = async (req, res) => {
    const { offerId } = req.params;
    try {
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