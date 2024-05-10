// Esta ruta sera usada para darle la información de del usuario a la aplicación.
const {Router} = require('express')
const authController = require('../controllers/authControllers')
const router = Router();
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/verifyuser', authController.verifyuser)

module.exports = router;