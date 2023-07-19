const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

module.exports = { createUser, signIn };
