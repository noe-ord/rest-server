const express = require('express');

const { verificaToken} = require('../middlewares/autentication');

const app = express();
let Producto = require('../models/producto');

//________________________
//Obtener Productos
//________________________
//trae todos los productos
//populate: usuario categoria
//paginado
app.get('/producto', verificaToken, (req, res) => {
    // let body = req.body;
    let base = Number(req.body.desde) || 0;
    let limite = Number(req.body.limit) || 5;
    
    Producto.find({disponible: true})
        .skip(base)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec((err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
//-----------------------------
//Obtener producto por ID
//-----------------------------
//populate: usuario categoria
app.get('/producto/:id', verificaToken, (req, res) =>{
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec((err, productoDB) => {
        if(err){
            return res.status(400).json({
                ok: true,
                err
        
            });
        }
        if(!productoDB){
            return res.status(400).json({
                
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
});
});

//-----------------------------
//Buscar Producto
//-----------------------------
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    // Aqui se crea una expresion regular y se manda argumento 'i' Para que sea insensible
    // a mayusculas y minusculas con el parametro 'i'
    let regex = new RegExp(termino, 'i');

    // Se manda como objeto y podemos agregar mas condiciones
    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productoS) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoS,
            nombre: productoS.nombre
        });
    });
});


//-----------------------------
//Crear producto
//----//grabar usuario, grabar una categoria de listado
app.post('/producto', verificaToken, (req, res) => {
   let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

    

});

//-----------------------------
//Actualizar el producto
//-----------------------------
//
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let changeCategoria = {
        nombre: body.nombre,
        // descripcion: body.descripcion,
        // precioUni: body.precio
    };

    Producto.findByIdAndUpdate(id, changeCategoria, {new: true, runValidators: true}, (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontraron datos'
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
});

//-----------------------------
//Borrar un producto
//-----------------------------
//disponible a falso
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let status = {
        disponible: false
    };
    
    Producto.findByIdAndUpdate(id, status, { new: true}, (err, productoDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
                // : {
                //     message: 'El Id no es valido'
                // }
            });
        }
        
        if(productoDB === null){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id No existe'
                }
            });
        }
        // console.log(productoDB.disponible,'-------------------');
        
        res.json({
            ok: true,
            // producto: productoDB,
            message: 'DAtos eliminados'
        });

    });

});

module.exports = app;