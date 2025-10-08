const pool = require('../config/db');

const createTask = async (req, res) => {
    const { project_id, title, description, deadline } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO tasks (project_id , title , description , deadline ) VALUES ($1,$2,$3,$4) RETURNING *',
        [project_id, title, description, deadline]

    )
    return res.status(201).json({
        message: "Succesfully created tasks",
        result: result.rows[0]
    })
    } catch (error) {
        return res.status(500).json({
            message : error
        })
        
    }
}


const getTasks = async (req, res) => {
    const{project_id} = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
            [project_id]
        )

        return res.status(200).json({

            result: result.rows
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })

    }
}

const updateTask = async (req, res) => {

    const { id } = req.params;
    const { title, description, deadline, status } = req.body
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, deadline = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [title, description, deadline, status, id])
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "no tasks found"
            })
        }
        return res.status(200).json({
            message: " sucessfully updated the tasks ",
            result: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })

    }
}

const deleteTask = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id=$1 RETURNING * ',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "NO TASKS FOUND"
            })
        }
        return res.status(200).json({
            message: " succesffully deleted the tasks "
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })

    }
}

module.exports = { createTask, getTasks, updateTask, deleteTask }