import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

    // _id:{type: String, required: true},
    c_id:{type: Number, required: true},
    catogory: { type: String, required: true},
    name: {type: String, required: true, unique: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    description: { type: String, required: true},
    countInStock: { type: Number, required: true},

},
{
    timestamps: true,
});

const Product = mongoose.model('product', productSchema);

export default Product;