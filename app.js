const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('SheetSync backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
