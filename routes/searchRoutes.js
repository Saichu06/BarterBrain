const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const isAuth = require('../middleware/isAuth');

// Search page
router.get('/', isAuth, searchController.getSearchPage);

// Search users API endpoint
router.get('/api/users', isAuth, searchController.searchUsers);

// Get user profile for viewing
router.get('/user/:userId', isAuth, searchController.viewUserProfile);

module.exports = router;