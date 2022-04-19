
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product =  require('./../models/product');
const logger = require('./../middlewares/logger');
const admin = require('./../middlewares/admin');
const auth = require('./../middlewares/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
     const name = file.originalname.split('.')[0];
     const format = file.originalname.split('.')[1];
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 999)

      cb(null, uniqueSuffix + name + '.' + format)
    }
});

const upload = multer({ storage: storage });

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

router.post('/products/new', [auth, admin], upload.array('imgs', 3), async (req, res) => {
    const sizes = [...req.body.sizes.split(',')];
   try { 
       const product = new Product({
        name: req.body.name,
        price: Number(req.body.price),
        desc: req.body.desc,
        stock: Number(req.body.stock),
        sizes: sizes,
        category: [req.body.category],
        images: [...req.files]
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

router.get('/products/:id', auth, async (req, res) => {
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