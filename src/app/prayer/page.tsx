'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer } from 'react';
import Sidebar from './components/Sidebar';
import PrayerDisplay from './components/PrayerDisplay';
import LineNavigation from './components/LineNavigation';
import PlaybackControls from './components/PlaybackControls';
import SpeedControl from './components/SpeedControl';
import MobileHeader from './components/MobileHeader';
import prayerData from '../data/prayerData';
import type { Prayer } from './components/PrayerItem';

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function useInterval(callback: () => void, delay: number | null, condition: boolean) {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!condition || delay === null) return;

    const tick = () => {
      if (savedCallback.current) savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, condition]);
}

const initialState = {
  selectedPrayer: prayerData[0] ?? null,
  currentLineIndex: 0,
  isPlaying: false,
  speed: 2000,
};

type PrayerAction =
  | { type: 'SELECT_PRAYER'; prayer: Prayer }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'NEXT_LINE' }
  | { type: 'PREV_LINE' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SELECT_LINE'; lineIndex: number };

function prayerReducer(state: typeof initialState, action: PrayerAction) {
  switch (action.type) {
    case 'SELECT_PRAYER':
      return {
        ...state,
        selectedPrayer: action.prayer ?? prayerData[0] ?? null,
        currentLineIndex: 0,
        isPlaying: false,
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESET':
      return { ...state, isPlaying: false, currentLineIndex: 0 };
    case 'NEXT_LINE':
      return {
        ...state,
        currentLineIndex: state.selectedPrayer && state.selectedPrayer.prayerText.length > 0
          ? (state.currentLineIndex + 1) % state.selectedPrayer.prayerText.length
          : 0,
      };
    case 'PREV_LINE':
      return {
        ...state,
        currentLineIndex: state.selectedPrayer && state.selectedPrayer.prayerText.length > 0
          ? state.currentLineIndex > 0
            ? state.currentLineIndex - 1
            : state.selectedPrayer.prayerText.length - 1
          : 0,
      };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'SELECT_LINE':
      return {
        ...state,
        currentLineIndex: action.lineIndex >= 0 && action.lineIndex < (state.selectedPrayer?.prayerText.length ?? 0)
          ? action.lineIndex
          : state.currentLineIndex,
        isPlaying: false,
      };
    default:
      return state;
  }
}

export default function PrayerLyricsLoop() {
  const [state, dispatch] = useReducer(prayerReducer, initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const prayerText = useMemo(() => state.selectedPrayer?.prayerText || [], [state.selectedPrayer]);
  const prayerTitle = useMemo(() => state.selectedPrayer?.title || 'ไม่มีชื่อบทสวด', [state.selectedPrayer]);
  const filteredPrayers = useMemo(() =>
    searchTerm.trim()
      ? prayerData.filter(prayer => prayer.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : prayerData,
    [searchTerm]
  );

  const advanceToNextLine = useCallback(() => {
    dispatch({ type: 'NEXT_LINE' });
  }, []);

  useInterval(advanceToNextLine, state.speed, state.isPlaying && prayerText.length > 0);

  useEffect(() => {
    const element = document.getElementById(`line-${state.currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.currentLineIndex]);

  const handlePlay = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const handlePause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const handleSelectPrayer = useCallback((prayer: Prayer) => {
    dispatch({ type: 'SELECT_PRAYER', prayer });
    if (isMobile) setIsSidebarOpen(false);
  }, [isMobile]);
  const handlePrevLine = useCallback(() => dispatch({ type: 'PREV_LINE' }), []);
  const handleNextLine = useCallback(() => dispatch({ type: 'NEXT_LINE' }), []);
  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SPEED', speed: Number(e.target.value) });
  }, []);
  const handleSelectLine = useCallback((lineIndex: number) => {
    dispatch({ type: 'SELECT_LINE', lineIndex });
  }, []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  if (!prayerData.length || !state.selectedPrayer) {
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

          <div className="w-full bg-muted rounded-full h-1 mb-4">
            <div
              className="bg-secondary h-1 rounded-full transition-all duration-300"
              style={{
                width: `${prayerText.length > 0 ? (state.currentLineIndex / (prayerText.length - 1)) * 100 : 0}%`,
              }}
            ></div>
          </div>

          <PrayerDisplay
            prayerText={prayerText}
            currentLineIndex={state.currentLineIndex}
            onSelectLine={handleSelectLine}
          />

          <LineNavigation
            currentLineIndex={state.currentLineIndex}
            totalLines={prayerText.length}
            onPrevLine={handlePrevLine}
            onNextLine={handleNextLine}
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
        </div>
      </main>
    </div>
  );
}