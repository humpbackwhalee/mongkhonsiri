'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer } from 'react';
import Sidebar from './components/Sidebar';
import PrayerDisplay from './components/PrayerDisplay';
import LineNavigation from './components/LineNavigation';
import PlaybackControls from './components/PlaybackControls';
import SpeedControl from './components/SpeedControl';
import MobileHeader from './components/MobileHeader';
import prayerDataObject from '../data/prayerData';

import type { Prayer } from './components/PrayerItem';

const prayerData: Prayer[] = Object.entries(prayerDataObject).map(([key, value]) => ({
  key,
  ...value,
}));

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function useInterval(callback: () => void, delay: number | null, condition: boolean) {
  const savedCallback = useRef<(() => void) | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
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
  selectedPrayer: prayerData[0],
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
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SELECT_LINE'; lineIndex: number };


function prayerReducer(state: typeof initialState, action: PrayerAction) {
  switch (action.type) {
    case 'SELECT_PRAYER':
      return {
        ...state,
        selectedPrayer: action.prayer,
        currentLineIndex: 0,
        isPlaying: false
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESET':
      return { ...state, isPlaying: false, currentLineIndex: 0 };
    case 'SELECT_LINE':
      return {
        ...state,
        currentLineIndex: action.lineIndex,
        isPlaying: true, // หรือ false แล้วแต่ต้องการ behavior
      };
    case 'NEXT_LINE':
      return {
        ...state,
        currentLineIndex: (state.currentLineIndex + 1) % (state.selectedPrayer?.prayerText?.length || 1)
      };
    case 'PREV_LINE':
      return {
        ...state,
        currentLineIndex: state.currentLineIndex > 0
          ? state.currentLineIndex - 1
          : (state.selectedPrayer?.prayerText?.length - 1) || 0
      };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
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

  // Memoize derived values
  const prayerText = useMemo(() =>
    state.selectedPrayer?.prayerText || [],
    [state.selectedPrayer]
  );

  const prayerTitle = useMemo(() =>
    state.selectedPrayer?.title || 'ไม่มีชื่อบทสวด',
    [state.selectedPrayer]
  );

  const filteredPrayers = useMemo(() =>
    searchTerm.trim()
      ? prayerData.filter(prayer =>
        prayer.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : prayerData,
    [searchTerm]
  );

  const advanceToNextLine = useCallback(() => {
    dispatch({ type: 'NEXT_LINE' });
  }, []);

  useInterval(advanceToNextLine, state.speed, state.isPlaying && prayerText.length > 0);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('lastSelectedPrayer', state.selectedPrayer.key);
    localStorage.setItem('lastSpeed', state.speed.toString());
  }, [state.selectedPrayer, state.speed]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const lastSelectedKey = localStorage.getItem('lastSelectedPrayer');
    if (lastSelectedKey) {
      const lastPrayer = prayerData.find(p => p.key === lastSelectedKey);
      if (lastPrayer) {
        dispatch({ type: 'SELECT_PRAYER', prayer: lastPrayer });
      }
    }

    const lastSpeed = localStorage.getItem('lastSpeed');
    if (lastSpeed) {
      dispatch({ type: 'SET_SPEED', speed: Number(lastSpeed) });
    }
  }, []);

  // Scroll current line into view with smooth animation
  useEffect(() => {
    const element = document.getElementById(`line-${state.currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.currentLineIndex]);

  // UI event handlers - memoized to prevent re-creation
  const handlePlay = useCallback(() => {
    dispatch({ type: 'PLAY' });
  }, []);

  const handlePause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleSelectPrayer = useCallback((prayer: Prayer) => {
    dispatch({ type: 'SELECT_PRAYER', prayer });
    if (isMobile) {
      setIsSidebarOpen(false); // Close sidebar on mobile after selection
    }
  }, [isMobile]);

  const handlePrevLine = useCallback(() => {
    dispatch({ type: 'PREV_LINE' });
  }, []);

  const handleNextLine = useCallback(() => {
    dispatch({ type: 'NEXT_LINE' });
  }, []);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SPEED', speed: Number(e.target.value) });
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Handle empty prayer data
  if (prayerData.length === 0) {
    return <div className="flex justify-center items-center h-screen">ไม่พบข้อมูลบทสวด</div>;
  }

  return (
    <div className="container mx-auto flex flex-col md:flex-row min-h-screen transition-colors duration-300">
      <MobileHeader
        title="บทสวดมนต์"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Prayer List */}
      <div className="h-fit rounded-lg shadow-md transition-colors duration-300">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          prayers={filteredPrayers}
          selectedPrayer={state.selectedPrayer}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectPrayer={handleSelectPrayer}
        />
      </div>

      {/* Prayer Text */}
      <div className="flex flex-col items-center justify-start flex-grow">
        <div className="w-full  md:min-w-4xl max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-center flex-grow">
              {prayerTitle}
            </h2>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-300 rounded-full h-1 mb-2">
            <div
              className="bg-gray-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(state.currentLineIndex / Math.max(1, prayerText.length - 1)) * 100}%` }}
            ></div>
          </div>

          <PrayerDisplay
            prayerText={prayerText}
            currentLineIndex={state.currentLineIndex}
            onSelectLine={(index) => {
              dispatch({ type: 'SELECT_LINE', lineIndex: index }); // สมมติว่า reducer มี action นี้
            }}
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

          {/* Line counter */}
          <div className="text-center mt-4">
            บรรทัด {state.currentLineIndex + 1} จาก {prayerText.length}
          </div>
        </div>
      </div>
    </div>
  );
}