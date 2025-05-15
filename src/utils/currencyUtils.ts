/**
 * Utility functions for currency operations
 */

/**
 * Format a number as South African Rand (ZAR)
 * @param amount Amount to format
 * @returns Formatted currency string (e.g., "R 1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return `R ${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format a number as South African Rand without decimal places
 * @param amount Amount to format
 * @returns Formatted currency string (e.g., "R 1,235")
 */
export const formatCurrencyNoDecimals = (amount: number): string => {
  return `R ${Math.round(amount).toLocaleString('en-ZA')}`;
};

/**
 * Calculate the percentage of one amount relative to another
 * @param amount The amount to calculate percentage for
 * @param total The total amount
 * @returns Percentage value (0-100)
 */
export const calculatePercentage = (amount: number, total: number): number => {
  if (total === 0) return 0;
  return (amount / total) * 100;
};

/**
 * Format a percentage value
 * @param percentage Percentage value
 * @returns Formatted percentage string (e.g., "42%")
 */
export const formatPercentage = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};

/**
 * Calculate the difference between two amounts
 * @param amount1 First amount
 * @param amount2 Second amount
 * @returns Difference as a number
 */
export const calculateDifference = (amount1: number, amount2: number): number => {
  return amount1 - amount2;
};

/**
 * Format a difference amount with a plus or minus sign
 * @param difference Difference amount
 * @returns Formatted difference string (e.g., "+R 100" or "-R 50")
 */
export const formatDifference = (difference: number): string => {
  const sign = difference >= 0 ? '+' : '';
  return `${sign}${formatCurrency(difference)}`;
};

/**
 * Calculate monthly payment for a loan
 * @param principal Loan amount
 * @param annualInterestRate Annual interest rate (as a percentage)
 * @param termInMonths Loan term in months
 * @returns Monthly payment amount
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): number => {
  // Convert annual interest rate to monthly decimal
  const monthlyRate = annualInterestRate / 100 / 12;
  
  // Calculate monthly payment using the loan formula
  if (monthlyRate === 0) {
    return principal / termInMonths;
  }
  
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termInMonths));
  return payment;
};

/**
 * Calculate total interest paid over the life of a loan
 * @param principal Loan amount
 * @param annualInterestRate Annual interest rate (as a percentage)
 * @param termInMonths Loan term in months
 * @returns Total interest paid
 */
export const calculateTotalInterest = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termInMonths);
  const totalPaid = monthlyPayment * termInMonths;
  return totalPaid - principal;
};
