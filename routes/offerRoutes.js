const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const isAuth = require('../middleware/isAuth');

console.log('=== DEBUGGING OFFER ROUTES ===');
console.log('offerController type:', typeof offerController);
console.log('offerController keys:', Object.keys(offerController));

// Check each method individually
console.log('getOffers type:', typeof offerController.getOffers);
console.log('getAllOffers type:', typeof offerController.getAllOffers);
console.log('getNewOffer type:', typeof offerController.getNewOffer);
console.log('postNewOffer type:', typeof offerController.postNewOffer);
console.log('deleteOffer type:', typeof offerController.deleteOffer);

console.log('isAuth type:', typeof isAuth);
console.log('==============================');

// Only define routes if all methods exist
if (typeof offerController.getOffers === 'function') {
    router.get('/', isAuth, offerController.getOffers);
} else {
    console.error('ERROR: getOffers is not a function!');
}

if (typeof offerController.getAllOffers === 'function') {
    router.get('/all', isAuth, offerController.getAllOffers);
} else {
    console.error('ERROR: getAllOffers is not a function!');
}

if (typeof offerController.getNewOffer === 'function') {
    router.get('/new', isAuth, offerController.getNewOffer);
} else {
    console.error('ERROR: getNewOffer is not a function!');
}

if (typeof offerController.postNewOffer === 'function') {
    router.post('/', isAuth, offerController.postNewOffer);
} else {
    console.error('ERROR: postNewOffer is not a function!');
}

if (typeof offerController.deleteOffer === 'function') {
    router.post('/delete/:offerId', isAuth, offerController.deleteOffer);
} else {
    console.error('ERROR: deleteOffer is not a function!');
}

module.exports = router;