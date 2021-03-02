const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    try {
        //Revisar si hay errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() })
        }

        //Se extrae el correo y el password desde el request
        const { correo, password } = req.body;

        //Validamos si existe un usuario con el correo extraído
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ msg: 'El usuario no existe' })
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        //Si el password es incorrecto retornamos un msg
        if (!passCorrecto) {
            return res.status(401).json({ msg: 'Password incorrecto' })
        }

        //Si pasa todas las validacion debemos crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error, token) => {
            if (error) throw error;

            res.send({ token: token });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al iniciar sesión' })
    }

}

//Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mgs: 'Error al obtener el usuario' })
    }
}