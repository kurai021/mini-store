const Product = require('../models/product');

// Obtener productos con paginación
async function getPaginatedProducts(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const { count, rows: products } = await Product.findAndCountAll({ offset, limit });
        const totalPages = Math.ceil(count / limit);

        res.json({
            totalProducts: count,
            totalPages,
            currentPage: page,
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    getPaginatedProducts,
};