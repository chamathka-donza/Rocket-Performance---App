import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Reservation from '../models/reservationModel.js';
import User from '../models/userModel.js';
import { isAuth, placeReservationEmailTemplate } from '../utils.js';
import nodemailer from 'nodemailer';
import nodemailMailGun from 'nodemailer-mailgun-transport';

const reservationRouter = express.Router();


reservationRouter.post('/', isAuth, expressAsyncHandler(async(req, res) =>{
    let userOb = await User.findById(req.user._id).populate('user', 'email name');
    console.log("ses")
    const reservation = new Reservation({
        date: req.body.date, 
        vehicleNo: req.body.vehicleNo, 
        timePeriod: req.body.timePeriod,
        user: userOb,
    });
    const createdReservation = await reservation.save();
    

        let emailAuth = {
          auth : {
              api_key: process.env.MAILGUN_API_KEY,
              domain: process.env.MAILGUN_DOMAIN,
          }
      }
      
      let transporter = nodemailer.createTransport(nodemailMailGun(emailAuth))
      
      let mailContent={
          from:'RocketPerformance@mg.yourdomain.com',
          to:`${reservation.user.name}<${reservation.user.email }>`,
          subject:`New reservation ${reservation._id}`,
          html: placeReservationEmailTemplate(reservation),
      };
      
      transporter.sendMail(mailContent, function(error, data){
          if(error){
              console.log(`Unable to send mail`, error)
          }
          else{
              console.log(`Email send successfully`)
          }
      });

 
      res.send({message: 'Reservation Added Successfully', reservation: createdReservation });
    
    }
    )
    );

    reservationRouter.get('/', expressAsyncHandler(async(req, res) =>{
        console.log("get reservations");
        const reservations = await Reservation.find();
        res.send(reservations);
        
    }));

    reservationRouter.post('/bookings', expressAsyncHandler(async(req, res) =>{
        
        console.log("date",req.body.date)
        const reservation = await Reservation.find({date: req.body.date}).populate({path:"user",model:"User"});
        if(reservation){
            res.send(reservation);
        }else{
            res.status(404).send({ message: 'No Reservations Found'});
        }
    }));


    reservationRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) =>{
        const reservations = await Reservation.find({user: req.user._id});
        res.send(reservations);
    }));

    reservationRouter.delete('/:id', isAuth, expressAsyncHandler(async(req, res) =>{
        const reservation = await Reservation.findById(req.params.id);
        if(reservation){
            const deleteReservation = await reservation.remove();
            res.send({message: 'Reservation Deleted', reservation: deleteReservation});
        }else{
            res.status(404).send({message: 'Reservation Not Found'});
        }
    }));
export default reservationRouter ;