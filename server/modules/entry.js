const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    accountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true
    },      
    amount:{
        type:Number,
        required:true
    },
    details:{
        type:String,
        default:""
    },
    note:{
        type:String,
        default:""
    },
    category:{
        type:String,
        default:""
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    updateAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model("Entry",entrySchema);

