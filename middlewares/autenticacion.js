var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ======================================
// Verificar Token
// ======================================
// definiendo F que recibe parametros
exports.verificaToken = function(req, res, next) { // acceso al url ()



    var token = req.query.token; // para obtener el token y revisarlo
    //realizar la comprobacion(toke de la peticion por url,SEED,(3parametro un callbackerr, decoded con inf del usuario).)
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto!',
                errors: err
            });
        }
        // informacion del usuario que este disponible en culaquier peticion
        req.usuario = decoded.usuario;
        next();
        /* res.status(200).json({
            ok: true,
            decoded: decoded //ver que contiene el decoded
        }); */

    });

}