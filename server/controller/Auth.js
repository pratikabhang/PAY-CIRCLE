const User = require("../modules/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Self = require("../modules/self.js");


exports.signup = async(req,res)=>{
    try{

        const {name, email ,password , confirmPassword} = req.body;
        console.log("TIl here")
        const user = await User.findOne({email});
        console.log(user);
        if(user){
            console.log("goingi here")
            return res.status(409).json({message:"User already exists"})
        }
        console.log("not ehre")

        if(password !== confirmPassword){
            return res.status(409).json({
                success:false,
                message:"Password does not match"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        console.log("got here")

        const self = await Self.create({
            amount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

         
        const savedUser = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
            selfId:self._id
        })

        console.log(savedUser)

        //send verification email -> will handle this later
        //await sendEmail({email, emailType: "VERIFY",userId:savedUser._id})

        return res.status(201).json({
            success:true,
            savedUser
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


exports.login = async(req,res) =>{

    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(402).json({
                success:false,
                message:"All fileds are reqired",
            })
        }

        const user =  await User.findOne({email});

        if(!user){
            return res.status(402).json({
                success:false,
                message:"User does not exit",
            })
        }

        //we  can check passwords  directly using  if else and bcrrytp compare  fuction
        if(await bcrypt.compare(password,user.password) ){

            const token = jwt.sign({
                email:user.email,id:user._id,role:user.role
            },
            process.env.JWT_SECRET, 
            {
                expiresIn: "365d",
            }
            );

            //check here there may be any parsing  error  with object 
            user.toObject();
            user.token  = token;
            user.password = undefined;
            
            const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			return res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});

        }
        else{
            return res.status(400).json({
                success:"false",
                message:"Password does not match",
            })
        }

    }
    catch(err){
        return  res.status(500).json({
            success:false,
            message:err.message,
        })
    }
    
}


exports.logout = async(req,res)=>{

    try{

        const userId = req.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(402).json({
                success:false,
                message:'User not found'
            })
        }

        return res.status(200).json({
            statsu:True,
            message:"Logout is not yet implemented"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}
