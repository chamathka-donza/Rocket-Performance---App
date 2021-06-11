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
       _id: '1',
       name: "Service Reservation",
       image: "/images/reservationImage.jpg",
      
       
   },
   {
       _id: '2',
       name: "Body Kits",
       image: "/images/bodykitImage.jpeg",
       
   },
   {
       _id: '3',
       name: "Alloy Wheels",
       image: "/images/tyreImage.jpg",
       
   },
   {
       _id: '4',
       name: "Exhaust Kits",
       image: "/images/ex-1.jpg",
       
       
   },
],

products: [
   {
    //    _id: '4',
    //    p_id: 4.1,
       catogory:"lubricants",
       name: "clatex 2.2",
       image: "/images/lubricantImage.jpg",
       price:"10000",
       description: "Adoooooo bomka",
       countInStock: 30,
      
   },
   {
       _id: '4',
       p_id: 4.2,
       catogory:"lubricants",
       name: "HKS Dual Output Exhaust",
       image: "/images/ex-1.jpg",
       price:"8000",
       description: "Original HKS made in Japan. Without inline valve and pipe.",
       countInStock: 10,
      
   },
   {
       _id: '3',
       p_id: 3.1,
       catogory:"tyres",
       name: "Michigon Evo 4 Alloy Wheel",
       image: "/images/aw-1.jpg",
       price:"26500",
       description: "Made in Japan. 15'. Can purchase any number of wheels. price of a single wheel is displayed",
       countInStock: 15,
       
   },
   {
       _id: '3',
       p_id: 3.2,
       catogory:"tyres",
       name: "HOOLER Evo 4 Alloy Wheel",
       image: "/images/aw-2.jpg",
       price:"13700",
       description: "Made in Thaiwan. 15' . Can purchase any number of wheels. price of a single wheel is displayed ",
       countInStock: 5,
      
   },
   {
       _id: '2',
       p_id: 2.1,
       catogory:"bodykits",
       name: "Lancer Evolution 4",
       image: "/images/evo-4.jpg",
       price:"40000",
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 20,
       
   },
   {
       _id: '2',
       p_id: 2.2,
       catogory:"bodykits",
       name: "Lancer Evolution 6",
       image: "/images/evo-6.jpg",
       price:"45000",
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 10,
       
   },
   {
       _id: '2',
       p_id: 2.3,
       catogory:"bodykits",
       name: "Lancer Evolution 8",
       image: "/images/evo-8.jpg",
       price:"48000",
       description: "Front Buffer, Rear Buffer, Rear Spoiler, Skirtings // Made by Fiber",
       countInStock: 0,
       
   },
]


};

export default data ;