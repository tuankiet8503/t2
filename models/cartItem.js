const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user'
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'product'
    },
    Quantity: {
        type: Number,
        required: true,
        default: 1
    },
    Price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CartItem', CartItemSchema);
