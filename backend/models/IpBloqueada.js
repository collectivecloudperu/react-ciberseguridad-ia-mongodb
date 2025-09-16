const mongoose = require('mongoose');

const IpBloqueadaSchema = new mongoose.Schema({
    ip: { type: String, unique: true },
    bloqueadaEn: { type: Date, default: Date.now },
    razon: String,
    totalIntentos: Number
});

module.exports = mongoose.model('IpBloqueada', IpBloqueadaSchema);