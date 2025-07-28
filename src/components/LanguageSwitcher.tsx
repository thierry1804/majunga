import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const languages = [
        { code: 'fr', flag: '🇫🇷', name: 'Français' },
        { code: 'en', flag: '🇬🇧', name: 'English' },
        { code: 'it', flag: '🇮🇹', name: 'Italiano' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded text-lg hover:bg-gray-100 transition-colors"
                title="Changer de langue"
            >
                <span>{currentLanguage.flag}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[60px]">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className={`w-full flex items-center justify-center px-3 py-2 hover:bg-gray-50 transition-colors ${
                                i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                            title={language.name}
                        >
                            <span className="text-lg">{language.flag}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default LanguageSwitcher; 