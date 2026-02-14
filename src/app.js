const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const httpStatus = require('http-status').status;
const routes = require('./routes/v1');
const AppError = require('./utils/AppError');

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors());

// Logger
app.use(morgan('dev'));

// Parse JSON body
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1', routes);

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(httpStatus.OK).json({ status: 'ok', version: '1.0.0', uptime: process.uptime() });
});

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode, message } = err;
    const status = err.statusCode || 500;
    
    res.status(status).json({
        status: err.status || 'error',
        statusCode: status,
        message: message || httpStatus[status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;