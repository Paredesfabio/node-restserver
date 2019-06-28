const jwt = require('jsonwebtoken');

// ===============================
// VERIFICAR TOKEN
// ===============================
let verificacionToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify( token, process.env.SEED, (err,decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no Valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

// ===============================
// VERIFICAR ADMIN ROLE
// ===============================
let verificacionAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if( usuario.role === "ADMIN_ROLE"){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es adminstrador'
            }
        });
    }

    
}

// ===============================
// VERIFICAR TOKEN URL
// ===============================
let verificacionTokenImg = (req, res, next) => {

    let token = req.query.token;
    jwt.verify( token, process.env.SEED, (err,decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no Valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

module.exports = { verificacionToken, verificacionAdminRole, verificacionTokenImg  };