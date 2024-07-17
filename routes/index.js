const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/', Controller.test);
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handlerRegister);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handlerLogin);

module.exports = router;