const jwt = require('jsonwebtoken')
const user = require('../models/user_register_model');


module.exports.verifyUser = ((req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodeData = jwt.verify(token, 'secretkey');
            user.findOne({_id : decodeData.custId})
            .then(function(alldata){
                
                req.user = alldata;
                next();
            })
                .catch(function(e){
                    res.status(401).json({error : e})
                })
           
        }catch(err){
            
            res.status(202).json({error:err,"success":false})

        }
})



// next guard for adin 

module.exports.verifyAdmin = function(req,res,next){
    if(!req.user){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType !== 'Admin'){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    next();
}

// next guard for buyer

module.exports.verifyBuyer = function(req,res,next){
    if(!req.user){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType !== 'Buyer'){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    next();
}

// next guard for seller

module.exports.verifySeller = function(req,res,next){
    if(!req.user){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType !== 'Seller'){
        return res.status(202).json({message : "Unauthorized User!"})
    }
    next();
}