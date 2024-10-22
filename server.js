const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.send('Welcome to the Energy Audit Tool Backend!');
});

// Serve React's index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
