const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/energy-audit', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Mongoose Schema and Model for Energy Audits
const AuditSchema = new mongoose.Schema({
  homeSize: Number,
  heatingType: String,
  coolingType: String,
  appliances: [String],
  energyUsage: Number,
  recommendations: [String],
});

const Audit = mongoose.model('Audit', AuditSchema);

// Helper function to calculate energy usage
const calculateEnergyUsage = (homeSize, heatingType) => {
  // Simple calculation logic for energy consumption based on home size and heating type
  let baseConsumption = homeSize * (heatingType === 'electric' ? 0.2 : 0.1); // Mock logic
  return baseConsumption;
};

// Helper function to generate recommendations
const getRecommendations = (energyUsage) => {
  let recommendations = [];
  if (energyUsage > 1000) {
    recommendations.push('Consider improving insulation to reduce heating costs.');
    recommendations.push('Switch to energy-efficient appliances.');
  } else {
    recommendations.push('You are already energy efficient! Keep up the good work.');
  }
  return recommendations;
};

// API route to handle energy audit submissions
app.post('/api/energy-audit', async (req, res) => {
  const { homeSize, heatingType, coolingType, appliances } = req.body;

  // Calculate energy usage based on user input
  const energyUsage = calculateEnergyUsage(homeSize, heatingType);

  // Generate recommendations based on energy usage
  const recommendations = getRecommendations(energyUsage);

  // Create and save the audit data in MongoDB
  const audit = new Audit({
    homeSize,
    heatingType,
    coolingType,
    appliances,
    energyUsage,
    recommendations,
  });

  await audit.save();

  // Send response back to frontend
  res.json({ energyUsage, recommendations, message: 'Energy audit completed and saved successfully' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route to serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
