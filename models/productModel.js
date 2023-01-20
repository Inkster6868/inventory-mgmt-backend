const mongoose = require('mongoose');

// for this schema we will need to map the particular users with only the products they have entered in their inventory, so for that we will be referrig to the user.id from the incoming req and attach that id as theuser:"", so this will create a map of user->products.
const productSchema=mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"user"
        },

        name:{
            type:String,
            required:[true,"Please add a name"],  //say customer to enter the name
            trim:true                    //if there is any space around the name entered we will trim it
        },

        sku:{                                // i will need a unique number to identify the product as there may diff product with same names
            type:String,
            required:true,                  // i didnt set a message cause i will myself generate it from the frontend, so it will possibly be there
            default:"SKU",
            trim:true
        },

        category:{
            type:String,
            required:[true,"Please add a category"],
            trim:true
        },

        quantity:{
            type:String,
            required:[true,"Please add a quanitity"],
            trim:true
        },

        price:{
            type:String,
            required:[true,"Please add a price"],
            trim:true
        },

        description:{
            type:String,
            required:[true,"Please add a description"],
            trim:true
        },

        image:{
            type:Object,            //this is going to be a object that contains several properties
            default:{}      //the user may not have a image at that moment so i set it to empty object by default
        }
    },
    {
        timestamps:true,
    }
    );

const Product=mongoose.model("products",productSchema);

module.exports=Product;