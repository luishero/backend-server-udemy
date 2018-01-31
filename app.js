// Requires
var express = require('express');
// referencia a la libreria
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

// conexión a la base de datos con mongoose
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err; //si no funciona la bd no hacemos nada;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});