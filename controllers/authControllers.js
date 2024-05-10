/* 
    Esta clase nos permite hacer toda la parte de autentificación haciendo uso de las librerias:
    -JWT
*/

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const maxAge = 5 * 24 * 60 * 60
const createJWT = id => {
    return jwt.sign({ id }, 'chatroom secret', {
        expiresIn: maxAge
    })
}
const alertError = (err) => {
    let errors = { name: '', email: '', password: '' }

    console.log('err message', err.message);
    console.log('err code', err.code);

    if (err.message === 'incorrect email') {
        errors.email = 'Este email no esta registrado.';
    }

    if (err.message === 'incorrect pwd') {
        errors.password = 'Contraseña incorrecta.';
    }

    if (err.code === 11000) {
        errors.email = 'Este email ya se encuentra registrado.'
        return errors;
    }

    if (err.message.includes('user validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

/* 
    Está función nos permite crear un token de JWT a partir de que el usuario se registre.
*/
module.exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({name, email, password});
        const token = createJWT(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({user});
    } catch (error) {
        let errors = alertError(error);
        res.status(400).json({ errors });
    }
}
/* 
    Está función nos permite crear un token de JWT a partir de que el usuario se logee.
*/
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createJWT(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user });
    } catch (error) {
        console.log(error)
        let errors = alertError(error);
        res.status(400).json({ errors });
    }
}
/*
    Está función nos permite hacer una verificación del usuario, a partir del JWT token.
*/
module.exports.verifyuser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'chatroom secret', async (err, decodedToken) => {
            console.log('decoded token', decodedToken)
            if (err) {
                console.log(err.message)
            } else {
                let user = await User.findById(decodedToken.id)
                res.json(user);
                next();

            }
        })
    } else {
        next();
    }
}
/*
    Asigna un cookie vacio y elimina el JWT token cuando el usuario cierre sesión.
*/
module.exports.logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 })
    res.status(200).json({ logout: true })
}