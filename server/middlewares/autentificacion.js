const jwt = require('jsonwebtoken');

// Verificar token
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message : 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
};

// Verifica Rol
let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// Verifica Token Image
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message : 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
}


module.exports = { verificaToken, verificaRole, verificaTokenImg }