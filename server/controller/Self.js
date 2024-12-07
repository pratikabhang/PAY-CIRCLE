const Self = require("../modules/self")
const User = require("../modules/user")
const Entry = require("../modules/entry")

exports.getSelf = async(req,res)=>{
    try{

        const userId = req.userId;

        const user = await User.findById(userId);

        const self = await Self.findById(user.selfId).populate("entry");

        return res.status(200).json({
            success:true,
            body:self
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.addEntry = async(req,res)=>{
    try{
        const userId = req.userId;
        const selfId = req.params.selfId;

        const {amount , note , details , category} = req.body;

        const entry = await Entry.create({
            userId,
            accountId:selfId,
            amount,
            note,
            details,
            category
        })

        const self = await Self.findById(selfId);

        self.amount = parseInt(self.amount) + parseInt(amount);
        self.entry.push(entry._id);
        await self.save();

        return res.status(200).json({
            success:true,
            message:"Entry added",
            body: self
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


exports.editEntry = async(req,res) =>{
    try{

        const entryId = req.params.entryId;

        const {amount , note , details } = req.body;

        const prevEntry = await Entry.findById(entryId);

        const self = await Self.findById(prevEntry.accountId);

        const entry = await Entry.findByIdAndUpdate(entryId,{
            amount,
            details,
            note
        })

        self.amount = parseInt(self.amount) - parseInt(prevEntry.amount) + parseInt(amount);
        self.save();

        return res.status(200).json({
            success:true,
            message:"Entry updated",
            body:self
        })

    } catch(err){
        return res.status(200).json({
            success:false,
            message:err.message
        })
    }
}

exports.deleteEntry = async(req,res) =>{
    try{

        const entryId = req.params.entryId;

        const entry = await Entry.findByIdAndDelete(entryId);

        const self = await Self.findById(entry.accountId);

        self.amount = self.amount - entry.amount;
        self.save();

        return res.status(200).json({
            success:true,
            message:"Entry Deleted",
            body:self
        })

    } catch(err){
        return res.statsu(500).json({
            success:true,
            message:err.message
        })
    }
}

exports.roundUp = async(req,res)=>{
    try{
        const userId = req.userId;
        const id = req.params.id;
        const amount = req.body.amount;

        const self = await Self.findById(id);
        const diff = parseInt(amount) - parseInt(self.amount);

        const entry = await Entry.create({
            userId,
            amount:diff,
            accountId:self._id,
            category:"Other"
        })

        self.amount = amount;
        self.entry.push(entry._id)
        self.save();

        return res.status(200).json({
            success:true,
            message:"Roundup successfull",
            body:self
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
