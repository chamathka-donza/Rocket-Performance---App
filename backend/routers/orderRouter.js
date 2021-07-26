import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, mailgun, payOrderEmailTemplate, completeOrderEmailTemplate } from '../utils.js';

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
             OrderID: req.body.OrderID,
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
    const order = await Order.findById(req.params.id).populate([{path: 'product', model: 'Product'}, { path: 'user', model: 'User'}]);;
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
            subject:`New order ${order.OrderID}`,
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
          res.send({ message: 'Payment Done', order: updatedOrder});
      }else{
          res.status(404).send({ message: 'Order Not Found'});
      }
  }))

  orderRouter.put('/:id/complete', isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if(order){
        order.orderComplete = true ;
        order.orderCompleteAt = Date.now();

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
          subject:`Order is cpmpleted ${order.OrderID}`,
          html: completeOrderEmailTemplate(order),
      };
      
      transporter.sendMail(mailContent, function(error, data){
          if(error){
              console.log(`Unable to send mail`, error)
          }
          else{
              console.log(`Email send successfully`)
          }
      });
        res.send({ message: 'Order Complete', order: updatedOrder});
    }else{
        res.status(404).send({ message: 'Order Not Found'});
    }
}))

export default orderRouter ;