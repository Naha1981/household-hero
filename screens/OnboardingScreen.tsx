// screens/OnboardingScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { SA_MUNICIPAL_TARIFFS, APP_NAME } from '../constants';
import SectionContainer from '../components/SectionContainer';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner'; // Keep for saving state

interface OnboardingScreenProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | ((prev: UserProfile | null) => UserProfile | null)) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  // Email is no longer a primary field from Supabase auth
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState<number | string>('');
  const [electricityTariff, setElectricityTariff] = useState(SA_MUNICIPAL_TARIFFS[0]?.value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (userProfile) {
      if (userProfile.onboarded_app) {
        navigate('/'); // Already onboarded, redirect to dashboard
      } else {
        // Pre-fill from existing partial profile if any
        setName(userProfile.name || '');
        setUsername(userProfile.username || userProfile.name?.toLowerCase().replace(/\s+/g, '_') || '');
        setLocation(userProfile.location || '');
        setHouseholdSize(userProfile.householdSize || '');
        setElectricityTariff(userProfile.electricityTariff || SA_MUNICIPAL_TARIFFS[0]?.value || '');
      }
    } else {
      // No profile, start fresh
      setName('');
      setUsername('');
      setLocation('');
      setHouseholdSize('');
      setElectricityTariff(SA_MUNICIPAL_TARIFFS[0]?.value || '');
    }
    setIsLoading(false);
  }, [userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      alert("Full Name and Username are required.");
      return;
    }
    setIsSaving(true);

    const updatedProfileData: UserProfile = {
      ...(userProfile || {}), // Spread existing fields if any
      name: name.trim(),
      username: username.trim(),
      location: location || undefined,
      householdSize: Number(householdSize) || undefined,
      electricityTariff,
      onboarded_app: true, // Mark as onboarded
      avatar_url: userProfile?.avatar_url || null, // Preserve avatar if it existed
    };
    
    setUserProfile(updatedProfileData);
    
    // Simulate save time if needed, otherwise navigate directly
    // await new Promise(resolve => setTimeout(resolve, 500)); 
    
    setIsSaving(false);
    navigate('/');
  };

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner text="Loading onboarding..." size="lg" />
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl w-full max-w-lg">
        <SectionContainer title={`${APP_NAME} Setup`}>
          <p className="mb-6 text-neutral">
            Welcome! Let's get a few details to personalize your experience.
            This data helps us tailor advice for you and is stored locally on your device.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Example"
              required
            />
            <Input
              label="Username (for display)"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., alex_example"
              required
            />
            {/* Email input removed as it's not a primary ID anymore */}
            <Input
              label="Your Location (City/Town in SA, Optional)"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Johannesburg"
            />
            <Input
              label="Household Size (Optional)"
              type="number"
              value={householdSize}
              min="1"
              onChange={(e) => setHouseholdSize(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              placeholder="e.g., 4"
            />
            <Select
              label="Electricity Tariff (Important for energy insights)"
              options={SA_MUNICIPAL_TARIFFS}
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(e.target.value)}
              required
            />
            
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSaving}>
              {isSaving ? 'Saving...' : 'Complete Setup & Go to Dashboard'}
            </Button>
          </form>
        </SectionContainer>
      </div>
    </div>
  );
};

export default OnboardingScreen;