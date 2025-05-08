'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrayerItem from '../components/PrayerItem';
import prayerDataObject from '../data/prayerData';

// Define type for prayer data
type Prayer = {
  key: string;
  title: string;
  prayerText: string[];
  [key: string]: unknown;
};

// Convert object to array for mapping
const prayerData: Prayer[] = Object.entries(prayerDataObject).map(([key, value]) => ({
  key,
  title: value.title,
  prayerText: value.prayerText,
  ...value as Omit<Prayer, 'key'>
}));

// Default export for PrayerLyricsLoop component
export default function PrayerLyricsLoop() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer>(prayerData[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);
  const prayerText = useMemo(() => selectedPrayer?.prayerText || [], [selectedPrayer]);
  const prayerTitle = useMemo(() => selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [selectedPrayer]);

  // Scroll to current line when it changes
  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLineIndex]);

  // Handle automatic line progression during playback
  useEffect(() => {
    if (isPlaying && prayerText.length > 0) {
      const id = setTimeout(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % prayerText.length);
      }, speed);
      timeoutId.current = id;

      return () => clearTimeout(id); // Cleanup timeout on unmount or dependency change
    }
  }, [currentLineIndex, prayerText, isPlaying, speed]);

  // Save selected prayer to localStorage
  useEffect(() => {
    localStorage.setItem('lastSelectedPrayer', selectedPrayer.key);
  }, [selectedPrayer]);

  // Load last selected prayer from localStorage on mount
  useEffect(() => {
    const lastSelectedKey = localStorage.getItem('lastSelectedPrayer');
    if (lastSelectedKey) {
      const lastPrayer = prayerData.find(p => p.key === lastSelectedKey);
      if (lastPrayer) {
        setSelectedPrayer(lastPrayer);
      }
    }
  }, []); // prayerData is static, so no dependency needed

  // Filter prayers based on search term
  const filteredPrayers = useMemo(() => {
    if (!searchTerm.trim()) return prayerData;
    return prayerData.filter(prayer =>
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handle empty prayer data
  if (prayerData.length === 0) {
    return <div className="flex justify-center items-center h-screen">ไม่พบข้อมูลบทสวด</div>;
  }

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentLineIndex(0);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  const handleSelectPrayer = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
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
    <div className="grid grid-cols-1 md:grid-cols-3 bg-white text-black">
      {/* Prayer list */}
      <div className="md:col-span-1 p-4 border-b md:border-r md:border-b-0 border-slate-500 bg-gray-100">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาบทสวด..."
          className="w-full p-2 mb-4 border rounded"
          aria-label="ค้นหาบทสวด"
        />
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
              className={`text-4xl leading-relaxed text-center py-1 px-4 w-fit transition-all duration-200 ${
                index === currentLineIndex ? 'bg-gray-500 text-white font-semibold rounded' : 'text-black'
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            onClick={handlePlay}
            disabled={isPlaying || prayerText.length === 0}
            aria-label="เริ่มอ่านบทสวด"
          >
            เล่น
          </button>
          <button
            className="bg-white hover:bg-gray-200 text-black border border-black font-semibold py-2 px-4 rounded disabled:opacity-50"
            onClick={handlePause}
            disabled={!isPlaying}
            aria-label="หยุดอ่านบทสวด"
          >
            หยุด
          </button>
          <button
            className="bg-gray-800 hover:bg-black text-white font-semibold py  disabled:opacity-50"
            onClick={handleReset}
            disabled={prayerText.length === 0}
            aria-label="รีเซ็ตการอ่าน"
          >
            รีเซ็ต
          </button>
        </div>

        <div className="flex gap-2 mt-2 items-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-full disabled:opacity-50"
            onClick={handlePrevLine}
            disabled={prayerText.length === 0}
            aria-label="ย้อนกลับบรรทัด"
          >
            ◀
          </button>
          <p className="text-sm text-gray-600">
            บรรทัดที่: {currentLineIndex + 1} / {prayerText.length}
          </p>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-full disabled: disabled:opacity-50"
            onClick={handleNextLine}
            disabled={prayerText.length === 0}
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
            aria-valuenow={speed}
            aria-valuemin={500}
            aria-valuemax={5000}
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