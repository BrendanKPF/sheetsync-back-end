const fs = require('fs');
const path = require('path');
const express = require('express');
const { google } = require('googleapis');
const app = express();

// Paths to credentials and token
const credentialsPath = path.join(__dirname, 'config/credentials.json');
const tokenPath = path.join(__dirname, 'config/token.json');

// Define the scopes
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Console log to trace app start
console.log("Starting the app...");

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route to serve Google Sheets data
app.get('/sheet-data', (req, res) => {
    // Load client secrets from the credentials file
    fs.readFile(credentialsPath, (err, content) => {
        if (err) {
            console.error('Error loading client secret file:', err);
            return res.status(500).send('Error loading credentials');
        }
        console.log("Credentials loaded successfully.");
        
        // Authorize a client with credentials, then call the Google Sheets API
        authorize(JSON.parse(content), (auth) => {
            listMajors(auth, res);  // Passing the res object to respond to the client
        });
    });
});

// Function to handle authorization
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    console.log("OAuth client initialized.");

    // Check if token already exists
    if (fs.existsSync(tokenPath)) {
        console.log("Token found, reading...");
        const token = fs.readFileSync(tokenPath);
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log("Token successfully set.");
        callback(oAuth2Client);
    } else {
        console.log("No token found, requesting new token...");
        getNewToken(oAuth2Client, callback);
    }
}

// Function to get a new token if not found
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    // This would be the route to capture the OAuth callback
    app.get('/oauth2callback', (req, res) => {
        const code = req.query.code;
        console.log("Authorization code received: ", code);

        if (!code) {
            console.error("Missing authorization code.");
            return res.status(400).send('Missing authorization code');
        }

        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return console.error('Error retrieving access token', err);
            }

            oAuth2Client.setCredentials(token);
            console.log("Token successfully retrieved.");

            // Store the token to disk for later use
            fs.writeFileSync(tokenPath, JSON.stringify(token));
            console.log('Token stored to', tokenPath);
            callback(oAuth2Client);
            res.send('Authorization successful!');
        });
    });
}

// Function to get data from the Google Sheet
function listMajors(auth, res) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1FwiRYZvPdfy3rDwOcMOmeyPzd6ICBSbWcCemy9g-c5I'; // Replace with your actual sheet ID
    const range = 'Sheet1!A1:D10';             // Adjust the range as necessary

    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
    }, (err, result) => {
        if (err) {
            console.error('The API returned an error: ' + err);
            return res.status(500).send('The API returned an error: ' + err);
        }

        const rows = result.data.values;
        if (rows.length) {
            console.log('Data from Google Sheet:', rows);
            res.json(rows);  // Send the data to the frontend
        } else {
            console.log('No data found.');
            res.status(404).send('No data found.');
        }
    });
}
