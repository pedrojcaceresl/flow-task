const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { apiReference } = require('@scalar/express-api-reference');
const httpStatus = require('http-status').status;
const routes = require('./routes/v1');
const AppError = require('./utils/AppError');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://fastly.jsdelivr.net"],
      upgradeInsecureRequests: null, // Disable automatic upgrade to HTTPS
    },
  },
  strictTransportSecurity: false, // Disable HSTS (Strict-Transport-Security) for HTTP support
}));

// CORS
app.use(cors());

// Logger
app.use(morgan('dev'));

// Parse JSON body
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Documentation
app.use(
  '/docs',
  apiReference({
    theme: 'purple',
    spec: {
      content: swaggerSpec,
    },
  })
);

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