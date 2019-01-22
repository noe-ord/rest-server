const jwt = require('jsonwebtoken');

// ========================
//  Verificar Token
// =====================

let verificaToken = ( req, res, next) => {
    // aqui extraigo el valor del header
    let token = req.get('token');
    console.log(token);
    // res.json({
    //     token
    // })
  
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
           return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No valido'
                }
            });
        }
        // Aqui tomo toda la informacion del usuario 
        // esto es el paylot(decoded)
        req.usuario = decoded.usuario;
        next();
    });
};

// ======================
// Verifica adminRole
// ======================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE' ){
        next();
        return;
    }else{

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
           
        }); 
    }
}
// ======================
// Verifica token para imagen
// ======================

let verificaTokenImg = (req, res, next) =>{
    let token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: true, 
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}
module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}