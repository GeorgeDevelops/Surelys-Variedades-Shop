
const express = require('express');
const router = express.Router();
const { accountSchema } = require('./../models/accounts');
const logger = require('./../middlewares/logger');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {

    try { 
        if (Object.values(req.body).length < 2) return res.status(400)
        .send('Solicitud no valida, por favor asegurese de llenar todos los campos.');
        
        const user = await accountSchema.findOne({ email: req.body.email});
        if (!user || user === '') return res.status(404).send("Correo o contraseña incorrecto.");
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(404).send("Correo o contraseña incorrecto."); 
    
        const token = user.generateJWT();
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', "x-auth-token")
        .status(200).send("Has iniciado sesión correctamente");
    
    } catch (ex) {
        logger.log({
            level: 'error',
            message: Date.now() + " : Something went wrong at /login : " + ex
        });
        return res.status(500).send("Algo ha salido mal.");
    }
});

module.exports = router;