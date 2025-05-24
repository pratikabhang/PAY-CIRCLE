// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('../helper/logger');

// Suppress mongoose strictQuery warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50
}).then(() => {
    logger.info('DB Connection Established');
    console.log('DB Connected');
}).catch(err => {
    logger.error(`DB Connection Fail | ${err.stack}`);
    console.error('DB Connection Error:', err);
});

// ----------------- SCHEMAS -----------------

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

// ----------------- EXPORT MODELS -----------------

module.exports = {
    User: mongoose.model('user', User),
    Group: mongoose.model('group', Group),
    Expense: mongoose.model('expense', Expense),
    Settlement: mongoose.model('settlement', Settlement)
};
