/**
 * @fileoverview This file defines the routes for handling incoming WhatsApp messages from Twilio.
 * It maps the HTTP POST requests to the appropriate controller function.
 */

const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

/**
 * @route POST /whatsapp
 * @description This route is the webhook endpoint for Twilio. Twilio sends a POST request to this
 *              endpoint whenever a new WhatsApp message is received on the configured number.
 *              The request is then handled by the `handleWhatsAppMessage` controller.
 * @access Public
 */
router.post('/whatsapp', chatbotController.handleWhatsAppMessage);

module.exports = router;