// Cuando colocamos archivos al inicio del serv es el primero en ejecutar
// y toda las configuraciones que tenga se ejecutan
require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');
// app.use son middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Rutas del sitio
app.use(require('./routes/usuario'));

//'mongodb://localhost:27017/cafe'
mongoose.connect( process.env.URLDB, (err, res) => {
    if(err) throw err;

    console.log(' Base de datos ONLINE ');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: 3020`);
});