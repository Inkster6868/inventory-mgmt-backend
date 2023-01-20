const asyncHandler=require('express-async-handler');
const Product = require('../models/productModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;


//CREATE PRODUCT
 const createProduct=asyncHandler(async(req,res)=>{
        const {name, sku, category, quantity, price, description}=req.body;      // i am expecting all this necessary info from the user while creating a product in the inventory, i will not necessarily require the image so i am not destrucring it here, because we will be handling it later on with the help of multer
        //VALIDATE Data
        if(!name || !category || !quantity || !price || !description){     //and i will be generating 'sku' by myself so no need to chck it
            res.status(400)
            throw new Error( "Please fill in all fields")
        }

        //Handle Image Upload(the fileupload function made it easier for us , using the multer, now we just have to handle the input given by it )
        let fileData={}    //we create an empty object initiallyz
        if(req.file){      // so if the 'req' has a file with it, we will check it

            //Save image to cloudinary
            let uploadedFile;
            try {
                uploadedFile= await cloudinary.uploader.upload(req.file.path,{folder:"Inventorymgmt",resource_type:"image"});
                //.upload() takes some args:
                // the first one is the path of file where it is located in the customers device
                //the second is the object which contains two props.. the folder in which we want it to go in the cloudinary platform, and the type of file/resource it is.
            } catch (error) {
                res.status(500)
                throw new Error("image couldn't be uploaded")
            }
                fileData={
                    fileName: req.file.originalname,
                    filePath: uploadedFile.secure_url, // this gives the path of the file on the cloudinary plaform.. an htttps link will be there which can be accesed just by clicking
                    fileType: req.file.mimetype,
                    fileSize: fileSizeFormatter(req.file.size,2)   //we want till 3 decimal places, if not provided the fileformatter will take "2" as default
                    
                }
        }



        //Create Products
        const product= await Product.create({
            user:req.user.id,       //we have added the 'protect' middleware in which it sets the 'req.user' this productController will also have access to it , so we get the id from it of the logged in user
            name,
            sku,
            category,
            quantity,
            price,
            description,
            image: fileData,
        });

        res.status(201).json(product);

 })

//GET ALL PRODUCTS
const getProducts=asyncHandler(async(req,res)=>{
        const products=await Product.find({user: req.user.id}).sort("-createdAt");      // jitne bhi id match krne vale products honge sab dikha do, lekin hummai thoda sort krna hai ki jo product recenlty uodate hua hai vo sabsse pehle dikhe, toh us hisab se kreneg
        //the "-createdAt" minus sign is to sort in reverse order because the latest update product will have the max createdAt but it needs to be displayed first so just revrse it using "-" sign 
        res.status(200).json(products);
})


//GET SINGLE PRODUCT
const getProduct=asyncHandler(async(req,res)=>{
    const product= await Product.findById(req.params.id);
    //if product doesn't exist
    if(!product){
        res.status(404)
        throw new Error("Product not found")
    }

    //checking whether the logged in user is authorised to see the product or not. we can do this by matching the products.theuser to the req.user.id that we will receive
    //converting it to string because in the productModel it is set to objectId type, so in order to compare i am converting it into string
    if(product.user.toString() !== req.user.id){     //ok see now writing' req.user.id'  will also give us the id in string format, but if we write '_id' this is of object type so we also need to convert this to compare. so both of them are object types so we convert them to string and compare
        // console.log(getproduct.theuser.toString())
        // console.log(req.user._id);

        res.status(401)
        throw new Error("User Not authorised")
    }

    //if it passes the above 2 checks then i will send the response
    res.status(200).json(product)
})


//DELETE A PRODUCT
const deleteProduct=asyncHandler(async(req,res)=>{
    //find if the product exists or not
    const product=await Product.findById(req.params.id);  // jo parameter mai ':id' aayegi, ki isse delete kro usse hae krna hoga delete , toh usse check krenge ki exist bhi krrha hai ya nhi
    if(!product) {
        res.status(404)
        throw new Error("No such product found to delete")
    }

    //now if the product exists check whether the user is authorised to delete the product or not, meaning ki uski id->product ke sath linked hai ya nhi humare database mai 
    //NOTE: we have mapped "theuser"->user.id  in the products model, so if that user has that product in his inventory then only he can delete
    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("Not allowed to delete this product! Please add this in your inventory first")
    }
    await product.remove(); // if the user has the product in their inventory then remove it 
    res.status(200).send({message:"Product Deleted."});
});

//UPDATE PRODUCT
const updateProduct=asyncHandler(async(req,res)=>{
    const {name, category, quantity, price, description}=req.body;      // i am expecting all this necessary info from the user while updating a product in the inventory
    // console.log(req.body);  
    const{id}=req.params;
    //we will be getting a :id from the URL which we will use to find the product in our databse
    const product=await Product.findById(id);

    //if product doesn't exist
    if(!product) {
        res.status(404)
        throw new Error("No such product found to update")
    }

    // now check if the user is allowed, meaning whether he has this product inside his inventory or not to update it.
    if(product.user.toString()!== req.user.id){
        res.status(401)
        throw new Error("Not allowed to update this product! Please add this in your inventory first")
    }

    //if the req also has a file to update then we will handle it the same way we did it earlier while creating the product.
    //Handle Image Upload(the fileupload function made it easier for us , using the multer, now we just have to handle the input given by it )
    let fileData={}    //we create an empty object initially,
    if(req.file){      // so if the 'req' has a file with it, we will check it

        //Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile= await cloudinary.uploader.upload(req.file.path,{folder:"updatedfile",resource_type:"image"});
            //.upload() takes some args:
            // the first one is the path of file where it is located in the customers device
            //the second is the object which contains two props.. the folder in which we want it to go in the cloudinary platform, and the type of file/resource it is.
        } catch (error) {
            res.status(500)
            throw new Error("image couldn't be uploaded")
        }
            fileData={
                fileName:req.file.originalname,
                filePath:uploadedFile.secure_url, // this gives the path of the file on the cloudinary plaform.. an htttps link will be there which can be accesed just by clicking
                fileType:req.file.mimetype,
                fileSize:fileSizeFormatter(req.file.size,2)   //we want till 3 decimal places, if not provided the fileformatter will take "2" as default
                
            }
    }

            //updatedProduct

            const updatedProduct= await Product.findByIdAndUpdate({_id:id},  
                {name,
                // sku,  we dont want the sku to change , because this will be unique and will be generated by us
                category,  // suppose the user doesnt send any of the field so, this will not have any properrty named quantitiy in the req.body so it will not update anything 
                quantity,
                price,
                description,
                image:Object.keys(fileData).length === 0  ? product.image : fileData         //there may be a case where the user doesnt upload a new image of the product while updating , so our fileData is empty at that moment, so we check that if its length is equal to 0 so keep the previous image only and if it is not '0' that means the user has sent a file to be udated so we update with it
                },
                {  
                    new:true,            //new means i am adding a new property 
                    runValidators:true    //this will run all the validators that we set in the mongoose --> required[true] like these ones
                }
            ) ;
    res.status(200).json(updatedProduct);

})

 module.exports={
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
 }