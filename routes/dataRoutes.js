const express = require('express');
const { getGoogleSheetData, oAuth2Client } = require('../services/sheetService'); // Ensure you import the necessary modules
const router = express.Router();

// Callback route for Google OAuth2
router.get('/oauth2callback', (req, res) => {
    const code = req.query.code; // Get the authorization code from the query parameters
    
    // Exchange the authorization code for tokens
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(500).send('Authentication failed');
        }

        // Store the token in the session or a secure place
        oAuth2Client.setCredentials(token);

        // Redirect or send a response
        res.send('Authentication successful! You can close this tab.');
    });
});

// Other routes...
router.get('/get-data', async (req, res) => {
    try {
        const data = await getGoogleSheetData();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;
