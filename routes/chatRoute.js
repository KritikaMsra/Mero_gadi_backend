const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel')
const auth = require('../middleware/auth');
const {check,validationResult} = require('express-validator')
const {getFormattedToday} = require('../utils/utils')
const moment = require('moment');
const User = require('../models/user_register_model');

router.post('/sendMessage',auth.verifyUser,
[
    check('message',"Please enter a message").not().isEmpty()
]
,(req,res)=>{
    let errors = validationResult(req);
    
    let receiver = req.body['receiverId'];
    let message = req.body['message'].trim();
    console.log(message)
    
    if(errors.isEmpty())
    {
        const msgObj = new Chat({
            "sender":req.user._id,
            "receiver":receiver,
            "message":message,
            "interactionAt":new Date(),
            "dateAndTime":moment().format("Do MMMM YYYY, h:mm a"),
            "date2":getFormattedToday(new Date())
        })
        
        msgObj.save()
        .then((result)=>{
            Chat.findOne({"_id":result._id})
            .populate({
                "path":"sender",
                "select":["username"]
            })
            .populate({
                "path":"receiver",
                "select":["username"]
            })
            .then((data1)=>{
                return res.status(200).json({"success":true,"message":"Sent","data":data1});
            })
            .catch((err)=>{
                console.log(err)
                return res.status(404).json({"success":false,"message":err});
            })
            
        })
        .catch((err)=>{
            console.log(err)
            return res.status(404).json({"success":false,"message":err});
        })
    }
    else {
        return res.status(202).json({"success":false,"message":errors.array()[0].msg});
    }
})


router.post('/getChatMessages',auth.verifyUser, async (req,res)=>{
    let receiver = req.body['receiver']
    if(receiver != "")
    {
        let messages = await Chat.find({$or:[{"sender":req.user._id,"receiver":receiver},{"receiver":req.user._id,"sender":receiver}]})
    .populate({
        "path":"sender",
        "select":['username']
    })
    .populate({
        "path":"receiver",
        "select":["username"]
    })
    .sort({
        "interactionAt":1
    })
    .catch((err)=>{
        console.log(err)
        return res.status(404).json({"success":false,"message":err});
    })

    if(messages.length > 0)
    {
        Chat.updateMany({"receiver":req.user._id,"sender":receiver,"receiverStatus":"Not Seen"},{$set:{"receiverStatus":`Seen At ${moment().format('Do MMMM YYYY, h:mm a')}`}})
        .then((result)=>{

        })
        .catch((err)=>{
            console.log(err);
            return res.status(404).json({"success":false,"message":err});
        })
        
        var eyeball ="Not Seen"; 
        
        if(messages[messages.length-1].sender._id.toString() == req.user._id.toString() && messages[messages.length-1].receiverStatus.startsWith("Seen"))
        {
            eyeball = messages[messages.length-1].receiverStatus;
        }

        return res.status(200).json({"success":true,"message":`${messages.length} data obtained.`,"data":messages,"eyeball":eyeball})
    }
    else {
        return res.status(202).json({"success":false,"message":`${messages.length} data obtained.`})
    }
    }
    else {
        return res.status(202).json({"success":false,"message":`No Data`})
    }
    
})


router.get('/fetchMyUnseen',auth.verifyUser,(req,res)=>{
    Chat.distinct('sender',{"receiver":req.user._id,"receiverStatus":"Not Seen"})
    .then(async (data)=>{
        if(data.length > 0)
        {
            var dataUnseen = {};
            for(var i of data)
            {
              var count = await Chat.find({"sender":i,"receiver":req.user._id,"receiverStatus":"Not Seen"}).countDocuments({})
                .catch((err)=>{
                    return res.status(404).json({"success":false,"message":err});
                })
              
                dataUnseen[i] = count
                
            }
            
            return res.status(200).json({"success":true,"message":`${Object.keys(dataUnseen).length} users are waiting for your respond.`,"data":dataUnseen})
        }
        else
        {
            return res.status(202).json({"success":false,"message":"No Records","data":{}});
        }
    })
    .catch((err)=>{
        return res.status(404).json({"success":false,"message":err});
    })
})


router.get('/myInteractions',auth.verifyUser,async (req,res)=>{
    Chat.find({$or:[{"receiver":req.user._id},{"sender":req.user._id}]})
    .sort({
        "interactionAt":-1
    })
    .then(async (data)=>{
        if(data.length > 0)
        {
            let myInteractions = [];
            let userInfo = [];
           
            
            myInteractions.push(...data.map((val)=>{return val.receiver.toString()}));
            myInteractions.push(...data.map((val)=>{return val.sender.toString()}));
            myInteractions = Array.from(new Set(myInteractions));
            let mySelfIndex = myInteractions.indexOf(req.user._id.toString());
            if(mySelfIndex >= 0)
            {
                myInteractions.splice(mySelfIndex,1);
            }
           
            for(var i of myInteractions)
            {
               
              let data = await User.findOne({"_id":i})
               .catch((err)=>{
                    return res.status(404).json({"success":false,"message":err});
                })

              if(data != null)
              {
                  userInfo.push(data);
              }   
            }
            return res.status(200).json({"success":true,"message":`${myInteractions.length} users found`,"data":userInfo})
        }
        else {
            return res.status(202).json({"success":false,"message":"No Records"})
        }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(404).json({"success":false,"message":err});
    })
})



router.get('/fetchAllUsers',auth.verifyUser,async (req,res)=>{
    try
    {
        let myCoordinates = req.user.locationPoint.coordinates;
        let users = await User.aggregate([
            {
                $geoNear:
                {
                    "near":{"type":"Point","coordinates":myCoordinates},
                    "maxDistance":200000,
                    "distanceMultiplier": 0.001,
                    "query":{"_id":{$ne:req.user._id}},
                    "distanceField":"dist.calculated",
                    "includeLocs":"dist.location",
                    "spherical":true,
                    
                }
            },
            {
                $sort:{
                    "distanceField":1
                }
            }
        ])

      
        

        // let users = await User.find({"_id":{$ne:req.user._id}})
        if(users.length > 0)
        {
            return res.status(200).json({"success":true,"message":`${users.length} data found.`,"data":users})
        }
        else
        {
            return res.status(202).json({"success":false,"message":"0 records found."})
        }
    }
    catch(err)
    {
        
        console.log(err)
        return res.status(404).json({"success":false,"message":err});
    }
})

router.post('/fetchAllUsers2',auth.verifyUser,async (req,res)=>{
    try
    {
        let myCoordinates = [req.body['latitude'],req.body['longitude']];
        let users = await User.aggregate([
            {
                $geoNear:
                {
                    "near":{"type":"Point","coordinates":myCoordinates},
                    "minDistance":2000,
                    "distanceMultiplier": 0.001,
                    "query":{"_id":{$ne:req.user._id}},
                    "distanceField":"dist.calculated",
                    "includeLocs":"dist.location",
                    "spherical":true,
                    
                }
            },
            {
                $sort:{
                    "distanceField":1
                }
            }
        ])

      
        

        // let users = await User.find({"_id":{$ne:req.user._id}})
        if(users.length > 0)
        {
            return res.status(200).json({"success":true,"message":`${users.length} data found.`,"data":users})
        }
        else
        {
            return res.status(202).json({"success":false,"message":"0 records found."})
        }
    }
    catch(err)
    {
        
        console.log(err)
        return res.status(404).json({"success":false,"message":err});
    }
})


module.exports = router;