/**
 * Utility functions for energy calculations
 */

// South African electricity tariff data (simplified for demonstration)
// In a real app, this would be fetched from a database or API
export const ELECTRICITY_TARIFFS = {
  eskom: {
    'Homepower 1': { baseRate: 1.85, serviceCharge: 150 },
    'Homepower 2': { baseRate: 2.10, serviceCharge: 180 },
    'Homepower 3': { baseRate: 2.35, serviceCharge: 210 },
    'Homepower 4': { baseRate: 2.60, serviceCharge: 240 }
  },
  city_power: {
    'Prepaid': { baseRate: 2.05, serviceCharge: 0 },
    'Conventional': { baseRate: 1.95, serviceCharge: 160 },
    'Business': { baseRate: 2.40, serviceCharge: 250 }
  },
  cape_town: {
    'Domestic': { baseRate: 2.15, serviceCharge: 170 },
    'Lifeline': { baseRate: 1.75, serviceCharge: 90 }
  },
  tshwane: {
    'Residential': { baseRate: 2.20, serviceCharge: 180 },
    'Prepaid': { baseRate: 2.30, serviceCharge: 0 }
  }
};

// Appliance average wattage data (in watts)
export const APPLIANCE_WATTAGE = {
  geyser: 3000,
  refrigerator: 150,
  stove: 2000,
  oven: 2500,
  microwave: 1000,
  kettle: 2000,
  toaster: 800,
  iron: 1000,
  washing_machine: 500,
  dishwasher: 1200,
  tv: 100,
  computer: 150,
  air_conditioner: 1500,
  heater: 2000,
  fan: 60,
  lights_led: 10,
  lights_cfl: 20,
  lights_incandescent: 60
};

/**
 * Calculate daily energy usage in kWh based on appliance usage
 * @param appliances Object with appliance names and hours used per day
 * @returns Daily energy usage in kWh
 */
export const calculateDailyUsage = (
  appliances: Record<string, number>
): number => {
  let totalDailyUsage = 0;
  
  for (const [appliance, hoursPerDay] of Object.entries(appliances)) {
    const wattage = APPLIANCE_WATTAGE[appliance as keyof typeof APPLIANCE_WATTAGE] || 0;
    const dailyUsage = (wattage * hoursPerDay) / 1000; // Convert to kWh
    totalDailyUsage += dailyUsage;
  }
  
  return totalDailyUsage;
};

/**
 * Calculate monthly energy cost based on daily usage and tariff
 * @param dailyUsage Daily energy usage in kWh
 * @param provider Electricity provider
 * @param tariff Tariff name
 * @returns Monthly cost in Rand
 */
export const calculateMonthlyCost = (
  dailyUsage: number,
  provider: string,
  tariff: string
): number => {
  // Get tariff data
  const tariffData = ELECTRICITY_TARIFFS[provider as keyof typeof ELECTRICITY_TARIFFS]?.[tariff];
  
  if (!tariffData) {
    return 0;
  }
  
  const monthlyUsage = dailyUsage * 30; // Approximate monthly usage
  const energyCost = monthlyUsage * tariffData.baseRate;
  const totalCost = energyCost + tariffData.serviceCharge;
  
  return totalCost;
};

/**
 * Calculate days remaining based on current units and daily usage
 * @param currentUnits Current units remaining
 * @param dailyUsage Daily usage in units
 * @returns Days remaining
 */
export const calculateDaysRemaining = (
  currentUnits: number,
  dailyUsage: number
): number => {
  if (dailyUsage <= 0) return 0;
  return Math.floor(currentUnits / dailyUsage);
};

/**
 * Calculate average daily usage from historical readings
 * @param readings Array of readings with date and value
 * @returns Average daily usage
 */
export const calculateAverageDailyUsage = (
  readings: Array<{ date: string; reading: number }>
): number => {
  if (readings.length < 2) return 0;
  
  // Sort readings by date
  const sortedReadings = [...readings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate total usage and days
  let totalUsage = 0;
  let totalDays = 0;
  
  for (let i = 1; i < sortedReadings.length; i++) {
    const prevReading = sortedReadings[i - 1].reading;
    const currentReading = sortedReadings[i].reading;
    const usage = prevReading - currentReading;
    
    const prevDate = new Date(sortedReadings[i - 1].date);
    const currentDate = new Date(sortedReadings[i].date);
    const days = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (usage > 0 && days > 0) {
      totalUsage += usage;
      totalDays += days;
    }
  }
  
  if (totalDays === 0) return 0;
  return totalUsage / totalDays;
};

/**
 * Calculate appliance usage breakdown based on total usage
 * @param totalDailyUsage Total daily usage in kWh
 * @returns Object with appliance categories and their percentage of total usage
 */
export const calculateApplianceBreakdown = (
  totalDailyUsage: number
): Record<string, { percentage: number; dailyUsage: number; monthlyCost: number }> => {
  // Typical South African household appliance usage distribution
  const distribution = {
    geyser: 0.38, // 38%
    refrigerator: 0.18, // 18%
    cooking: 0.14, // 14%
    lights: 0.12, // 12%
    entertainment: 0.09, // 9%
    other: 0.09 // 9%
  };
  
  const breakdown: Record<string, { percentage: number; dailyUsage: number; monthlyCost: number }> = {};
  
  for (const [appliance, percentage] of Object.entries(distribution)) {
    const dailyUsage = totalDailyUsage * percentage;
    const monthlyCost = dailyUsage * 30 * 2.10; // Using average rate of R2.10 per kWh
    
    breakdown[appliance] = {
      percentage: percentage * 100,
      dailyUsage,
      monthlyCost
    };
  }
  
  return breakdown;
};

/**
 * Generate energy saving tips based on appliance usage
 * @param applianceBreakdown Appliance usage breakdown
 * @returns Array of energy saving tips
 */
export const generateEnergySavingTips = (
  applianceBreakdown: Record<string, { percentage: number }>
): string[] => {
  const tips: string[] = [];
  
  // Sort appliances by percentage
  const sortedAppliances = Object.entries(applianceBreakdown)
    .sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Add tips for top energy consumers
  for (const [appliance, data] of sortedAppliances) {
    if (appliance === 'geyser' && data.percentage > 30) {
      tips.push('Install a geyser timer to reduce electricity usage by up to 40%.');
      tips.push('Insulate your geyser and hot water pipes to reduce heat loss.');
    }
    
    if (appliance === 'refrigerator' && data.percentage > 15) {
      tips.push('Ensure your refrigerator door seals properly and set the temperature to 3-4°C for optimal efficiency.');
      tips.push('Keep your refrigerator away from heat sources and allow air circulation around it.');
    }
    
    if (appliance === 'cooking' && data.percentage > 10) {
      tips.push('Use lids on pots and pans to reduce cooking time and energy usage.');
      tips.push('Match pot size to stove plate size for efficient cooking.');
    }
    
    if (appliance === 'lights' && data.percentage > 10) {
      tips.push('Replace incandescent bulbs with LED lights to reduce lighting costs by up to 80%.');
      tips.push('Use natural light whenever possible and turn off lights in unoccupied rooms.');
    }
    
    if (appliance === 'entertainment' && data.percentage > 5) {
      tips.push('Unplug electronics when not in use to eliminate phantom power usage.');
      tips.push('Use power strips to easily turn off multiple devices at once.');
    }
  }
  
  // Add general tips
  tips.push('During loadshedding, switch off your geyser before the power goes off and only switch it back on an hour after power returns.');
  tips.push('Consider investing in energy-efficient appliances when replacing old ones.');
  tips.push('Use cold water for laundry when possible to save on water heating costs.');
  
  // Return a subset of tips (maximum 5)
  return tips.slice(0, 5);
};
