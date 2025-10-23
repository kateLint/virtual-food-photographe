
import React, { useState, useCallback } from 'react';
import { Dish, PhotoStyle } from './types';
import { parseMenu, generateFoodImage } from './services/geminiService';
import MenuInput from './components/MenuInput';
import StyleSelector from './components/StyleSelector';
import ImageGrid from './components/ImageGrid';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [menuText, setMenuText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>(PhotoStyle.MODERN);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePhotos = useCallback(async () => {
    if (!menuText.trim()) {
      setError('Please enter a menu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDishes([]);

    try {
      const dishNames = await parseMenu(menuText);
      if (!dishNames || dishNames.length === 0) {
        setError("Could not find any dishes in the menu. Please check the format.");
        setIsLoading(false);
        return;
      }

      const initialDishes: Dish[] = dishNames.map(name => ({
        id: self.crypto.randomUUID(),
        name,
        imageUrl: null,
        status: 'pending'
      }));
      setDishes(initialDishes);

      for (const dish of initialDishes) {
        setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'generating' } : d));
        try {
          const base64Image = await generateFoodImage(dish.name, selectedStyle);
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'completed', imageUrl } : d));
        } catch (e) {
          console.error(`Failed to generate image for ${dish.name}:`, e);
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'failed' } : d));
        }
      }

    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [menuText, selectedStyle]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Virtual Food Photographer
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Turn your menu into a masterpiece. Generate stunning, professional food photos with AI.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MenuInput value={menuText} onChange={setMenuText} />
              <StyleSelector selectedStyle={selectedStyle} onChange={setSelectedStyle} />
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleGeneratePhotos}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <SparklesIcon className="w-6 h-6 mr-3" />
                {isLoading ? 'Generating...' : 'Generate Photos'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="mt-12">
            <ImageGrid dishes={dishes} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
