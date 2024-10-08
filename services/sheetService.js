const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load client secrets from a local file
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json'); // Update the path to point to config
const TOKEN_PATH = path.join(__dirname, 'token.json');

let oAuth2Client;

// Create an OAuth2 client
function createOAuth2Client() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

// Function to get Google Sheet Data
async function getGoogleSheetData() {
    // Use the authenticated client to fetch data from your Google Sheet
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1FwiRYZvPdfy3rDwOcMOmeyPzd6ICBSbWcCemy9g-c5I', // Replace with your spreadsheet ID
        range: 'Sheet1!A1:B10', // Replace with your desired range
    });
    return response.data.values; // Return the values retrieved from the sheet
}

createOAuth2Client(); // Initialize the OAuth2 client

module.exports = { getGoogleSheetData, oAuth2Client };
