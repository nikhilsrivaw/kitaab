const express = require("express");
const { createClient, getAllClients, updateClient, deleteClient, getClientById } = require("../controllers/clientController");
const router = express.Router();

 console.log('✅ CLIENT ROUTES LOADED'); // ADD THIS LINE

router.post('/',createClient);
router.get('/',getAllClients);
router.get('/:id',getClientById)
router.put('/:id',updateClient);
router.delete('/:id',deleteClient);


module.exports = router;