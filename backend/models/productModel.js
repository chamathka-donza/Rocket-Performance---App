import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    comment: {type: String, required: true},
    rating: {type: Number, required: true},
},
{
    timestamps: true,
});
const productSchema = new mongoose.Schema({

    // _id:{type: String, required: true},
    // c_id:{type: Number, required: true},
    category: { type: String, required: true},
    brand:{ type: String, required: true},
    name: {type: String, required: true, unique: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    description: { type: String, required: true},
    countInStock: { type: Number, required: true},
    rating: { type: Number, required: true},
    numReviews: { type: Number, required: true},
    reviews: [reviewSchema],

},
{
    timestamps: true,
});

const Product = mongoose.model('product', productSchema);

export default Product;