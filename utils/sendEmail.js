const nodemailer = require('nodemailer');
const asynchandler = require('express-async-handler');

const sendEmail= asynchandler(async(subject, message, send_to, sent_from,reply_to)=>{
        //we first create a transporter that helps us to transport the required credentials for sending email to user
        console.log(subject);
        console.log(message);
        console.log(send_to);
        console.log(sent_from);

        //TRANSPORTER
        const transporter=nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:587,                      //according to the documentation of the nodemailer this has to be the port given to it 
            auth:{                         //this is the fuel/authentication that nodemailer will use to send the emails to desired users, basically our id's credential
                user:process.env.EMAIL_USER, 
                pass:process.env.EMAIL_PASS
            },
            tls:{                            //trasnport layer security // this is not neccesarry, but we might get into a problem with some platform sending emails over the security methods such as 'http' or 'https', so in order to prevent them , that in future they never occur we write this
                rejectUnauthorized:false
                //IMP:://Do not fail on invalid certificates, this will open a connection to Transport Layer Security (TLS) with self signed or invalid certs. it is important so that the email sending doesnt hinder 
            }
        })


        //OPTIONS FOR SENDING EMAIL(https://nodemailer.com/message/)
        const options ={                      //this contains all the info that we need to send like fron where did email came, whom to send, the subject,message etc.
             from:sent_from,
             to:send_to,
             replyTo:reply_to, 
             subject:subject,
             html:message ,                       //i want to send message as a html script so i specify like this
                                
        }


    //SEND EMAIL AND ACKNOWLEDGE WHETHER RECEIVED OR NOT 
    transporter.sendMail(options,function (err,info) {    // if the email was sent succesfully it will be in the 'info' parameter if not then in 'err' parameter
        if(err) {
            console.log(err)}

        else{ console.log(info)}
        
    });

});

//This transporter function that we wrote would connect to a SMTP server separately for every single message.
//SMTP-->Simple mail transfer protocol

module.exports=sendEmail;

    

