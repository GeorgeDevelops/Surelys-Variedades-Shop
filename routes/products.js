
const express = require('express');
const router = express.Router();
const Product =  require('./../models/product');
const logger = require('./../middlewares/logger');
const admin = require('./../middlewares/admin');
const auth = require('./../middlewares/auth');

router.get('/products', async (req, res) => {
    try {
        const product =  await Product.find();
        return res.status(200).send(product);
    } catch (ex) {
        logger.log({
            level: 'error',
            message: `${Date.now()} : Something went wrong at /products : ${ex}`
        });
        return res.status(500).send(`Algo ha salido mal al intentar cargar los articulos, Intentelo nuevamente.`);
    }
});

router.post('/products/new', [auth, admin], async (req, res) => {

    const { body } = req;
    // Object.keys(body).forEach(key => {
    //     if(!body[key] || body[key] === '') return res.status(400).send(`Algo anda mal ${key} is required.`);
    // });
    const keys = Object.keys(body);

    if (keys.length < 1) return res.status(400).send(`Llenar el formulario es obligatorio.`);
    if (!body.images || body.images === '' || body.images === null) return res.status(400).send(`Seleccionar al menos una imagen es obligatorio.`);
    if (!body.name || body.name === '' || body.name === null) return res.status(400).send(`Nombre es obligatorio.`);
    if (!body.price || body.price === '' || body.price === null) return res.status(400).send(`Precio es obligatorio.`);
    if (!body.stock || body.stock === '' || body.stock === null) return res.status(400).send(`Stock es obligatorio.`);
    if (!body.categories || body.categories === '' || body.categories === null) return res.status(400).send(`Categorias es obligatorio.`);
    if (!body.desc || body.desc === '' || body.desc === null) return res.status(400).send(`Descripcion es obligatorio.`);
    
   try { 
       const product = new Product({
        name: req.body.name,
        price: Number(req.body.price),
        desc: req.body.desc,
        stock: Number(req.body.stock),
        sizes: req.body.sizes,
        category: req.body.categories,
        images: req.body.images
    });

    await product.save();
    return res.status(200).send("Articulo publicado correctamente.");
    } catch(ex){
        logger.log({
            level: 'error',
            message: `${Date.now()} : Something went wrong at /products/new : ${ex}`
        });
        return res.status(500).send(`Algo ha salido mal al intentar publicar este articulo.
        Verifique que todos los campos requeridos esten llenos e intenten nuevamente.`);
    }
});

router.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findOne({ _id: id });
        if(!product || product === '') return res.status(404).send("Articulo no encontrado.");
    return res.status(200).send(product)
    } catch (ex){
        logger.log({level: 'error', message: Date.now() + ": Something went wrong at /products/:id :" + ex});
    return res.status(500).send("Algo ha salido mal al cargar este articulo, intentelo nuevamente."); 
    }
}); 

router.put('/products/update/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.updateOne({_id: id}, req.body)
        if(!product || product === '') return res.status(404).send("Articulo no encontrado.");

    return res.status(200).send("Articulo actualizado con exito!")
    } catch (ex){
        logger.log({level: 'error', message: Date.now() + ": Something went wrong at /products/update/:id :" + ex});
    return res.status(500).send("Algo ha salido mal al actualizar este articulo, intentelo nuevamente."); 
    }
}); 

router.delete('/products/delete/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.deleteOne({_id: id});
        if(!product || product === '') return res.status(404).send("Articulo no encontrado.");

    return res.status(200).send("Articulo eliminado con exito!")
    } catch (ex){
        logger.log({level: 'error', message: Date.now() + ": Something went wrong at /products/delete/:id :" + ex});
    return res.status(500).send("Algo ha salido mal al eliminar este articulo, intentelo nuevamente."); 
    }
}); 

module.exports = router;