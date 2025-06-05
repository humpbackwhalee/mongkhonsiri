'use client';
import React, { useReducer, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import LineNavigation from './_components/LineNavigation';
import Sidebar from './_components/Sidebar';
import PrayerDisplay from './_components/PrayerDisplay';
import PlaybackControls from './_components/PlaybackControls';
import SpeedControl from './_components/SpeedControl';
import MobileHeader from './_components/MobileHeader';
import useWindowSize from './_utils/useWindowSize';
import useInterval from './_utils/useInterval';
import { prayerReducer, initialState } from './_utils/prayerReducer';
import { PrayerContext } from './_context/PrayerContext';
import { useAudioPlayer } from './_hooks/useAudioPlayer';

import prayerData from '../data/prayerData';
import { Prayer } from "./_utils/types";

export default function PrayerLyricsLoop() {
  const [state, dispatch] = useReducer(prayerReducer, initialState);
  const { selectedPrayer, currentLineIndex, isPlaying, audioMode, speed } = state; // Destructure for easier use

  const { audioRef, audioLoaded, audioError } = useAudioPlayer();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [audioLoaded, setAudioLoaded] = useState(false); // Removed, from hook
  // const [audioError, setAudioError] = useState<string | null>(null); // Removed, from hook
  // const audioRef = useRef<HTMLAudioElement>(null); // Removed, from hook

  const { width = 0 } = useWindowSize();
  const isMobile = width < 768;

  const prayerText = useMemo(() => state.selectedPrayer?.prayerText || [], [state.selectedPrayer]);
  const prayerTitle = useMemo(() => state.selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [state.selectedPrayer]);
  const filteredPrayers = useMemo(() =>
    searchTerm.trim()
      ? prayerData.filter(prayer => prayer.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : prayerData,
    [searchTerm]
  );

  // Removed audio event listener useEffect, it's now in useAudioPlayer

  const advanceToNextLine = useCallback(() => {
    if (isPlaying && prayerText.length > 0) {
      // If sync mode with audio source and audio is loaded, let timeupdate handle line changes
      if (audioMode === 'sync' && selectedPrayer?.audioSrc && audioLoaded) {
        return;
      }

      // For non-sync mode, or sync mode without audio/audio not loaded
      if (currentLineIndex < prayerText.length - 1) {
        dispatch({ type: 'NEXT_LINE' });
      } else {
        dispatch({ type: 'PAUSE' });
        // Resetting audioRef current time for non-src audio is implicitly handled
        // as useAudioPlayer won't play anything if no src.
        // If there was an audio source and it just finished, useAudioPlayer handles PAUSE.
      }
    }
  }, [isPlaying, prayerText.length, currentLineIndex, audioMode, selectedPrayer, audioLoaded, dispatch]);

  // ใช้ interval เฉพาะในโหมดที่ไม่ใช่ซิงค์ หรือเมื่อไม่มีไฟล์เสียง หรือเสียงยังไม่โหลด
  const useIntervalCondition = isPlaying &&
    prayerText.length > 0 &&
    (audioMode !== 'sync' || !selectedPrayer?.audioSrc || !audioLoaded);

  useInterval(advanceToNextLine, state.speed, useIntervalCondition); // state.speed is still fine

  useEffect(() => {
    const element = document.getElementById(`line-${currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLineIndex]);

  // handlePlay, handlePause, handleReset are removed.
  // PlaybackControls dispatches actions, useAudioPlayer reacts to isPlaying state.

  // handleSelectPrayer is now only for UI (closing sidebar).
  // The dispatch part is in Sidebar.tsx. Audio loading is in useAudioPlayer.
  const handleSelectPrayerCallback = useCallback(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  // handlePrevLine, handleNextLine, handleSpeedChange, handleSelectLine are removed.
  // Child components dispatch actions directly. Audio sync logic is in useAudioPlayer.

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
    <PrayerContext.Provider value={{ state, dispatch }}>
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
          onSelectPrayer={handleSelectPrayerCallback} {/* Updated prop name */}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 text-primary">
            {prayerTitle}
          </h2>

          {/* แสดงสถานะเสียง using audioLoaded, audioError from useAudioPlayer */}
          {selectedPrayer?.audioSrc ? (
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center bg-muted rounded-full px-4 py-2">
                <span className="mr-2">
                  {audioLoaded ? ( // From hook
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                </span>
                <span className="text-sm">{audioLoaded ? 'พร้อมเล่นเสียง' : 'กำลังโหลดเสียง...'}</span> {/* From hook */}

                {/* ปุ่มสลับโหมดเล่นเสียง */}
                <button
                  className="ml-4 px-2 py-1 bg-secondary rounded-md text-xs text-white"
                  onClick={toggleAudioMode}
                >
                  {audioMode === 'sync' ? 'โหมด: ซิงค์กับเนื้อหา' : 'โหมด: เสียงต่อเนื่อง'}
                </button>
              </div>
            </div>
          ) : null}

          {/* แสดงข้อความเตือนเมื่อมีเสียงแต่โหลดไม่สำเร็จ using audioError from useAudioPlayer */}
          {audioError && ( // From hook
            <div className="text-center mb-4 text-red-500 bg-red-100 p-2 rounded-md">
              {audioError} {/* From hook */}
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

          {/* Audio Element using audioRef from useAudioPlayer */}
          <audio ref={audioRef} preload="auto"> {/* Ref from hook */}
            {/* Source will be set by the hook based on selectedPrayer.audioSrc */}
          </audio>
        </div>
      </main>
    </div>
    </PrayerContext.Provider>
  );
}