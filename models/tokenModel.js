const mongoose = require('mongoose');

const tokenSchema=mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,  // this is how we define the 'type' if we want the '_id' property of some other databse 
            required: true,
            ref: "user"    //referring to the consumers database which has the 'user' schema
        },

        token:{
            type:String,
            required:true,
        },

        createdAt:{
            type:Date,
            required:true
        },

        expiresAt:{
            type: Date,
            required:true
        }
});

const Token=mongoose.model("ForgotValidate",tokenSchema);

module.exports=Token;