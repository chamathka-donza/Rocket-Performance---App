import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

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

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const product = new Product({
        c_id:0,
        catogory: 'sample catogory',
        name: 'sample name' + Date.now(),
        image:'/images/p1.jpg',
        price:0,
        description:'sample description',
        countInStock:0


    });
    const createdProduct = await product.save();
    res.send({message: 'Product Created Successfully', product: createdProduct });
})
); 

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
        product.c_id = req.body.c_id;
        product.catogory = req.body.catogory;
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
}))

export default productRouter;