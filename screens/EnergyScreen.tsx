import React, { useState, useEffect } from 'react';
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserProfile, Appliance, AppData, AIData, ConsumptionEstimateData, DatedFetchTracker, GroundingSource } from '../types';
import { SA_MUNICIPAL_TARIFFS } from '../constants';
import { getEnergyTipsSA, getGeneralTip, estimateApplianceConsumption } from '../services/geminiService';
import { getTodaysDateISO, isFetchAllowedToday } from '../App';

interface EnergyScreenProps {
  userProfile: UserProfile | null;
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
}

const EnergyScreen: React.FC<EnergyScreenProps> = ({ userProfile, appliances, setAppliances, appData, updateAppData }) => {
  const [selectedTariff, setSelectedTariff] = useState(userProfile?.electricityTariff || SA_MUNICIPAL_TARIFFS[0]?.value);
  const [totalKWhInput, setTotalKWhInput] = useState('');
  const [consumptionPeriodInput, setConsumptionPeriodInput] = useState('last 24 hours');
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [isLoadingApplianceCare, setIsLoadingApplianceCare] = useState(false);
  const [selectedApplianceForCare, setSelectedApplianceForCare] = useState(appliances.length > 0 ? appliances[0].name : '');
  const [isLoadingInsurance, setIsLoadingInsurance] = useState(false);
  const [newApplianceNameInput, setNewApplianceNameInput] = useState('');


  const canFetchEnergyTips = isFetchAllowedToday(appData.lastEnergySavingTipFetchDate);
  const canFetchInsuranceTip = isFetchAllowedToday(appData.lastInsuranceBasicTipFetchDate);
  const canFetchConsumptionEstimate = isFetchAllowedToday(appData.lastConsumptionEstimateRequestDate);

  const canFetchApplianceCareTip = (applianceName: string): boolean => {
    if (!applianceName) return false;
    const lastFetchDate = appData.lastApplianceCareTipFetchDates?.[applianceName];
    return isFetchAllowedToday(lastFetchDate);
  };
  
  const fetchEnergySavingTips = async () => {
    if (!canFetchEnergyTips) return;
    setIsLoadingTips(true);
    const { tips, sources } = await getEnergyTipsSA();
    updateAppData({
      energySavingTips: { data: tips, sources, lastFetched: getTodaysDateISO() },
      lastEnergySavingTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingTips(false);
  };
  
  const fetchApplianceCareTipHandler = async (applianceName: string) => {
    if (!applianceName || !canFetchApplianceCareTip(applianceName)) return;
    setSelectedApplianceForCare(applianceName);
    setIsLoadingApplianceCare(true);
    const { tip, sources } = await getGeneralTip(`care and maintenance for ${applianceName}`, "Provide a practical tip for extending its lifespan or ensuring efficiency for a household appliance. Format as a short, clear paragraph or bullet points.");
    
    const updatedCareTips = { ...(appData.applianceCareTips || {}) };
    updatedCareTips[applianceName] = { data: tip, sources, lastFetched: getTodaysDateISO() };
    
    const updatedFetchDates = { ...(appData.lastApplianceCareTipFetchDates || {}) };
    updatedFetchDates[applianceName] = getTodaysDateISO();

    updateAppData({
      applianceCareTips: updatedCareTips,
      lastApplianceCareTipFetchDates: updatedFetchDates,
    });
    setIsLoadingApplianceCare(false);
  };

  const fetchInsuranceBasicsTip = async () => {
    if (!canFetchInsuranceTip) return;
    setIsLoadingInsurance(true);
    const { tip, sources } = await getGeneralTip("household insurance basics", "Explain a fundamental concept of household or contents insurance relevant for South Africans, without recommending specific policies. Format as a short, clear paragraph or bullet points.");
    updateAppData({
      insuranceBasicTip: { data: tip, sources, lastFetched: getTodaysDateISO() },
      lastInsuranceBasicTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingInsurance(false);
  };

  const handleEstimateConsumption = async () => {
    if (!canFetchConsumptionEstimate || !totalKWhInput || !consumptionPeriodInput || appliances.length === 0) {
        alert("Please enter total kWh, period, and ensure you have appliances listed. You can estimate once per day.");
        return;
    }
    setIsLoadingEstimates(true);
    const applianceNames = appliances.map(a => a.name);
    const kwh = parseFloat(totalKWhInput);
    const { estimates, sources } = await estimateApplianceConsumption(kwh, consumptionPeriodInput, applianceNames);
    
    const estimateData: ConsumptionEstimateData = { estimates, totalKWh: kwh, period: consumptionPeriodInput };
    updateAppData({
      consumptionEstimates: { data: estimateData, sources, lastFetched: getTodaysDateISO() },
      lastConsumptionEstimateRequestDate: getTodaysDateISO(),
    });
    setIsLoadingEstimates(false);
  };

  const handleAddApplianceKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newApplianceNameInput.trim()) {
      handleAddAppliance(newApplianceNameInput.trim());
      setNewApplianceNameInput(''); // Clear input after adding
    }
  };
  
  const handleAddAppliance = (applianceName: string) => { 
    if (applianceName && !appliances.find(a => a.name.toLowerCase() === applianceName.toLowerCase())) {
      const newAppliance: Appliance = {
        id: Date.now().toString(),
        name: applianceName,
        estimatedKWHLow: 0, 
        estimatedKWHHigh: 0,
      };
      setAppliances([...appliances, newAppliance]);
      if (!selectedApplianceForCare) setSelectedApplianceForCare(newAppliance.name);
      setNewApplianceNameInput(''); // Clear input after adding
    }
  };

  useEffect(() => {
    if (appliances.length > 0 && !selectedApplianceForCare) {
        setSelectedApplianceForCare(appliances[0].name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliances]);

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
    <SectionContainer title="Energy & Appliance Insights">
      <Card title="Your Tariff" className="mb-6">
        <Select
          label="Current Electricity Tariff"
          options={SA_MUNICIPAL_TARIFFS}
          value={selectedTariff}
          onChange={(e) => {
            setSelectedTariff(e.target.value);
            // updateAppData({ userProfile: { ...appData.userProfile!, electricityTariff: e.target.value }});
          }}
        />
        <p className="text-xs text-slate-500 mt-2">Selected: {SA_MUNICIPAL_TARIFFS.find(t => t.value === selectedTariff)?.label}</p>
      </Card>

      <Card title="AI Consumption Estimator (1/day)" className="mb-6">
        <div className="space-y-4">
          <Input 
            label="Total kWh Consumed" 
            type="number" 
            value={totalKWhInput} 
            onChange={(e) => setTotalKWhInput(e.target.value)}
            placeholder="e.g., 15"
            disabled={!canFetchConsumptionEstimate && !!appData.consumptionEstimates?.data}
          />
          <Select
            label="For Period"
            value={consumptionPeriodInput}
            onChange={(e) => setConsumptionPeriodInput(e.target.value)}
            options={[
              {value: "last 24 hours", label: "Last 24 Hours"},
              {value: "last 7 days", label: "Last 7 Days"},
              {value: "last month", label: "Last Month"},
            ]}
            disabled={!canFetchConsumptionEstimate && !!appData.consumptionEstimates?.data}
          />
          <p className="text-sm text-slate-600">Your listed appliances: {appliances.map(a => a.name).join(', ') || 'None listed yet'}</p>
           {isLoadingEstimates ? <LoadingSpinner text="Estimating..." /> : (
            canFetchConsumptionEstimate || !appData.consumptionEstimates?.data ? (
                <Button onClick={handleEstimateConsumption} disabled={!totalKWhInput || appliances.length === 0 || isLoadingEstimates}>
                    Estimate Breakdown
                </Button>
            ) : (
                <p className="text-sm text-slate-500 italic">Today's estimate already generated.</p>
            )
          )}
        </div>
        {appData.consumptionEstimates?.data && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-200">
            <h4 className="font-semibold text-indigo-800">Estimated Breakdown for {appData.consumptionEstimates.data.totalKWh} kWh ({appData.consumptionEstimates.data.period}):</h4>
            <ul className="list-disc list-inside text-slate-700 pl-5 mt-2">
              {Object.entries(appData.consumptionEstimates.data.estimates).map(([name, kwh]) => (
                <li key={name}>{name}: {kwh}</li>
              ))}
            </ul>
            {renderSources(appData.consumptionEstimates.sources)}
          </div>
        )}
      </Card>
      
      <Card title="Manage Your Appliances" className="mb-6">
        <div className="flex items-end gap-2">
            <Input 
                label="Add an appliance (e.g. Geyser, Fridge)" 
                placeholder="Appliance Name"
                value={newApplianceNameInput}
                onChange={(e) => setNewApplianceNameInput(e.target.value)}
                onKeyDown={handleAddApplianceKeyPress}
                className="flex-grow"
            />
            <Button 
                onClick={() => handleAddAppliance(newApplianceNameInput.trim())} 
                disabled={!newApplianceNameInput.trim()}
                className="h-[42px]" // Match height of Input
            >
                Add
            </Button>
        </div>
          {appliances.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-1">Listed Appliances:</h4>
              <ul className="text-sm text-slate-600 list-disc list-inside pl-5">
                {appliances.map(app => <li key={app.id}>{app.name}</li>)}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-2">No appliances added yet.</p>
          )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Energy Saving Tips for SA">
          {isLoadingTips ? <LoadingSpinner text="Fetching tips..." /> : (
            appData.energySavingTips?.data ? (
              <>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mb-2 whitespace-pre-line">
                  {appData.energySavingTips.data.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
                {renderSources(appData.energySavingTips.sources)}
                {!canFetchEnergyTips && <p className="text-xs text-slate-500 mt-3 italic">Today's tips received.</p>}
              </>
            ) : null
          )}
          {canFetchEnergyTips && (
            <Button onClick={fetchEnergySavingTips} disabled={isLoadingTips} className="mt-3">
              Get Today's Energy Tips
            </Button>
          )}
        </Card>

        <Card title="Appliance Care Guide">
            {appliances.length > 0 ? (
                <Select
                    label="Select Appliance for Care Tip"
                    options={appliances.map(app => ({ value: app.name, label: app.name }))}
                    value={selectedApplianceForCare}
                    onChange={(e) => setSelectedApplianceForCare(e.target.value)}
                    className="mb-3"
                    placeholder="Choose an appliance"
                />
            ) : <p className="text-sm text-slate-500 mb-3">Add appliances to get care tips.</p>}

            {isLoadingApplianceCare && selectedApplianceForCare ? <LoadingSpinner text={`Fetching tip for ${selectedApplianceForCare}...`} /> : (
              selectedApplianceForCare && appData.applianceCareTips?.[selectedApplianceForCare]?.data ? (
                <>
                  <p className="text-slate-600 mb-2 whitespace-pre-line">{appData.applianceCareTips[selectedApplianceForCare].data}</p>
                  {renderSources(appData.applianceCareTips?.[selectedApplianceForCare]?.sources)}
                  {!canFetchApplianceCareTip(selectedApplianceForCare) && <p className="text-xs text-slate-500 mt-3 italic">Today's tip for {selectedApplianceForCare} received.</p>}
                </>
              ) : selectedApplianceForCare ? <p className="text-sm text-slate-500">No tip fetched yet for {selectedApplianceForCare}.</p> : null
            )}
            {selectedApplianceForCare && canFetchApplianceCareTip(selectedApplianceForCare) && (
                 <Button 
                    onClick={() => fetchApplianceCareTipHandler(selectedApplianceForCare)} 
                    disabled={isLoadingApplianceCare || !selectedApplianceForCare}
                    className="mt-3"
                  >
                   Get Care Tip for {selectedApplianceForCare}
                 </Button>
            )}
        </Card>
      </div>

      <Card title="Insurance Basics (SA Focus)">
        {isLoadingInsurance ? <LoadingSpinner text="Fetching info..." /> : (
          appData.insuranceBasicTip?.data ? (
            <>
              <p className="text-slate-600 mb-2 whitespace-pre-line">{appData.insuranceBasicTip.data}</p>
              {renderSources(appData.insuranceBasicTip.sources)}
              {!canFetchInsuranceTip && <p className="text-xs text-slate-500 mt-3 italic">Today's insurance basic received.</p>}
            </>
          ) : null
        )}
        {canFetchInsuranceTip && (
           <Button onClick={fetchInsuranceBasicsTip} disabled={isLoadingInsurance} className="mt-3">
            Get Today's Insurance Basic
          </Button>
        )}
         <p className="italic text-xs text-slate-500 mt-4">This is general educational content and not financial advice.</p>
      </Card>

    </SectionContainer>
  );
};

export default EnergyScreen;