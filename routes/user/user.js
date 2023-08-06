const userCtrl = require('../../controllers/user');
const User = require('../../models/User');

const router = require('express').Router();
//register
router.get('/initData', userCtrl.initData);

module.exports = router;
