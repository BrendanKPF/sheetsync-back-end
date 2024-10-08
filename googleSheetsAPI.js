const express = require('express');
const { google } = require('googleapis');
const fs = require('fs').promises;
const { getSheetData } = require('./services/sheetService');

const app = express();

// Load credentials and token for authentication
const loadCredentials = async () => {
  const credentials = JSON.parse(await fs.readFile('credentials.json'));
  const token = JSON.parse(await fs.readFile('token.json'));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

// Define an API route to fetch sheet data
app.get('/get-sheet-data', async (req, res) => {
  try {
    const auth = await loadCredentials();
    const spreadsheetId = '1cXKmUV2BDYGDa8DLI-rCyiu-hg0vp3xI'; // Replace with actual spreadsheet ID
    const range = 'Sheet1!A1:C5'; // Replace with actual range

    const data = await getSheetData(auth, spreadsheetId, range);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching sheet data');
  }
});

// Set up server to run on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
