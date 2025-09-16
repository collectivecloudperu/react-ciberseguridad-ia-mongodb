const mongoose = require('mongoose');

const IntentoSchema = new mongoose.Schema({
    ip: String,
    usuarioIntentado: String,
    exito: Boolean,
    puntuacion: Number, // Score enviado desde el frontend por la IA
    creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Intento', IntentoSchema);