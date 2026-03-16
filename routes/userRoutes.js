const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

// View another user's public profile
router.get('/:userId', isAuth, userController.viewUserProfile);

module.exports = router;