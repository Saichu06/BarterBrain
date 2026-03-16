const AvailabilityModel = require('../models/availabilityModel');

exports.getAvailability = async (req, res) => {
    try {
        const availability = await AvailabilityModel.findByUser(req.session.userId);
        res.render('availability', { availability, user: req.session.user, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading availability');
    }
};

exports.getAddAvailability = (req, res) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    res.render('addAvailability', { days, user: req.session.user, error: null });
};

exports.postAddAvailability = async (req, res) => {
    const { day, start_time, end_time } = req.body;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    if (!day || !start_time || !end_time) {
        return res.render('addAvailability', { 
            days, 
            user: req.session.user, 
            error: 'All fields are required' 
        });
    }
    
    if (start_time >= end_time) {
        return res.render('addAvailability', { 
            days, 
            user: req.session.user, 
            error: 'End time must be after start time' 
        });
    }
    
    try {
        await AvailabilityModel.create(req.session.userId, day, start_time, end_time);
        res.redirect('/availability');
    } catch (err) {
        console.error(err);
        res.render('addAvailability', { 
            days, 
            user: req.session.user, 
            error: 'Failed to add availability' 
        });
    }
};

exports.deleteAvailability = async (req, res) => {
    const { availabilityId } = req.params;
    try {
        await AvailabilityModel.delete(availabilityId);
        res.redirect('/availability');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting availability');
    }
};