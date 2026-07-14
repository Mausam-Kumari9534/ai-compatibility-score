const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

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
app.use('/api', apiRoutes);

// Database connection placeholder (No models needed for just AI match phase 1 MVP)
// mongoose.connect(process.env.MONGO_URI, ...);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Keep-alive for the event loop
setInterval(() => {}, 1000 * 60 * 60);
