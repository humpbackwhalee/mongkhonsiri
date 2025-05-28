'use client';
import React, { useReducer, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Sidebar from './_components/Sidebar';
import PrayerDisplay from './_components/PrayerDisplay';
import PlaybackControls from './_components/PlaybackControls';
import SpeedControl from './_components/SpeedControl';
import MobileHeader from './_components/MobileHeader';
import useWindowSize from './_utils/useWindowSize';
import useInterval from './_utils/useInterval';
import { prayerReducer, initialState } from './_utils/prayerReducer';

import prayerData from '../data/prayerData';
import { Prayer } from "./_utils/types";

export default function PrayerLyricsLoop() {
  const [state, dispatch] = useReducer(prayerReducer, initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  // Audio event handlers - moved to separate functions for better readability
  const handleTimeUpdate = useCallback(() => {
    if (state.audioMode === 'sync' && state.isPlaying && state.selectedPrayer?.audioTimings) {
      const audioElement = audioRef.current;
      if (!audioElement) return;

      const currentTime = audioElement.currentTime;
      const timings = state.selectedPrayer.audioTimings;

      // Find the correct line index based on current audio time
      let newLineIndex = 0;
      for (let i = 0; i < timings.length; i++) {
        if (i < timings.length - 1) {
          if (currentTime >= timings[i] && currentTime < timings[i + 1]) {
            newLineIndex = i;
            break;
          }
        } else if (currentTime >= timings[i]) {
          newLineIndex = i;
        }
      }

      // Update current line if it's different
      if (newLineIndex !== state.currentLineIndex) {
        dispatch({ type: 'SELECT_LINE', lineIndex: newLineIndex });
      }
    }
  }, [state.audioMode, state.isPlaying, state.selectedPrayer, state.currentLineIndex]);

  const handleAudioLoaded = useCallback(() => {
    setAudioLoaded(true);
    setAudioError(null);
    
    // Auto-sync to current line when audio loads (important for prayer switching)
    if (state.audioMode === 'sync' && state.selectedPrayer?.audioTimings) {
      const audioElement = audioRef.current;
      if (audioElement) {
        const timing = state.selectedPrayer.audioTimings[state.currentLineIndex];
        if (timing !== undefined) {
          audioElement.currentTime = timing;
        }
      }
    }
  }, [state.audioMode, state.selectedPrayer, state.currentLineIndex]);

  const handleAudioError = useCallback(() => {
    setAudioLoaded(false);
    setAudioError('ไม่สามารถโหลดไฟล์เสียงได้');
  }, []);

  const handleAudioEnded = useCallback(() => {
    if (state.audioMode === 'continuous') {
      dispatch({ type: 'RESET' });
      dispatch({ type: 'PAUSE' });
    }
  }, [state.audioMode]);

  // Main audio effect - cleaner setup
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadeddata', handleAudioLoaded);
    audioElement.addEventListener('error', handleAudioError);
    audioElement.addEventListener('ended', handleAudioEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadeddata', handleAudioLoaded);
      audioElement.removeEventListener('error', handleAudioError);
      audioElement.removeEventListener('ended', handleAudioEnded);
    };
  }, [handleTimeUpdate, handleAudioLoaded, handleAudioError, handleAudioEnded]);

  const advanceToNextLine = useCallback(() => {
    if (!state.isPlaying || prayerText.length === 0) return;

    // Don't auto-advance in sync mode when audio is loaded and playing
    if (state.audioMode === 'sync' && state.selectedPrayer?.audioSrc && audioLoaded) {
      return;
    }

    if (state.currentLineIndex < prayerText.length - 1) {
      dispatch({ type: 'NEXT_LINE' });
    } else {
      // End of prayer reached
      dispatch({ type: 'PAUSE' });
      if (audioRef.current && (!state.selectedPrayer?.audioSrc || !audioLoaded)) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [state.isPlaying, prayerText.length, state.currentLineIndex, state.audioMode, state.selectedPrayer, audioLoaded]);

  // Improved interval condition logic
  const useIntervalCondition = useMemo(() => 
    state.isPlaying &&
    prayerText.length > 0 &&
    (state.audioMode !== 'sync' || !state.selectedPrayer?.audioSrc || !audioLoaded),
    [state.isPlaying, prayerText.length, state.audioMode, state.selectedPrayer?.audioSrc, audioLoaded]
  );

  useInterval(advanceToNextLine, state.speed, useIntervalCondition);

  // Auto-scroll to current line
  useEffect(() => {
    const element = document.getElementById(`line-${state.currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.currentLineIndex]);

  // Improved audio playback with better error handling
  const handlePlay = useCallback(async () => {
    dispatch({ type: 'PLAY' });
    
    const audioElement = audioRef.current;
    if (!audioElement || !state.selectedPrayer?.audioSrc) return;

    try {
      // Set audio timing for sync mode
      if (state.audioMode === 'sync' && state.selectedPrayer.audioTimings) {
        const timing = state.selectedPrayer.audioTimings[state.currentLineIndex];
        if (timing !== undefined) {
          audioElement.currentTime = timing;
        }
      }

      // Adjust playback rate based on speed
      audioElement.playbackRate = state.speed !== 2000 ? 2000 / state.speed : 1.0;

      await audioElement.play();
    } catch (err) {
      console.error("ไม่สามารถเล่นเสียงได้:", err);
      setAudioError("ไม่สามารถเล่นเสียงได้ โปรดลองใหม่อีกครั้ง");
      dispatch({ type: 'PAUSE' }); // Stop playback on error
    }
  }, [state.selectedPrayer, state.currentLineIndex, state.audioMode, state.speed]);

  const handlePause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    if (audioRef.current && state.selectedPrayer?.audioSrc) {
      audioRef.current.pause();
    }
  }, [state.selectedPrayer]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleSelectPrayer = useCallback((prayer: Prayer) => {
    // Stop current playback first
    dispatch({ type: 'PAUSE' });
    
    // Reset to first line when selecting new prayer
    dispatch({ type: 'RESET' });
    
    // Then select the new prayer
    dispatch({ type: 'SELECT_PRAYER', prayer });
    
    if (isMobile) setIsSidebarOpen(false);

    // Reset audio state
    setAudioLoaded(false);
    setAudioError(null);

    // Load new audio file if available
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;

      if (prayer.audioSrc) {
        audioElement.src = prayer.audioSrc;
        audioElement.load();
        
        // Wait for audio to load before allowing sync
        audioElement.addEventListener('loadeddata', () => {
          // If we're in sync mode, set audio to start position
          if (state.audioMode === 'sync' && prayer.audioTimings && prayer.audioTimings[0] !== undefined) {
            audioElement.currentTime = prayer.audioTimings[0];
          }
        }, { once: true });
      } else {
        audioElement.src = '';
      }
    }
  }, [isMobile, state.audioMode]);

  // Navigation handlers with improved audio sync
  const syncAudioToLine = useCallback((lineIndex: number) => {
    const audioElement = audioRef.current;
    if (audioElement && state.selectedPrayer?.audioTimings && state.audioMode === 'sync') {
      const timing = state.selectedPrayer.audioTimings[lineIndex];
      if (timing !== undefined) {
        audioElement.currentTime = timing;
        if (state.isPlaying) {
          audioElement.play().catch(err => {
            console.error("ไม่สามารถเล่นเสียงได้:", err);
          });
        }
      }
    }
  }, [state.selectedPrayer, state.audioMode, state.isPlaying]);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    dispatch({ type: 'SET_SPEED', speed: newSpeed });

    // Adjust audio playback rate
    const audioElement = audioRef.current;
    if (audioElement && state.selectedPrayer?.audioSrc) {
      audioElement.playbackRate = 2000 / newSpeed;
    }
  }, [state.selectedPrayer]);

  const handleSelectLine = useCallback((lineIndex: number) => {
    dispatch({ type: 'SELECT_LINE', lineIndex });
    syncAudioToLine(lineIndex);
  }, [syncAudioToLine]);

  const toggleAudioMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_AUDIO_MODE' });
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  // Early return for no data
  if (!prayerData.length || !state.selectedPrayer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-text">
        <div className="text-center">
          <p className="text-lg mb-2">ไม่พบข้อมูลบทสวด</p>
          <p className="text-sm text-gray-500">กรุณาตรวจสอบไฟล์ข้อมูลบทสวด</p>
        </div>
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
          selectedPrayer={state.selectedPrayer}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectPrayer={handleSelectPrayer}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 text-primary">
            {prayerTitle}
          </h2>

          {/* Audio status indicator */}
          {state.selectedPrayer?.audioSrc && (
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center bg-muted rounded-full px-4 py-2">
                <span className="mr-2">
                  {audioLoaded ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </span>
                <span className="text-sm">{audioLoaded ? 'พร้อมเล่นเสียง' : 'กำลังโหลดเสียง...'}</span>

                {/* Audio mode toggle button */}
                <button
                  className="ml-4 px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md text-xs text-white transition-colors"
                  onClick={toggleAudioMode}
                  disabled={!audioLoaded}
                >
                  {state.audioMode === 'sync' ? 'โหมด: ซิงค์กับเนื้อหา' : 'โหมด: เสียงต่อเนื่อง'}
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {audioError && (
            <div className="text-center mb-4 text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
              <p className="font-medium">เกิดข้อผิดพลาด</p>
              <p className="text-sm">{audioError}</p>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1 mb-4">
            <div
              className="bg-secondary h-1 rounded-full transition-all duration-300"
              style={{
                width: `${prayerText.length > 0 ? (state.currentLineIndex / Math.max(prayerText.length - 1, 1)) * 100 : 0}%`,
              }}
            />
          </div>

          <PrayerDisplay
            prayerText={prayerText}
            currentLineIndex={state.currentLineIndex}
            onSelectLine={handleSelectLine}
          />

          <PlaybackControls
            isPlaying={state.isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            disabled={prayerText.length === 0}
          />

          <SpeedControl
            speed={state.speed}
            onSpeedChange={handleSpeedChange}
          />

          <div className="text-center mt-4 text-sm md:text-base text-secondary">
            บรรทัด {state.currentLineIndex + 1} จาก {prayerText.length}
          </div>

          {/* Audio Element */}
          {state.selectedPrayer?.audioSrc && (
            <audio ref={audioRef} preload="auto">
              <source src={state.selectedPrayer.audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </main>
    </div>
  );
}