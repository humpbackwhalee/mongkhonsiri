import React from 'react';

// กำหนด Type สำหรับข้อมูลบทสวด (ถ้ายังไม่ได้ import)
type Prayer = {
  key: string;
  title: string;
  prayerText: string[];
  [key: string]: unknown;
};

interface PrayerItemProps {
  prayer: Prayer;
  isSelected: boolean;
  onSelect: (prayer: Prayer) => void;
}

// คอมโพเนนต์แสดงรายการบทสวด (แยกเป็น memo component เพื่อป้องกัน re-render ที่ไม่จำเป็น)
const PrayerItemInner = ({
  prayer,
  isSelected,
  onSelect
}: PrayerItemProps) => (
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