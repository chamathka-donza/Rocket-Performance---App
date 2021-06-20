import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { generateToken } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res) =>{
    const products = await Product.find({});
    res.send(products);
}));

productRouter.get(
    '/seed', 
    expressAsyncHandler(async(req, res) =>{
    //  await Product.remove({}); 
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts});
}));

productRouter.get('/:id', expressAsyncHandler(async(req, res) =>{
    // const product = await Product.findById(req.params.id);
    // const product = data.products.filter(p => {if(p._id == req.params.id) return true})
    console.log("crt id", req.params.id)
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    }else{
        res.status(404).send({ message: 'Product Not Found'});
    }
}));

productRouter.post('/addProduct', expressAsyncHandler(async(req, res) =>{
    const product = Product({
        c_id: req.body.c_id,
        catogory: req.body.catogory,
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        countInStock: req.body.countInStock

    });
    const createdProduct = await product.save();
    res.send({

        _id: createdProduct._id,
        c_id: createdProduct.c_id,
        catogory: createdProduct.catogory,
        name: createdProduct.name,
        image: createdProduct.image,
        price: createdProduct.price,
        description: createdProduct.description,
        countInStock: createdProduct.countInStock,
        token: generateToken(createdProduct),
    })
}


))

export default productRouter;