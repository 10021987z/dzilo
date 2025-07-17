import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';

interface CompanyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('dziljo');

  useEffect(() => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
    
    // Load company name from localStorage
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.companyName) {
          setCompanyName(settings.companyName);
        }
      } catch (e) {
        console.error('Error parsing company settings:', e);
      }
    }
  }, []);

  // Determine size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {logo ? (
        <div className={`rounded-lg overflow-hidden ${containerClasses[size]}`}>
          <img 
            src={logo} 
            alt={companyName} 
            className={`${sizeClasses[size]} object-contain`}
          />
        </div>
      ) : (
        <div className={`bg-blue-600 rounded-lg ${containerClasses[size]}`}>
          <Briefcase className={`${sizeClasses[size]} text-white`} />
        </div>
      )}
      <h1 className={`font-bold text-blue-400 ${textClasses[size]}`}>{companyName}</h1>
    </div>
  );
};

export default CompanyLogo;