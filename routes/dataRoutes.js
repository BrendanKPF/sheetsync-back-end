const express = require('express');
const router = express.Router();
const { getSheetData } = require('../services/sheetService');


// Route to fetch and save data from Google Sheets
router.get('/sync-data', async (req, res) => {
    try {
        const data = await getSheetData();
        // Process or save the data as needed
        // For example, save to MongoDB or display it

        res.status(200).json({ message: 'Data fetched successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});

module.exports = router;
