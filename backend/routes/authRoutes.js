const express = require('express');
const router = express.Router();
const {
    registrarUsuario,
    iniciarSesion,
    obtenerDashboard
} = require('../controllers/authController');

const protegerRuta = require('../middlewares/authMiddleware');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('dashboard', protegerRuta, obtenerDashboard);

module.exports = router;
