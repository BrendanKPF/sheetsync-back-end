const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load credentials and token
const credentialsPath = path.join(__dirname, '../config/credentials.json');
const tokenPath = path.join(__dirname, '../config/token.json');

// Authorize using OAuth2 credentials
const authorize = () => {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Load the token
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
};

// Fetch data from Google Sheets
const getSheetData = async () => {
    const auth = authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1FwiRYZvPdfy3rDwOcMOmeyPzd6ICBSbWcCemy9g-c5I'; // Your sheet ID
    const range = 'Sheet1!A1:D10'; // Adjust the range as needed

    const result = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = result.data.values;
    if (rows.length) {
        return rows; // Successfully fetched rows
    } else {
        console.log('No data found.');
        return [];
    }
};

module.exports = {
    getSheetData,
};
