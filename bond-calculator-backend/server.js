const express = require('express');
const cors = require('cors');
const { calculateBondValue } = require('./src/services/bondCalculator');

const app = express();

// Constants for validation
const VALIDATION = {
  MAX_RATE: 100,
  MIN_FACE_VALUE: 0.01,
  MIN_YEARS_TO_MATURITY: 0.1,
  MIN_PAYMENT_FREQUENCY: 1,
  REQUIRED_FIELDS: ['faceValue', 'annualCouponRate', 'yearsToMaturity', 'annualMarketRate', 'paymentFrequency']
};

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: "server is running" });
});

// Validation middleware
const validateBondInputs = (req, res, next) => {
  // Check if all required fields exist
  const missingFields = VALIDATION.REQUIRED_FIELDS.filter(field => !(field in req.body));
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Extract and convert values to numbers
  const params = {};
  try {
    VALIDATION.REQUIRED_FIELDS.forEach(field => {
      params[field] = Number(req.body[field]);
      if (isNaN(params[field])) {
        throw new Error(`${field} must be a valid number`);
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // Validate specific constraints
  if (params.faceValue < VALIDATION.MIN_FACE_VALUE) {
    return res.status(400).json({
      error: `Face value must be at least ${VALIDATION.MIN_FACE_VALUE}`
    });
  }

  if (params.annualCouponRate < 0 || params.annualCouponRate > VALIDATION.MAX_RATE) {
    return res.status(400).json({
      error: `Annual coupon rate must be between 0 and ${VALIDATION.MAX_RATE}%`
    });
  }

  if (params.yearsToMaturity < VALIDATION.MIN_YEARS_TO_MATURITY) {
    return res.status(400).json({
      error: `Years to maturity must be at least ${VALIDATION.MIN_YEARS_TO_MATURITY}`
    });
  }

  if (params.annualMarketRate < 0 || params.annualMarketRate > VALIDATION.MAX_RATE) {
    return res.status(400).json({
      error: `Annual market rate must be between 0 and ${VALIDATION.MAX_RATE}%`
    });
  }

  if (params.paymentFrequency < VALIDATION.MIN_PAYMENT_FREQUENCY || !Number.isInteger(params.paymentFrequency)) {
    return res.status(400).json({
      error: `Payment frequency must be a whole number greater than or equal to ${VALIDATION.MIN_PAYMENT_FREQUENCY}`
    });
  }

  // Store validated params in request object
  req.validatedParams = params;
  next();
};

// Bond calculation endpoint
app.post('/api/calculate', validateBondInputs, (req, res) => {
  try {
    // Use the validated params from the middleware
    const bondValue = calculateBondValue(req.validatedParams);

    // Check if result is valid
    if (isNaN(bondValue) || !isFinite(bondValue)) {
      return res.status(400).json({
        error: "Calculation resulted in an invalid value. Please check your inputs."
      });
    }

    // Return result
    res.json({ bondValue: Number(bondValue.toFixed(2)) });
  } catch (error) {
    console.error('Bond calculation error:', error);
    res.status(500).json({
      error: "An error occurred while calculating the bond value"
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 