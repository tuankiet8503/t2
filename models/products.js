let mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
let productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        min:0,
        default:1
    },
    quantity:{
        type:Number,
        min:0,
        default:1
    },
    description:{
        type:String,
        default:""
    },
    imgURL:{
        type:String,
        default:""
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"category",
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    sale: {
        type: mongoose.Types.ObjectId,
        ref: "sale", // Liên kết đến bảng Sale
        default: null
    }
},{
    timestamps:true
})
module.exports=
mongoose.model('product',productSchema)