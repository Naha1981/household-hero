import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { AppData, AIData, GroundingSource } from '../types';
import { getGeneralTip } from '../services/geminiService';
import { getTodaysDateISO, isFetchAllowedToday } from '../App';

interface WellnessScreenProps {
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
}

const WellnessScreen: React.FC<WellnessScreenProps> = ({ appData, updateAppData }) => {
  const [isLoadingFitness, setIsLoadingFitness] = useState(false);
  const [isLoadingGardening, setIsLoadingGardening] = useState(false);

  const canFetchFitnessTip = isFetchAllowedToday(appData.lastFitnessTipFetchDate);
  const canFetchGardeningTip = isFetchAllowedToday(appData.lastGardeningTipFetchDate);

  const fetchFitnessTipHandler = async () => {
    if (!canFetchFitnessTip) return;
    setIsLoadingFitness(true);
    const {tip, sources} = await getGeneralTip("home fitness routine or diet tip", "Provide a simple, actionable tip for South Africans. Text-based only. Format as a short, clear paragraph or bullet points.");
    updateAppData({
      fitnessTip: { data: tip, sources, lastFetched: getTodaysDateISO() },
      lastFitnessTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingFitness(false);
  };

  const fetchGardeningGuideHandler = async () => {
    if (!canFetchGardeningTip) return;
    setIsLoadingGardening(true);
    const {tip, sources} = await getGeneralTip("beginner gardening guide for South African climates", "Focus on a specific easy-to-grow crop or general advice for starting a small home garden. Text-based only. Format as a short, clear paragraph or bullet points.");
    updateAppData({
      gardeningGuide: { data: tip, sources, lastFetched: getTodaysDateISO() },
      lastGardeningTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingGardening(false);
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
    <SectionContainer title="Wellness & Home Life">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Fitness & Diet Tips">
          {isLoadingFitness ? <LoadingSpinner text="Fetching fitness tip..." /> : (
            appData.fitnessTip?.data ? (
              <>
                <p className="text-slate-600 mb-3 whitespace-pre-line">{appData.fitnessTip.data}</p>
                {renderSources(appData.fitnessTip.sources)}
                {!canFetchFitnessTip && <p className="text-xs text-slate-500 mt-3 italic">Today's fitness tip received.</p>}
              </>
            ) : <p className="text-slate-500">Click below to get your daily fitness tip.</p>
          )}
          {canFetchFitnessTip && (
            <Button onClick={fetchFitnessTipHandler} disabled={isLoadingFitness} size="sm" className="mt-3">
              Get Today's Fitness Tip
            </Button>
          )}
          <p className="italic text-xs text-slate-500 mt-4">This content is for informational purposes only and not medical advice.</p>
        </Card>

        <Card title="Gardening Guides for SA Climates">
          {isLoadingGardening ? <LoadingSpinner text="Fetching gardening guide..." /> : (
             appData.gardeningGuide?.data ? (
              <>
                <p className="text-slate-600 mb-3 whitespace-pre-line">{appData.gardeningGuide.data}</p>
                {renderSources(appData.gardeningGuide.sources)}
                {!canFetchGardeningTip && <p className="text-xs text-slate-500 mt-3 italic">Today's gardening guide received.</p>}
              </>
            ) : <p className="text-slate-500">Click below for your daily gardening guide.</p>
          )}
          {canFetchGardeningTip && (
            <Button onClick={fetchGardeningGuideHandler} disabled={isLoadingGardening} size="sm" className="mt-3">
              Get Today's Gardening Guide
            </Button>
          )}
          <p className="italic text-xs text-slate-500 mt-4">Tips are general; consult local resources for specific planting times and conditions.</p>
        </Card>
      </div>
    </SectionContainer>
  );
};

export default WellnessScreen;