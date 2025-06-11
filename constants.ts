import { AppSection } from './types';

export const APP_NAME = "HouseHoldHero AI";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
// export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002"; // Not used in this app

export const SA_MUNICIPAL_TARIFFS: { value: string; label: string }[] = [
  { value: "city_power_joburg", label: "City Power (Johannesburg)" },
  { value: "city_cape_town", label: "City of Cape Town" },
  { value: "ethekwini_electricity", label: "eThekwini Electricity (Durban)" },
  { value: "tshwane_electricity", label: "City of Tshwane (Pretoria)" },
  { value: "eskom_direct", label: "Eskom Direct Customer" },
  { value: "mangaung_metro", label: "Mangaung Metro (Bloemfontein)" },
  { value: "nelson_mandela_bay", label: "Nelson Mandela Bay Metro (Port Elizabeth)" },
  { value: "other", label: "Other/Not Sure" },
];

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  "Groceries", "Utilities", "Rent/Mortgage", "Transport", "Healthcare", 
  "Entertainment", "Education", "Clothing", "Personal Care", "Debt Repayment", "Other"
];

export const DEFAULT_INCOME_CATEGORIES: string[] = [
  "Salary", "Bonus", "Investment", "Freelance", "Gift", "Other"
];

export const NAVIGATION_ITEMS = [
  { name: AppSection.Dashboard, path: '/', icon: 'home' },
  { name: AppSection.Financial, path: '/financial', icon: 'currency-dollar' },
  { name: AppSection.Energy, path: '/energy', icon: 'lightning-bolt' },
  { name: AppSection.Household, path: '/household', icon: 'archive' },
  { name: AppSection.Kitchen, path: '/kitchen', icon: 'beaker' },
  { name: AppSection.Wellness, path: '/wellness', icon: 'heart' },
  { name: AppSection.Settings, path: '/settings', icon: 'cog' },
];

// Environment Variable Handling
// These should be set in your environment. For development, placeholders can be set in index.html.
if (!process.env.API_KEY || process.env.API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
  console.warn(
    "Gemini API_KEY is not set or is using a placeholder. AI features may fail. " +
    "Ensure this is properly configured in your environment or index.html for development."
  );
}
