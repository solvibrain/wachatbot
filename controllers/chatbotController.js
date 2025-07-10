/**
 * @fileoverview This file contains the controller logic for handling WhatsApp messages.
 */

const llmService = require('../services/llmService');
const spreadsheetService = require('../services/spreadsheetService');

/**
 * Handles incoming WhatsApp messages from Twilio.
 * 
 * This function processes a user's message by:
 * 1. Extracting the message content and sender's number.
 * 2. Fetching an intelligent response from the LLM service.
 * 3. Sending the response back to the user via Twilio.
 * 4. Logging the conversation for analytics and record-keeping.
 * 
 * @param {object} req - The Express request object, containing the message body from Twilio.
 * @param {object} res - The Express response object, used to send a status back to Twilio.
 */
exports.handleWhatsAppMessage = async (req, res) => {
  try {
    const userMessage = req.body.Body;
    const fromNumber = req.body.From;
    console.log(`Received message from ${fromNumber}: "${userMessage}"`);

    // 1. Get a response from the Large Language Model (LLM).
    const llmResponse = await llmService.getLLMResponse(userMessage);
    console.log(`LLM response: "${llmResponse}"`);

    // 2. Send the response back to the user via Twilio.
    const twilioClient = require('../config/twilio');
    await twilioClient.messages.create({
      body: llmResponse,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio WhatsApp number
      to: fromNumber
    });

    // 3. Log the entire conversation to a spreadsheet for tracking.
    await spreadsheetService.logToSpreadsheet(fromNumber, userMessage, llmResponse);

    // 4. Send a 200 OK status to Twilio to acknowledge receipt of the message.
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling WhatsApp message:', error);
    res.status(500).send('An internal error occurred.');
  }
};