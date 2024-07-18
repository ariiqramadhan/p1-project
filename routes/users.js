const router = require('express').Router({mergeParams: true});
const Controller = require('../controllers/controller');

router.get('/', Controller.home);

module.exports = router;