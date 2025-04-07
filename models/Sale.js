let mongoose = require('mongoose');

let saleSchema = mongoose.Schema({
    saleName: {
        type: String,
        required: true,
        unique:true
    },
    discount: {
        type: Number,
        min: 0,
        max: 100, // Giảm tối đa 100%
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('sale', saleSchema);
