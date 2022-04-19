
const express = require('express');
const router = express.Router();
const { accountSchema } = require('./../models/accounts');
const Product = require('./../models/product');
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

router.put('/cart/new/:customerId/:productId', auth, async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const productId = req.params.productId;

        const customer = await accountSchema.findById(customerId);
        if (!customer || customer === '') return res.status(404).send("Usuario no encontrado.");
    
        const product = await Product.findOne({_id: productId});
        if (!product || product === '') return res.status(404).send("Producto no encontrado.");
        const item = product;
        
        await accountSchema.updateOne({_id: customerId}, {$push: { cart: item}});
        return res.status(200).send("Articulo agregado al carrito con exito.");
    } catch(ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /cart/new/:customerId/:productId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al agregar al carrito.");
    }
});

router.delete('/cart/delete/:customerId/:productId', auth, async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const productId = req.params.productId;

        const customer = await accountSchema.findById(customerId);
        if (!customer || customer === '') return res.status(404).send("Usuario no encontrado.");

        const product = await Product.findOne({_id: productId});
        if (!product || product === '') return res.status(404).send("Producto no encontrado.");
    
        await accountSchema.updateOne({ _id: mongoose.Types.ObjectId(customerId) }, 
            { $pull: { 'cart': { _id: mongoose.Types.ObjectId(productId)} }});
    
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