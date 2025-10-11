const pool = require('../config/db');

const createTask = async (req, res) => {
    const {
        project_id,
        title,
        description,
        priority,
        estimated_hours,
        tags,
        ai_generated,
        due_date
    } = req.body;

    try {
        // Get the highest order number for this project
        const maxOrderResult = await pool.query(
            'SELECT COALESCE(MAX("order"), 0) as max_order FROM tasks WHERE project_id = $1',
            [project_id]
        );
        const newOrder = maxOrderResult.rows[0].max_order + 1;

        const result = await pool.query(
            `INSERT INTO tasks
         (project_id, title, description, priority, estimated_hours, tags, ai_generated, due_date, "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
            [
                project_id,
                title,
                description,
                priority || 'medium',
                estimated_hours || 0,
                JSON.stringify(tags || []),
                ai_generated || false,
                due_date,
                newOrder
            ]
        );

        return res.status(201).json({
            message: "Successfully created task",
            result: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getTasks = async (req, res) => {
    const { project_id } = req.params;
    const user_id = req.user.id;  // From auth middleware

    try {
        // SECURITY: Check if project belongs to this user
        const projectCheck = await pool.query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [project_id, user_id]
        );

        if (projectCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Access denied: Project not found or doesn't belong to you"
            });
        }

        // Now safe to get tasks
        const result = await pool.query(
            'SELECT * FROM tasks WHERE project_id = $1 ORDER BY "order" ASC, created_at ASC',
            [project_id]
        );

        return res.status(200).json({
            message: "Tasks retrieved successfully",
            result: result.rows
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const {
        title,
        description,
        status,
        priority,
        estimated_hours,
        actual_hours,
        tags,
        due_date,
        order
    } = req.body;

    try {
        // SECURITY: Verify task belongs to user's project
        const taskCheck = await pool.query(
            'SELECT t.* FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
            [id, user_id]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Access denied: Task not found or doesn't belong to you"
            });
        }

        // UPDATE: Different query based on status
        let query;
        let values;

        if (status === 'done') {
            // If marking as done, set completed_at
            query = `
                  UPDATE tasks SET
                      title = $1,
                      description = $2,
                      status = $3,
                      priority = $4,
                      estimated_hours = $5,
                      actual_hours = $6,
                      tags = $7,
                      due_date = $8,
                      "order" = $9,
                      completed_at = NOW(),
                      updated_at = NOW()
                  WHERE id = $10
                  RETURNING *
              `;
            values = [title, description, status, priority, estimated_hours, actual_hours, JSON.stringify(tags), due_date, order, id];
        } else {
            // Normal update
            query = `
                  UPDATE tasks SET
                      title = $1,
                      description = $2,
                      status = $3,
                      priority = $4,
                      estimated_hours = $5,
                      actual_hours = $6,
                      tags = $7,
                      due_date = $8,
                      "order" = $9,
                      updated_at = NOW()
                  WHERE id = $10
                  RETURNING *
              `;
            values = [title, description, status, priority, estimated_hours, actual_hours, JSON.stringify(tags), due_date, order, id];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Successfully updated task",
            result: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {

        // SECURITY: Verify task belongs to user's project
        const taskCheck = await pool.query(
            'SELECT t.* FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
            [id, user_id]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Access denied: Task not found or doesn't belong to you"
            });
        }
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