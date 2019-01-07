// Cuando colocamos archivos al inicio del serv es el primero en ejecutar
// y toda las configuraciones que tenga se ejecutan
require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// app.use son middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});
app.post('/usuario', (req, res) => {
    // Para obtener los datos por des esta manera tambien por post, put, delete
    let body = req.body;
    if(body.nombre == undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es nbecesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
    res.json({
        persona: body
    });
});
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id
    });
});
app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: 3020`);
});