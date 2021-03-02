const express = require('express');
const router = express.Router();
const usuarioController = require('./../controllers/usuarioController');
const { check } = require('express-validator');

//Crear un usuario - /api/usuarios/
router.post('/'
    ,[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo es obligatorio').isEmail(),
        check('password', 'El password debe ser de mínimo 6 caracteres').isLength({ min: 6 })
    ], 
    usuarioController.crearUsuario
);

module.exports = router;