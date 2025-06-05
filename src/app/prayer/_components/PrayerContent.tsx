'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { usePrayerContext } from '../_context/PrayerContext';
import { useAudioPlayer } from '../_hooks/useAudioPlayer';
import useWindowSize from '../_utils/useWindowSize';
import useInterval from '../_utils/useInterval';
import { Prayer } from "../_utils/types";
import prayerData from '../../data/prayerData'; // Import prayerData directly

// Import Child Components
import LineNavigation from './LineNavigation';
import Sidebar from './Sidebar';
import PrayerDisplay from './PrayerDisplay';
import PlaybackControls from './PlaybackControls';
import SpeedControl from './SpeedControl';
import MobileHeader from './MobileHeader';

export default function PrayerContent() {
  const { state, dispatch } = usePrayerContext();
  const { selectedPrayer, currentLineIndex, isPlaying, audioMode, speed } = state;

  const { audioRef, audioLoaded, audioError } = useAudioPlayer();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { width = 0 } = useWindowSize();
  const isMobile = width < 768;

  const prayerText = useMemo(() => selectedPrayer?.prayerText || [], [selectedPrayer]);
  const prayerTitle = useMemo(() => selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [selectedPrayer]);

  const filteredPrayers = useMemo(() =>
    searchTerm.trim()
      ? prayerData.filter(prayer => prayer.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : prayerData,
    [searchTerm]
  );

  const advanceToNextLine = useCallback(() => {
    if (isPlaying && prayerText.length > 0) {
      if (audioMode === 'sync' && selectedPrayer?.audioSrc && audioLoaded) {
        return;
      }
      if (currentLineIndex < prayerText.length - 1) {
        dispatch({ type: 'NEXT_LINE' });
      } else {
        dispatch({ type: 'PAUSE' });
      }
    }
  }, [isPlaying, prayerText.length, currentLineIndex, audioMode, selectedPrayer, audioLoaded, dispatch]);

  const useIntervalCondition = isPlaying &&
    prayerText.length > 0 &&
    (audioMode !== 'sync' || !selectedPrayer?.audioSrc || !audioLoaded);

  useInterval(advanceToNextLine, speed, useIntervalCondition);

  useEffect(() => {
    const element = document.getElementById(`line-${currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLineIndex]);

  const handleSelectPrayerCallback = useCallback(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  const toggleAudioMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_AUDIO_MODE' });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  if (!prayerData.length || !selectedPrayer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-text">
        ไม่พบข้อมูลบทสวด
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col md:flex-row bg-background text-text transition-colors duration-300">
      <MobileHeader
        title="บทสวดมนต์"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="h-fit md:w-64 lg:w-80 rounded-lg shadow-md bg-background">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          prayers={filteredPrayers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectPrayer={handleSelectPrayerCallback}
        />
      </div>
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 text-primary">
            {prayerTitle}
          </h2>
          {selectedPrayer?.audioSrc ? (
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center bg-muted rounded-full px-4 py-2">
                <span className="mr-2">
                  {audioLoaded ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                </span>
                <span className="text-sm">{audioLoaded ? 'พร้อมเล่นเสียง' : 'กำลังโหลดเสียง...'}</span>
                <button
                  className="ml-4 px-2 py-1 bg-secondary rounded-md text-xs text-white"
                  onClick={toggleAudioMode}
                >
                  {audioMode === 'sync' ? 'โหมด: ซิงค์กับเนื้อหา' : 'โหมด: เสียงต่อเนื่อง'}
                </button>
              </div>
            </div>
          ) : null}
          {audioError && (
            <div className="text-center mb-4 text-red-500 bg-red-100 p-2 rounded-md">
              {audioError}
            </div>
          )}
          <div className="w-full bg-muted rounded-full h-1 mb-4">
            <div
              className="bg-secondary h-1 rounded-full transition-all duration-300"
              style={{
                width: `${prayerText.length > 0 ? (currentLineIndex / (prayerText.length - 1)) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <PrayerDisplay />
          <LineNavigation />
          <PlaybackControls />
          <SpeedControl />
          <div className="text-center mt-4 text-sm md:text-base text-secondary">
            บรรทัด {currentLineIndex + 1} จาก {prayerText.length}
          </div>
          <audio ref={audioRef} preload="auto" />
        </div>
      </main>
    </div>
  );
}
