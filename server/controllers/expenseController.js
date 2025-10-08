const pool = require('../config/db')

const createExpense = async (req, res) => {
    const { project_id, amount, category, description, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO expenses (project_id , amount , category , description , date ) VALUES ($1 , $2 , $3 , $4 , $5) RETURNING *',
            [project_id, amount, category, description, date]
        )
        return res.status(201).json({
            message: "Expense created successfully",
            expense: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error
        })

    }

}
const getExpenses = async (req, res) => {
    const { project_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM expenses WHERE project_id = $1 ORDER BY date DESC',
            [project_id]
        )
        return res.json({
            expenses: result.rows
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const updateExpense = async (req, res) => {
    const { id } = req.params
    const { amount, category, description, date } = req.body;

    try {
        const result = await pool.query(
            'UPDATE expenses SET amount = $1, category = $2, description = $3, date = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [amount, category, description, date, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }
        return res.json({
            message: "Expense updated successfully",
            expense: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }
        return res.status(200).json({
            message: "SUccesfully deleted expense"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }




}




module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };