const User = require("../modules/user");
const {uploadImageToCloudinary} = require("../Utils/imageUploader")
const {promisify} = require("util");




exports.getUser = async(req,res) =>{

    try{
        //console.log("Into getuser")
        const userId = req.userId;
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


exports.uploadScanner = async(req,res) =>{
    try{

        const userId = req.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        //console.log("This is request",req.files)

        const scanner = req.files.scanner;
        //console.log("this is scanner",scanner)
        const image = await uploadImageToCloudinary(
            scanner,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        
        user.scanner = image.secure_url;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Image uploaded",
            body:user
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}