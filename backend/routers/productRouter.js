import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res) =>{
    const name = req.query.name || '';
    const category = req.query.category || '';
    const order = req.query.order || '';
    const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

    const nameFilter = name ? {name: {$regex: name, $options: 'i'}} : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder = order === 'lowest'
    ? { price: 1 }
    : order === 'highest'
    ? { price: -1 }
    : order === 'toprated'
    ? { rating: -1 }
    : { _id: -1 };

    const products = await Product.find(
        {...nameFilter,
         ...categoryFilter,
         ...priceFilter,
         ...ratingFilter,
         
        }
        )
        .populate()
        .sort(sortOrder);
    res.send(products);
}));

productRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));


productRouter.get(
    '/seed', 
    expressAsyncHandler(async(req, res) =>{
    // await Product.remove({});  
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts});
}));

productRouter.get('/:id', expressAsyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    }else{
        res.status(404).send({ message: 'Product Not Found'});
    }
}));

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const product = new Product({
        
        category: 'sample category',
        brand: 'sample brand',
        name: 'sample name' + Date.now(),
        image:'/images/p1.jpg',
        price:0,
        description:'sample description',
        countInStock:0,
        rating:0,
        numReviews:0,
        // reviews:[]


    });
    const createdProduct = await product.save();
    res.send({message: 'Product Created Successfully', product: createdProduct });
})
); 

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
        
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.name = req.body.name;
        product.image = req.body.image;
        product.price = req.body.price;
        product.description = req.body.description;
        product.countInStock = req.body.countInStock;
        const updatedProduct = await product.save();
        res.send({message:'Product Updated', product: updatedProduct});

    }else{
        res.status(404).send({message:'Product Not Found'});
    }
}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deleteProduct = await product.remove();
        res.send({message: 'Product Deleted', product: deleteProduct});
    }else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

productRouter.post('/reviews/:id', isAuth, expressAsyncHandler(async (req, res) => {
    console.log("Req Came")
    console.log("Review ID", req.params.id)
    const product = await Product.findById(req.params.id);
    // console.log("product", product);
    if(product){
       
        // if(product.reviews.find(x => x.name === req.user.name)) {
        //     return res.status(400).send({message: 'You Already Submitted a Review'});
        // }
        const review = {name: req.user.name, rating: Number(req.body.rating), comment: req.body.comment,};
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((a,c) => c.rating + a, 0 )/ product.reviews.length;
        console.log("product",product)
        const updatedProduct = await product.save();
        res.status(201).send({message:'Review Added', review: updatedProduct.reviews[updatedProduct.reviews.length - 1],});

    }else{
        
        res.status(404).send({message:'Product Not Found'});
    }
}));



export default productRouter;