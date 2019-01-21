const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');//el estandar es el _
// sirve para filtrar, mapear, reducir, cada uno
const Usuario = require('../models/usuario');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/autentication');
// const {} = require('../middlewares/autentication');
app.get('/usuario', verificaToken, (req, res) => {

    // Ejemplo de extraer datos espesificos del usr
    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })
    

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //  {_id:false, nombre: true} ó 'nombre:false' no lo muestra
    Usuario.find({estado:true}, 'nombre email role estado google img') 
    //.find({condicionales}, 'valores( de mi schema) que solo deseo mostrar') traeme todos los registros
        .skip(desde) //salat apartir de un registro en adelante
        .limit(limite) //limita el numero de registros que buscara
        .exec((err, usuarios) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //count({condicionales}) Cuenta todos los registros que cumplan con lo anterior
            Usuario.count({estado: true}, (err, conteo) => {
               
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });   //Hace un conteo de los registros
        }) //ejecutalo


});
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Para obtener los datos por des esta manera tambien por post, put, delete
    let body = req.body;
// Por nomenglatura se declara la primer letra en mayusculas
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // bcrypt .hashSync(parametroha_encriptar, numero de veces(ó vueltas) aplicado al hash)
        password: bcrypt.hashSync( body.password, 10),
        role: body.role

    });
// usuario.save((err, usuarioDB) => {}) (.save() palabra reservada de mongoose)
usuario.save((err, usuarioDB) => {
    if(err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    // usuarioDB.password = null; // aqui el password lo muestra como nulo
    // pero aun el campo donde se almacena se muestra(el nombre) haceindola mas vulnerable
    res.json({
        ok: true,
        usuario: usuarioDB

    });
});

    // if(body.nombre === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es nbecesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
   
});
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role],(req, res) => {
    let id = req.params.id;
    // _.pick(se solicita el objeto, valores que si actualizare)
    let body = _.pick(req.body, ['nombre','email','img','role','estado']) ;
    
    
    delete body.password;
    delete body.google;

    // mongoose tiene muchas funciones como .findById(id, (error, bd_collection))
    // .findByIdAndUpdate(id, (err, bd_collection)) busca y si encuentra actualiza
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        // Al usar la funcion de arriba se pierde un poco la funcionalidad en cuanto
        // a manejo de error cuando el id no se encuentre y se trabaja mas el front-end
       
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // res.json('delete Usuario');

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    // let body = _.pick(req.body, ['estado']);
    // delete body.nombre;
    // delete body.role;
    // delete body.password;
    // delete body.email; 
    // delete body.google;
    
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioDB ) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.status= new
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    
    // *************aqui se remueve el registro***********************
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // });
    //****************FIN*********************/
});

// Se exporta el app por ha hora contienen todas las rutas 

module.exports = app;