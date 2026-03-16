const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, availabilityController.getAvailability);
router.get('/add', isAuth, availabilityController.getAddAvailability);
router.post('/', isAuth, availabilityController.postAddAvailability);
router.post('/delete/:availabilityId', isAuth, availabilityController.deleteAvailability);

module.exports = router;