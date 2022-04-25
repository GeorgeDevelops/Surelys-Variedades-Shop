
const express = require('express');
const router = express.Router();
const { accountSchema } = require('./../models/accounts');
const auth = require('./../middlewares/auth');
const logger = require('./../middlewares/logger');
const mongoose = require('mongoose');

router.get('/cart/:customerId', auth, async (req, res)=>{
    try {
        const customerId = req.params.customerId;
        const customer = await accountSchema.findById(customerId);
        if (!customer || customer === '') return res.status(404).send("No encontrado.");
        return res.status(200).send(customer.cart);

    } catch (ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /cart/:customerId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al cargar los articulos del carrito.");
    }
});

router.put('/cart/new/:customerId', auth, async (req, res) => {

    try {
        const customerId = req.params.customerId;

        const customer = await accountSchema.findById(customerId);
        if (!customer || customer === '') return res.status(404).send("Usuario no encontrado.");

        if (!req.body.size || req.body.size === '') return res.status(400).send("Size es obligatorio.");

        const item = { _id: new mongoose.Types.ObjectId(),...req.body};
        
        await accountSchema.updateOne({_id: customerId}, {$push: { cart: item }});
        return res.status(200).send("Articulo agregado al carrito con exito.");
    } catch(ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /cart/new/:customerId/:productId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al agregar al carrito.");
    }
});

router.delete('/cart/delete/:customerId/:itemId', auth, async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const itemId = req.params.itemId;
    
        await accountSchema.updateOne({ _id: mongoose.Types.ObjectId(customerId) }, 
            { $pull: { 'cart': { _id: mongoose.Types.ObjectId(itemId)} }});
    
        return res.status(200).send("Articulo eliminado del carrito con exito.");
    } catch(ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /cart/delete/:customerId/:productId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al eliminar articulo.");
    }
});

module.exports = router;