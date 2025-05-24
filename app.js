// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Helpers
const logger = require('./helper/logger');
const requestLogger = require('./helper/requestLogger');
const apiAuth = require('./helper/apiAuthentication');

// Routers
const usersRouter = require('./routes/userRouter');
const groupRouter = require('./routes/groupRouter');
const expenseRouter = require('./routes/expenseRouter');

// Initialize app
const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ------------------- ROUTES -------------------
app.use('/api/users', usersRouter);
app.use('/api/group', apiAuth.validateToken, groupRouter);
app.use('/api/expense', apiAuth.validateToken, expenseRouter);

// ------------------- STATIC FRONTEND -------------------
if (['production', 'staging'].includes(process.env.NODE_ENV)) {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// ------------------- 404 HANDLER -------------------
app.all('*', (req, res) => {
  logger.error(`[Invalid Route] ${req.originalUrl}`);
  res.status(404).json({
    status: 'fail',
    message: 'Invalid path'
  });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Server error: ${err}`);
    logger.error(`Server error: ${err}`);
  } else {
    console.log(`✅ Server started on PORT ${PORT}`);
    logger.info(`Server started on PORT ${PORT}`);
  }
});
