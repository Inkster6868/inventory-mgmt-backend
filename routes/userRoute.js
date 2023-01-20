const express=require('express');
const {registerUser,loginUser,logout,getUser, loginStatus, updateUser, changePassword, forgotPassword, resetPassword}  = require('../controllers/userController');  // when importing some function write the name as it is and {} inside this as it is(preferrably).
const protect = require('../middleWare/authMiddleware');

const router=express.Router();  //https://expressjs.com/en/guide/routing.html
// A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
// The following example creates a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.


router.post('/register',registerUser);  //whenever i get this endpoint at the end of the base url from where this is being accesed i call the registerUser handle
router.post('/login',loginUser);

router.get('/logout',logout);
router.get('/getuser',protect,getUser);//getUser will now have the information of the user through 'req.user' that we set in the 'protect' middleware. we just modified the req a little bit before getting it reached to the getUser function, just to perform some validation checks so that any unauthorised/not logged in user should not be able to get details of anyone   
router.get('/loggedin',loginStatus); 

router.patch('/updateuser',protect,updateUser);  // i also want my update user page to be acceses by someone who is a authorised user
router.patch('/changepassword',protect,changePassword);
router.post('/forgotpassword',forgotPassword);  //this is not going to be protected as we want users to access this when they are logged out also, because they cant remember their there pass so they wont be able to authenticate themselves
router.put('/resetpassword/:resetToken',resetPassword)  //when the user clicks on the reset password link which we sent him through "email" he will be redirected here, the link will basically contain 2 tings.. one is the 'URL' and the other will be the resettoken that we sent .

module.exports=router;