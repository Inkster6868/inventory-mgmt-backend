const express = require('express');
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct} = require('../controllers/productsController');
const protect = require('../middleWare/authMiddleware');
const { upload } = require('../utils/fileUpload');  //code for destination,storage setting of the images received
const router=express.Router();


router.post("/",protect,upload.single("image"),createProduct);
router.patch("/:id",protect,upload.single("image"),updateProduct);     //we will be updating only that product which we will be getting from the ":id".
router.get("/",protect,getProducts);
router.get("/:id",protect,getProduct);   // we will grab the single product by the id 
//so i will tell him to first go to the 'upload' function then visit the 'createProduct'
//also if we want too upload single file we use '.single()' if we want upload multiple files we use '.array()'

router.delete("/:id",protect,deleteProduct);

module.exports=router;