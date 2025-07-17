import React, { useEffect, useState } from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const [footerText, setFooterText] = useState<string>('Dénomination Sociale : dziljo SaaS Adresse du siège : Paris – France Forme juridique : Société par actions simplifiée (SAS) N° SIRET : 123 456 789 00012 Capital Social : 10 000 € Tel : +33 1 23 45 67 89 Site web : www.dziljo.com Email: contact@dziljo.com');

  useEffect(() => {
    // Load footer text from localStorage
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.footerText) {
          setFooterText(settings.footerText);
        }
      } catch (e) {
        console.error('Error parsing company settings:', e);
      }
    }
  }, []);

  return (
    <footer className={`text-center py-3 px-4 text-xs text-slate-500 border-t border-slate-200 ${className}`}>
      {footerText}
    </footer>
  );
};

export default Footer;