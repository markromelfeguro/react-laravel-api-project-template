import React from 'react';
import { Button } from './button/Button';
import { MaterialIcon } from './MaterialIcon';

interface FontSizeControlProps {
  value: number;
  onChange: (newValue: number) => void;
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({ value, onChange }) => {
  
  const updateGlobalSize = (newSize: number) => {
    onChange(newSize);
    document.documentElement.style.fontSize = `${(newSize / 16) * 100}%`;
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-surface border border-border rounded-2xl shadow-main">
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={() => updateGlobalSize(value - 1)}
        tooltip='Decrease text Size'
        tooltipPosition='bottom'
        className="min-h-91 px-3!">
        <MaterialIcon iconName="text_fields" size={14} />
        <MaterialIcon iconName="remove" size={12} />
      </Button>

      {/* <span className="text-xs font-bold text-main-text w-8 text-center">
        {value}
      </span> */}

      <Button 
        variant="secondary" 
        size="sm" 
        onClick={() => updateGlobalSize(value + 1)}
        tooltip='Increase text Size'
        tooltipPosition='bottom'
        className="min-h-91 px-3!">
        <MaterialIcon iconName="text_fields" size={18} />
        <MaterialIcon iconName="add" size={12} />
      </Button>
    </div>
  );
};