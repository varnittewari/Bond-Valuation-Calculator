/**
 * Calculates the present value of a bond
 * @param {Object} params - Bond parameters
 * @param {number} params.faceValue - Face value of the bond
 * @param {number} params.annualCouponRate - Annual coupon rate (in percentage)
 * @param {number} params.yearsToMaturity - Years until maturity
 * @param {number} params.annualMarketRate - Annual market rate (in percentage)
 * @param {number} params.paymentFrequency - Number of payments per year
 * @returns {number} The calculated present value of the bond
 */
function calculateBondValue({
  faceValue,
  annualCouponRate,
  yearsToMaturity,
  annualMarketRate,
  paymentFrequency
}) {
  // Convert percentage rates to decimals
  const couponRate = annualCouponRate / 100;
  const marketRate = annualMarketRate / 100;

  // Calculate per-period rates
  const periodicCouponRate = couponRate / paymentFrequency;
  const periodicMarketRate = marketRate / paymentFrequency;
  const totalPeriods = yearsToMaturity * paymentFrequency;

  // Calculate coupon payment per period
  const couponPayment = faceValue * periodicCouponRate;

  // Calculate present value of coupon payments
  const pvOfCoupons = couponPayment * (1 - Math.pow(1 + periodicMarketRate, -totalPeriods)) / periodicMarketRate;

  // Calculate present value of face value
  const pvOfFaceValue = faceValue * Math.pow(1 + periodicMarketRate, -totalPeriods);

  // Total bond value is the sum of both present values
  return pvOfCoupons + pvOfFaceValue;
}

module.exports = { calculateBondValue }; 