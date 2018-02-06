var express = require('express');

// encrypar el password
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//Inicializar variables
var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    // verificar si existe un usuario con ese correo , Usuario referencia al modelo Usuario
    // la condicion de busqueda mientras que el correo: igual al body.email (callback error, respueswta usuariode BD)
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        // verificar si existe un correo electronico
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email!',
                errors: err
            });
        }
        //esta F nos permite comparar un string body.password contra otro, usuarioDB.password 
        //y regresa un valor booleano true oder false
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear token !!! parametros date que quiero colocar Payload{},SEED, {fecha de expiracion}

        usuarioDB.password = ':)'; // para no mandar la contraseña en el token
        var token = jwt.sign({ ususario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas



        res.status(200).json({
            ok: true,
            //mandamos el usuario de base de datos que se logeo
            usuario: usuarioDB,
            //mandamos el id unico que tiene ese usuario
            id: usuarioDB._id,
            token: token,
            mensaje: 'Login post correcto',
            body: body //para confirmar que recibe los datos de body

        });
    })

});

//var body = req.body;

//verificar si existe un usuario con ese correo , Usuario referencia al modelo Usuario
// la condicion de busqueda mientras que el correo: igual al body.email (callback error, usuariode BD)
//     Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar usuario!',
//                 errors: err
//             });
//         }
//         // verificar si existe un correo electronico
//         if (UsuarioDB) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Credenciales incorrectas - email!',
//                 errors: err
//             });
//         }
//         // si no entra en este error tenemos usuario valido que ha pasado por el hash body.password y comparamos con usuarioDB.password
//         if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Credenciales incorrectas - password',
//                 errors: err
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             usuario: usuarioDB,
//             id: usuarioDB._id
//         });
//     });
// });

// //     var body = req.body;

// //     //verificar si existe un usuario con ese correo , Usuario referencia al modelo Usuario
// //     Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
// //         if (err) {
// //             return res.status(500).json({
// //                 ok: false,
// //                 mensaje: 'Error al buscar usuarios!',
// //                 errors: err
// //             });
// //         }
// //         //verificar si existe un correo electronico

// //         if (UsuarioDB) {
// //             return res.status(400).json({
// //                 ok: false,
// //                 mensaje: 'Credenciales incorrectas - email!',
// //                 errors: err
// //             });
// //         }
// //         // si no entra en este error tenemos usuario valido y verificamos la contraseña
// //         if (!bcrypt.compsreSync(body.password, usuarioDB.password)) {
// //             return res.status(400).json({
// //                 ok: false,
// //                 mensaje: 'Credenciales incorrectas - password',
// //                 errors: err
// //             });
// //         }

// //         // Crear token
// //         usuarioDB.password = ':)';
// //         var token = jwt.sign({ ususario: usuarioDB }, '@este-es@-un-seed-dificil', { expiresIn: 14400 }); //4 horas


// //         res.status(200).json({
// //             ok: true,
// //             usuario: usuarioDB,
// //             Id: usuarioDB._id

// //         });
// //     });

// });

// se exporta el archivo
module.exports = app;