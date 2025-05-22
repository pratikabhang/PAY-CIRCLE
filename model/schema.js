const mongoose = require('mongoose');
const logger = require('../helper/logger');

// Handle strictQuery deprecation warning
mongoose.set('strictQuery', true);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, 
    // Optional settings for future use
    // {
    //     maxPoolSize: 50,
    //     wtimeoutMS: 2500,
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }
)
.then(() => {
    logger.info(`DB Connection Established`);
    console.log("DB Connected");
})
.catch(err => {
    logger.error(`DB Connection Fail | ${err.stack}`);
    console.log(err);
});

// User Schema
const User = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Group Schema
const Group = new mongoose.Schema({
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    groupCurrency: { type: String, default: "INR" },
    groupOwner: { type: String, required: true },
    groupMembers: { type: Array, required: true },
    groupCategory: { type: String, default: "Others" },
    groupTotal: { type: Number, default: 0 },
    split: { type: Array }
});

// Expense Schema
const Expense = new mongoose.Schema({
    groupId: { type: String, required: true },
    expenseName: { type: String, required: true },
    expenseDescription: { type: String },
    expenseAmount: { type: Number, required: true },
    expenseCategory: { type: String, default: "Others" },
    expenseCurrency: { type: String, default: "INR" },
    expenseDate: { type: Date, default: Date.now },
    expenseOwner: { type: String, required: true },
    expenseMembers: { type: Array, required: true },
    expensePerMember: { type: Number, required: true },
    expenseType: { type: String, default: "Cash" }
});

// Settlement Schema
const Settlement = new mongoose.Schema({
    groupId: { type: String, required: true },
    settleTo: { type: String, required: true },
    settleFrom: { type: String, required: true },
    settleDate: { type: String, required: true },
    settleAmount: { type: Number, required: true }
});

// Export models
module.exports.Expense = mongoose.model('expense', Expense);
module.exports.User = mongoose.model('user', User);
module.exports.Group = mongoose.model('group', Group);
module.exports.Settlement = mongoose.model('settlement', Settlement);
