
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep for navigation
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
// AvatarUpload is removed
import { UserProfile } from '../types';
import { SA_MUNICIPAL_TARIFFS, APP_NAME } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

interface SettingsScreenProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => void;
  clearAllData: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userProfile, setUserProfile, clearAllData }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState<number | string>('');
  const [electricityTariff, setElectricityTariff] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (userProfile) {
      setName(userProfile.name || '');
      setUsername(userProfile.username || userProfile.name?.toLowerCase().replace(/\s+/g, '_') || '');
      setLocation(userProfile.location || '');
      setHouseholdSize(userProfile.householdSize || '');
      setElectricityTariff(userProfile.electricityTariff || SA_MUNICIPAL_TARIFFS[0]?.value || '');
      setIsLoading(false);
    } else {
      // If no profile, redirect to onboarding as settings are for an existing profile
      navigate('/app-onboarding', { replace: true });
    }
  }, [userProfile, navigate]);

  const handleSaveProfile = async () => {
    if (!userProfile) {
        alert("Profile not found. Please complete onboarding.");
        return;
    }
    if (!name.trim() || !username.trim()) {
      alert("Full Name and Username are required.");
      return;
    }
    setIsSaving(true);

    const updatedProfileData: UserProfile = {
      ...userProfile, // Spread existing profile to keep fields like onboarded_app
      name: name.trim(),
      username: username.trim(),
      location: location || undefined,
      householdSize: Number(householdSize) || undefined,
      electricityTariff,
      // avatar_url is not managed here anymore directly unless we add a local way
    };
    
    setUserProfile(updatedProfileData);
    
    // Simulate save if needed
    // await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsSaving(false);
    alert("Profile details updated locally!");
  };
  
  const handleClearDataConfirmation = () => {
    clearAllData(); // This now clears the generic local storage
    setShowClearConfirmation(false);
    alert("All locally stored application data (profile, transactions, stock, etc.) has been cleared. The app will reset.");
    navigate('/app-onboarding', { replace: true }); // Navigate to onboarding after clearing all data
  };

  // Logout is removed as there's no session management
  // const handleLogout = async () => { /* ... */ };

  if (isLoading || !userProfile) { // Show loading if data is still loading or if redirecting
    return (
      <SectionContainer title="Settings">
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner text="Loading settings..." />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer title="Settings">
        <>
          <Card title={`Profile for ${userProfile.username || 'User'}`} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center">
                {/* Avatar Display Placeholder */}
                <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-semibold ring-2 ring-white/50 mb-4">
                  {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : (userProfile.username ? userProfile.username[0].toUpperCase() : 'HH')}
                </div>
                <p className="text-sm text-slate-500">Avatar upload removed.</p>
              </div>
              <div className="space-y-4 md:col-span-2">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Example"
                  required
                />
                 <Input
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., alex_example"
                  required
                />
                <Input
                  label="Location (City/Town in SA, Optional)"
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
                  label="Electricity Tariff"
                  options={SA_MUNICIPAL_TARIFFS}
                  value={electricityTariff}
                  onChange={(e) => setElectricityTariff(e.target.value)}
                  required
                />
                <Button onClick={handleSaveProfile} isLoading={isSaving} disabled={isSaving} className="w-full md:w-auto">
                  {isSaving ? "Saving..." : "Save Profile Changes"}
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Data Management" className="mb-6">
            <p className="text-slate-600 mb-3">
              All application data (profile, transactions, stock, etc.) is stored locally in your browser.
            </p>
            {!showClearConfirmation ? (
                <Button variant="danger" onClick={() => setShowClearConfirmation(true)}>
                Clear All Local Data & Reset App
                </Button>
            ) : (
                <div className="p-4 border border-amber-400 rounded-md bg-amber-50">
                    <p className="font-semibold text-amber-700 text-lg mb-2">Are you sure?</p>
                    <p className="text-sm text-amber-600 mb-4">This will permanently delete all your locally stored data and reset the application. This action cannot be undone.</p>
                    <div className="flex space-x-3">
                        <Button variant="danger" onClick={handleClearDataConfirmation}>Yes, Clear Data & Reset</Button>
                        <Button variant="ghost" onClick={() => setShowClearConfirmation(false)} className="text-slate-700 hover:bg-slate-200">Cancel</Button>
                    </div>
                </div>
            )}
          </Card>
          
           {/* Account Actions card removed as there's no login/logout */}
        </>
      
      <Card title={`About ${APP_NAME}`}>
        <p className="text-slate-600">Version 1.4.0 (Local Data Mode)</p>
        <p className="text-slate-600 mt-1">Your smart household data companion for South Africa.</p>
        <p className="text-xs text-slate-500 mt-3">
          This app uses the Gemini API for AI-powered insights. All other data is stored locally.
          Remember that AI suggestions are for informational purposes and should be used with your own judgment.
        </p>
      </Card>
    </SectionContainer>
  );
};

export default SettingsScreen;