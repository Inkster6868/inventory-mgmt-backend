const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');

//define schema
const userSchema=mongoose.Schema({
        name:{
            type:String,
        require:[true,"please add a name"]},  //here we set the require to true, if the user doesnt enter anything and the request comes back to us we will send the second entry of the array to the user, it is also necessary to pass the message  "please add a name" to the frontend, because suppose the user clicks submit and on the frontend there is no message shown to him, then he will contniously press the button and create unnecesary requests/load on the backend.
        
        email:{
            type:String,
            require:[true,"please add an email"],  // if not given then second argument will go to user
            unique:true,  // the email should be unique for every user, you cannot create more than 1 account with the same email, or even if we update the email of a user to some email slready present in the database then also it will show duplicate keys error
            trim:true,  //it removes all the whitespaces from both the ends of the string 
            match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"please enter a valid email addres"]
            //we use match to match the email pattern with the 0th entry that we provided, noow id it doesnt match it will again send a message to the frontend
            
        },

        password:{
            type:String,
            require:[true,"please enter the password"],
            minLength:[6,"enter password upto 6 characters long"],
            // maxLength:[23,"password must not be more than 23 chars long"], // also a reason to keep password this long only is that ,someusers might try to enter malcious strings through the input box, to affect the query running(typically seen in SQL databases).
            //we need to hash and store the pass,but after hashing the pass length exceedss 23 chars so we comment this validation here and we can apply this validation on the frontend.
        },
        photo:{
            type:String,
            require:[true,"please upload a photo"],
            default:"https://i.ibb.co/4pDNDk1/avatar.png"  //its not good to force user to upload a photo and then only allow him, so we keep default option, that by default this image will be there
        },
        
        phone:{
            type:String,
            default:"+999"
        },

        bio:{
            type:String,
            maxLength:[250,"characters should not be more than 50"],
            default:"bio"
        }

},
{
    timestamps:true,
})  //this will add 2 properties  i.e 'creartedAt' and 'updatedAt' property to every entry inside the schema.


//encrypting the pass before saving it into the db.
userSchema.pre("save",async function(next){

    //now the user when editing profile will not always change the pass, so i do not want to unnnecesarily hash the passsword , so i will check whether the password has been modified or not if not then return nect(), i.e simply execute the next lines of code written after this fucntion 
    if(!this.isModified('password')){
        return next();    
    }

const salt= await bcrypt.genSalt(10);  // salt is basically a 'random value' that is generated and is hardly ever the same when generated, so it 
const hashedPassword= await bcrypt.hash(this.password,salt);  //now we hash the original pass with the 'salt' so that it is hard for the attacker to crack  .. for referring to the password of this schema we write this.password
this.password=hashedPassword;
next(); //tranfer execution
});            

// https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-model
const User =mongoose.model("consumers",userSchema); //tell the collection to which this schema is to be applied

module.exports=User;   //exporting the schema.