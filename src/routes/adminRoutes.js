const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {
  authMiddleware,
  adminOnly,
} = require('../middlewares/authMiddleware.js');

// Ruta para obtener productos con paginación
router.post(
  '/admin/products',
  authMiddleware,
  adminOnly,
  adminController.createProduct
);
router.put(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.updateProduct
);
router.delete(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.deleteProduct
);
router.patch(
  '/admin/products/:productId',
  authMiddleware,
  adminOnly,
  adminController.deactivateProduct
);

module.exports = router;
