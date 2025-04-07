let mongoose = require('mongoose');

let OrderSchema = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
         ref: 'user'
    },
    OrderDate:{
        type:Date,
        required:true,
    },
    TotalPrice:{
        type:Number,
        required:true,
    },
    ShippingAddress:{
        type:String,
        required:true,
    },
    Note:{
        type:String,
        default:"",
    },
    Trangthai:{
        type:String,
        required:true,
    },
    Sdt:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})
module.exports = mongoose.model('Order', OrderSchema);
