const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing. Check your .env file and configuration.");
}

const twilio = require('twilio');
const client = twilio(accountSid, authToken);
module.exports = client;
console.log(process.env.TWILIO_ACCOUNT_SID)
console.log(process.env.TWILIO_AUTH_TOKEN)