const express = require('express');
const router = express.Router();
const { accountSchema } = require('./../models/accounts');
const logger = require('./../middlewares/logger');

router.get('/users/:id', async (req, res)=>{
    const id = req.params.id;
    try {
        const user = await accountSchema.findById(id);
        if (!user || user === '') return res.status(404).send("Este usuario no existe.");
        return res.status(200).send(user);
    } catch (ex) {
        logger.log({
            level: "error",
            message: Date.now() + "Something went wrong at /users/:id" + ex
        });
        return res.status(500).send(`Algo anda mal al intentar cargar usuario.
                                    Intente nuevamente o contacte soporte.`);
    }
});

router.delete('/users/delete/:id', async (req, res)=>{
    const id = req.params.id;
    try {
        await accountSchema.deleteOne({ _id: id});
        return res.status(200).send("Usuario eliminado con exito.");
    } catch (ex) {
        logger.log({
            level: "error",
            message: Date.now() + "Something went wrong at /users/delete/:id" + ex
        });
        return res.status(500).send(`Algo anda mal al intentar eliminar cuenta.
                                    Intente nuevamente o contacte soporte.`);
    }
});

module.exports = router;