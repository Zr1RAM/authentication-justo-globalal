const { getUsers, editUser } = require('../controllers/admin');
const checkPrevileges = require('../middleware/checkPrivileges');
const authenticateUser = require('../middleware/verifyToken');

const router = require('express').Router();

router.use(authenticateUser);
router.use(checkPrevileges);
router.get("/users", getUsers);
router.put("/users/:id", editUser)

module.exports = router;