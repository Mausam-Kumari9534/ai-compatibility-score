const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/analyzeController');
const actionController = require('../controllers/actionController');

const builderController = require('../controllers/builderController');
const { protect } = require('../middleware/authMiddleware');

// Multer setup to store files in memory for ephemeral processing
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/analyze-resume', upload.single('resume'), analyzeResume);

// Action Routes (JSON payloads)
router.post('/action/optimize-resume', actionController.optimizeResume);
router.post('/action/generate-cover-letter', actionController.generateCoverLetter);
router.post('/action/prepare-interview', actionController.prepareInterview);

// Builder Routes
router.route('/resume-builder/drafts')
    .get(protect, builderController.getDrafts)
    .post(protect, builderController.saveDraft);

router.route('/resume-builder/drafts/:id')
    .delete(protect, builderController.deleteDraft);

router.post('/resume-builder/rewrite', protect, builderController.aiRewrite);
router.post('/resume-builder/suggest', protect, builderController.aiSuggest);
router.post('/resume-builder/autofill', protect, upload.single('resume'), builderController.autoFill);

module.exports = router;
