const asyncHandler=require("express-async-handler");
const User = require("../models/userModels");
const jwt=require("jsonwebtoken");

const protect= asyncHandler(async(req,res,next)=>{
              // console.log(req.body);
            //Check token 
            try{
            const token= req.cookies.token;// we are going to check first that the request incoming has a token or not .
            if(!token) {
                res.status(401)
                throw new Error("Not authorised,Please login again")
              }  //if not that means the user is not logged in so display this error
              
              // console.log("hello");
            //Vaidate User token
            const verified=jwt.verify(token,process.env.SECRET_KEY)
            //now if this is verified we want to check the credentials that whether it exists or not, so when we created the token we used "id,secretkey" to sign it . so we can just extract that and search the userModel for it 
            // console.log(verified.id);
            const user= await User.findById(verified.id).select("-password");
            // console.log("hello")
            //now we don't want to send the password back to the user so thats why use "-password" to disselect pass and send the rest of the things back to the user profile page,

            //now if the user didnt exist, throw err that user not found. sometimes your request may be interpreeted by a hacker and he might try to change the id's so we need not display details for the wrong id, 
            if(!user) {
                res.status(401)
                throw new Error("User not found")
            }
            //if everthing comes out to be fine the user is present and has a token(that means it is authentic) so we save the data that we want to send in the "req.user"
            req.user=user;  // this will provide the user information to the getuser controller function by modifying the req a little bit
            // console.log(req.user);
            next(); // allow next written code to execute
          }   catch (error) {
            res.status(401);
            throw new Error("Not authorized, please login");

          }
});
module.exports=protect;