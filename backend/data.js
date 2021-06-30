import bcrypt from 'bcryptjs';

const data ={

    users: [
    {
        name: 'Chamathka',
        email:'chamathkasenarath17@gmail.com',
        password:bcrypt.hashSync('1234', 8),
        phone:'0717016068',
        isAdmin: true,
        
    },
    {
        name: 'Ravindu',
        email:'Saduniharindra16@gmail.com',
        password:bcrypt.hashSync('1234', 8),
        phone:'0757031684',
        isAdmin: false,
        
    },
    ],

    sections: [
   {
       c_id: '1',
       name: "Service Reservation",
       image: "/images/reservationImage.jpg",
      
       
   },
   {
       c_id: '2',
       name: "Body Kits",
       image: "/images/bodykitImage.jpeg",
       
   },
   {
       c_id: '3',
       name: "Alloy Wheels",
       image: "/images/tyreImage.jpg",
       
   },
   {
       c_id: '4',
       name: "Exhaust Kits",
       image: "/images/ex-1.jpg",
       
       
   },
],

products: [
   {
       c_id: 4,
    //    p_id: 4.2,
       catogory:"exhausts",
       brand:"HKS",
       name: "HKS Dual Output Exhaust",
       image: "/images/ex-1.jpg",
       price: 9000,
       description: "Original HKS made in Japan. Without inline valve and pipe.",
       countInStock: 10,
       rating:3.8,
       numReviews: 10,
      
   },
   {
       c_id: 3,
    //    p_id: 3.1,
       catogory:"Alloy Wheels",
       brand:"Michigon",
       name: "Michigon Evo 4 Alloy Wheel",
       image: "/images/aw-1.jpg",
       price: 26500,
       description: "Made in Japan. 15'. Can purchase any number of wheels. price of a single wheel is displayed",
       countInStock: 15,
       rating:1.0,
       numReviews: 11,
       
   },
   {
      c_id: 3,
    //    p_id: 3.2,
       catogory:"Alloy Wheels",
       brand:"HOOLER",
       name: "HOOLER Evo 4 Alloy Wheel",
       image: "/images/aw-2.jpg",
       price: 13700,
       description: "Made in Thaiwan. 15' . Can purchase any number of wheels. price of a single wheel is displayed ",
       countInStock: 5,
       rating:2.0,
       numReviews: 7,
      
   },
   {
       c_id: 2,
    //    p_id: 2.1,
       catogory:"bodykits",
       brand:"Fiber",
       name: "Lancer Evolution 4",
       image: "/images/evo-4.jpg",
       price: 40000,
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 20,
       rating:0.0,
       numReviews: 10,
       
   },
   {
       c_id: 2 ,
    //    p_id: 2.2,
       catogory:"bodykits",
       brand:"Fiber",
       name: "Lancer Evolution 6",
       image: "/images/evo-6.jpg",
       price: 45000,
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 10,
       rating:2.1,
       numReviews: 10,
       
   },
   {
       c_id: 2,
    //    p_id: 2.3,
       catogory:"bodykits",
       brand:"Fiber",
       name: "Lancer Evolution 8",
       image: "/images/evo-8.jpg",
       price: 48000,
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 0,
       rating:3.0,
       numReviews: 0,
       

       
   },
],


};

export default data ;