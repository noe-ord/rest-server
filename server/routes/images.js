const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();
const {verificaTokenImg} = require('../middlewares/autentication');
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = `./uploads/${tipo}/${img}`;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync( pathImagen )){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        // res.sendFile() lee el content type del archivo y es lo que envia, ejem:
        // una imagen es lo que envia un text, etc.
        res.sendFile(noImagePath);
    }
});

module.exports = app;