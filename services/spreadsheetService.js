/**
 * @fileoverview This file contains the service logic for logging conversation data to Google Sheets.
 * It handles authentication and appending data to a specified spreadsheet.
 */

const { google } = require('googleapis');

/**
 * Authenticates with the Google Sheets API using credentials from a key file.
 * This instance is configured to access the spreadsheets scope.
 * @type {google.auth.GoogleAuth}
 */
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json', // Path to your Google service account credentials
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

/**
 * Logs a conversation entry to a specified Google Sheet.
 * 
 * This function appends a new row containing the timestamp, contact number, user message,
 * and bot response to the 'Sheet1' of the spreadsheet defined by the GOOGLE_SHEET_ID
 * environment variable.
 * 
 * @param {string} contact - The user's contact number (e.g., WhatsApp number).
 * @param {string} userMessage - The message sent by the user.
 * @param {string} botResponse - The response sent by the chatbot.
 * @returns {Promise<void>} A promise that resolves when the data has been logged.
 * @throws {Error} If there is an error during the API call.
 */
exports.logToSpreadsheet = async (contact, userMessage, botResponse) => {
  try {
    // Authenticate and get the Google Sheets API client.
    const sheetsClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: sheetsClient });

    // Prepare the data row to be inserted.
    const timestamp = new Date().toISOString();
    const values = [[timestamp, contact, userMessage, botResponse]];

    // Append the data to the spreadsheet.
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // The ID of your Google Sheet
      range: 'Sheet1!A:D', // The range to append to (e.g., the first available row in columns A-D)
      valueInputOption: 'RAW', // The data will be inserted as-is, without parsing.
      resource: {
        values: values
      }
    });
  } catch (error) {
    console.error('Error logging to spreadsheet:', error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it gracefully without stopping the application.
  }
};