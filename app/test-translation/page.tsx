'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import { TranslatedText } from '@/app/components/TranslatedText';

export default function TestTranslationPage() {
  const { currentLocale, setLocale, availableLocales } = useLanguage();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Translation Test Page</h1>
        
        {/* Current Locale Display */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Current Locale</h2>
          <p className="text-xl">
            <strong>Locale:</strong> <span className="text-blue-600">{currentLocale}</span>
          </p>
        </div>

        {/* Language Selector */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Select Language</h2>
          <div className="flex flex-wrap gap-2">
            {availableLocales.map((locale) => (
              <button
                key={locale}
                onClick={() => {
                  console.log('Changing locale to:', locale);
                  setLocale(locale);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentLocale === locale
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Test Translations */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Test Translations</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">Original: "Dashboard"</p>
              <TranslatedText as="p" className="text-xl font-bold text-blue-600">
                Dashboard
              </TranslatedText>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">Original: "Sign In"</p>
              <TranslatedText as="p" className="text-xl font-bold text-blue-600">
                Sign In
              </TranslatedText>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">Original: "Expert Doctor"</p>
              <TranslatedText as="p" className="text-xl font-bold text-blue-600">
                Expert Doctor
              </TranslatedText>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">Original: "AI-Powered Matching"</p>
              <TranslatedText as="p" className="text-xl font-bold text-blue-600">
                AI-Powered Matching
              </TranslatedText>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2 text-yellow-800">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-900">
            <li>Click on different language buttons above</li>
            <li>Watch the "Current Locale" change</li>
            <li>Watch the translated text change in real-time</li>
            <li>Open browser console (F12) to see debug logs</li>
          </ol>
          
          <div className="mt-4 p-4 bg-white rounded">
            <h4 className="font-bold mb-2">Expected Results for Hindi (hi):</h4>
            <ul className="space-y-1 text-sm">
              <li>• Dashboard → डैशबोर्ड</li>
              <li>• Sign In → साइन इन करें</li>
              <li>• Expert Doctor → विशेषज्ञ डॉक्टर</li>
              <li>• AI-Powered Matching → एआई-संचालित मिलान</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
