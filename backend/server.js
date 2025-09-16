require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBD = require('./config/database');

const app = express();

// Midlewares 
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
conectarBD();

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const PORT = process.env.PUERTO || 8000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
