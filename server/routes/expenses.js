const express = require("express");
const { createExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");

const router = express.Router();


router.post('/',createExpense);
router.get('/:project_id', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id',deleteExpense);


module.exports = router;