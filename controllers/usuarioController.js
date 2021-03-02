const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    try {

        //Revisar si hay errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() })
        }

        const { correo, password } = req.body;

        //Crear nuevo usuario
        let usuario = await Usuario.findOne({ correo });

        if (usuario) {
            return res.status(400).send({ msg: 'El usuario ya existe!' });
        }

        //Guardar nuevo usuario en la base de datos
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            res.send({ token: token });
        })

    } catch (error) {
        res.status(400).send('Hubo un error al guardar un usuario');
    }
};