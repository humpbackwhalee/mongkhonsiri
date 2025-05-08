'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import prayerDataObject from '../data/prayerData';

// กำหนด Type สำหรับข้อมูลบทสวด
type Prayer = {
  key: string;
  title: string;
  prayerText: string[];
  [key: string]: unknown;
};



// แปลง object เป็น array เพื่อใช้งานกับ map
const prayerData: Prayer[] = Object.entries(prayerDataObject).map(([key, value]) => ({
  key,
  title: value.title,
  prayerText: value.prayerText,
  ...value as Omit<Prayer, 'key'>
}));


// คอมโพเนนต์แสดงรายการบทสวด (แยกเป็น memo component เพื่อป้องกัน re-render ที่ไม่จำเป็น)
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

export { PrayerItem };

export default function PrayerLyricsLoop() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer>(prayerData[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // ใช้ state แทน ref สำหรับ isPlaying
  const [speed, setSpeed] = useState(2000); // เพิ่ม state สำหรับปรับความเร็ว
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);
  const prayerText = useMemo(() => selectedPrayer?.prayerText || [], [selectedPrayer]);
  const prayerTitle = useMemo(() => selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [selectedPrayer]);

  // เลื่อนไปที่บรรทัดปัจจุบันเมื่อเปลี่ยนบรรทัด
  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLineIndex]);

  // จัดการการเล่นบทสวดอัตโนมัติ
  useEffect(() => {
    if (isPlaying && prayerText.length > 0) {
      const id = setTimeout(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % prayerText.length);
      }, speed);
      timeoutId.current = id;

      return () => clearTimeout(id);
    }
  }, [currentLineIndex, prayerText, isPlaying, speed]);

  // บันทึกบทสวดที่เลือกล่าสุดลงใน localStorage
  useEffect(() => {
    localStorage.setItem('lastSelectedPrayer', selectedPrayer.key);
  }, [selectedPrayer]);

  // โหลดบทสวดที่เลือกล่าสุดจาก localStorage เมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const lastSelectedKey = localStorage.getItem('lastSelectedPrayer');
    if (lastSelectedKey) {
      const lastPrayer = prayerData.find(p => p.key === lastSelectedKey);
      if (lastPrayer) {
        setSelectedPrayer(lastPrayer);
      }
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  // กรองรายการบทสวดตามคำค้นหา
  const filteredPrayers = useMemo(() => {
    if (!searchTerm.trim()) return prayerData;
    return prayerData.filter(prayer =>
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);


  // ตรวจสอบว่ามีข้อมูลบทสวดหรือไม่
  if (prayerData.length === 0) {
    return <div className="flex justify-center items-center h-screen">ไม่พบข้อมูลบทสวด</div>;
  }

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentLineIndex(0);
  };

  const handleSelectPrayer = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setCurrentLineIndex(0);
    setIsPlaying(false);
  };

  const handlePrevLine = () => {
    setCurrentLineIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prayerText.length - 1
    );
  };

  const handleNextLine = () => {
    setCurrentLineIndex((prevIndex) =>
      (prevIndex + 1) % prayerText.length
    );
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-white text-black ">
      {/* Prayer list */}
      <div className="md:col-span-1 p-4 border-b md:border-r md:border-b-0 border-slate-500 bg-gray-100">
        <div className="mb-4">
          <input
            type="text"
            placeholder="ค้นหาบทสวด..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="ค้นหาบทสวด"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {filteredPrayers.map((prayer) => (
            <PrayerItem
              key={prayer.key}
              prayer={prayer}
              isSelected={selectedPrayer.key === prayer.key}
              onSelect={handleSelectPrayer}
            />
          ))}
        </div>
      </div>

      {/* Prayer player */}
      <div className="md:col-span-2 p-6 flex flex-col items-center gap-4 bg-white text-black">
        <h1 className="text-2xl font-semibold border-b border-black pb-2 w-full text-center">{prayerTitle}</h1>

        <div className="flex flex-col items-center max-h-[50vh] overflow-y-auto w-full">
          {prayerText.map((line, index) => (
            <p
              key={index}
              ref={index === currentLineIndex ? currentLineRef : null}
              className={`text-4xl leading-relaxed text-center py-1 px-4 w-fit transition-all duration-200 ${index === currentLineIndex ? 'bg-gray-500 text-white font-semibold rounded' : 'text-black'
                }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
            onClick={handlePlay}
            disabled={isPlaying}
            aria-label="เริ่มอ่านบทสวด"
          >
            เล่น
          </button>
          <button
            className="bg-white hover:bg-gray-200 text-black border border-black font-semibold py-2 px-4 rounded"
            onClick={handlePause}
            disabled={!isPlaying}
            aria-label="หยุดอ่านบทสวด"
          >
            หยุด
          </button>
          <button
            className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded"
            onClick={handleReset}
            aria-label="รีเซ็ตการอ่าน"
          >
            รีเซ็ต
          </button>
        </div>

        <div className="flex gap-2 mt-2 items-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-full"
            onClick={handlePrevLine}
            aria-label="ย้อนกลับบรรทัด"
          >
            ◀
          </button>
          <p className="text-sm text-gray-600">
            บรรทัดที่: {currentLineIndex + 1} / {prayerText.length}
          </p>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-full"
            onClick={handleNextLine}
            aria-label="ไปบรรทัดถัดไป"
          >
            ▶
          </button>
        </div>

        <div className="mt-4 w-full max-w-md">
          <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-1">
            ความเร็ว: {speed}ms
          </label>
          <input
            type="range"
            id="speed"
            name="speed"
            min="500"
            max="5000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full"
            aria-label="ปรับความเร็วในการเปลี่ยนบรรทัด"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>เร็ว</span>
            <span>ช้า</span>
          </div>
        </div>
      </div>
    </div>
  );
}