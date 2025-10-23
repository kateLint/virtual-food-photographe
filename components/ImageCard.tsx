
import React from 'react';
import { Dish } from '../types';
import LoaderIcon from './icons/LoaderIcon';

interface ImageCardProps {
  dish: Dish;
}

const ImageCard: React.FC<ImageCardProps> = ({ dish }) => {
  const renderContent = () => {
    switch (dish.status) {
      case 'generating':
      case 'pending':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="animate-spin">
              <LoaderIcon className="w-10 h-10 text-amber-500" />
            </div>
            {dish.status === 'generating' && <p className="mt-2 text-sm">Generating...</p>}
          </div>
        );
      case 'completed':
        return (
          <img
            src={dish.imageUrl!}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold">Image failed</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col transition-all duration-300 hover:shadow-amber-500/20 hover:border-amber-500/50">
      <div className="aspect-w-4 aspect-h-3 bg-gray-900 overflow-hidden">
        {renderContent()}
      </div>
      <div className="p-4 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 truncate">{dish.name}</h3>
      </div>
    </div>
  );
};

export default ImageCard;
