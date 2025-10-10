const express = require("express");
const { createClient, getAllClients, updateClient, deleteClient } = require("../controllers/clientController");
const router = express.Router();

 console.log('✅ CLIENT ROUTES LOADED'); // ADD THIS LINE

router.post('/',createClient);
router.get('/',getAllClients);
router.put('/:id',updateClient);
router.delete('/:id',deleteClient);


module.exports = router;