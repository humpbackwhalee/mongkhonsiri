import React from 'react';

export interface Prayer {
  id: number;
  title: string;
  prayerText: string[];
}

interface PrayerItemProps {
  prayer: Prayer;
  isSelected: boolean;
  onSelect: (prayer: Prayer) => void;
}

const PrayerItem: React.FC<PrayerItemProps> = ({ prayer, isSelected, onSelect }) => {
  return (
    <div
      className={`w-full px-4 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 rounded-lg' : 'hover:bg-gray-50 hover:rounded-lg'
        }`}
      onClick={() => onSelect(prayer)}
      aria-selected={isSelected}
      role="option"
    >
      <h3 className={`text-base ${isSelected ? 'font-semibold' : 'font-normal'}`}>
        {prayer.title}
      </h3>
    </div>
  );
};

export default PrayerItem;