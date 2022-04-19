
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 25,
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 1
    },
    sizes: {
        type: [String]
    },
    category:{
        type: [String],
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    postedDate: { type: Date, default: Date.now }
});

const Product = mongoose.model('products', productSchema);
module.exports = Product;