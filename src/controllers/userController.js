const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart')
const CartItem = require('../models/cartItem');
const { userOnly } = require('../middlewares/authMiddleware');

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos por su correo electrónico
    const user = await User.findOne({ where: { email } });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: 'El usuario no existe' });
    }

    // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    // Generar un token de autenticación
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Incluir el token en el encabezado de respuesta
    res.header('Authorization', `Bearer ${token}`);

    // Devolver el token en la respuesta
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function buyProduct(req, res) {
  // Verificar si el usuario es un cliente valido
  userOnly(req, res, async () => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.userId;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findByPk(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Verificar disponibilidad del producto
      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Producto agotado' });
      }

      // Calcular el precio total de la compra
      const totalPrice = product.price * quantity;

      // Crear la orden de compra en la base de datos
      const order = await Order.create({
        productId,
        userId,
        quantity,
        totalPrice,
      });

      // Actualizar el stock del producto
      product.quantity -= quantity;
      await product.save();

      res.json({ message: 'Compra realizada exitosamente', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function getUserOrders(req, res) {
  userOnly(req, res, async () => {
    try {
      const userId = req.user.userId; // El ID del usuario logueado

      // Buscar las órdenes de compra del usuario en la base de datos
      const orders = await Order.findAll({
        where: { userId },
      });

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function addToCart(req, res) {
  userOnly(req, res, async () => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.userId; // El ID del usuario logueado

      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Verificar si hay suficiente stock disponible
      if (product.stock < quantity) {
        return res.status(400).json({ error: 'No hay suficiente stock disponible' });
      }

      // Buscar el carrito del usuario en la base de datos
      let cart = await Cart.findOne({ where: { userId } });

      // Si no se encuentra el carrito, crear uno nuevo
      if (!cart) {
        cart = await Cart.create({ userId });
      }

      // Buscar si el producto ya existe en el carrito
      const cartItem = await CartItem.findOne({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      if (cartItem) {
        // Si el producto ya existe en el carrito, actualizamos la cantidad
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Si el producto no existe en el carrito, lo agregamos como un nuevo registro
        await CartItem.create({
          cartId: cart.id,
          productId,
          quantity,
        });
      }

      // Obtener el detalle del producto agregado al carrito
      const productDetail = await Product.findByPk(productId);

      res.json({
        message: 'Producto agregado al carrito',
        product: {
          id: productDetail.id,
          name: productDetail.name,
          category: productDetail.category,
          store: productDetail.store,
          price: productDetail.price
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function getUserCart(req, res) {
  userOnly(req, res, async () => {
    try {
      const userId = req.user.userId; // El ID del usuario logueado

      // Buscar el carrito del usuario en la base de datos
      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        // Si no se encuentra el carrito, retornar un carrito vacío
        return res.json({ id: null, userId, cartItems: [] });
      }

      // Obtener todas las entradas de cartItem con el cartId del carrito del usuario
      const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

      res.json({ id: cart.id, userId, cartItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function removeFromCart(req, res) {
  userOnly(req, res, async () => {
    try {
      const { itemId } = req.params;
      const userId = req.user.userId; // El ID del usuario logueado

      // Buscar el carrito del usuario en la base de datos
      const cart = await Cart.findOne({ where: { userId } });

      // Si no se encuentra el carrito o el carrito no tiene el artículo, retornamos un error
      if (!cart) {
        return res.status(404).json({ error: 'Carrito del usuario no encontrado' });
      }

      // Buscar el artículo del carrito por su ID dentro del carrito del usuario
      const cartItem = await CartItem.findOne({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      });

      // Si el artículo del carrito no existe o no pertenece al carrito del usuario, retornamos un error
      if (!cartItem) {
        return res.status(404).json({ error: 'Artículo del carrito no encontrado' });
      }

      // Eliminar el artículo del carrito de la base de datos
      await cartItem.destroy();

      // Devolver una respuesta con un mensaje de éxito
      res.json({ message: 'Artículo removido del carrito exitosamente' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  })
}


module.exports = { createUser, signIn, buyProduct, getUserOrders, addToCart, getUserCart, removeFromCart };
