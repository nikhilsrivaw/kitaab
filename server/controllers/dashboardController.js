const pool = require('../config/db')

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const projectResult = await pool.query(
            'SELECT * FROM projects WHERE user_id = $1',
            [userId]

        )
        const projects = projectResult.rows;
        const projectIds = projects.map(p => p.id); // extract project ids and thats all 

        if (projectIds.length == 0) {
            return res.status(200).json({
                totalProjects: 0,
                totalExpenses: 0,
                totalIncome: 0,
                profitLoss: 0,
                recentActivity: [],
                projects: []
            })
        }
        const expenseResult =await  pool.query(
            'SELECT SUM(amount) as total FROM expenses WHERE project_id = ANY($1)',
            [projectIds]
        )



        const incomeResult = await pool.query(
            'SELECT SUM(amount) as total FROM income WHERE project_id = ANY($1)',
            [projectIds]
        )

        const recentExepensesResult = await pool.query(
            `SELECT e.*, p.name as project_name, 'expense' as type
             FROM expenses e 
             JOIN projects p ON e.project_id = p.id
             WHERE e.project_id = ANY($1)
             ORDER BY e.date DESC
             LIMIT 5`,
            [projectIds]
        )

        const recentIncomeResult = await pool.query(
            `SELECT i.*, p.name as project_name , 'income' as type
            FROM income i
            JOIN projects p ON i.project_id = p.id
            WHERE i.project_id = ANY($1)
            ORDER BY i.date DESC
            LIMIT 5`,
            [projectIds]
        )

        const totalExpenses = parseFloat(expenseResult.rows[0].total) || 0;
        const totalIncome = parseFloat(incomeResult.rows[0].total) || 0;
       const profitLoss = parseFloat(totalIncome - totalExpenses);

        // combne and sort recent activity
        const recentActivity = [
            ...recentExepensesResult.rows,
            ...recentIncomeResult.rows
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);




        res.status(200).json({
            totalProjects: projects.length,
            totalExpenses: totalExpenses,
            totalIncome: totalIncome,
            profitLoss: profitLoss,
            recentActivity: recentActivity,
            projects: projects
        })
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });

    }



}


module.exports = { getDashboardStats };