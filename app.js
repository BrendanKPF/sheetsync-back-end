const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/dataRoutes');
const { oAuth2Client } = require('./services/sheetService');
const fs = require('fs'); // Import fs module

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Replace with your actual secret
    resave: false,
    saveUninitialized: true,
}));

// Routes
app.use('/api/data', dataRoutes);

// Set up OAuth2 Client
app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(500).send('Error retrieving access token');
        }
        oAuth2Client.setCredentials(token);
        // Save the token to a file
        fs.writeFileSync('config/token.json', JSON.stringify(token));
        res.send('Authentication successful! You can close this tab.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
