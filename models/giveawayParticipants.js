const mongoose = require('mongoose');
const {ObjectId} = require('bson');
const User = require('./user_register_model');
const Giveaway = require('./giveawayModel');


const Participants = mongoose.model('Participants',{
    "user_id":{"type":ObjectId,"ref":User,"required":true},
    "giveaway_id":{"type":ObjectId,"ref":Giveaway,"required":true},
    "participated_at":{"type":String,"required":true},
    "participation_time":{"type":String,"required":true},
    "participatedCode":{"type":String,"required":true}
})

module.exports = Participants;