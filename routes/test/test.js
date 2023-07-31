const router = require('express').Router();
const TestController = require('../../controllers/testController');
router.post('/crash', TestController.crash);
module.exports = router;
