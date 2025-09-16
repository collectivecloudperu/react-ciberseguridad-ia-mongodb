const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombreUsuario: { type:String, unique: true, required: true},
    contraseña: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);