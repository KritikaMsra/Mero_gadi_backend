const mongoose = require('mongoose');
const {ObjectId} = require('bson');
const Giveaway = require('./giveawayModel');


const GiveawayWinner = mongoose.model('GiveawayWinner',{
    "giveaway_id":{"type":ObjectId,"required":true,"ref":Giveaway},
    "winners":{"type":String,"required":true},
    "resultGeneratedAt":{"type":String,"required":true},
    "resultTime":{"type":String,"required":true}
})

module.exports = GiveawayWinner;