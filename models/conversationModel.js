// models/conversationModel.js
const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
  contact: String,
  messages: [{ userMessage: String, botResponse: String, timestamp: Date }]
});
module.exports = mongoose.model('Conversation', conversationSchema);