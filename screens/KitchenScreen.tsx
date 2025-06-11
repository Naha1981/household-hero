
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select'; 
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { GroceryListItem, MealPlanItem, PriceComparisonResult, GroundingSource, AppData, AIData } from '../types';
import { getRecipeFromIngredients, getGeneralTip, compareGroceryPricesSA } from '../services/geminiService';
import { getTodaysDateISO, isFetchAllowedToday, isUsageAllowedToday, incrementUsageTracker } from '../App';

interface KitchenScreenProps {
  groceryList: GroceryListItem[];
  setGroceryList: React.Dispatch<React.SetStateAction<GroceryListItem[]>>;
  mealPlan: MealPlanItem[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlanItem[]>>;
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
}

const RECIPE_LIMIT = 3;
const PRICE_COMPARE_LIMIT = 3;

const KitchenScreen: React.FC<KitchenScreenProps> = ({ groceryList, setGroceryList, mealPlan, setMealPlan, appData, updateAppData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(searchParams.get('action') === 'recipeGen');
  
  const [ingredients, setIngredients] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<{ name: string, instructions: string, sources?: GroundingSource[] } | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  const [newGroceryItem, setNewGroceryItem] = useState('');
  const [newMealDescription, setNewMealDescription] = useState('');
  const [newMealDate, setNewMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMealType, setNewMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Dinner');
  
  const [isLoadingUsageTips, setIsLoadingUsageTips] = useState(false);

  const [itemToCompare, setItemToCompare] = useState('');
  const [priceComparisonResults, setPriceComparisonResults] = useState<PriceComparisonResult[]>([]);
  const [priceComparisonSources, setPriceComparisonSources] = useState<GroundingSource[] | undefined>(undefined);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  const recipeUsageInfo = isUsageAllowedToday(appData.recipeGenerationUsage, RECIPE_LIMIT);
  const priceCompareUsageInfo = isUsageAllowedToday(appData.priceComparisonUsage, PRICE_COMPARE_LIMIT);
  const canFetchKitchenTip = isFetchAllowedToday(appData.lastKitchenTipFetchDate);

  useEffect(() => {
    if (searchParams.get('action') === 'recipeGen' && !isRecipeModalOpen) {
      setIsRecipeModalOpen(true);
    }
  }, [searchParams, isRecipeModalOpen]);

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
    setGeneratedRecipe(null);
    searchParams.delete('action');
    setSearchParams(searchParams);
  };
  
  const handleGenerateRecipe = async () => {
    if (!ingredients || !recipeUsageInfo.allowed) return;
    setIsLoadingRecipe(true);
    setGeneratedRecipe(null);
    const recipeData = await getRecipeFromIngredients(ingredients.split(',').map(i => i.trim()));
    setGeneratedRecipe(recipeData);
    updateAppData({ recipeGenerationUsage: incrementUsageTracker(appData.recipeGenerationUsage) });
    setIsLoadingRecipe(false);
  };

  const addGroceryItem = () => {
    if (!newGroceryItem) return;
    const newItem: GroceryListItem = { id: Date.now().toString(), name: newGroceryItem, quantity: '1', isChecked: false };
    setGroceryList(prev => [newItem, ...prev]);
    setNewGroceryItem('');
  };

  const toggleGroceryItemCheck = (id: string) => setGroceryList(prev => prev.map(item => item.id === id ? { ...item, isChecked: !item.isChecked } : item));
  const removeGroceryItem = (id: string) => setGroceryList(prev => prev.filter(item => item.id !== id));

  const addMealToPlan = () => {
    if (!newMealDescription || !newMealDate) return;
    const newMeal: MealPlanItem = { id: Date.now().toString(), date: newMealDate, mealType: newMealType, description: newMealDescription };
    setMealPlan(prev => [...prev, newMeal].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewMealDescription('');
  };
  const removeMealFromPlan = (id: string) => setMealPlan(prev => prev.filter(item => item.id !== id));

  const fetchKitchenUsageTipsHandler = async () => {
    if (!canFetchKitchenTip) return;
    setIsLoadingUsageTips(true);
    const {tip, sources} = await getGeneralTip("kitchen efficiency and food preservation", "Provide a practical tip for South African households. Format as short bullet points or a concise paragraph.");
    updateAppData({
        kitchenUtilityTip: { data: tip, sources, lastFetched: getTodaysDateISO() },
        lastKitchenTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingUsageTips(false);
  };
  
  const handlePriceComparison = async () => {
    if (!itemToCompare || !priceCompareUsageInfo.allowed) return;
    setIsLoadingPrices(true);
    setPriceComparisonResults([]);
    setPriceComparisonSources(undefined);
    const { results, sources } = await compareGroceryPricesSA(itemToCompare);
    setPriceComparisonResults(results); 
    setPriceComparisonSources(sources);
    updateAppData({ priceComparisonUsage: incrementUsageTracker(appData.priceComparisonUsage) });
    setIsLoadingPrices(false);
  };
  
  const renderSources = (sources?: GroundingSource[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-2 text-xs">
        <p className="font-semibold text-slate-600">Sources:</p>
        <ul className="list-disc list-inside space-y-1">
          {sources.map((source, idx) => source.web && (
             <li key={idx}><a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{source.web.title || source.web.uri}</a></li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <SectionContainer title="Kitchen & Grocery Savings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Recipe Generator">
          <Button onClick={() => setIsRecipeModalOpen(true)} className="w-full">Open Recipe Generator</Button>
          <p className="text-xs text-slate-500 mt-2">Recipes remaining today: {RECIPE_LIMIT - recipeUsageInfo.count}</p>
        </Card>
        <Card title="Price Comparison (SA Major Chains)">
          <div className="flex items-end space-x-2 mb-2">
            <Input 
              label="Item to Compare"
              value={itemToCompare} 
              onChange={e => setItemToCompare(e.target.value)} 
              placeholder="e.g., White Bread 700g"
              className="flex-grow"
              disabled={!priceCompareUsageInfo.allowed}
            />
            <Button onClick={handlePriceComparison} isLoading={isLoadingPrices} disabled={!itemToCompare || !priceCompareUsageInfo.allowed}>Compare</Button>
          </div>
          <p className="text-xs text-slate-500 mb-2">Comparisons remaining today: {PRICE_COMPARE_LIMIT - priceCompareUsageInfo.count}</p>
          {isLoadingPrices && <LoadingSpinner text="Comparing prices..." />}
          {priceComparisonResults.length > 0 && (
            <div className="mt-3 p-3 bg-indigo-50 rounded-md border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-1">Results for "{priceComparisonResults[0]?.item || itemToCompare}":</h4>
              <ul className="text-sm space-y-1 text-slate-700">
                {priceComparisonResults.map((r, i) => (
                  <li key={i} className="border-b border-indigo-100 pb-1 last:border-b-0">
                    <span className="font-medium">{r.store}:</span> {r.price} 
                    <span className="text-xs text-slate-500 ml-2">(Checked: {new Date(r.lastChecked).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
              {renderSources(priceComparisonSources)}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Grocery List">
          <div className="flex items-end space-x-2 mb-3">
            <Input label="New Item" value={newGroceryItem} onChange={e => setNewGroceryItem(e.target.value)} placeholder="e.g., Milk 2L" className="flex-grow" onKeyDown={(e) => e.key === 'Enter' && addGroceryItem()} />
            <Button onClick={addGroceryItem}>Add</Button>
          </div>
          {groceryList.length === 0 ? <p className="text-slate-600">Your grocery list is empty.</p> : (
            <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {groceryList.map(item => (
                <li key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={item.isChecked} onChange={() => toggleGroceryItemCheck(item.id)} className="form-checkbox h-5 w-5 text-primary rounded border-slate-300 focus:ring-primary/50" />
                    <span className={`${item.isChecked ? 'line-through text-slate-500' : 'text-slate-700'}`}>{item.name} {item.quantity !== '1' ? `(${item.quantity})` : ''}</span>
                  </label>
                  <Button size="sm" variant="ghost" onClick={() => removeGroceryItem(item.id)} className="text-error hover:bg-error/10 p-1">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Meal Planner (Manual)">
          <div className="space-y-4 mb-4">
            <Input label="Meal Date" type="date" value={newMealDate} onChange={e => setNewMealDate(e.target.value)} />
            <Select label="Meal Type" value={newMealType} onChange={e => setNewMealType(e.target.value as any)}
              options={[ {value: 'Breakfast', label: 'Breakfast'}, {value: 'Lunch', label: 'Lunch'}, {value: 'Dinner', label: 'Dinner'}, {value: 'Snack', label: 'Snack'} ]} />
            <Input label="Meal Description" value={newMealDescription} onChange={e => setNewMealDescription(e.target.value)} placeholder="e.g., Chicken Curry with Rice" />
            <Button onClick={addMealToPlan} className="w-full">Add to Meal Plan</Button>
          </div>
          {mealPlan.length === 0 ? <p className="text-slate-600">Your meal plan is empty.</p> : (
            <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {mealPlan.map(meal => (
                <li key={meal.id} className="p-3 rounded hover:bg-slate-100 border-b border-slate-200 last:border-b-0 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">{new Date(meal.date).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })} - {meal.mealType}</p>
                      <p className="text-sm text-slate-600">{meal.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeMealFromPlan(meal.id)} className="text-error hover:bg-error/10 p-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      
      <Card title="Kitchen Efficiency & Food Preservation Tips">
          {isLoadingUsageTips ? <LoadingSpinner text="Fetching tips..." /> : (
            appData.kitchenUtilityTip?.data ? (
              <>
                <p className="text-slate-600 mb-2 whitespace-pre-line">{appData.kitchenUtilityTip.data}</p>
                {renderSources(appData.kitchenUtilityTip.sources)}
                {!canFetchKitchenTip && <p className="text-xs text-slate-500 mt-3 italic">Today's tip received.</p>}
              </>
            ) : null
          )}
          {canFetchKitchenTip && (
            <Button onClick={fetchKitchenUsageTipsHandler} disabled={isLoadingUsageTips} className="mt-3">
              Get Today's Kitchen Tip
            </Button>
          )}
      </Card>

      <Modal isOpen={isRecipeModalOpen} onClose={closeRecipeModal} title="Recipe Generator">
        <div className="space-y-4">
          <Input label="Enter ingredients (comma-separated)" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="e.g., chicken, rice, broccoli" disabled={!recipeUsageInfo.allowed}/>
          <p className="text-xs text-slate-500">Recipes remaining today: {RECIPE_LIMIT - recipeUsageInfo.count}</p>
          <Button onClick={handleGenerateRecipe} isLoading={isLoadingRecipe} className="w-full" disabled={!ingredients || !recipeUsageInfo.allowed || isLoadingRecipe}>
            Generate Recipe
          </Button>
          {isLoadingRecipe && <LoadingSpinner text="Generating recipe..." />}
          {generatedRecipe && (
            <div className="mt-4 p-4 bg-slate-100 rounded-md border border-slate-200">
              <h4 className="font-semibold text-lg text-secondary mb-2">{generatedRecipe.name}</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line">{generatedRecipe.instructions}</p>
              {renderSources(generatedRecipe.sources)}
            </div>
          )}
        </div>
      </Modal>
    </SectionContainer>
  );
};

export default KitchenScreen;
