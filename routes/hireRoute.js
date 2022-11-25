const express = require('express');
const router = express.Router();
const HireMe = require('../models/hireMeModel');
const auth = require('../middleware/auth')
const upload = require('../middleware/upload');
const {check,validationResult} = require('express-validator');
const {getCustomizedError,getFormattedToday,getTimeValue} = require('../utils/utils')
const {sendMailMessage} = require('../utils/mail')


router.post('/addMeForWork',upload.single('profile'),auth.verifyUser,[
    check('fullName',"Full Name cannot be left empty.").not().isEmpty(),
    check('address',"Address cannot be left empty.").not().isEmpty(),
    check('contact','Contact cannot be left empty.').not().isEmpty(),
    check('email','Email cannot be left empty.').not().isEmpty(),
    check('fee','Fee cannot be left empty.').not().isEmpty(),
    check('contact','Contact cannot have any alphabet characters.').isNumeric(),
    check('contact','Invalid contact length.').isLength({"min":10,"max":10})
], async (req,res)=>{
    try
    {
      
        let errors = validationResult(req);
        if(errors.isEmpty())
        {
            let fullName = req.body['fullName'].trim();
            let address = req.body['address'].trim();
            let contact = req.body['contact'].trim();
            let email = req.body['email'].trim();
            let fee = parseInt(req.body['fee']);

            if(req.file == undefined)
            {
                return res.status(202).json({"success":false,"message":"Inappropriate file.","error":{"profile":"Inappropriate file."}})
            }

            let myHiring = await HireMe.findOne({"userId":req.user._id});
            let totalHired = await HireMe.find({})
            if(myHiring != null)
            {
                return res.status(202).json({"successs":false,"message":"You have already listed yourself.","error":{"random":"You have already listed yourself."}})
            }
            else
            {
                let emailContainer = totalHired.map((val)=>{return val.email});
                let errorBox = {};
                if(emailContainer.includes(email))
                {
                    errorBox['email'] = "Email Address already registered."
                }

                if(Object.keys(errorBox).length > 0)
                {
                    return res.status(202).json({"success":false,"message":"Certain Error Found.","error":errorBox})
                }

                let emailBox = [];

               if(req.user.email != email)
               {
                  emailBox.push(...[req.user.email,email])
               }
               else
               {
                   emailBox.push(req.user.email)
               }


               const hireObj = new HireMe({
                   "createdAt":getFormattedToday(new Date()),
                   "fullName":fullName,
                   "address":address,
                   "contact":contact,
                   "userPhoto":req.file.path,
                   "email":email,
                   "fee":fee,
                   "userId":req.user._id
               })

               hireObj.save()
               .then((result)=>{
                let content = {
                    "heading":"You are listed in a work!!",
                    "greeting":getTimeValue()+",",
                    "message": `Work honestly and earn your respect and get more jobs.`,
                    "task":"Hire"
                }
                   for(var i of emailBox)
                   {
                    sendMailMessage("FunFurnish",i,content);
                   }
                   return res.status(200).json({"success":true,"message":"You are added for the work."})
               })
               .catch((err)=>{
                   return res.status(404).json({"success":false,"message":err})
               })
               
            }


        }
        else
        {
            let customizedError = getCustomizedError(errors.array());
            return res.status(202).json({"success":false,"message":"Certain errors found.","error":customizedError});
        }
        
    }
    catch(err)
    {
        console.log(err)
        return res.status(404).json({"success":false,"message":err})
    }
})



router.get('/getWorkers',async(req,res)=>{
    try
    {   
        let workers = await HireMe.find({});
        if(workers.length>0)
        {
            return res.status(200).json({"success":true,"message":`${workers.length} Repairman found`,"data":workers});
        }
        else
        {
            return res.status(202).json({"success":false,"message":"0 repairman found."})
        }
    }
    catch(err)
    {
        return res.status(404).json({"success":false,"message":err})
    }
})


module.exports = router;