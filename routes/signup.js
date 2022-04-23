
const express = require('express');
const bcrypt = require('bcrypt');
const logger = require('../middlewares/logger');
const router = express.Router();
const { accountSchema } = require('./../models/accounts');

router.post('/signup', async (req, res) => {
    try {
        const request = Object.values(req.body);
        if (request.length < 4) return res.status(400)
        .send('Solicitud no valida, por favor asegurese de llenar todos los campos.');

        const Salt = await bcrypt.genSalt(8);
        const password = await bcrypt.hash(req.body.password.toString(), Salt);

        const newAccount = new accountSchema({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: password,
            isAdmin: req.body.isAdmin
        });
        await newAccount.save();

        const token = newAccount.generateJWT();
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', "x-auth-token")
        .status(200).send("Te has registrado exitosamente!")
    }
    catch (ex) {
        logger.log({
            level: "error",
            message: Date.now() + "Something went wrong at /signup" + ex
        });
        return res.status(500).send(`Algo anda mal al intentar registrarte.
                                    Intente nuevamente o contacte soporte.`);
    }
});

module.exports = router;