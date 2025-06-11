

import { GoogleGenAI, GenerateContentResponse, Part, GroundingChunk } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { Transaction, GroundingSource, PriceComparisonResult, BudgetItem, UserProfile, TransactionType } from "../types";

// Initialize directly using process.env.API_KEY as per guidelines.
// The SDK will handle issues if the key is missing/invalid.
// Assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

const formattingInstructions = `Please provide a response that is clean and well-formatted. Use clear headings with bold font. Employ bullet points only when necessary for lists. Avoid the use of asterisks (*) or double asterisks (**) for emphasis within paragraphs, except for bolding headings. Do not include introductory phrases like 'Here is...' or similar.`;

const parseJsonFromGeminiResponse = <T,>(textResponse: string): T | null => {
  let jsonStr = textResponse.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Gemini response:", error, "Original text:", textResponse);
    return null;
  }
};

export const getCategorySuggestion = async (description: string, existingCategories: string[]): Promise<string> => {
  // Removed API key check here; assuming key is valid and proceeding with API call.
  try {
    const prompt = `Given the transaction description "${description}" and the existing categories [${existingCategories.join(", ")}], suggest the most appropriate single category. If unsure, suggest "Other". Respond with only the category name. Do not use introductory phrases.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    return response.text.trim() || "Other";
  } catch (error) {
    console.error("Error getting category suggestion:", error);
    return "Other (Error)";
  }
};

export const getFinancialLiteracyTip = async (): Promise<{ tip: string, sources?: GroundingSource[] }> => {
  // Removed API key check here
  try {
    const prompt = `Provide a concise financial literacy tip relevant for South African households. Focus on practical advice for budgeting, saving, or managing debt. Make the tip easy to understand and actionable. If possible, use Google Search to find relevant, up-to-date information or context if the tip relates to current economic conditions or specific SA financial products.
${formattingInstructions}`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    const tip = response.text.trim();
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];
      
    return { tip: tip || "Could not fetch tip.", sources };
  } catch (error) {
    console.error("Error getting financial literacy tip:", error);
    return { tip: "Error fetching tip. Check console." };
  }
};

export const getRecipeFromIngredients = async (ingredients: string[], mealType?: string, dietaryRestrictions?: string[]): Promise<{ name: string, instructions: string, sources?: GroundingSource[] }> => {
  // Removed API key check here
  try {
    let prompt = `Generate a simple recipe using these ingredients: ${ingredients.join(", ")}.`;
    if (mealType) prompt += ` Suitable for ${mealType}.`;
    if (dietaryRestrictions && dietaryRestrictions.length > 0) prompt += ` Keep in mind these dietary restrictions: ${dietaryRestrictions.join(", ")}.`;
    prompt += ` The recipe should be easy to follow for a home cook. Provide a recipe name and step-by-step instructions.
Format the response as JSON with "name" and "instructions" keys.
For the text in the "instructions" field: Use clear, numbered steps. Use **bold headings** for any sub-sections if appropriate. Avoid asterisks for emphasis. Employ bullet points only if necessary for lists (numbered steps are preferred for instructions).
Ensure the overall output is ONLY the JSON object. Do not use introductory phrases like 'Here is...' or similar.
Use Google Search to find a suitable, publicly available recipe if possible.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        // responseMimeType: "application/json", // Keep this if G specifies, but the prompt is strong for JSON only.
      }
    });

    const parsed = parseJsonFromGeminiResponse<{ name: string; instructions: string }>(response.text);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];

    if (parsed) {
      return { ...parsed, sources };
    }
    console.warn("Failed to parse recipe JSON from Gemini response or response was not JSON. Raw text:", response.text);
    return { name: "Recipe Not Found", instructions: "Could not generate a recipe with the given ingredients. Gemini response: " + response.text, sources };

  } catch (error) {
    console.error("Error getting recipe:", error);
    return { name: "Error Generating Recipe", instructions: "An error occurred while trying to generate the recipe." };
  }
};

export const getEnergyTipsSA = async (): Promise<{ tips: string[], sources?: GroundingSource[] }> => {
  // Removed API key check here
  try {
    const prompt = `Provide 3-5 practical and concise energy-saving tips for South African households. Consider common appliances and typical energy usage patterns in SA. Format the tips as a list. Use Google Search to ensure tips are relevant and potentially reference local conditions or common appliance types.
${formattingInstructions}`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    const rawText = response.text.trim();
    // Improved parsing for bullet points, numbered lists, or simple lines if no clear list format detected
    let tips = rawText.split('\n')
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0);

    // If it looks like a list (starts with bullet/number), clean it up
    if (tips.length > 1 && tips.every(tip => /^(\*|-|\d+\.|[a-zA-Z]\.)\s/.test(tip))) {
        tips = tips.map(tip => tip.replace(/^(\*|-|\d+\.|[a-zA-Z]\.)\s*/, ''));
    } else if (tips.length === 1 && rawText.includes('\n')) { // Single block with newlines, treat as separate if user expects list
        tips = rawText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    }


    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];

    return { tips: tips.length > 0 ? tips : [rawText || "Could not fetch tips."], sources };
  } catch (error) {
    console.error("Error getting energy tips:", error);
    return { tips: ["Error fetching energy tips."] };
  }
};

export const analyzeSpendingForSavings = async (transactions: Transaction[], budgetItems: BudgetItem[]): Promise<{ analysis: string, sources?: GroundingSource[] }> => {
  // Removed API key check here
  if (transactions.length === 0) return { analysis: "No transactions to analyze. Log some expenses first!" };

  try {
    const expenseSummary = transactions
      .filter(t => t.type === TransactionType.Expense)
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    const budgetSummary = budgetItems.reduce((acc, item) => {
      acc[item.category] = item.allocated;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `
Analyze the following spending data for a South African household and provide actionable savings tips.
Focus on categories where spending is high or exceeds budget.
Be practical and context-aware for South Africa.
Spending: ${JSON.stringify(expenseSummary)}
Budget: ${JSON.stringify(budgetSummary)}
Provide insights and 2-3 specific, actionable savings suggestions.
Use Google Search for context if needed (e.g., tips for saving on groceries in SA).
${formattingInstructions}`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    
    const analysis = response.text.trim();
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];

    return { analysis: analysis || "Could not generate spending analysis.", sources };

  } catch (error) {
    console.error("Error analyzing spending:", error);
    return { analysis: "Error performing spending analysis." };
  }
};


export const getGeneralTip = async (topic: string, context?: string): Promise<{ tip: string, sources?: GroundingSource[] }> => {
  // Removed API key check here
  try {
    let prompt = `Provide a concise and practical tip on "${topic}" for a South African household.`;
    if (context) {
      prompt += ` Context: ${context}.`;
    }
    prompt += ` Make it easy to read and actionable. Use Google Search for relevant, up-to-date information or local context.
${formattingInstructions}`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    const tip = response.text.trim();
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];
      
    return { tip: tip || `Could not fetch tip for ${topic}.`, sources };
  } catch (error) {
    console.error(`Error getting tip for ${topic}:`, error);
    return { tip: `Error fetching tip for ${topic}. Check console.` };
  }
};

export const compareGroceryPricesSA = async (itemName: string): Promise<{ results: PriceComparisonResult[], sources?: GroundingSource[] }> => {
  // Removed API key check here
  try {
    const prompt = `Compare current prices for "${itemName}" across major South African grocery chains like Checkers, Pick n Pay, Woolworths, Spar, Shoprite.
Provide the results as a JSON array, where each object has "item", "store", "price", and "lastChecked" (use today's date in ISO format).
Example: [{"item": "Milk 1L", "store": "Checkers", "price": "R20.99", "lastChecked": "YYYY-MM-DDTHH:mm:ss.sssZ"}]
Use Google Search to find this information. If a price isn't found for a specific store, omit it or state "N/A".
If you find multiple prices for the same item at the same store (e.g. online vs in-store, different pack sizes that are still the core item), list the most common or standard one.
Return ONLY the JSON array as your response. Do not use introductory phrases like 'Here is...' or any other text outside the JSON array.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json", // Model should infer from "Return ONLY JSON"
      },
    });
    
    const parsedResults = parseJsonFromGeminiResponse<PriceComparisonResult[]>(response.text);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];

    if (parsedResults) {
      const resultsWithDate = parsedResults.map(r => ({
        ...r,
        item: itemName, 
        lastChecked: r.lastChecked || new Date().toISOString()
      }));
      return { results: resultsWithDate, sources };
    }
    
    console.warn("Failed to parse price comparison results, or Gemini returned non-JSON. Raw text:", response.text);
    return { 
      results: [{ item: itemName, store: "Error", price: "Could not fetch/parse prices. Response: " + response.text.substring(0,100) + "...", lastChecked: new Date().toISOString() }],
      sources 
    };

  } catch (error) {
    console.error("Error comparing grocery prices:", error);
    let errorMessage = "Service unavailable";
    if (error instanceof Error && (error as any).message) { 
        errorMessage = (error as any).message;
    }
    return { results: [{ item: itemName, store: "Error", price: `Service error: ${errorMessage}`, lastChecked: new Date().toISOString() }] };
  }
};

export const estimateApplianceConsumption = async (
  totalKWh: number, 
  period: string, 
  applianceNames: string[]
): Promise<{ estimates: Record<string, string>, sources?: GroundingSource[] }> => {
  // Removed API key check here
  if (applianceNames.length === 0) return { estimates: { info: "No appliances listed to estimate for." } };

  try {
    const prompt = `A South African household consumed a total of ${totalKWh} kWh over ${period}. 
Their listed appliances are: [${applianceNames.join(', ')}]. 
Please provide an estimated breakdown of kWh consumption for each of these listed appliances. 
The sum of individual estimates should closely match the total ${totalKWh} kWh. 
Consider typical usage patterns for these appliances in South Africa. 
Respond ONLY with a JSON object mapping appliance names (from the provided list) to their estimated kWh consumption as a string (e.g., "Geyser": "5 kWh", "Fridge": "1.2 kWh").
Example JSON: {"${applianceNames[0]}": "X kWh", "${applianceNames[1] || 'AnotherAppliance'}": "Y kWh"}.
Do not use introductory phrases like 'Here is...' or any other text outside the JSON object.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
         responseMimeType: "application/json", 
      },
    });

    const parsedEstimates = parseJsonFromGeminiResponse<Record<string, string>>(response.text);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata; 
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];
      
    if (parsedEstimates) {
      return { estimates: parsedEstimates, sources };
    }

    console.warn("Failed to parse consumption estimates JSON. Raw text:", response.text);
    return { estimates: { error: "Could not parse estimates. Response: " + response.text.substring(0,100) + "..." } };

  } catch (error) {
    console.error("Error estimating appliance consumption:", error);
    let errorMessage = "Service unavailable";
     if (error instanceof Error && (error as any).message) { 
        errorMessage = (error as any).message;
    }
    return { estimates: { error: `Service error: ${errorMessage}` } };
  }
};

export const getBudgetFeedback = async (
  budgetItems: BudgetItem[],
  transactions: Transaction[],
  userProfile: UserProfile | null
): Promise<{ feedback: string, sources?: GroundingSource[] }> => {
  // Removed API key check here
  if (budgetItems.length === 0) return { feedback: "No budget set. Please add budget items first to get feedback." };

  const expenseTransactions = transactions.filter(t => t.type === TransactionType.Expense);
  const spendingByBudgetCategory: Record<string, number> = {};

  for (const budgetItem of budgetItems) {
    spendingByBudgetCategory[budgetItem.category] = expenseTransactions
      .filter(t => t.category === budgetItem.category)
      // Summing for the current month for simplicity. A real app might need date filtering.
      .reduce((sum, t) => sum + t.amount, 0);
  }

  let prompt = `Analyze the following household budget for a South African context.
Budget Items (Category: Allocated Amount R per month):
${budgetItems.map(item => `- ${item.category}: R${item.allocated.toFixed(2)}`).join('\n')}

Actual Spending in these categories for the current period (Category: Spent Amount R):
${Object.entries(spendingByBudgetCategory).map(([cat, spent]) => `- ${cat}: R${spent.toFixed(2)}`).join('\n')}
`;

  if (userProfile) {
    prompt += "\nUser Profile Context (Optional):\n";
    if (userProfile.incomeLevel) prompt += `- Income Level: ${userProfile.incomeLevel}\n`;
    if (userProfile.location) prompt += `- Location: ${userProfile.location}\n`;
    if (userProfile.householdSize) prompt += `- Household Size: ${userProfile.householdSize}\n`;
  }

  prompt += `
Provide feedback on this budget's realism. Identify categories where spending significantly deviates from the allocated budget (either over or under).
Offer 2-3 specific, actionable suggestions for improvement, better alignment, or staying on track.
Use Google Search if needed for general South African household spending benchmarks or cost-saving tips relevant to the categories mentioned.
${formattingInstructions}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    const feedback = response.text.trim();
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!web && !!web.uri)
      .map(web => ({ web })) || [];
      
    return { feedback: feedback || "Could not generate budget feedback at this time.", sources };
  } catch (error) {
    console.error("Error getting budget feedback:", error);
    return { feedback: "Error performing budget analysis. Please check console." };
  }
};