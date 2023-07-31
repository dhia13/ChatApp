const router = require('express').Router();
const uploadCtrl = require('../../controllers/upload');
router.post('/upload', uploadCtrl.uploadImg);
module.exports = router;
