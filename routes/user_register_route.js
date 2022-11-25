const express= require("express");
const router = express.Router();
const User = require('../models/user_register_model');
const {check, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt=require('jsonwebtoken');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/added/insert',
[
    check('fname', "Account first name is required!").not().isEmpty()
],
 function(req, res) {
     const errors = validationResult(req);
     

     if(errors.isEmpty()){
        const fname = req.body.fname;
    const lname = req.body.lname;
    const address = req.body.address;
    const phone_number = req.body.phone_number;
    const username = req.body.username;
    const password = req.body.password; // fetch from client
    const email = req.body.email;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;

    let locationPoints = {"type":"Point","coordinates":[longitude,latitude]}

    bcryptjs.hash(password,10,function(err, hash){
        const data= new User({fname:fname,lname:lname,address:address,phone_number:phone_number,username:username,password:hash,userType:"Buyer",email:email,locationPoint:locationPoints});
        data.save().then((result)=>{
            return res.status(200).json({"success":true,"message":"Registered Successfully","data":result});  
        }).catch((err)=>{
            console.log(err)
            return res.status(404).json({"success":false,"message":err});  
        });
       
    })


    // console.log(pname,pdesc,pprice,pquantity)
    
     }
     else
     {
        return res.status(202).json({"success":false,"message":errors.array()});
     }  
})




//////////////////baki xa mathe token ko garna
///// .catch(function(){
  ///  res.status(500).json(error:e)
//////})


// lets create a login system 

router.post('/funfurnish/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({ username: username })
        .then((customerData) => {
            if (customerData=== null) {
                //email not found
                return res.status(202).json({ success:false,message: "Invalid Credentials!!" })
            }
            bcryptjs.compare(password, customerData.password, (err, result) => {
                if (result === false) {
                    //email not found
                    return res.status(202).json({ success:false,message: "Invalid Credentials!!" })
                }
                //generate token
                const token = jwt.sign({ custId: customerData._id,  username: customerData.username }, 'secretkey')
                return res.status(200).json({ success:true,token: token, message: "Auth success",data:customerData })
           
            })
        })
        .catch((e)=>{
            res.status(500).json({error:e})
        })
})

router.post('/update/details',auth.verifyUser,(req,res)=>{
    
    let fn = req.body['fname'].trim();
    let ln = req.body['lname'].trim();
    let address = req.body['address'].trim();
    let username = req.body['username'].trim();
    let email = req.body['email'].trim();
    
    
     let query1 = User.findOneAndUpdate({"_id":req.user._id},{
                $set:{
                    "fname":fn,
                    "lname":ln,
                    "address":address,
                    "username":username,
                    "email":email
                   
                }
            });
            query1.then((result)=>{
                User.findOne({"_id":result._id})
                .then((data2)=>{
                    return res.status(200).json({"success":true,"message":"Account Details Updated Successfully!!","data":data2});   
                })
               
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            })
        }
       
    
   
)


    
router.put('/change/profilePicture',upload.single('profileImg'),auth.verifyUser,(req,res)=>{
    let imgPath = req.file['path'];
    User.findOneAndUpdate({"_id":req.user._id},{$set:{"profileImg":imgPath}}).then((result)=>{
        User.findOne({"_id":result._id})
        .then((data)=>{
            return res.status(200).json({"success":true,"message":"Profile Picture changed!!","data":data});
        })
        
    }).catch((err)=>{
        return res.status(202).json({"success":false,"message":err});
    })
});











module.exports = router;