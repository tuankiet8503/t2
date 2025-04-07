let mongoose = require('mongoose');

let OrderDetailSchema = mongoose.Schema({
    OrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required: true
    },
    ProductId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    Quantity: {  
        type: Number,
        required: true
    },
    Price: {  
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
