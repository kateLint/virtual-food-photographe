
import React from 'react';

interface MenuInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuInput: React.FC<MenuInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="menu-input" className="block text-lg font-semibold text-gray-200 mb-2">
        1. Paste Your Menu
      </label>
      <textarea
        id="menu-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Example:\n\nMargherita Pizza\nClassic pizza with tomato, mozzarella, and basil.\n\nSpaghetti Carbonara\nPasta with eggs, cheese, pancetta, and pepper.`}
        className="w-full h-64 p-4 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300 text-gray-300 resize-none"
      />
    </div>
  );
};

export default MenuInput;
