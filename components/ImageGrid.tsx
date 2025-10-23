
import React from 'react';
import { Dish } from '../types';
import ImageCard from './ImageCard';
import LoaderIcon from './icons/LoaderIcon';

interface ImageGridProps {
  dishes: Dish[];
  isLoading: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ dishes, isLoading }) => {
  const hasPendingOrGenerating = dishes.some(d => d.status === 'pending' || d.status === 'generating');
  const showGrid = dishes.length > 0;

  if (isLoading && dishes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin">
            <LoaderIcon className="w-12 h-12 text-amber-500" />
        </div>
        <p className="mt-4 text-lg text-gray-400">Parsing your menu...</p>
      </div>
    );
  }

  if (!showGrid) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-2xl">
        <p className="text-xl text-gray-500">Your generated food photos will appear here.</p>
      </div>
    );
  }

  return (
    <div>
        {hasPendingOrGenerating && (
             <div className="text-center mb-6 flex items-center justify-center">
                 <div className="inline-block animate-spin mr-3">
                    <LoaderIcon className="w-6 h-6 text-amber-500" />
                 </div>
                <p className="text-lg text-gray-400">Generating images... This may take a moment.</p>
            </div>
        )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <ImageCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
