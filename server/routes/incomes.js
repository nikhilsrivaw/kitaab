const express = require("express");
const { createIncome, getIncome, updateIncome, deleteIncome } = require("../controllers/incomeController");



const router = express.Router();


router.post('/',createIncome);
router.get('/:project_id', getIncome);
router.put('/:id', updateIncome);
router.delete('/:id',deleteIncome);


module.exports = router;