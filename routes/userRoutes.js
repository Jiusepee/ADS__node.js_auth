const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    getUsers
} = require( '../controllers/userController');

const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/user', getUser, protect);
router.get('/list', getUsers, protectAdmin);

module.exports = router;