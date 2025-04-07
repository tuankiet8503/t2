let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
        default :"/",
    },
    parent:{
        type: mongoose.Types.ObjectId,
        ref: "menu",
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})
module.exports =  mongoose.model('menu',roleSchema)
