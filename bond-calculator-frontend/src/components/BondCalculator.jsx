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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bond calculation logic will be implemented later
    console.log('Form submitted:', formData);
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
            required
          />
        </div>

        <button type="submit">Calculate Bond Value</button>
      </form>

      <h2 className="result">Calculation result will appear here</h2>
    </div>
  );
};

export default BondCalculator; 