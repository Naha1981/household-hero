import axios from 'axios';

// The API key should be stored in an environment variable
// For development purposes, we're using the key provided in the PRD
const GEMINI_API_KEY = 'AIzaSyA3awtnaNSnb968uiwWJ4GiUYj2VYIl55Y';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

class GeminiService {
  /**
   * Send a prompt to the Gemini API and get a response
   * @param prompt The prompt to send to Gemini
   * @returns The response text from Gemini
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }
      );

      const data = response.data as GeminiResponse;
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API');
    }
  }

  /**
   * Analyze financial transactions and provide insights
   * @param userId The user ID
   * @param transactions The user's financial transactions
   * @returns Financial insights from Gemini
   */
  async analyzeFinances(userId: string, transactions: any[]): Promise<string> {
    const prompt = `
      Analyze the following manually entered transactions for ${userId}:
      - Identify spending hotspots exceeding the budget.
      - Suggest adjustments based on SA benchmarks (e.g., average grocery costs).
      - Format results as a summary with visualizable data (e.g., pie charts).
      
      Transactions: ${JSON.stringify(transactions)}
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Calculate energy costs and provide insights
   * @param userId The user ID
   * @param meterReading Current meter reading
   * @param tariff Electricity tariff
   * @param appliances List of appliances with usage data
   * @returns Energy usage insights from Gemini
   */
  async calculateEnergyCosts(
    userId: string, 
    meterReading: number, 
    tariff: string, 
    appliances: any[]
  ): Promise<string> {
    const prompt = `
      Calculate energy costs for ${userId} using:
      - Meter reading: ${meterReading} units.
      - Tariff: ${tariff}.
      - Appliance data: ${JSON.stringify(appliances)} with average wattage from public sources.
      Provide a breakdown by appliance type and actionable savings tips.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Compare grocery prices across retailers
   * @param groceryList List of grocery items to compare
   * @returns Price comparison insights from Gemini
   */
  async compareGroceryPrices(groceryList: string[]): Promise<string> {
    const prompt = `
      Search real-time prices for ${JSON.stringify(groceryList)} across South African retailers (Checkers, PnP, etc.).
      Highlight the cheapest retailer for each item and overall savings opportunities.
      Use web search to verify current specials.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate recipes based on available ingredients
   * @param ingredients List of available ingredients
   * @param dietaryPreferences Dietary preferences
   * @returns Recipe suggestions from Gemini
   */
  async generateRecipes(ingredients: string[], dietaryPreferences: string[] = []): Promise<string> {
    const prompt = `
      Generate 3 recipes using ${JSON.stringify(ingredients)} and dietary preferences: ${JSON.stringify(dietaryPreferences)}.
      Prioritize SA-relevant dishes and source recipes from credible websites via web search.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Get financial literacy advice
   * @param topic Financial topic to get advice on
   * @returns Financial advice from Gemini
   */
  async getFinancialAdvice(topic: string): Promise<string> {
    const prompt = `
      Provide South African-specific financial advice on the topic: ${topic}.
      Include relevant regulations, local context, and practical tips for South African households.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Get wellness tips
   * @param category Wellness category (fitness, mental health, etc.)
   * @returns Wellness tips from Gemini
   */
  async getWellnessTips(category: string): Promise<string> {
    const prompt = `
      Provide practical wellness tips for South African households in the category: ${category}.
      Include tips that are accessible, affordable, and relevant to the South African context.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Get gardening advice
   * @param plantType Type of plants
   * @param region South African region
   * @returns Gardening advice from Gemini
   */
  async getGardeningAdvice(plantType: string, region: string): Promise<string> {
    const prompt = `
      Provide gardening advice for growing ${plantType} in ${region}, South Africa.
      Include information about climate adaptation, water conservation, and local growing conditions.
    `;

    return this.generateResponse(prompt);
  }
}

export default new GeminiService();
