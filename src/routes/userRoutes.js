const express = require('express');
const userController = require('../controllers/userController');
const {
  authMiddleware,
  userOnly,
} = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/users/signup', userController.createUser);
// Ruta para loguear un usuario existente
router.post('/users/signin', userController.signIn);

// Ruta para comprar un producto
router.post(
  '/client/products/buy',
  authMiddleware,
  userOnly,
  userController.buyProduct
);

// Ruta para ver todas las ordenes de compra del usuario
router.get('/client/orders', authMiddleware, userOnly, userController.getUserOrders);

// Ruta para agregar un artículo al carrito
router.post('/cart/add', authMiddleware, userOnly, userController.addToCart);
// Ruta para obtener el contenido de mi carrito
router.get('/cart/list', authMiddleware, userOnly, userController.getUserCart);
// Ruta para eliminar un artículo del carrito
router.delete('/cart/remove/:itemId', authMiddleware, userOnly, userController.removeFromCart);

module.exports = router;
