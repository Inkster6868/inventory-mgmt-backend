const asyncHandler=require("express-async-handler");
const User = require("../models/userModels");
const sendEmail = require("../utils/sendEmail");

const contactUs=asyncHandler(async(req,res)=>{
        //so in contact us page we are expecting 2 things from the user 1.)subject 2.)message  so we are going to destructure it
        const{subject,message}=req.body;
        
        //now we are going to find the user by the id
        const user=await User.findById(req.user._id);   //req.user will be provided by the protect route

        if(!user){
            res.status(400)
            throw new Error("User not found,Please signup");
        }

        //Validation
        if(!subject || !message){
            res.status(400)
            throw new Error("Please add a subject and a message");
        }


            //now we want to receive the email , and also we cannot login from the clients account, so both sent and from are our emails only, no isssue in that
            //we will add an extra reply_to email, to identify to whom do we have to reply and also it will be recognnised that who sent this email
            const send_to=process.env.EMAIL_USER;
            const sent_from=process.env.EMAIL_USER;
            const reply_to=user.email;
        try {
            await sendEmail(subject, message, send_to, sent_from, reply_to);  //we will not be sending the reply_to email , it will work fine
            res.status(200).json({
                success:true,   
                message:"Email sent"
            })
           } catch (error) {
                res.status(500)
                throw new Error("Email not sent, Please try again")
                //there might be several reasons that we get error maybe our ISP is blaclisted or the IP that we are currenlty on is blacklisted, and many more reasons, so we will catch that error using this try catch block
           } 
});

module.exports={
    contactUs
}