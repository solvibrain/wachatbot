// routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/whatsapp', chatbotController.handleWhatsAppMessage);

module.exports = router;