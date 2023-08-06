const router = require('express').Router();
const { multerSetup } = require('../../utils/multerSetup');
const uploadCtrl = require('../../controllers/upload');
const upload = multerSetup();

router.post('/upload-audio', upload.single('audio'), uploadCtrl.uploadAudio);
module.exports = router;
