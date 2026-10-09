/**
 * Currency utility for Indian Rupee (INR - ₹) formatting across NEXUS Tech
 */

export const CURRENCY_SYMBOL = '₹';

/**
 * Format a numeric amount into INR currency representation (e.g. ₹389, ₹1,499)
 */
export const formatINR = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export default formatINR;
