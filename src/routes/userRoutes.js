const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/users/signup', userController.createUser);
router.get('/users/signin', userController.signIn);

module.exports = router;
