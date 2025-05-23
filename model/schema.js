// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('../helper/logger');

// Enable strict query parsing (to avoid deprecation warnings)
mongoose.set('strictQuery', true);

// Get MongoDB URI from environment variables
const dbURI = process.env.MONGODB_URI;

// Validate URI presence
if (!dbURI) {
  logger.error('❌ MongoDB URI is not defined in environment variables.');
  process.exit(1); // Exit process with failure
}

// Optional settings for improved stability
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50,
  serverSelectionTimeoutMS: 5000,
};

// Attempt MongoDB connection
mongoose.connect(dbURI, connectionOptions)
  .then(() => {
    logger.info('✅ MongoDB connected successfully');
    console.log('✅ DB Connected');
  })
  .catch(err => {
    logger.error(`❌ MongoDB connection failed: ${err.stack}`);
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1); // Exit process on failed connection
  });

/* ========== SCHEMAS ========== */

// User Schema
const User = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Group Schema
const Group = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupDescription: { type: String },
  groupCurrency: { type: String, default: 'INR' },
  groupOwner: { type: String, required: true },
  groupMembers: { type: [String], required: true },
  groupCategory: { type: String, default: 'Others' },
  groupTotal: { type: Number, default: 0 },
  split: { type: Array }
}, { timestamps: true });

// Expense Schema
const Expense = new mongoose.Schema({
  groupId: { type: String, required: true },
  expenseName: { type: String, required: true },
  expenseDescription: { type: String },
  expenseAmount: { type: Number, required: true },
  expenseCategory: { type: String, default: 'Others' },
  expenseCurrency: { type: String, default: 'INR' },
  expenseDate: { type: Date, default: Date.now },
  expenseOwner: { type: String, required: true },
  expenseMembers: { type: [String], required: true },
  expensePerMember: { type: Number, required: true },
  expenseType: { type: String, default: 'Cash' }
}, { timestamps: true });

// Settlement Schema
const Settlement = new mongoose.Schema({
  groupId: { type: String, required: true },
  settleTo: { type: String, required: true },
  settleFrom: { type: String, required: true },
  settleDate: { type: String, required: true },
  settleAmount: { type: Number, required: true }
}, { timestamps: true });

/* ========== EXPORT MODELS ========== */

module.exports = {
  User: mongoose.model('User', User),
  Group: mongoose.model('Group', Group),
  Expense: mongoose.model('Expense', Expense),
  Settlement: mongoose.model('Settlement', Settlement)
};
