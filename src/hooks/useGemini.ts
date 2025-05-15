import { useState } from 'react';
import { useQuery, useMutation, QueryClient } from 'react-query';
import GeminiService from '../services/GeminiService';

// Create a query client
export const queryClient = new QueryClient();

/**
 * Custom hook for interacting with the Gemini API
 */
export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generate a response from Gemini using a custom prompt
   */
  const generateResponse = useMutation(
    async (prompt: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.generateResponse(prompt);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Analyze financial transactions
   */
  const analyzeFinances = useMutation(
    async ({ userId, transactions }: { userId: string; transactions: any[] }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.analyzeFinances(userId, transactions);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Calculate energy costs
   */
  const calculateEnergyCosts = useMutation(
    async ({ 
      userId, 
      meterReading, 
      tariff, 
      appliances 
    }: { 
      userId: string; 
      meterReading: number; 
      tariff: string; 
      appliances: any[] 
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.calculateEnergyCosts(
          userId, 
          meterReading, 
          tariff, 
          appliances
        );
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Compare grocery prices
   */
  const compareGroceryPrices = useMutation(
    async (groceryList: string[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.compareGroceryPrices(groceryList);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Generate recipes
   */
  const generateRecipes = useMutation(
    async ({ 
      ingredients, 
      dietaryPreferences 
    }: { 
      ingredients: string[]; 
      dietaryPreferences?: string[] 
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.generateRecipes(
          ingredients, 
          dietaryPreferences
        );
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Get financial advice
   */
  const getFinancialAdvice = useMutation(
    async (topic: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.getFinancialAdvice(topic);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Get wellness tips
   */
  const getWellnessTips = useMutation(
    async (category: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.getWellnessTips(category);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  /**
   * Get gardening advice
   */
  const getGardeningAdvice = useMutation(
    async ({ plantType, region }: { plantType: string; region: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GeminiService.getGardeningAdvice(plantType, region);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  );

  return {
    isLoading,
    error,
    generateResponse,
    analyzeFinances,
    calculateEnergyCosts,
    compareGroceryPrices,
    generateRecipes,
    getFinancialAdvice,
    getWellnessTips,
    getGardeningAdvice
  };
};

export default useGemini;
