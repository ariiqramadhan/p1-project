const router = require('express').Router({mergeParams: true});
const Controller = require('../controllers/controller');
const AdminController = require('../controllers/admin');

router.get('/', Controller.isAdmin, AdminController.manageProducts);
router.get('/product/add', Controller.isAdmin, AdminController.renderAddProduct);
router.post('/product/add', Controller.isAdmin, AdminController.handlerAddProduct);
router.get('/product/:productId/edit', Controller.isAdmin, AdminController.renderEditProduct);
router.post('/product/:productId/edit', Controller.isAdmin, AdminController.handlerEditProduct);
router.get('/product/:productId/delete', Controller.isAdmin, AdminController.deleteProduct);

module.exports = router;