const pool = require('../config/db');

const getProjectFinancials = async (req,res)=>{
    const {project_id} = req.params;
    try {
        const incomeResult = await  pool.query(
            'SELECT SUM(amount) as total FROM income WHERE project_id = $1',
            [project_id]
        )
        const expensesResult = await pool.query(
            'SELECT SUM(amount) as total FROM expenses WHERE project_id = $1',
            [project_id]
        )
        const totalIncome = incomeResult.rows[0].total || 0;
        const totalExpenses = expensesResult.rows[0].total || 0;
        const profitLoss = totalIncome - totalExpenses;
        res.json({ project_id, totalIncome, totalExpenses, profitLoss })

    } catch (error) {
        console.error('Get financials error:', error);
        res.status(500).json({ error: 'Failed to get financials' });
        
    }
}

module.exports = { getProjectFinancials };