const { Op } = require('sequelize');
const Product = require('../models/product');

// Obtener productos con paginación
async function getPaginatedProducts(req, res) {
  try {
    const { page = 1, limit = 10, name, category, store } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (category) {
      where.category = {
        [Op.iLike]: `%${category}%`,
      };
    }

    if (store) {
      where.store = {
        [Op.iLike]: `%${store}%`,
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: Object.keys(where).length > 0 ? where : null, // Ignorar la cláusula 'where' si no hay condiciones
      offset,
      limit,
    });

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

// Obtener detalles de un producto por su ID
async function getProductDetails(req, res) {
  try {
    const { productId } = req.params;

    // Buscar el producto en la base de datos por su ID
    const product = await Product.findByPk(productId);

    // Verificar si el producto existe
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  getPaginatedProducts,
  getProductDetails,
};
