const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Intento = require('../models/Intento');
const IpBloqueada = require('../models/IpBloqueada');

const obtenerIP = (req) => {
    const xff = req.header['x-forwarded-for'];
    return xff ? xff.split(',')[0].trim() : req.connection.remoteAddress;
};

// Registro de usuario
exports.registrarUsuario = async (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    if (!nombreUsuario || !contraseña) {
        return req.status(400).json({ ok: false, mensaje: 'Faltan datos'});
    }

    try {
        const hash = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = new Usuario({ nombreUsuario, contraseña: hash });
        await nuevoUsuario.save();
        res.json({ ok: true, mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario o ya existe' });
    }
};

// Login
exports.iniciarSesion = async (req, res) => {
    const { nombreUsuario, contraseña, puntuacion } = req.body;
    //const ip = obtenerIP(req); // Obtiene la IP automáticamente
    const ip = "19.10.15.45";

    try {
        // Verificar si la IP está bloqueada
        const ipbBloqueada = await IpBloqueada.findOne({ ip });
        if (ipbBloqueada) {
            return res.status(403).json({ ok: false, bloqueada: true, mensaje: 'IP bloqueada' });
        }

        // Verificar las credenciales
        const usuario = await Usuario.findOne({ nombreUsuario });
        if (usuario) {
            const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
            if (coincide) {
                const token = jwt.sign(
                    { id: usuario._id, nombreUsuario: usuario.nombreUsuario }, 
                    process.env.JWT_SECRETO,
                    { expiresIn: '2h'}
                );
                await Intento.create({ ip, usuarioIntentado: nombreUsuario, exito: true, puntuacion });
                return res.json({ ok: true, token });
            }
        }

        // Login fallido
        await Intento.create({ ip, usuarioIntentado: nombreUsuario, exito: false, puntuacion });

        const intentosFallidos = await Intento.countDocuments({ ip, exito: false });
        if (intentosFallidos >= 3) {
            await IpBloqueada.create({
                ip,
                razon: 'Demasiados intentos fallidos',
                totalIntentos: intentosFallidos
            });
            return res.status(403).json({ ok: false, bloqueada: true, mensaje: 'IP bloqueada por intentos fallidos' })
        }

        return res.status(401).json({
            ok: false,
            bloqueada: false,
            restantes: 3 - intentosFallidos,
            mensajes: 'Credenciales incorrectas'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }

};

// Dashoarbd protegido
exports.obtenerDashboard = (req, res) => {
    res.json({ ok: true, mensaje:`Bienvenido ${req.usuario.nombreUsuario} al dashboard` });
}
