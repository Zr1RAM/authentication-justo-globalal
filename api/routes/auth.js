const { register, login, generateLink, verifyLink, logout } = require('../controllers/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = require('express').Router();

router.post("/logout", logout);
router.use(rateLimiter);
router.post("/register" , register);
router.post("/login", login);
router.post("/generate-link", generateLink);
router.get("/verify-link/:token", verifyLink);


module.exports = router;