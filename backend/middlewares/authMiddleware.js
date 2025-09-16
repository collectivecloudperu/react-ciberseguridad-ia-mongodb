const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
    const cabecera = req.headers.authorization;
    if (!cabecera) {
        return res.status(401).json({ ok: false, mensaje: 'No se proporciono un token' });
    }

    const token = cabecera.split(' ')[1];
    try {
        const datos = jwt.verify(token, process.env.JWT_SECRETO);
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, mensaje: 'Tokén inválido' });
    }
};

module.exports = protegerRuta;