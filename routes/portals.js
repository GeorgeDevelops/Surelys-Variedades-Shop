const express = require('express');
const router = express.Router();
const Portal = require('./../models/portal');
const logger = require('./../middlewares/logger');
const admin = require('./../middlewares/admin');
const auth = require('./../middlewares/auth');

router.post('/slider/post/image', [auth, admin], async (req, res) => {
    const { url } = req.body;
    try {
        if (!url || url === '') return res.status(400).send("Debe seleccionar una imagen.");

        const repeat = await Portal.find({ image: url });
        if (repeat.length > 0) return res.status(400).send("Esta imagen de portada ya ha sido publicada.");

        const portal = new Portal({
            image: url
        });
        await portal.save();

        return res.status(200).send("Nueva foto de portada publicada con exito.");
    } catch (ex) {
        logger.log({
            level: "error",
            message: new Date().toLocaleDateString('es-ES') + " : ERROR at /new/portal/photo: " + ex
        });
        return res.status(500).send("Algo ha salido mal.");
    }
});

router.get('/slider/get/images', [auth, admin], async (req, res) => {
    try {
        const portalPhotos = await Portal.find();
        return res.status(200).send(portalPhotos);
    } catch (ex) {
        logger.log({
            level: 'error',
            message: new Date().toLocaleDateString('es-ES') + 'ERROR at /portal/get/photos' + ex
        });
        return res.status(500).send("Algo ha salido mal.");
    }
});

router.delete('/slider/delete/image/:id', [auth, admin], async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || id === '') return res.status(400).send("Debes seleccionar una imagen.");

        const image = await Portal.findById(id);
        if (!image) return res.status(400).send("Esta imagen de portada ya ha sido eliminada.");

        await Portal.deleteOne({ _id: id });

        return res.status(200).send("Imagen de portada eliminada con exito.");
    } catch (ex) {
        logger.log({
            level: 'error',
            message: new Date().toLocaleDateString('es-ES') + '/portal/delete/photo' + ex
        });
        return res.status(500).send("Algo ha salido mal.");
    }
});

module.exports = router;