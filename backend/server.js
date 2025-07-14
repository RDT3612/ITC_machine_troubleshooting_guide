const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware (relaxed for local dev)
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

// Health and test
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.get('/api/test', (req, res) => res.json({ message: 'Backend is working!' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});




