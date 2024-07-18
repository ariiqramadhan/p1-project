const router = require('express').Router();
const Controller = require('../controllers/controller');
const routerUser = require('./users');

router.get('/', Controller.redirectLogin);
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handlerRegister);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handlerLogin);

// router.use((req, res, next) => {
//     console.log(req.session);
//     if (!req.session.user) {
//         return res.redirect('/login?error=You must login first!');
//     }

//     if (!req.session.user.id) {
//         return res.redirect('/login?error=You must login first!');
//     } else {
//         next();
//     }
// });

router.use('/:userId/:userRole', Controller.userAuth, routerUser);

module.exports = router;