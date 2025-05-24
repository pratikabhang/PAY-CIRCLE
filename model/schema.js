// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('../helper/logger'); // Adjust path as needed

// Suppress mongoose strictQuery warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50
}).then(() => {
    logger.info('✅ DB Connection Established');
    console.log('✅ DB Connected');
}).catch(err => {
    logger.error(`❌ DB Connection Failed | ${err.stack}`);
    console.error('❌ DB Connection Error:', err);
});

// ----------------- SCHEMAS -----------------

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Group Schema
const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    groupCurrency: { type: String, default: "INR" },
    groupOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    groupCategory: { type: String, default: "Others" },
    groupTotal: { type: Number, default: 0 },
    split: [{ type: mongoose.Schema.Types.Mixed }] // Adjust to structured object if needed
}, { timestamps: true });

// Expense Schema
const expenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
    expenseName: { type: String, required: true },
    expenseDescription: { type: String },
    expenseAmount: { type: Number, required: true },
    expenseCategory: { type: String, default: "Others" },
    expenseCurrency: { type: String, default: "INR" },
    expenseDate: { type: Date, default: Date.now },
    expenseOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    expenseMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    expensePerMember: { type: Number, required: true },
    expenseType: { type: String, default: "Cash" }
}, { timestamps: true });

// Settlement Schema
const settlementSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
    settleTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    settleFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    settleDate: { type: Date, default: Date.now },
    settleAmount: { type: Number, required: true }
}, { timestamps: true });

// ----------------- EXPORT MODELS -----------------

module.exports = {
    User: mongoose.model('user', userSchema),
    Group: mongoose.model('group', groupSchema),
    Expense: mongoose.model('expense', expenseSchema),
    Settlement: mongoose.model('settlement', settlementSchema)
};
