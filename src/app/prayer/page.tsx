'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import PrayerDisplay from './components/PrayerDisplay';
import LineNavigation from './components/LineNavigation';
import PlaybackControls from './components/PlaybackControls';
import SpeedControl from './components/SpeedControl';
import MobileHeader from './components/MobileHeader';
// Using the Prayer interface from PrayerItem component
import prayerDataObject from '../data/prayerData';

// Import Prayer type from the component
import type { Prayer } from './components/PrayerItem';

// Convert object to array for mapping
const prayerData: Prayer[] = Object.entries(prayerDataObject).map(([key, value]) => ({
  key,
  ...value,
}));

export default function PrayerLyricsLoop() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer>(prayerData[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Memoize derived values to prevent unnecessary re-renders
  const prayerText = useMemo(() => selectedPrayer?.prayerText || [], [selectedPrayer]);
  const prayerTitle = useMemo(() => selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [selectedPrayer]);

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
  const filteredPrayers = searchTerm.trim()
    ? prayerData.filter(prayer => prayer.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : prayerData;

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
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row bg-white text-black">
      <MobileHeader
        title="บทสวดมนต์"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/* Prayer List */}
      <div className="bg-white mt-2 p-2 rounded-lg shadow-md">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          prayers={filteredPrayers}
          selectedPrayer={selectedPrayer}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectPrayer={handleSelectPrayer}
        />
      </div>

      {/* Prayer Text */}
      <div className="flex flex-col items-center justify-start flex-grow">
        <div className="w-full max-w-7xl mx-auto px-8">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 pb-2 ">
            {prayerTitle}
          </h2>

          <PrayerDisplay
            prayerText={prayerText}
            currentLineIndex={currentLineIndex}
          />

          <LineNavigation
            currentLineIndex={currentLineIndex}
            totalLines={prayerText.length}
            onPrevLine={handlePrevLine}
            onNextLine={handleNextLine}
          />

          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            disabled={prayerText.length === 0}
          />

          <SpeedControl
            speed={speed}
            onSpeedChange={handleSpeedChange}
          />
        </div>
      </div>
    </div>
  );
}