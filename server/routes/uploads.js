const express =  require('express');
const fileUpload = require('express-fileupload');

const app = express();
const fs = require('fs');
const path = require('path');
// Schemas
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// uso del midelware
    // Con esto se realiza todas lascargas que se guarden en un archivo .files
app.use(fileUpload());

app.put('/upload/:tipo/:id',function(req, res)  {
    let tipo = req.params.tipo;
    let id = req.params.id;
    // Aqui se valida si vienen o no archivos 
    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado algun archivo'
            }
        });
    }
    //Valida Tipo
    // llevan el mismo nombre de las carpetas en uploads
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipos permitidos son '+ tiposValidos.join(', ')
            }
        });
    }

    // El nombre que tienen files es el que trae el valor que usaremos
    // esto es file es la fariable del form 
    let file = req.files.file;
    let extencionNombre = file.name.split('.');
    let extension = extencionNombre[extencionNombre.length -1 ];
    // console.log(extension);

    // Validando la extencion del archivo
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Busca en el arregla el tipo de extencion y si es < 0 (no hay coinsidencias)
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de archivo nop esta permitido. Las extenciones validas son: .'+
                extensionesValidas.join(', .'),
                // . join agrega el caracter espesifico a cada elemento del arreglo
                ext: extension
            }
        });
    }
    // CAmbiar nombre al archivo
    let nombreFile = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //Se a creado el archivo con un nombre que no se repite 
    file.mv(`uploads/${tipo}/${nombreFile}`, (err) => {
       if(err) {
           return res.status(500).json({
                ok: false,
                err
           });
       }
       if(tipo === 'usuarios'){
           console.log('usuarios-----------');
           imagenUsuario(id, res, nombreFile);

       }else{
           imagenProducto(id, res, nombreFile);
       }

    //    La imagen esta cargada
    //    res.json({
    //        ok: true,
    //        message: 'Imagen subida correctamente'
    //    })
    });
    
});  
function imagenUsuario(id, res, nombreFile) {
// En la funcion mando la res que es un objeto por referencia ya que no existe en mi fun.
    Usuario.findById(id, (err, usuarioDB) => {
        if(err){
            borraArchivo(nombreFile, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            borraArchivo(nombreFile, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        // verificando la ruta del archivo
        // let pathImage = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // // fs.existSync()  es una funcion sincrona de fs
        // if(fs.existsSync(pathImage)){
        //     fs.unlinkSync(pathImage);
        //     // console.log('imagen eliminada');
        // }
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreFile;

        usuarioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreFile
            });
        });
    });
}

function imagenProducto(id, res, nombreFile) {

    Producto.findById(id, (err, productodb) => {
        if(err){
            borraArchivo(nombreFile, 'productos');
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if(!productodb){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        
        borraArchivo(productodb.img, 'productos');
        productodb.img = nombreFile;
        productodb.save( (err, productoG) => {
            res.json({
                ok: true,
                producto: productoG,
                img: nombreFile
            });
        });

    });

}

function borraArchivo(nombreImage, tipo){
    // verificando la ruta del archivo
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImage}`);
    // fs.existSync()  es una funcion sincrona de fs
    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;