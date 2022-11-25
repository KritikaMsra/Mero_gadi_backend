const mongoose = require('mongoose');
const {ObjectId} = require('bson');
const User = require('./user_register_model');

const HireMe = mongoose.model('HireMe',{
    "userId":{"type":ObjectId,"required":true,"ref":User},
    "todayWorks":{"type":Number,"required":true,"default":0},
    "createdAt":{"type":String,"required":true},
    "hiredBy":[{
        "type":ObjectId,
        "ref":User
    }],
    "fullName":{"type":String,"required":true},
    "address":{"type":String,"required":true},
    "contact":{"type":String,"required":true},
    "userPhoto":{"type":String,"required":true,"default":"no-img.jpg"},
    "email":{"type":String,"required":true},
    "fee":{"type":Number,'required':true}
})

module.exports = HireMe;