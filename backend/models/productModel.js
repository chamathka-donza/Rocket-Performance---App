import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    image: { type: String, required: true},
    catogory: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: String, required: true},
    countInStock: { type: Number, required: true},

},
{
    timestamps: true,
});

const Product = mongoose.model('product', productSchema);

export default Product;