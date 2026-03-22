// controllers/requestController.js
const CategoryModel = require('../models/categoryModel');

exports.getRequests = async (req, res) => {
    try {
        const RequestModel = require('../models/requestModel');
        const requests = await RequestModel.findByUser(req.session.userId);
        res.render('requests', { requests, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading requests');
    }
};

exports.getNewRequest = async (req, res) => {
    try {
        const categories = await CategoryModel.getAll();
        res.render('newRequest', { categories, error: null, user: req.session.user, formData: {} });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading form');
    }
};

exports.postNewRequest = async (req, res) => {
    const { skill_name, category_id, description } = req.body;

    if (!skill_name || skill_name.trim() === '') {
        try {
            const categories = await CategoryModel.getAll();
            return res.render('newRequest', {
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
        const RequestModel = require('../models/requestModel');
        
        // Convert empty string or undefined to null
        const finalCategoryId = category_id && category_id !== '' ? parseInt(category_id) : null;
        
        const skillId = await SkillModel.findOrCreate(skill_name, finalCategoryId);
        await RequestModel.create(req.session.userId, skillId, description);
        res.redirect('/requests');
    } catch (err) {
        console.error(err);
        try {
            const categories = await CategoryModel.getAll();
            res.render('newRequest', {
                categories,
                error: 'Failed to create request: ' + err.message,
                user: req.session.user,
                formData: req.body
            });
        } catch (err2) {
            res.status(500).send('Failed to create request');
        }
    }
};

exports.deleteRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const RequestModel = require('../models/requestModel');
        const deleted = await RequestModel.delete(requestId);
        if (deleted) {
            res.redirect('/requests');
        } else {
            res.status(404).send('Request not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting request');
    }
};