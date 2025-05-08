"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PrayerFunctionProps {
  prayerTextLine: string[];
  scrollSpeed?: number; // ความเร็วในการเลื่อน (มิลลิวินาทีต่อบรรทัด)
  highlightStyle?: 'bold';
}

const PrayerFunction: React.FC<PrayerFunctionProps> = ({
  prayerTextLine,
  scrollSpeed = 500,
  highlightStyle = 'bold',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]); // Ref สำหรับแต่ละบรรทัด

  const scrollToCenter = useCallback((index: number) => {
    if (containerRef.current && lineRefs.current[index]) {
      const container = containerRef.current;
      const line = lineRefs.current[index];

      const containerHeight = container.offsetHeight;
      const lineHeight = line.offsetHeight;
      const lineOffsetTop = line.offsetTop;

      const scrollTo = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);

      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }
  }, []);

  const startPrayer = () => {
    setIsPlaying(true);
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % prayerTextLine.length);
      }, scrollSpeed);
    }
  };

  const stopPrayer = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % prayerTextLine.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + prayerTextLine.length) % prayerTextLine.length);
  };

  useEffect(() => {
    scrollToCenter(currentIndex);
  }, [currentIndex, scrollToCenter]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md shadow-md overflow-y-auto"
      style={{ maxHeight: '300px' }}
    >
      <div className="text-center mb-4 space-y-2">
        {prayerTextLine.map((line, index) => (
          <p
            key={index}
            ref={(el) => {
              if (el) {
                lineRefs.current[index] = el;
              }
            }}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? highlightStyle === 'bold'
                  ? 'text-lg font-semibold scale-125'
                  : 'text-lg font-bold'
                : 'text-md font-normal text-gray-700'
            }`}
          >
            {line}
          </p>
        ))}
      </div>
      <div className="flex space-x-4">
        {!isPlaying ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={startPrayer}
          >
            เริ่มสวดมนต์
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={stopPrayer}
          >
            หยุดสวดมนต์
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={goToPrevious}
        >
          ก่อนหน้า
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={goToNext}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default PrayerFunction;