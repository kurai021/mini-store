const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener productos con paginación
router.get('/products', productController.getPaginatedProducts);
// Ruta para obtener detalles del producto ofreciendo un ID
router.get('/products/:productId', productController.getProductDetails);

module.exports = router;
