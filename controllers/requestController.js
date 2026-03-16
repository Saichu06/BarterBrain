    const RequestModel = require('../models/requestModel');
    const SkillModel = require('../models/skillModel');

    exports.getRequests = async (req, res) => {
        try {
            const requests = await RequestModel.findByUser(req.session.userId);
            res.render('requests', { requests, user: req.session.user });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading requests');
        }
    };

    exports.getNewRequest = async (req, res) => {
        try {
            const skills = await SkillModel.getAll();
            res.render('newRequest', { skills, error: null, user: req.session.user });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading form');
        }
    };

    exports.postNewRequest = async (req, res) => {
        const { skill_id, description } = req.body;
        
        if (!skill_id) {
            try {
                const skills = await SkillModel.getAll();
                return res.render('newRequest', { 
                    skills, 
                    error: 'Please select a skill',
                    user: req.session.user 
                });
            } catch (err) {
                return res.status(500).send('Error');
            }
        }

        try {
            await RequestModel.create(req.session.userId, skill_id, description);
            res.redirect('/requests');
        } catch (err) {
            console.error(err);
            try {
                const skills = await SkillModel.getAll();
                res.render('newRequest', { 
                    skills, 
                    error: 'Failed to create request',
                    user: req.session.user 
                });
            } catch (err2) {
                res.status(500).send('Failed to create request');
            }
        }
    };

    exports.deleteRequest = async (req, res) => {
        const { requestId } = req.params;
        try {
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