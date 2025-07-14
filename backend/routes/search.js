const express = require('express');
const router = express.Router();
const { getIssuesByMachine, searchTroubleshooting } = require('../services/searchService');

// Return list of {id, problem} for a machine
router.get('/issues/:machineType', (req, res) => {
  const issues = getIssuesByMachine(req.params.machineType);
  res.json({ machineType: req.params.machineType, issues });
});

// Return top-5 matching troubleshooting entry
router.post('/troubleshoot', async (req, res) => {
  const { query = '', machineType, noLLM } = req.body;
  if (!machineType) return res.status(400).json({ error: 'machineType required' });
  try {
    const result = await searchTroubleshooting(query, machineType, Boolean(noLLM));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


