/**
 * Utility functions for date and time operations
 */

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "15 May 2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format a date string to include time
 * @param dateString ISO date string
 * @returns Formatted date and time string (e.g., "15 May 2025, 14:30")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get the current date as an ISO string
 * @returns Current date as ISO string
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

/**
 * Get the current date formatted as YYYY-MM-DD
 * @returns Current date in YYYY-MM-DD format
 */
export const getCurrentDateFormatted = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Calculate the difference in days between two dates
 * @param date1 First date
 * @param date2 Second date (defaults to current date)
 * @returns Number of days between the dates
 */
export const getDaysDifference = (date1: string, date2?: string): number => {
  const firstDate = new Date(date1);
  const secondDate = date2 ? new Date(date2) : new Date();
  
  // Convert to UTC to avoid timezone issues
  const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
  
  // Calculate difference in days
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

/**
 * Get the start and end dates for a specific period
 * @param period Period type ('week', 'month', 'year')
 * @returns Object with start and end dates
 */
export const getPeriodDates = (period: 'week' | 'month' | 'year'): { start: string; end: string } => {
  const now = new Date();
  let start = new Date();
  
  if (period === 'week') {
    // Set to the beginning of the current week (Sunday)
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    start.setDate(now.getDate() - day);
  } else if (period === 'month') {
    // Set to the first day of the current month
    start.setDate(1);
  } else if (period === 'year') {
    // Set to the first day of the current year
    start = new Date(now.getFullYear(), 0, 1);
  }
  
  // Reset time to start of day
  start.setHours(0, 0, 0, 0);
  
  return {
    start: start.toISOString(),
    end: now.toISOString()
  };
};

/**
 * Check if a date is in the past
 * @param dateString Date to check
 * @returns True if the date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 days")
 * @param dateString Date to compare
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = getDaysDifference(dateString);
  
  if (date > now) {
    // Future date
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `in ${diffInDays} days`;
    if (diffInDays < 30) return `in ${Math.floor(diffInDays / 7)} weeks`;
    return `in ${Math.floor(diffInDays / 30)} months`;
  } else {
    // Past date
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }
};
