# HouseHoldHero AI

**Your Smart Household Data Companion (Manual Input + Web-Powered Insights for South Africa)**

HouseHoldHero AI is a South Africa-focused personal assistant app that empowers households to manage finances, energy usage, grocery shopping, and wellness through manual data entry and AI-driven insights. By combining user-provided information with real-time web search capabilities (via Gemini API), the app delivers actionable recommendations to save money, optimize resources, and improve household well-being.

## Core Value Proposition
- Transform manual data entry into actionable insights using AI
- Leverage web search for real-time grocery price comparisons and localized energy-saving tips
- Provide contextually relevant financial literacy and wellness guidance tailored to South African households

## Features
- Manual Financial Command Centre
- Estimated Energy Insights
- Manual Stock Tracking
- Grocery Price Comparison
- Recipe Generator & Meal Planner
- Financial Literacy Coach
- Wellness & Gardening Guides

## Tech Stack
- Frontend: React Native + Tailwind CSS
- Backend: Firebase/Firestore + Node.js
- AI Integration: Google Gemini API
- State Management: Zustand + React Query

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI

### Installation
1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm start` or `yarn start`
4. Run on Android: `npm run android` or `yarn android`
5. Run on iOS: `npm run ios` or `yarn ios`

## Environment Setup
Create a `.env` file in the root directory with the following variables:
```
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
