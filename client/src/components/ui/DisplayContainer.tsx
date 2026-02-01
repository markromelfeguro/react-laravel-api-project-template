import React, { useState } from 'react';
import { MaterialIcon, Button } from '../ui';

interface DisplayProps {
  items: any[];
  renderItem: (item: any, view: 'grid' | 'list') => React.ReactNode;
}

const DisplayContainer: React.FC<DisplayProps> = ({ items, renderItem }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* View Toggle Controls */}
      <div className="flex justify-end gap-2 bg-surface p-2 rounded-2xl border border-border w-fit ml-auto shadow-main">
        <Button 
          variant={view === 'grid' ? 'primary' : 'ghost'}
          tooltip="Grid View"
          onClick={() => setView('grid')}
          className="p-2! rounded-xl! transition-all"
        >
          <MaterialIcon iconName="grid_view" size={20} />
        </Button>
        
        <Button 
          variant={view === 'list' ? 'primary' : 'ghost'}
          tooltip="List View"
          onClick={() => setView('list')}
          className="p-2! rounded-xl! transition-all"
        >
          <MaterialIcon iconName="view_list" size={20} />
        </Button>
      </div>

      {/* Dynamic Layout Wrapper */}
      <div className={`
        transition-all duration-300
        ${view === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-auto-rows-fr' 
          : 'flex flex-col gap-4'
        }
      `}>
        {items.map((item, index) => (
          <div key={item.id || index} className="animate-in fade-in zoom-in-95 duration-300 flex">
            {renderItem(item, view)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayContainer;