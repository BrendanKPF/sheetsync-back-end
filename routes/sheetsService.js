const { google } = require('googleapis');
const { readFile } = require('fs').promises;

// Load the credentials from the JSON file (replace with your actual file path)
const getAuth = async () => {
  const credentials = JSON.parse(await readFile('credentials.json'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Token should be saved and used here (you'll need to generate this first)
  oAuth2Client.setCredentials({
    refresh_token: "YOUR_REFRESH_TOKEN",
  });

  return oAuth2Client;
};

const getGoogleSheetData = async () => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Replace with your Google Sheets ID and range
  const spreadsheetId = '1cXKmUV2BDYGDa8DLI-rCyiu-hg0vp3xI';
  const range = 'Sheet1!A1:C5'; // Replace with your actual sheet range

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values; // This contains the rows from the sheet
};

module.exports = {
  getGoogleSheetData,
};
