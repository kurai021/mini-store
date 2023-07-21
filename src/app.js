require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const swaggerRouter = require('./routes/swaggerRouter');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la Mini Store API!');
});

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', swaggerRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
