const errorHandler=(err,req,res,next)=>{         //we passes err,req,res as arguments to this function, and the next is written to call the next function, as this is a middleware.
const statusCode=res.statusCode ? res.statusCode : 500;   //here what we have done is first checked the status code fo the response, if the error is client error then the code will itself be there, and if there is some server error that is nothng is present in response ka status code toh we say '500' that is server error.
res.status(statusCode);

res.json({
    message:err.message,  
    stack:process.env.NODE_ENV==="development" ? err.stack : null   //'stack' is basically the path/ file where the error is being generated, now it is risky to display the stack info in 'production' environment'. so i create a check with the environment variable that i have in my development machine only. that if it is "development" then only display the err.stack else do not show anything.    
});
};

module.exports=errorHandler;