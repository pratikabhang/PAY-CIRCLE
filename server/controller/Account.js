const Account = require("../modules/account");
const User = require("../modules/user");
const Entry = require("../modules/entry");
const {promisify} = require("util");
const Self = require("../modules/self");



//#region Account
exports.createAccount = async(req,res)=>{
    try{

        const userId = req.userId;
        const {name} = req.body;
        const {totalAmount} = req.body || 0;
        const {details,note} = req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"Name of account is required"
            })
        }

        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized access"
            })
        }
        const user = await User.findById(userId);

        if(!user){
            return res.status(200).json({
                success:false,
                message:"User does not exist"
            })
        }

        const account = await Account.create({
            userId,
            name,
            totalAmount:0,            
        })

        const accountId = account._id;

        const entry = await Entry.create({
            userId,
            accountId,
            amount:totalAmount,
            details,
            note,
            createAt:Date.now()
        })

        account.totalAmount = totalAmount;
        account.entry.push(entry)
        account.updateAt = Date.now();
        await account.save();


        user.accounts.push(account);
        await user.save();
        await user.populate("accounts");

        return res.status(201).json({
            success:true,
            message:"Account Created Successfully",
            user
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.getAllAccounts = async(req,res)=>{

    try{

        const userId = req.userId;

        const accounts = await Account.find({userId:userId});

        return res.status(200).json({
            success:true,
            body:accounts
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

exports.getAccountById = async(req,res) =>{
    try{

        const id = req.params.id;

        const account = await Account.findById(id).populate("entry");
        //console.log(account)

        return res.status(200).json({
            success:true,
            body:account
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.deleteAccount = async(req,res)=>{
    try{

        const userId = req.userId;
        const id = req.params.id;
       

        await Account.findByIdAndDelete(id);

        const user = await User.findById(userId).populate("accounts");

        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
            body:user
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

// #endregion

// #region Entry
exports.createEntry = async(req,res) =>{

    try{

        const userId = req.userId;
        const {accountId , amount , details , note } = req.body;

        if(!accountId || !amount){
            return res.status(402).json({
                success:false,
                message:"All filds are required"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User does not exists"
            })
        }

        const account = await Account.findById(accountId);
        
        if(!account){
            return res.status(404).json({
                success:false,
                messgage:"Account does not exists"
            })
        }

        const entry = new Entry({
            userId,
            accountId,
            amount,
            details,
            note,
            createAt:Date.now()
        })
        await entry.save();

        account.totalAmount = parseInt(account.totalAmount) + parseInt(amount);
        account.entry.push(entry)
        account.updateAt = Date.now();
        await account.save();

        return res.status(201).json({
            success:true,
            account
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

exports.getEntry = async(req,res)=>{
    try{

        const id = req.params.id;

        if(!id){
            return res.status(402).json({
                success:false,
                message:"Id not found"
            })
        }

        const entry = await Entry.findById(id);

        return res.status(200).json({
            success:true,
            body:entry
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.editEntry = async(req,res)=>{
    try{

        const id = req.params.id;

        const {amount , details , note} = req.body;

        if(!amount && !details && !note){
            return res.status(200).json({
                success:true,
                message:"Updated Successfully"
            })
        }

        const prevEntry = await Entry.findById(id);

        const entry = await Entry.findByIdAndUpdate(id,{
            amount:amount,
            details:details,
            note:note,
            updateAt:Date.now(),
        },{new:true})

        let account = await Account.findById(entry.accountId);
        if(!account){
            account = await Self.findById(entry.accountId);
            account.amount = parseInt(account.amount) - parseInt(prevEntry.amount) + parseInt(amount)
        } 
        else{
            account.totalAmount = parseInt(account.totalAmount) - parseInt(prevEntry.amount) + parseInt(amount)
        }
        await account.save();

        return res.status(200).json({
            success:true,
            message:"Updated",
            body:entry
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.deleteEntry = async(req,res)=>{
    try{

        const userId = req.userId;

        const id = req.params.id;

        const entry = await Entry.findByIdAndDelete(id);

        let account = await Account.findById(entry.accountId);
        if(!account){
            account = await Self.findById(entry.accountId);
            account.amount = parseInt(account.amount) - parseInt(entry.amount)
            account.save();
        }
        else{
            account.totalAmount = parseInt(account.totalAmount) - parseInt(entry.amount);
            //console.log(account);
            await account.save();
        }

        const user = await User.findById(userId).populate("accounts");

        return res.status(200).json({
            success:true,
            message:"Deleted Successfully",
            body:user
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//utility for split
const createEntryForSplit = async(body) =>{
    try{
        const userId = body.userId;
        const {accountId , amount , details , note } = body.body;

        if(!accountId || !amount){
            return res.status(402).json({
                success:false,
                message:"All filds are required"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            console.log("User does not exists")
            return 
        }

        const account = await Account.findById(accountId);
        
        if(!account){
            console.log("ACcount does not exists")
            return
        }

        const entry = new Entry({
            userId,
            accountId,
            amount,
            details,
            note
        })
        await entry.save();

        account.totalAmount = parseInt(account.totalAmount) + parseInt(amount);
        account.entry.push(entry)
        account.updateAt = Date.now();
        await account.save();

    } catch(err){
        console.log(err);
    }
}

exports.split = async(req,res) => {
    try{

        const {amount , details , accounts} = req.body;
        const userId = req.userId;
        const length = accounts.length;

        for(let i = 0;i<accounts.length;i++){
            const body = {
                body : {
                    amount : amount/length,
                    details : details,
                    accountId : accounts[i]
                },
                userId: userId
            }
            await createEntryForSplit(body);
        }
        //console.log(userId);
        const user = await User.findById(userId).populate("accounts");

        return res.status(200).json({
            success:true,
            body:user
        })


    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}