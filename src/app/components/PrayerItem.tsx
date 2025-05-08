import React from 'react';

// Define type for prayer data
type Prayer = {
  key: string;
  title: string;
  prayerText: string[];
  [key: string]: unknown;
};

// Memoized PrayerItem component to prevent unnecessary re-renders
const PrayerItemInner = ({
  prayer,
  isSelected,
  onSelect
}: {
  prayer: Prayer;
  isSelected: boolean;
  onSelect: (prayer: Prayer) => void;
}) => (
  <div
    onClick={() => onSelect(prayer)}
    className={`cursor-pointer text-xl leading-relaxed py-1 px-2 rounded
      ${isSelected ? 'bg-black text-white font-bold' : 'text-black hover:bg-gray-200'}`}
    role="button"
    aria-pressed={isSelected}
  >
    {prayer.title}
  </div>
);

PrayerItemInner.displayName = 'PrayerItem';

const PrayerItem = React.memo(PrayerItemInner);

export default PrayerItem;