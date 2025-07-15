const { calculateBondValue } = require('./bondCalculator');

describe('Bond Value Calculator', () => {
  test('should return face value when coupon rate equals market rate', () => {
    const params = {
      faceValue: 1000,
      annualCouponRate: 5,
      yearsToMaturity: 1,
      annualMarketRate: 5,
      paymentFrequency: 2
    };

    const bondValue = calculateBondValue(params);
    expect(bondValue).toBeCloseTo(1000, 2);
  });

  test('should handle zero coupon bond', () => {
    const params = {
      faceValue: 1000,
      annualCouponRate: 0,
      yearsToMaturity: 1,
      annualMarketRate: 5,
      paymentFrequency: 2
    };

    const bondValue = calculateBondValue(params);
    expect(bondValue).toBeLessThan(1000); // Zero coupon bonds should be worth less than face value
  });

  test('should calculate higher value when market rate is lower than coupon rate', () => {
    const params = {
      faceValue: 1000,
      annualCouponRate: 6,
      yearsToMaturity: 1,
      annualMarketRate: 4,
      paymentFrequency: 2
    };

    const bondValue = calculateBondValue(params);
    expect(bondValue).toBeGreaterThan(1000); // Bond should be worth more when market rate is lower
  });
}); 