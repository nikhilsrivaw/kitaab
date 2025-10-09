  const express = require("express");
  const router = express.Router();
  const { getDashboardStats } = require("../controllers/dashboardController");
  const auth = require('../middleware/auth');  // ← Add this

  router.get("/stats", auth, getDashboardStats);  // ← Fix path and add auth

  module.exports = router;
