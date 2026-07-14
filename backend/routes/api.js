const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/analyzeController');

// Multer setup to store files in memory for ephemeral processing
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/analyze-resume', upload.single('resume'), analyzeResume);

module.exports = router;
