const express = require("express");
const { getUserChannels, getChannelById, createProjectChannel } = require("../controllers/channelController");


const router = express.Router();



router.get('/',getUserChannels);
router.get('/:id',getChannelById);
router.post('/',createProjectChannel)


module.exports = router;