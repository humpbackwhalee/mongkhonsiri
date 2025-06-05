import React from 'react';
import PrayerItem from './PrayerItem';
import { Prayer } from '../_utils/types';
import { usePrayerContext } from '../_context/PrayerContext';

interface SidebarProps {
  isSidebarOpen: boolean;
  prayers: Prayer[];
  // selectedPrayer: Prayer; // Removed, will use context
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectPrayer: () => void; // Changed: No longer passes prayer object, just a trigger
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  prayers,
  // selectedPrayer, // Removed
  searchTerm,
  onSearchChange,
  onSelectPrayer // This prop will now primarily handle UI logic like closing the sidebar
}) => {
  const { state, dispatch } = usePrayerContext();

  const handleSelectPrayer = (prayer: Prayer) => {
    dispatch({ type: 'SELECT_PRAYER', prayer });
    onSelectPrayer(); // Call original prop (now arg-less) for parent-side effects
  };

  return (
    <aside className={`
      ${isSidebarOpen ? 'block' : 'hidden'} 
      lg:block w-full overflow-hidden transition-all duration-300 fixed lg:static top-32 left-0 right-0 bottom-0 z-20 bg-white p-4
    `}>
      <div className="sticky top-0 z-10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาบทสวดมนต์..."
          className="w-full p-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-200"
          aria-label="ค้นหาบทสวดมนต์"
        />
      </div>

      <div className="overflow-y-auto mt-2" aria-label="รายการบทสวด" role="listbox">
        {prayers.map((prayer) => (
          <PrayerItem
            key={prayer.id}
            prayer={prayer}
            isSelected={state.selectedPrayer?.id === prayer.id} // Use context state
            onSelect={handleSelectPrayer} // Use new handler
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;