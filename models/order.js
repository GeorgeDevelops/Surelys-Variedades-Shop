
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    product: {
        type: [Object],
        required: true
    },
    phone: {
        type: Number,
        required: true,
        maxlength: 12
    },
    status: {
        type: String,
        default: "Pendiente",
        required: true
    }
});

const Order = mongoose.model('orders', orderSchema);
module.exports = Order;