//TURNOSTRABAJADORES/server.js

// Importaciones necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

// Inicializar la app de Express
const app = express();

// Middlewares globales
app.use(cors()); // Habilita CORS para peticiones desde otros dominios (como el frontend)
app.use(express.json()); // Permite recibir JSON en las solicitudes

// Rutas
const authRoutes = require('./routes/auth');
const turnosRoutes = require('./routes/turnos');
const usuariosRoutes = require('./routes/usuarios');

// Usar las rutas con prefijos
app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error al conectar MongoDB:', err));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

