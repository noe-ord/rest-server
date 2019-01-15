const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);


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

//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();//A qui ya se obtiene ya toda la informacion del usr
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
  }
// fin de las configuraciones
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
                            .catch(e => {
                                return res.status(403).json({
                                    ok: false,
                                    err: e
                                });
                            });
    
    Usuario.findOne({ email: googleUser.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( usuarioDB){//si existe el usuario

            if(usuarioDB.google === false){
                //Si el usuario no es de google pero se autentico con claves 
                //de usuario local.
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar una autenticacion normal'
                    }
                });

            }else {
                let token = jwt.sign({
                    udusrio: usuarioDB

                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            //Si el usuario no existe en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    udusrio: usuarioDB

                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }
    });
                            // res.json({
    //     usuario: googleUser
    // });
});
//asi se exportan todas las modificaciones que se hacen a app
module.exports = app;