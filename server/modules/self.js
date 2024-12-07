const mongoose = require("mongoose");

const selfSchema = new mongoose.Schema({
    amount :{
        type: Number,
        default: 0
    },
    entry:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Entry",
        default:[]
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Self",selfSchema);
