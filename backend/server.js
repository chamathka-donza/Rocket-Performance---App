import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './data.js';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import orderRouter from './routers/orderRouter.js';

dotenv.config();
 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/RocketPerformance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(cors())

// app.get('/api/products', (req, res) =>{
//     res.send(data.products);
//     console.log(data.products)
// });

// app.get('/api/product/:id', (req, res) =>{
//     console.log("Params id", req.params .id)
//     const product = data.products.filter(p => {if(p.p_id == req.params.id) return true})
//     res.send(product[0]);
//     console.log(data.products)
// });

app.get('/api/sections', (req, res) =>{
    res.send(data.sections);
    // console.log(data.sections);
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.get('/',(req, res) => {
    res.send('Server is ready');
});

app.use((err, req, res, next) =>{
res.status(500).send({message: err.message});
});

const port = process.env. PORT || 5000;
app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});