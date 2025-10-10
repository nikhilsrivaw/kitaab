const pool = require('../config/db');

const createProject = async (req, res) => {
    const { name, description ,client_id } = req.body;
    const user_id = req.user.id
    try {
        const result = await pool.query(
            'INSERT INTO projects (user_id,name , description, client_id) VALUES ($1 , $2 , $3 , $4) RETURNING *',
            [user_id, name, description , client_id]
        )


        return res.status(201).json({
            message: "project created succesfully",
            result: result.rows[0]
        })
    } catch (error) {
        console.error("Create project error:", error);
        res.status(500).json({ error: " Failed to create project " })

    }
};


const getProjects = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects where user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        )

        return res.json({
            projects: result.rows
        })
    } catch (error) {
        console.error("GEt projects error ", error);
        res.status(500).json({ error: 'failed to get projects ' })

    }
}

const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE projects SET name = $1 , description = $2 , status = $3 , updated_at = NOW() WHERE id =$4 AND user_id = $5 RETURNING *',
            [ name, description, status,id , req.user.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ eroor: "error" });

        return res.json({
            message: "Project updated successfully",
            project: result.rows[0]
        });


    } catch (error) {
        console.error("Update project error", error);
        res.status(500).json({ error: "Failed to update project", project: result.rows[0] });

    }
}


const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json({ message: "project deleted suceessfully" })

    } catch (error) {
        console.error("Delete project error", error);
        res.status(500).json({ error: "Failed to delete  project" })

    }
}


module.exports = { createProject, getProjects, deleteProject, updateProject }