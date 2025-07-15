const express = require('express');
const cors = require('cors');
const { calculateBondValue } = require('./src/services/bondCalculator');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: "server is running" });
});

// Bond calculation endpoint
app.post('/api/calculate', (req, res) => {
  try {
    // Extract values from request body
    const { faceValue, annualCouponRate, yearsToMaturity, annualMarketRate, paymentFrequency } = req.body;

    // Convert string inputs to numbers
    const params = {
      faceValue: Number(faceValue),
      annualCouponRate: Number(annualCouponRate),
      yearsToMaturity: Number(yearsToMaturity),
      annualMarketRate: Number(annualMarketRate),
      paymentFrequency: Number(paymentFrequency)
    };

    // Validate inputs
    if (Object.values(params).some(isNaN)) {
      return res.status(400).json({ error: "All inputs must be valid numbers" });
    }

    if (params.paymentFrequency <= 0) {
      return res.status(400).json({ error: "Payment frequency must be greater than zero" });
    }

    // Calculate bond value
    const bondValue = calculateBondValue(params);

    // Check if result is valid
    if (isNaN(bondValue) || !isFinite(bondValue)) {
      return res.status(400).json({ error: "Calculation resulted in an invalid value. Please check your inputs." });
    }

    // Return result
    res.json({ bondValue: Number(bondValue.toFixed(2)) });
  } catch (error) {
    console.error('Bond calculation error:', error);
    res.status(500).json({ error: "An error occurred while calculating the bond value" });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 