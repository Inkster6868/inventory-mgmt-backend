const multer=require("multer");

//THIS FILE IS WRITTEN IN A CERTAIN FORMAT , TAKEN FROM THE "multer npm packages",please refer to it in case of any difficulty
//Define file storage
// The disk storage engine gives you full control on storing files to disk.

//filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
//The 'diskStorage' engine gives you full control on storing files to disk
// Each function gets passed both the request (req) and some information about the file (file) to aid with the decision.
const storage = multer.diskStorage({              //we set the path where to store the received files in our system. destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.
    destination: function (req, file, cb) {
      cb(null, 'uploads')           //leave the first arg(it is foe error handling in node js), the second tells the path where to point at while storing it, so we need to create that folder inside the workspace. inside that folder the files which the client uploads are saved 
    },

    filename: function (req, file, cb) {        // this tells what should be the name of the file when it is being uploaded in our system/folder.
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)--> this is just written to make the filenames unique but we will make them unique our own way.
      cb(null,new  Date().toISOString().replace(/:/g,"-")+"-"+file.originalname);         //leave the first field to be "null" the second is the name of the file that we have to send back , so we will make it unique and then send it back
        //toISOString() returns a date as string, using the ISO standard:eg:- 2023-01-15T20:41:38.118Z,
        //now it is very very very imp to replace all the ":" with '-', or else the path creates an error in being found out,
        //so we globally replace ":" with "-". now it works absolutely fine
        // so the file name will always be unique in this case.
        //originalname is the name of file that is stored in our computer, we will get it from there
    }
  });

    //Specify File Format(because i dont want user to input any malcious files so i will use the filefilter function, so that files of only specified formats can be accepted) (i only want to store jpg,png,jpeg types of files)
    function fileFilter (req, file, cb) {
        if(
            file.mimetype=== "image/jpg" ||                    //mimetype means the type of file. so if the file's extension is amongst any of them
            file.mimetype=== "image/png" ||
            file.mimetype=== "image/jpeg" ){

             // The function should call `cb` with a boolean
             // to indicate if the file should be accepted

            // To accept the file pass `true`, like so, if the file is any of the above type we want it to be accepted , so we call the cb like this
            cb(null, true);
            }else{
        // To reject this file pass `false`, like so:
        cb(null, false) ;
            }
      
        // // You can always pass an error if something goes wrong:
        // cb(new Error('I don\'t have a clue!'))
        }


//so basically here we are defining the properties to multer before uploading, the storage and the filters that need to be applied
  const upload = multer({ storage, fileFilter })   //though is the key and value have same names we can just write them singly, but for viewers easiness we wrote like this

   //FILE SIZE FORMATTER(COPIED) we will export it along upload so that we can use it wherver we want
   const fileSizeFormatter=(bytes,decimal)=>{
    if(bytes===0){           //simply
        return "0 bytes";
    }
    //refer to mdn docs or your phones saved articles for this 
    // console.log(bytes);
    const dm=decimal ||2;    //if decimal places are given while calling this function then it is ok otherwise we take(2) as default
    const sizes=["Bytes","KB","MB","GB","TB","PB","EB","YB","ZB"];
    const index=Math.floor(Math.log(bytes)/Math.log(1000));
    // console.log(Math.log(1048576))
    // console.log(Math.log(1000))
    // console.log((Math.log(bytes)/Math.log(1000)))
    return(
        parseFloat((bytes/Math.pow(1000,index)).toFixed(dm)+" "+sizes[index])
    )
   }

  module.exports={upload,fileSizeFormatter};