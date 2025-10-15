const express = require("express");
console.log('✅ CHANNELS ROUTES FILE LOADED');
const { getUserChannels, getChannelById, createProjectChannel } = require("../controllers/channelController");
console.log('✅ CHANNEL CONTROLLER IMPORTED');

const router = express.Router();


router.get('/', (req, res, next) => {
    console.log('🔥 CHANNELS GET / ROUTE HIT');
    getUserChannels(req, res, next);
});
router.get('/:id', getChannelById);
router.post('/', createProjectChannel);
console.log('✅ CHANNELS ROUTES CONFIGURED')
module.exports = router;