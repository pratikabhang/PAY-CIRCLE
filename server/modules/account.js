const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    totalAmount:{
        type:Number,
        default:0
    },
    entry:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Entry"
    }],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updateAt:{
        type:Date,
        default:Date.now(),
    }

})

module.exports = mongoose.model("Account",accountSchema);

