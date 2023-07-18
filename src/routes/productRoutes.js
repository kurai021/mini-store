// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener productos con paginación
router.get('/products', productController.getPaginatedProducts);

module.exports = router;