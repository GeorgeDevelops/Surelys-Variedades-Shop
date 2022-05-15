
const mongoose = require('mongoose');

const portalSchema = new mongoose.Schema({
    images: {
        type: Array,
        required: true
    },
    postedDate: { type: Date, default: Date.now }
});

const Product = mongoose.model('portal', portalSchema);
module.exports = Product;