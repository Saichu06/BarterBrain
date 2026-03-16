const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, profileController.getProfile);
router.post('/update', isAuth, profileController.updateProfile);
router.post('/change-password', isAuth, profileController.changePassword);

module.exports = router;