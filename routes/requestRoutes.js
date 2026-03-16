const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, requestController.getRequests);
router.get('/new', isAuth, requestController.getNewRequest);
router.post('/', isAuth, requestController.postNewRequest);
router.post('/delete/:requestId', isAuth, requestController.deleteRequest);

module.exports = router;