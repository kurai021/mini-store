const jwt = require('jsonwebtoken');

// Middleware de autenticación y autorización
function authMiddleware(req, res, next) {
  // Obtener el token de acceso del encabezado de la solicitud
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      error: 'Token de acceso no proporcionado',
    });
  }

  // Verificar el formato del encabezado de autorización
  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Formato de encabezado de autorización inválido',
    });
  }

  // Verificar el token de acceso
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar la expiración del token
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTimestamp) {
      return res.status(401).json({ error: 'Token de acceso expirado' });
    }

    // Agregar los datos del usuario al objeto de solicitud
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token de acceso inválido',
    });
  }
}

// Middleware para validar si el usuario es un administrador
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren privilegios de administrador',
    });
  }

  next();
}

// Middleware para validar si el usuario es un administrador
function userOnly(req, res, next) {
  if (req.user.role !== 'user') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren privilegios de cliente',
    });
  }

  next();
}

module.exports = {
  authMiddleware,
  adminOnly,
  userOnly,
};
