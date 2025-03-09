// tests/unit/chatbot.test.js
const { expect } = require('chai');
const chatbotController = require('../../controllers/chatbotController');

describe('Chatbot Controller', () => {
  it('should handle WhatsApp message', async () => {
    const req = { body: { Body: 'Hello', From: 'whatsapp:+123456789' } };
    const res = { sendStatus: (status) => expect(status).to.equal(200) };
    await chatbotController.handleWhatsAppMessage(req, res);
  });
});