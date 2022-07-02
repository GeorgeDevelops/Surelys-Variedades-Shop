
const mongoose = require('mongoose');

const portalSchema = new mongoose.Schema({
    image: {
        type: Object,
        required: true
    },
    postedDate: { type: String, default: new Date().toLocaleDateString('es-ES') }
});

const Product = mongoose.model('portal', portalSchema);
module.exports = Product;