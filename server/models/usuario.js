const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// ENUM DE ROLES VALIDOS
let rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido' 
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [ true , 'El nombre es obligatorio' ]
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es obligatorio' ]
    },
    password: {
        type: String,
        required: [ true, 'El password es obligatorio' ]
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

// SE ELIMINAN PROPIEDADES DE LA RESPUESTA
usuarioSchema.methods.toJSON = function(){
    let userObject = this.toObject();
    delete userObject.password;
    //delete userObject._id;
    return userObject;
}

// VALIDADOR DE PROPIEDADES UNICAS
usuarioSchema.plugin( uniqueValidator, { message: ' {PATH} debe de ser unico.' });

module.exports = mongoose.model( 'Usuario', usuarioSchema );