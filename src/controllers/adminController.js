const Product = require('../models/product');
const Order = require('../models/order');
const { adminOnly } = require('../middlewares/authMiddleware');

// Crear un nuevo producto
function createProduct(req, res) {
  // Verificar si el usuario es un administrador
  adminOnly(req, res, () => {
    // Obtener los datos del producto del cuerpo de la solicitud
    const { name, category, store, price, active, quantity } = req.body;

    // Crear el producto en la base de datos
    Product.create({
      name,
      category,
      store,
      price,
      active,
      quantity,
    })
      .then((product) => {
        res.json(product);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
      });
  });
}

// Actualizar un producto existente
function updateProduct(req, res) {
  // Verificar si el usuario es un administrador
  adminOnly(req, res, async () => {
    try {
      const { productId } = req.params;
      const { name, category, store, price, active, quantity } = req.body;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findByPk(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Actualizar los campos del producto
      product.name = name;
      product.category = category;
      product.store = store;
      product.price = price;
      product.active = active;
      product.quantity = quantity;

      // Guardar los cambios en la base de datos
      await product.save();

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

function deleteProduct(req, res) {
  adminOnly(req, res, async () => {
    try {
      const { productId } = req.params;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findByPk(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Borrar el producto de la base de datos
      await product.destroy();

      res.json({ message: 'Producto borrado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

function deactivateProduct(req, res) {
  adminOnly(req, res, async () => {
    try {
      const { productId } = req.params;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findByPk(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Desactivar el producto
      product.active = false;

      // Guardar los cambios en la base de datos
      await product.save();

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function getAllOrders(req, res) {
  adminOnly(req, res, async () => {
    try {
      // Buscar todas las órdenes de compra en la base de datos
      const orders = await Order.findAll();

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  getAllOrders
};
