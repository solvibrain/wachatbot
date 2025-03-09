// controllers/chatbotController.js
const llmService = require('../services/llmService');
const spreadsheetService = require('../services/spreadsheetService');

exports.handleWhatsAppMessage = async (req, res) => {
  const userMessage = req.body.Body;
  const fromNumber = req.body.From;
  console.log(fromNumber, userMessage);

  // Get LLM response
  const llmResponse = await llmService.getLLMResponse(userMessage);
  console.log(llmResponse);
  console.log(process.env.TWILIO_PHONE_NUMBER)
  // Send response via Twilio
  const twilioClient = require('../config/twilio');
  await twilioClient.messages.create({
    body: llmResponse,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: fromNumber
  });

  // Log conversation
  await spreadsheetService.logToSpreadsheet(fromNumber, userMessage, llmResponse);

  res.sendStatus(200);
};