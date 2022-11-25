const mongoose = require('mongoose');
const {ObjectId} = require('bson');
const User = require('./user_register_model');

 
const Chat = mongoose.model("Chat",{
    sender :{"type":ObjectId,"required":true,"ref":User},
    receiver : {"type":ObjectId,"required":true,"ref":User},
    interactionAt:{"type":Date,"required":true},
    dateAndTime:{"type":String,"required":true},
    receiverStatus:{"type":String,"default":"Not Seen","required":true},
    message:{"type":String,"required":true},
    unsent:{"type":Boolean,"default":false,"required":true},
    date2:{"type":String,"required":true}
})
 
module.exports = Chat;