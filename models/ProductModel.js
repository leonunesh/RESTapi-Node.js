const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        unique: [true, 'Product name must be unique']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
    },
    description: {
        type: String,
        minlength: [10, 'Product description must be at least 10 characters long'],
        maxlength: [200, 'Product description must be at most 200 characters long'],
        required: [true, 'Product description is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;