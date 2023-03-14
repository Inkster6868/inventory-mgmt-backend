const dotenv=require("dotenv").config();  //config() will read your .env file, parse the contents, assign it to process.env, and return an Object with a parsed key containing the loaded content or an error key if it failed.
const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");  //converts the incoming request body to 'json' file that we can read .Before parsing, it was just a regular buffer-string that could not access the data encoded inside, but after parsing, it becomes a JavaScript object where it can access the various data within.
const cors=require("cors"); //for moving from frontend to backend
const userRouting=require('./routes/userRoute'); //used for navigation of user to different endpoints
const productRouting=require('./routes/productsRoute'); // used for navigation to different endpoints of 'product' page
const contactRouting=require('./routes/contactRoute');  //used for navigating to the contactRoute page
const errorHandler=require('./middleWare/errorMiddleWare'); //made by us to show errors in a differently designed way
const cookieParser=require("cookie-parser"); 
const path = require('path');  //required for getting the path and joining them

const app=express(); // all functions and methods of express get transferred to app. now like object we can access them 'app.method()'.
const PORT=process.env.PORT || 5000;  //locally it will run on port 5000 but when it is hosted it will pick the port from the server

//Middlewares
app.use(express.json());  //converts the incoming body data to .json format 
app.use(cookieParser());
app.use(express.urlencoded({extended:false})); //??
app.use(cors({
    origin:["http://localhost:3000", "https://streamlinemgmt.vercel.app"], 
    credentials:true                   
}));


//The express.static() function is a built-in middleware function in Express. It serves static files and is based on serve-static
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
//so if someone uses /uploads as their goto path so they will point at this

//Routes Middlewares
    app.use('/api/users',userRouting); 
    //technically after this prefixed endpoint, we will call the userRouting function which will then check the desired route and respond accordingly, if the route entered by the user is valid or not.
    app.use('/api/products',productRouting);
    app.use('/api/contactus',contactRouting); 

//Routes
app.get("/",(req,res)=>{
    res.send('homepage')
});

//errorHandler
app.use(errorHandler);

//connect to DB and start server
mongoose
        .connect(process.env.MONGO_URI)   //first connect to th database
        .then(()=>{                       //then listen to server.
            app.listen(PORT,()=>{
                console.log(`server is running on port ${PORT}`)
            })
        })

        .catch((err)=>{
            console.log(err);
        })

