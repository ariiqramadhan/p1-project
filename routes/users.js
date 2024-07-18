const router = require('express').Router({mergeParams: true});
const Controller = require('../controllers/controller');
const AdminController = require('../controllers/admin');

router.get('/', Controller.home);
router.get('/manageproducts', Controller.isAdmin, AdminController.manageProducts);
router.get('/manageproducts/product/add', Controller.isAdmin, AdminController.renderAddProduct);
router.post('/manageproducts/product/add', Controller.isAdmin, AdminController.handlerAddProduct);
router.get('/manageproducts/product/:productId/delete', Controller.isAdmin, AdminController.deleteProduct);

module.exports = router;