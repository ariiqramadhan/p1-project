const router = require('express').Router({mergeParams: true});
const routerAdmin = require('./admin');
const UserController = require('../controllers/user');
const Controller = require('../controllers/controller');

router.get('/', UserController.home);
router.get('/profile', Controller.isUser, UserController.renderProfile);
router.post('/profile', Controller.isUser, UserController.handlerProfile);
router.get('/history', Controller.isUser, UserController.transactionHistory);
router.use('/manageproducts', routerAdmin);
router.get('/product/:productId', UserController.productDetails);
router.get('/product/:productId/buy', Controller.isUser, UserController.buyProduct);

module.exports = router;