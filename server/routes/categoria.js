const express = require('express');

const app = express();

let Categoria = require('../models/categoria');
const {verificaToken, verificaAdmin_Role} = require('../middlewares/autentication');


// crear 5 servicios
// get que aparescan las categorias
app.get('/categoria', verificaToken, (req, res) => {
        
    // Categoria.find( (err, categoriaDB) => {
        Categoria.find({})
        .sort('description')
        .populate('usuario', 'nombre email')
        // populate busca que objetos existen de los schemas que tenga para agregar
        // mas solo tengo que poner otro populate y agregar
        .exec((err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    // return res.json({
    //      nombre: req.categoria,
    //     //  usuario: req.categoria.usuario,
    //      descripcion: req.categoria.description
    //  });
    

});

// app.get('/categoria', (req, res) => {


// });
// otro get mostrar una categoria por ID : regresar solo la categoria
// con Categoria.findById(...);
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB.description
        });
    });
});
// Crear Categoria
// y regresa la nueva categoria(yo tengo el id del usuario 
// para usarlo req.usuari._id)
//
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        description: body.description,
        usuario: req.usuario._id //Este valor lo toma del token(verifica token)
        // sino existe no tomara el id
    });

    categoria.save( (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// put Actualiza categoria(nombre de la categoria)
// 
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;

    let body = req.body;
    console.log(body, '------------------');
    let descCategoria = {
        descripcion: body.description
    }
    

    Categoria.findByIdAndUpdate( id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        console.log(categoriaDB, '_________________');
        res.json({
            ok: true,
            categoria: categoriaDB
        });
        
        
    });
});

// delete categoria(dcategoria eliminar)
// dos condiciones solo administrador
// y solicitar el token 
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    
    console.log(id, '-----------------');
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id No Existe'
                }
            });
        }
        // if(id === categoriaDB.id){

            res.json({
                ok: true,
                // categoria: categoriaDB
                message: 'La categoria fue Eliminada'
            });
        // }
        // res.json({
        //     ok: false,
        //     message: 'El id no existe 2'
        // });
    });
    
        

    
});
module.exports = app;