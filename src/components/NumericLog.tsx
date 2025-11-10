// Component for logging numeric values (weight, calories, protein, etc.)
import React, { useState } from 'react';

interface NumericLogProps {
  label: string;
  value: number | null | undefined;
  unit: string;
  icon?: string;
  onUpdate: (value: number) => void;
  placeholder?: string;
}

export default function NumericLog({
  label,
  value,
  unit,
  icon,
  onUpdate,
  placeholder,
}: NumericLogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onUpdate(numValue);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    setInputValue(value?.toString() || '');
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 min-w-[120px]">
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-400">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            {label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSubmit}
              autoFocus
              placeholder={placeholder || '0'}
              className="w-full text-2xl font-bold text-gray-900 outline-none bg-transparent"
            />
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex-1 min-w-[120px] bg-white hover:bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95 touch-manipulation"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">
          {value?.toFixed(unit === 'kg' || unit === 'lbs' ? 1 : 0) || '—'}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </button>
  );
}
