import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => changeLanguage('fr')}
                className={`px-3 py-1 rounded ${i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                FR
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('it')}
                className={`px-3 py-1 rounded ${i18n.language === 'it' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                IT
            </button>
        </div>
    );
};

export default LanguageSwitcher; 