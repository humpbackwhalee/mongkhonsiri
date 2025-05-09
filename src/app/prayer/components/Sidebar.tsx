import React from 'react';
import PrayerItem, { Prayer } from './PrayerItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  prayers: Prayer[];
  selectedPrayer: Prayer;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectPrayer: (prayer: Prayer) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  prayers,
  selectedPrayer,
  searchTerm,
  onSearchChange,
  onSelectPrayer
}) => {
  return (
    <aside className={`
      ${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full h-fit overflow-hidden transition-all duration-300 fixed lg:static top-14 left-0 right-0 bottom-0 z-20
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

      <div className="overflow-y-auto mt-2" role="listbox">
        {prayers.map((prayer) => (
          <PrayerItem
            key={prayer.key}
            prayer={prayer}
            isSelected={selectedPrayer.key === prayer.key}
            onSelect={onSelectPrayer}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;