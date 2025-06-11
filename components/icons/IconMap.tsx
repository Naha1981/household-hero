
import React from 'react';
import HomeIcon from './HomeIcon';
import CurrencyDollarIcon from './CurrencyDollarIcon';
import LightningBoltIcon from './LightningBoltIcon';
import ArchiveIcon from './ArchiveIcon';
import BeakerIcon from './BeakerIcon';
import HeartIcon from './HeartIcon';
import CogIcon from './CogIcon';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const IconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  'currency-dollar': CurrencyDollarIcon,
  'lightning-bolt': LightningBoltIcon,
  archive: ArchiveIcon,
  beaker: BeakerIcon,
  heart: HeartIcon,
  cog: CogIcon,
};

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = IconMap[name];
  if (!IconComponent) {
    // Fallback icon or null
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
  return <IconComponent {...props} />;
};

export default Icon;
    