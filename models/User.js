const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

// Se define el esquema del modelo 'Usuario {User}' para enviar al cluster de: MongoDB Atlas.
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Por favor ingrese un nombre.']
    }, 
    email: {
        type: String, 
        required: [true, 'Por favor ingrese un correo electrónico.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Por favor ingrese un correo electrónico válido.']
    },
    telefono: {
        type: String,
        required: [true, 'Ingrese un numero de contacto por favor']
    },
    pais: {
        type: String,
        required: [true, 'Por favor ingrese el pais de origen']
    },
    clave: {
        type: String, 
        required: [true,'Por favor ingrese una contraseña válida.'],
        minlength: [6, 'La contraseña debe tener almenos 6 caracteres.']
    },
})

/* 
    Se hace uso de la libereria [bcrypt] para encriptar la contraseña del usuario antes de ser guardada
    en MongoDB Atlas.
*/
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.clave = await bcrypt.hash(this.clave, salt);
    next()
})

/* 
    Está función realiza el proceso de autenticación con el cluster de MongoDb Atlas
    donde se realiza una comparación con lo que recibe y lo que está guardado.
*/
userSchema.statics.login = async function (email, clave) {
    const user = await this.findOne({ email });
    if (user) {
        const isAuthenticated = await bcrypt.compare(clave, user.clave);
        if (isAuthenticated) {
            return user;
        }
        throw Error('incorrect pwd');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema)
module.exports = User;