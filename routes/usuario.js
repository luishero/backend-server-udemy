var express = require('express');

// encrypar el password
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

// ya no se utiliza var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');
//dentro del middlewere de autenticacion tenemos la F verifica token

//Inicializar variables
var app = express();

// esquema de usuario
var Usuario = require('../models/usuario');

// ======================================
// Obtener todos los usuarios
// ======================================
//  Ruta principal 
app.get('/', (req, res, next) => {
    // usamos el modelo de usuario
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario!',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});
/* // ======================================
// Verificar Token
// ======================================
app.use('/', (req, res, next) => {
    var token = req.query.token; // para obtener el token
    //realizar la comprobacion(toke de la peticion por url,SEED,(3parametro un callbackerr, decoded con inf del usuario).)
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto!',
                errors: err
            });
        }
        next();
    });

}); */
// ======================================
// Actualizar usuario
// ======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id; //obtener el id

    var body = req.body; // metodo o variable inecesario si hay errores

    //referencia a clase del Usuario (toda la libreria o modelo).
    Usuario.findById(id, (err, usuario) => { // mongoose findById

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }
        // evaluar si viene un usuario
        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        //ya se que existe el usuario y trabajamos con la var usuario
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        //grabacion
        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }
            // para omitir cierta informacion
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado //si regreso un usuario en este metodo quiere decir que lo hizo correcto

            });


        });

    });

});
// ======================================
// Crear un nuevo usuario
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => { // si queremos autenticacion 2 parametro
    // la F verificaToken se ejecuta cuando es solicitada esa peticion

    var body = req.body; // se recibe algo en este Obj del body.

    // definicion para crear un nuevo usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario!',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,

            usuariotoken: req.usuario

        });


    });
});

// ======================================
// Borrar un usuario por el id
// ======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id; //segundo id se refiere al id de arriba
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //modelo usuario.F moonguse instruccion. findByIdAndRemove

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario!',
                errors: err
            });
        }
        //validacion
        if (!uarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id!',
                errors: { message: 'No existe un usuario con ese id!' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado

        });
    });
});

// se exporta el archivo
module.exports = app;