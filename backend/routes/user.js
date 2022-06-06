const router = require('express').Router();
const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');

router.get('/', middlewareController.verifyToken, userController.getAllUser)
// router.get('/', userController.getAllUser)

router.delete('/:id', middlewareController.verifyTokenAndAdminAuth, userController.deleteUser)

module.exports = router