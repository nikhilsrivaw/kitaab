const pool = require('../config/db');

const createClient = async (req, res) => {
    try {
        const { name, company_name, email, phone, address, city, country, website, industry, tax_id, payment_terms, hourly_rate, currency, status,
            client_type, notes } = req.body;


        const user_id = req.user.id;

        const query = `
        INSERT INTO clients (
                  user_id, name, company_name, email, phone,
                  address, city, country, website, industry,
                  tax_id, payment_terms, hourly_rate, currency,
                  status, client_type, notes
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
              RETURNING *



        `

        const result = await pool.query(query, [
            user_id, name, company_name, email, phone, address, city, country, website, industry, tax_id, payment_terms, hourly_rate, currency, status, client_type, notes
        ])

        res.status(201).json({
            message: 'Client created successfully',
            client: result.rows[0]
        });

    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Failed to create client' });

    }
}


const getAllClients = async (req, res) => {
    
    const user_id = req.user.id;
    
    try {
        const result = await pool.query(

            'SELECT * FROM clients WHERE user_id = $1  ORDER BY created_at DESC',
            [user_id]

        )
        

        // if (result.rows.length === 0) {
        //     return res.status(404).json({
        //         message: " there are no clients for this user ",
        //     })
        // }
        
        return res.status(200).json({
            message: "Reeturned all the clients",
            result: result.rows
        })
    } catch (error) {
        
        return res.status(500).json({
            message: error.message

        })

    }

}

const getClientById = async (req,res)=>{
    const {id} = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
              [id, user_id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message : "NO CLIENT FOUND "
            })
        }

        return res.status(200).json({
            success: true,
            client:result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        });
        
    }
}

const updateClient = async (req, res) => {
    const { id } = req.params;
    const user_id =  req.user.id;
    const { name, company_name, email, phone, address, city, country, website, industry, tax_id, payment_terms, hourly_rate, currency, status,
        client_type, notes } = req.body;

    try {
        const result = await pool.query(
            'UPDATE clients SET name = $1 , company_name = $2 , email = $3 , phone=$4 ,address=$5 ,city=$6 ,country=$7, website=$8 , industry=$9 ,tax_id=$10 , payment_terms=$11 ,hourly_rate=$12 , currency=$13 , status =$14 ,client_type=$15, notes=$16 ,updated_at = NOW() WHERE id =$17 AND user_id = $18  RETURNING * ',
            [
                name, company_name, email, phone, address, city, country, website, industry, tax_id, payment_terms, hourly_rate, currency, status, client_type, notes, id ,user_id
            ]

        )

        return res.status(200).json({
            messaeg: "successfully updated",
            result: result.rows[0]
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }


}

const deleteClient = async (req, res) => {
    const { id } = req.params;
    const user_id= req.user.id;
    try {
        const result = await pool.query(
            'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING *',
            [id , user_id]

        )
        return res.status(200).json({
            messaeg: "Succesfully deleted the client"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }


}

module.exports = {
    createClient,getAllClients,updateClient,deleteClient,getClientById
};