import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ru';

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, ru: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (en) => en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (en: string, ru: string) => {
    return language === 'ru' ? ru : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
