const pool = require('../config/db')


const createIncome = async (req, res) => {

    const { project_id, amount, source, date } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO income (project_id , amount , source , date ) VALUES ($1 , $2 , $3 , $4 ) RETURNING * ',
            [project_id, amount, source, date]
        )
        return res.status(201).json({
            message: " Succesfully stored the income",
            result: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const updateIncome = async (req, res) => {
    const { id } = req.params;
    const { amount, source, date } = req.body;

    try {
        const result = await pool.query(
            'UPDATE income SET amount = $1, source = $2, date = $3,  updated_at = NOW() WHERE id = $4 RETURNING *',
            [amount, source, date, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No income found to update"
            })
        }

        return res.status(200).json({
            message: " succesfully updated the income",
            result: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }





}

const getIncome = async (req, res) => {
    const { project_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM income WHERE project_id = $1 ORDER BY date DESC',
            [project_id]
        )

        return res.status(200).json({
            incomes: result.rows
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM income WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Income not found" });
        }

        return res.status(200).json({
            message: " succesfully deleted income "
        })

    }
    catch (error) {
        res.status(500).json({
            messaeg: error.message
        })

    }
}


module.exports = {deleteIncome,getIncome,updateIncome,createIncome}
