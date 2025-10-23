
import React from 'react';
import { PhotoStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: PhotoStyle;
  onChange: (style: PhotoStyle) => void;
}

const styles = [
  { id: PhotoStyle.MODERN, label: "Bright & Modern", description: "Clean, minimalist, and full of light." },
  { id: PhotoStyle.RUSTIC, label: "Rustic & Dark", description: "Moody, textured, and dramatic." },
  { id: PhotoStyle.SOCIAL, label: "Social Media Ready", description: "Vibrant, top-down, and eye-catching." },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onChange }) => {
  return (
    <div>
      <h3 className="block text-lg font-semibold text-gray-200 mb-3">
        2. Choose a Style
      </h3>
      <div className="space-y-3">
        {styles.map((style) => (
          <label
            key={style.id}
            htmlFor={style.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedStyle === style.id
                ? 'bg-amber-500/10 border-amber-500'
                : 'bg-gray-900 border-gray-600 hover:border-gray-500'
            }`}
          >
            <input
              type="radio"
              id={style.id}
              name="photo-style"
              value={style.id}
              checked={selectedStyle === style.id}
              onChange={() => onChange(style.id)}
              className="hidden"
            />
            <div className="flex-grow">
              <span className="font-bold text-gray-100">{style.label}</span>
              <p className="text-sm text-gray-400">{style.description}</p>
            </div>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStyle === style.id ? 'border-amber-500' : 'border-gray-500'}`}>
                {selectedStyle === style.id && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
