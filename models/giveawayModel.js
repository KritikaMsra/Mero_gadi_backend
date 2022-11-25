const mongoose = require('mongoose');

const Giveaway = mongoose.model('Giveaway',{
    "sponsor":{"type":String,"required":true},
    "quantity":{"type":Number,"required":true},
    "giveAwayCode":{"type":String,required:true},
    "startingFrom":{"type":String,"required":true},
    "endAt":{"type":String,"required":true},
    "status":{"type":String,"required":true,enum:['Starting Soon','Ongoing','Finished','Result Out']},
    "resultAt":{'type':String,"required":true},
    "notificationSent":{"type":Boolean,"required":true,'default':false},
    "image":{"type":String,"required":false,"default":"no-img.jpg"},
    "mergedItem":{"type":String,"required":true},
    "mergedQuantity":{"type":String,"required":true},
    "item":{"type":String,"required":true}
    
})

module.exports = Giveaway;

