import { useState } from 'react';
import './BondCalculator.css';

const BondCalculator = () => {
  const [formData, setFormData] = useState({
    faceValue: '',
    annualCouponRate: '',
    yearsToMaturity: '',
    annualMarketRate: '',
    paymentFrequency: ''
  });
  const [calculatedValue, setCalculatedValue] = useState(null);
  const [error, setError] = useState('');

  const validateInputs = (data) => {
    // Check for empty values
    const hasEmptyValues = Object.values(data).some(value => value === '');
    if (hasEmptyValues) {
      return 'All fields are required';
    }

    // Convert values to numbers and check if they're positive
    const numericValues = Object.values(data).map(Number);
    const hasNonPositiveValues = numericValues.some(value => value <= 0);
    if (hasNonPositiveValues) {
      return 'All values must be positive numbers';
    }

    // Additional validation for specific fields
    if (data.annualCouponRate > 100) {
      return 'Coupon rate cannot exceed 100%';
    }

    if (data.annualMarketRate > 100) {
      return 'Market rate cannot exceed 100%';
    }

    if (!Number.isInteger(Number(data.paymentFrequency))) {
      return 'Payment frequency must be a whole number';
    }

    return null; // Validation passed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous results and errors
    setCalculatedValue(null);
    setError('');

    // Frontend validation
    const validationError = validateInputs(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setCalculatedValue(data.bondValue);
      } else {
        setError(data.error || 'An error occurred while calculating the bond value');
      }
    } catch (err) {
      setError('Network error: Could not connect to the calculation service');
    }
  };

  return (
    <div className="bond-calculator">
      <h1>Bond Value Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="faceValue">Face Value ($)</label>
          <input
            type="number"
            id="faceValue"
            name="faceValue"
            value={formData.faceValue}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="annualCouponRate">Annual Coupon Rate (%)</label>
          <input
            type="number"
            id="annualCouponRate"
            name="annualCouponRate"
            value={formData.annualCouponRate}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="yearsToMaturity">Years to Maturity</label>
          <input
            type="number"
            id="yearsToMaturity"
            name="yearsToMaturity"
            value={formData.yearsToMaturity}
            onChange={handleInputChange}
            min="0.1"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="annualMarketRate">Annual Market Rate (%)</label>
          <input
            type="number"
            id="annualMarketRate"
            name="annualMarketRate"
            value={formData.annualMarketRate}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentFrequency">Payment Frequency per Year</label>
          <input
            type="number"
            id="paymentFrequency"
            name="paymentFrequency"
            value={formData.paymentFrequency}
            onChange={handleInputChange}
            min="1"
            step="1"
            required
          />
        </div>

        <button type="submit">Calculate Bond Value</button>
      </form>

      {calculatedValue !== null && (
        <h2 className="result success">
          Calculated Bond Value: ${calculatedValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h2>
      )}

      {error && (
        <h2 className="result error">{error}</h2>
      )}
    </div>
  );
};

export default BondCalculator; 