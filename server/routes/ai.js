const express = require('express');
  const router = express.Router();
  const { analyzeProject } = require('../controllers/aiController');


  router.post('/analyze-project', analyzeProject);

  module.exports = router;