const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, matchController.getMatches);
router.get('/potential', isAuth, matchController.getPotentialMatches);
router.post('/create', isAuth, matchController.createMatch);
router.post('/:matchId/accept', isAuth, matchController.acceptMatch);
router.post('/:matchId/complete', isAuth, matchController.completeMatch);
router.get('/:matchId/review', isAuth, matchController.getReviewForm);
router.post('/:matchId/review', isAuth, matchController.submitReview);

module.exports = router;