const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Dummy route to prevent 404 errors for Chrome DevTools
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.json({});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Database connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Keep-alive for the event loop
setInterval(() => {}, 1000 * 60 * 60);
