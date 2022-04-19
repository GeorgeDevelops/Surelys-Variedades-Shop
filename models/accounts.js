
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const account = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart:{
        type: [Object]    
    },
    orders: {
        type: [Object] 
    }
});

account.methods.generateJWT = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('defaultSettings.privateKey'))
    return token;
}

const accountSchema = mongoose.model('account', account);

module.exports.accountSchema = accountSchema;