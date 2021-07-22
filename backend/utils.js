
import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const generateToken = (user) =>{
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
    }, 
    process.env.JWT_SECRET || 'somethinsecret',
    { 
    expiresIn: '30d',
    }
    );
};

export const isAuth = (req, res, next) =>{
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET || 'somethinsecret', (err, decode) =>{
            if(err){
                res.status(401).send({message: 'Invalid Token'});
            }else{
                req.user = decode;
                next();
            }
        });
    }else {
        res.status(401).send({message: 'No Token'});
    }
}

export const isAdmin = (req,res,next) =>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send({message: 'Invalid Admin Token'});
    }
} ;

export const mailgun = () => mg({
    apiKey: process.env.MAILGUN_API_KEY,
    doamin: process.env.MAILGUN_DOMAIN,
    
});

export const payOrderEmailTemplate = (order) => {
    console.log(order.user.email);
    return `<h1>Thank You For Connect with Us</h1>
    <p>
    Hi ${order.user.name},</p>
    <p>We have finished processing your order. Once the order is completed we will let you know.</p>
    <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> Rs. ${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> Rs. ${order.itemsPrice.toFixed(2)}</td>
  </tr>
 
  </table>
  
  <p>
  Thanks for connect with us.
  </p>
  `;
};

export const placeReservationEmailTemplate = (reservation) => {
    console.log(reservation.user.email);
    return `<h1>Thank You For Connect with Us</h1>
    <p>
    Hi ${reservation.user.name},</p>
    <p>Your Reservation has been placed successfully.</p>
    <h2>[Reservation ${reservation._id}] (${reservation.createdAt.toString().substring(0, 10)})</h2>
    <table>
  <thead>
  <tr>
  <td><strong>Date</strong></td>
  <td><strong>Time Slot</strong></td>
  <td><strong align="right">Vehicle No</strong></td>
  </thead>
  <tbody>
    
    <tr>
    <td>${reservation.date}</td>
    <td align="center">${reservation.timePeriod}</td>
    <td align="right"> ${reservation.vehicleNo}</td>
    </tr>
  
  </tbody>
  <tfoot>
 
  </table>
  
  <p>
  Thanks for connect with us.
  </p>
  `;
};
    
