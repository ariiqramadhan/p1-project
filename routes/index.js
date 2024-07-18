const router = require('express').Router();
const Controller = require('../controllers/controller');
const routerUser = require('./users');

router.get('/', Controller.redirectLogin);
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handlerRegister);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handlerLogin);
router.get('/logout', Controller.logout);
router.use('/:userId/:userRole', Controller.userAuth, routerUser);

module.exports = router;