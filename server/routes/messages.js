const express = require("express");
  const { sendMessage, getMessages, addReaction } = require("../controllers/messageController");

  const router = express.Router();

  router.post('/', sendMessage);
  router.get('/:id', getMessages);
  router.post('/reactions', addReaction);

  module.exports = router;