const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    // se declara el body todo lo que trae la pagina
    let body = req.body;
    // Se utilisa Usuario(por que es el schema completo) 
    // findOne({condiciones}) busca solo un registro
    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        // Al usuario jamas se le debe de dar indicio de que esta mal usr o pass
        // con bcrypt.compareSync(password.user, password.db)
        // funcion que compara las contraseñas la que esta encriptada con la que el 
        // usuario esta metiendo
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
            // expireIn: seg * min * hrs * days
            // expiresIn: 60 * 60 * 24 * 30
        }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
            // como el nombre es igual token con el ecs6 se coloca una sola vez
        });

    })

});

//asi se exportan todas las modificaciones que se hacen a app
module.exports = app;