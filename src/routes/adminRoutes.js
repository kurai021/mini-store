const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {
  authMiddleware,
  adminOnly,
} = require('../middlewares/authMiddleware.js');

// Ruta para crear un nuevo producto
router.post(
  '/admin/products',
  authMiddleware,
  adminOnly,
  adminController.createProduct
);

// Ruta para actualizar un producto existente
router.put(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.updateProduct
);

// Ruta para eliminar un producto existente
router.delete(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.deleteProduct
);

// Ruta para desactivar un producto existente sin borrarlo
router.patch(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.deactivateProduct
);

// Ruta para ver todas las ordenes de compras
router.get('/admin/orders', authMiddleware, adminOnly, adminController.getAllOrders);

module.exports = router;
