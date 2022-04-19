
const express = require('express');
const router = express.Router();
const Order =  require('./../models/order');
const { accountSchema } =  require('./../models/accounts');
const Product = require('./../models/product');
const auth = require('./../middlewares/auth');
const admin = require('./../middlewares/admin');
const logger = require('./../middlewares/logger');
const mongoose = require('mongoose');

router.get('/orders/all', [auth,admin], async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).send(orders);
    } catch (ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /orders/all :' + ex
        });
        return res.status(500).send("Algo ha salido mal al cargar todas las ordenes.");
    }
});

router.get('/orders/:customerId', auth, async (req, res) => {
    const id = req.params.customerId;

    try{
    const customer = await accountSchema.findOne({ _id: id});
    if (!customer || customer === '') return res.status(404).send("Orden no pudo ser encontrada.");

    return res.status(200).send(customer.orders);
    } catch (ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /order/:customerId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al cargar esta orden.");
    }
});

router.post('/orders/new', auth, async (req, res) => {
    const customerId = req.body.customerId;
    const product = req.body.product;
    const orderId = new mongoose.Types.ObjectId();
    try {
        const customer = await accountSchema.findOne({ _id: customerId});
        if (!customer || customer === '') return res.status(404).send('Usuario no encontrado.')
        const order = await new Order({
        _id: orderId,
        customer: customerId,
        product: product,
        phone: req.body.phone
    });
    // customer.orders.push(order);
    await accountSchema.updateOne({ _id: customerId}, {$push: {orders: order }});
    product.forEach(async item => {
        const p = await Product.findById(item.productId);
        p.stock = p.stock - item.amount;
        await p.save();
    });
    await order.save();
    customer.cart.splice(0, customer.cart.length);
    await customer.save();
    return res.status(200).send("Pedido enviado con éxito!");
 } catch (ex){
    logger.log({
        level: 'error',
        message: Date.now() + ': Something went wrong at /orders/new :' + ex
    });
    return res.status(500).send("Algo ha salido mal al enviar este pedido.");
}
});

router.delete('/orders/delete/:customerId/:orderId', async(req, res) => {

    try {
        const idOrder = req.params.orderId;
        const order = await Order.findOne({ _id: idOrder});
        if (!order || order == "") return res.status(404).send("Esta orden ya ha sido eliminada.")
        await Order.deleteOne({ _id: idOrder });

        await accountSchema.updateOne({ _id: req.params.customerId}, 
            { $pull: { 'orders': { _id: mongoose.Types.ObjectId(idOrder) }}});

        // const customer = await accountSchema.findOne({ _id: req.params.customerId});
        // const orders = customer.orders.filter(order => order._id.toHexString() !== idOrder);
        // customer.orders = orders;
        // await customer.save();

    return res.status(200).send("Orden eliminada con exito.");
    } catch(ex){
        logger.log({
            level: 'error',
            message: Date.now() + ': Something went wrong at /orders/delete/orderId :' + ex
        });
        return res.status(500).send("Algo ha salido mal al eliminar esta orden");
    }
});

module.exports = router;