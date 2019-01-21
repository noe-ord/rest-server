const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

// crearemos los roles validos para el sistema
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};//{VALUE} es el valor que introdusca el usuario

// se crea una nueva schema deusuario(esquema)
let usuarioSchema = new Schema({
    // nombre es la coleccion que creo o propiedad
    nombre: {
        type: String,
        required:[true, 'El nombre es necesario']
        // true va entre [true, 'mensaje'] porque declaro el mesaje encaso que no se cumpla
    },
    email: {
        type: String,
        unique: true,//para que no se repita el valor
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true


    },
    google: {
        type: Boolean,
        default: false
    }

});
// em metodo methods.toJSON siempre se llama cuando deseo imprimir
// se recomienda el uso de fuction y no callback por el uso de this
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

// Con esto hacemos que el schema use un plugin 
// con el {PATH} inyectamos el argumento donde muestra el error en este caso email
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})


// Exportamos el Schema que emos creado ejemplo:
// mongoose.model('Nombre del Schema', nombreD la configuracion del schema)
module.exports = mongoose.model( 'Usuario', usuarioSchema);


