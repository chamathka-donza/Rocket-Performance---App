import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, mailgun, payOrderEmailTemplate } from '../utils.js';

import nodemailer from 'nodemailer';
import nodemailMailGun from 'nodemailer-mailgun-transport';
import is_number from 'is-number';

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name');
    res.send(orders);

}))

orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) =>{
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}));

orderRouter.post('/', isAuth, expressAsyncHandler(async(req, res) =>{
    //console.log(req.user._id)
    let userOb = await User.findById(req.user._id)
     if(req.body.orderItems.length === 0){
         res.status(400).send({ message: 'Cart is Empty'});
     }else {
         const order = new Order({
             orderItems: req.body.orderItems,
             // customerDetails: req.body.customerDetails,
             itemsPrice: req.body.itemsPrice,
             // totalPrice: req.body.totalPrice,
             user: userOb,

         });
         const createdOrder = await order.save();
          req.body.orderItems.forEach(async element =>{
              let productObject = await Product.findById(element.product)
              //console.log(productObject.countInStock)
              productObject.countInStock = productObject.countInStock - element.qty ;
              productObject.save();
            //  console.log(productObject.countInStock)
            // console.log(is_number(req.body.orderItems.qty))

          });

         res.status(201).send({message: 'New Order Created', order: createdOrder});
     }
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order);
    }else {
        res.status(404).send({message: 'Order Not Found'});
    }
}));

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.put('/:id/payment', isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
      const order = await Order.findById(req.params.id).populate('user', 'email name');
      if(order){
          order.isPaid = true ;
          order.paidAt = Date.now();

          const updatedOrder = await order.save();

          let emailAuth = {
            auth : {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN,
            }
        }
        
        let transporter = nodemailer.createTransport(nodemailMailGun(emailAuth))
        
        let mailContent={
            from:'RocketPerformance@mg.yourdomain.com',
            to:`${order.user.name}<${order.user.email }>`,
            subject:`New order ${order._id}`,
            html: payOrderEmailTemplate(order),
        };
        
        transporter.sendMail(mailContent, function(error, data){
            if(error){
                console.log(`Unable to send mail`, error)
            }
            else{
                console.log(`Email send successfully`)
            }
        });

        //   console.log('tem',payOrderEmailTemplate(order))
        //   mailgun().messages().send({
        //       from:'RocketPerformance@mg.yourdomain.com',
        //       to:`${order.user.name}<${order.user.email }>`,
        //       subject:`New order ${order._id}`,
        //       html: payOrderEmailTemplate(order),
        //   }, (error, body) => {
        //       if(error){
        //           console.log("Error",error);
        //       }else{
        //           console.log("Mail Success", body);
                  
        //       }
        //   }); 
          res.send({ message: 'Payment Done', order: updatedOrder});
      }else{
          res.status(404).send({ message: 'Order Not Found'});
      }
  }))

export default orderRouter ;