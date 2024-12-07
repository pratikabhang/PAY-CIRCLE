const express = require('express');
const app = express();

const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const database = require('./config/dbconfig');
const cors = require("cors")
const fileUpload = require("express-fileupload")
const {cloudinaryConnect} = require("./config/cloudinary");
const authRouter = require("./route/auth");
const accountRouter = require("./route/account");
const selfRouter = require("./route/self");

database.connect();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
 		credentials:true,
    })
)

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

cloudinaryConnect();

app.use("/auth",authRouter);
app.use("/account",accountRouter);
app.use("/self",selfRouter);
app.use("/hailing",(req,res)=>{
    //console.log("hailing route");
    return res.status(200).json({
        success:true,
        message:"hailing route",
    })
})

app.get("/",()=>{
    return `<h1>Working..</h1>`
})

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})

const axios = require('axios');

function callSelfApi() {
    axios.get('https://mtracker-0sct.onrender.com/hailing')
        .then(response => {
            console.log('API Response:', response.data);
        })
        .catch(error => {
            console.error('Error calling API:', error.message);
        });
}


function scheduleApiCall() {
    callSelfApi(); 
    setInterval(callSelfApi, 14 * 60 * 1000);
}


scheduleApiCall();

