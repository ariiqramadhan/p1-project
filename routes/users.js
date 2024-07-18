const router = require('express').Router({mergeParams: true});
const routerAdmin = require('./admin');
const Controller = require('../controllers/controller');
const AdminController = require('../controllers/admin');
const UserController = require('../controllers/user');

router.get('/', UserController.home);
router.get('/profile', UserController.renderProfile);
router.post('/profile', UserController.handlerProfile);
router.use('/manageproducts', routerAdmin);
router.get('/product/:productId', UserController.productDetails);
router.get('/product/:productId/buy', UserController.buyProduct);

module.exports = router;