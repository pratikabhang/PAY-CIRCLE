const mongoose = require('mongoose');
const logger = require('../helper/logger');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    logger.info('✅ DB Connection Established');
    console.log('✅ DB Connected');
})
.catch(err => {
    logger.error(`❌ DB Connection Failed | ${err.stack}`);
    console.error('❌ DB Connection Failed:', err);
});

// User Schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Group Schema
const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    groupDescription: {
        type: String
    },
    groupCurrency: {
        type: String,
        default: 'INR'
    },
    groupOwner: {
        type: String,
        required: true
    },
    groupMembers: {
        type: [String],
        required: true
    },
    groupCategory: {
        type: String,
        default: 'Others'
    },
    groupTotal: {
        type: Number,
        default: 0
    },
    split: {
        type: Array
    }
}, { timestamps: true });

// Expense Schema
const ExpenseSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    expenseName: {
        type: String,
        required: true
    },
    expenseDescription: {
        type: String
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseCategory: {
        type: String,
        default: 'Others'
    },
    expenseCurrency: {
        type: String,
        default: 'INR'
    },
    expenseDate: {
        type: Date,
        default: Date.now
    },
    expenseOwner: {
        type: String,
        required: true
    },
    expenseMembers: {
        type: [String],
        required: true
    },
    expensePerMember: {
        type: Number,
        required: true
    },
    expenseType: {
        type: String,
        default: 'Cash'
    }
}, { timestamps: true });

// Settlement Schema
const SettlementSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    settleTo: {
        type: String,
        required: true
    },
    settleFrom: {
        type: String,
        required: true
    },
    settleDate: {
        type: String,
        required: true
    },
    settleAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Exporting Models
module.exports = {
    User: mongoose.model('User', UserSchema),
    Group: mongoose.model('Group', GroupSchema),
    Expense: mongoose.model('Expense', ExpenseSchema),
    Settlement: mongoose.model('Settlement', SettlementSchema)
};
