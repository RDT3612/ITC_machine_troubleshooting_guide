const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processManual } = require('../services/documentService');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.post('/manual', upload.single('manual'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await processManual(req.file, req.body.machineType);
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
