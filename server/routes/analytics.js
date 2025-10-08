const express = require("express");
const { getProjectFinancials } = require("../controllers/analyticsController");


const router = express.Router();


router.get('/:project_id/financials', getProjectFinancials);



module.exports = router;