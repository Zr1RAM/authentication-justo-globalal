// this route is just for checking if post login api's work with token validation, etc
const test = require('../controllers/home');
const authenticateUser = require('../middleware/verifyToken');



const router = require('express').Router();

router.use(authenticateUser);
router.get('/test', test);

module.exports = router;