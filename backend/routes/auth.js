const router = require('express').Router();
const authController = require('../controllers/authController')
const middlewareController = require('../controllers/middlewareController');

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/refresh', authController.reqRefreshToken)
router.get('/logout', authController.userLogout)

module.exports = router