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

import prayerData from '../data/prayerData';
import { Prayer } from "./_utils/types";

export default function PrayerLyricsLoop() {
  // console.log(prayerData);
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

  // เพิ่ม event listener สำหรับการติดตามเวลาของเสียง
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      // ถ้าเราอยู่ในโหมดซิงค์และกำลังเล่น และมีข้อมูล audioTimings
      if (state.audioMode === 'sync' && state.isPlaying && state.selectedPrayer?.audioTimings) {
        const currentTime = audioElement.currentTime;
        const timings = state.selectedPrayer.audioTimings;

        // หาบรรทัดที่ควรแสดงตามเวลาปัจจุบัน
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

        // อัพเดตบรรทัดปัจจุบัน (ถ้าไม่ตรงกับปัจจุบัน)
        if (newLineIndex !== state.currentLineIndex) {
          dispatch({ type: 'SELECT_LINE', lineIndex: newLineIndex });
        }
      }
    };

    // เพิ่ม event listeners สำหรับการโหลดเสียง
    const handleAudioLoaded = () => {
      setAudioLoaded(true);
      setAudioError(null);
    };

    const handleAudioError = () => {
      setAudioLoaded(false);
      setAudioError('ไม่สามารถโหลดไฟล์เสียงได้');
    };

    const handleAudioEnded = () => {
      if (state.audioMode === 'continuous') {
        dispatch({ type: 'RESET' });
        dispatch({ type: 'PAUSE' });
      }
    };

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
  }, [state.selectedPrayer, state.audioMode, state.isPlaying, state.currentLineIndex]);

  const advanceToNextLine = useCallback(() => {
    if (state.isPlaying && prayerText.length > 0) {
      // ถ้าเป็นโหมดซิงค์ อย่าเลื่อนบรรทัดอัตโนมัติ เพราะจะควบคุมด้วย timeupdate event แทน
      if (state.audioMode === 'sync' && state.selectedPrayer?.audioSrc && audioLoaded) {
        return;
      }

      if (state.currentLineIndex < prayerText.length - 1) {
        dispatch({ type: 'NEXT_LINE' });
      } else {
        dispatch({ type: 'PAUSE' });
        if (audioRef.current && (!state.selectedPrayer?.audioSrc || !audioLoaded)) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }
  }, [state.isPlaying, prayerText.length, state.currentLineIndex, state.audioMode, state.selectedPrayer, audioLoaded]);

  // ใช้ interval เฉพาะในโหมดที่ไม่ใช่ซิงค์ หรือเมื่อไม่มีไฟล์เสียง
  const useIntervalCondition = state.isPlaying &&
    prayerText.length > 0 &&
    (state.audioMode !== 'sync' || !state.selectedPrayer?.audioSrc || !audioLoaded);

  useInterval(advanceToNextLine, state.speed, useIntervalCondition);

  useEffect(() => {
    const element = document.getElementById(`line-${state.currentLineIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.currentLineIndex]);

  const handlePlay = useCallback(() => {
    dispatch({ type: 'PLAY' });
    if (audioRef.current && state.selectedPrayer?.audioSrc) {
      // ถ้าเป็นโหมดซิงค์และมี audioTimings ให้เล่นจากตำแหน่งเวลาของบรรทัดปัจจุบัน
      if (state.audioMode === 'sync' && state.selectedPrayer.audioTimings) {
        const timing = state.selectedPrayer.audioTimings[state.currentLineIndex];
        if (timing !== undefined) {
          audioRef.current.currentTime = timing;
        }
      }

      // ปรับความเร็วเสียงหากความเร็วต่างไปจากปกติ
      if (state.speed !== 2000) {
        // ปรับความเร็วเสียงเป็นอัตราส่วนกับความเร็วปกติ (2000ms)
        audioRef.current.playbackRate = 2000 / state.speed;
      } else {
        audioRef.current.playbackRate = 1.0;
      }

      audioRef.current.play().catch(err => {
        console.error("ไม่สามารถเล่นเสียงได้:", err);
        setAudioError("ไม่สามารถเล่นเสียงได้ โปรดลองใหม่อีกครั้ง");
      });
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
    dispatch({ type: 'SELECT_PRAYER', prayer });
    if (isMobile) setIsSidebarOpen(false);

    // รีเซ็ตสถานะเสียง
    setAudioLoaded(false);
    setAudioError(null);

    // โหลดไฟล์เสียงใหม่หากมี
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      if (prayer.audioSrc) {
        audioRef.current.src = prayer.audioSrc;
        audioRef.current.load();
      } else {
        audioRef.current.src = '';
      }
    }
  }, [isMobile]);

  const handlePrevLine = useCallback(() => {
    dispatch({ type: 'PREV_LINE' });
    if (audioRef.current && state.selectedPrayer?.audioTimings && state.audioMode === 'sync') {
      // ซิงค์เสียงกับบรรทัดก่อนหน้า
      const newIndex = state.currentLineIndex > 0 ? state.currentLineIndex - 1 : state.selectedPrayer.prayerText.length - 1;
      const timing = state.selectedPrayer.audioTimings[newIndex];
      if (timing !== undefined) {
        audioRef.current.currentTime = timing;
      }
    }
  }, [state.currentLineIndex, state.selectedPrayer, state.audioMode]);

  const handleNextLine = useCallback(() => {
    dispatch({ type: 'NEXT_LINE' });
    if (audioRef.current && state.selectedPrayer?.audioTimings && state.audioMode === 'sync') {
      // ซิงค์เสียงกับบรรทัดถัดไป
      const newIndex = (state.currentLineIndex + 1) % state.selectedPrayer.prayerText.length;
      const timing = state.selectedPrayer.audioTimings[newIndex];
      if (timing !== undefined) {
        audioRef.current.currentTime = timing;
      }
    }
  }, [state.currentLineIndex, state.selectedPrayer, state.audioMode]);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    dispatch({ type: 'SET_SPEED', speed: newSpeed });

    // ปรับความเร็วเสียงตามความเร็วที่ผู้ใช้เลือก
    if (audioRef.current && state.selectedPrayer?.audioSrc) {
      audioRef.current.playbackRate = 2000 / newSpeed;
    }
  }, [state.selectedPrayer]);

  const handleSelectLine = useCallback((lineIndex: number) => {
    dispatch({ type: 'SELECT_LINE', lineIndex });

    // ซิงค์เสียงกับบรรทัดที่เลือก
    if (audioRef.current && state.selectedPrayer?.audioTimings && state.audioMode === 'sync') {
      const timing = state.selectedPrayer.audioTimings[lineIndex];
      if (timing !== undefined) {
        audioRef.current.currentTime = timing;
        if (state.isPlaying) {
          audioRef.current.play().catch(err => {
            console.error("ไม่สามารถเล่นเสียงได้:", err);
          });
        }
      }
    }
  }, [state.selectedPrayer, state.isPlaying, state.audioMode]);

  const toggleAudioMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_AUDIO_MODE' });
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

          {/* แสดงสถานะเสียง */}
          {state.selectedPrayer?.audioSrc ? (
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

                {/* ปุ่มสลับโหมดเล่นเสียง */}
                <button
                  className="ml-4 px-2 py-1 bg-secondary rounded-md text-xs text-white"
                  onClick={toggleAudioMode}
                >
                  {state.audioMode === 'sync' ? 'โหมด: ซิงค์กับเนื้อหา' : 'โหมด: เสียงต่อเนื่อง'}
                </button>
              </div>
            </div>
          ) : null}

          {/* แสดงข้อความเตือนเมื่อมีเสียงแต่โหลดไม่สำเร็จ */}
          {audioError && (
            <div className="text-center mb-4 text-red-500 bg-red-100 p-2 rounded-md">
              {audioError}
            </div>
          )}

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

          {/* Audio Element */}
          <audio ref={audioRef} preload="auto">
            <source src={state.selectedPrayer?.audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </main>
    </div>
  );
}