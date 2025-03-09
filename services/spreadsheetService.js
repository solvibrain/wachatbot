// services/spreadsheetService.js
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

exports.logToSpreadsheet = async (contact, userMessage, botResponse) => {
  const sheetsClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: sheetsClient });
  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:D',
    valueInputOption: 'RAW',
    resource: {
      values: [[timestamp, contact, userMessage, botResponse]]
    }
  });
};