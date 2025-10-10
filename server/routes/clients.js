const express = require("express");
const { createClient, getAllClients, updateClient, deleteClient } = require("../controllers/clientController");
const router = express.Router();

router.post('/',createClient);
router.get('/',getAllClients);
router.put('/:id',updateClient);
router.delete('/:id',deleteClient);


module.exports = router;