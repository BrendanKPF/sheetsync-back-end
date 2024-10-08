const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Load client secrets from a local file.
fs.readFile('config/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), getAccessToken);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile('config/token.json', (err, token) => {
    if (err || !token) {
      // If token file doesn't exist or is invalid, proceed to get new token.
      return getAccessToken(oAuth2Client, callback);
    }
    try {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    } catch (error) {
      console.error("Invalid token, generating new token...");
      getAccessToken(oAuth2Client, callback);
    }
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (authCode) => {
    oAuth2Client.getToken(authCode, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile('config/token.json', JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', 'config/token.json');
      });
      callback(oAuth2Client);
    });
    rl.close();
  });
}
