'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function PrayerFunction() {
  const rawPrayerLyrics = useMemo(() => [
    { text: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ" },
    { text: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ" },
    { text: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ" },
    { text: "พุทธัง สะระณัง คัจฉามิ" },
    { text: "ธัมมัง สะระณัง คัจฉามิ" },
    { text: "สังฆัง สะระณัง คัจฉามิ" },
  ], []);

  const fixedDuration = 1000; // 1 วินาที (1000 มิลลิวินาที)
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const isPlaying = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying.current && currentLineIndex < rawPrayerLyrics.length) {
      timeoutId.current = setTimeout(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % rawPrayerLyrics.length);
      }, fixedDuration);
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [currentLineIndex, rawPrayerLyrics, isPlaying]);

  const handlePlay = () => {
    isPlaying.current = true;
    if (currentLineIndex >= rawPrayerLyrics.length) {
      setCurrentLineIndex(0);
    } else {
      timeoutId.current = setTimeout(() => {
        setCurrentLineIndex(prevIndex => prevIndex + 1);
      }, fixedDuration);
    }
  };

  const handlePause = () => {
    isPlaying.current = false;
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  const handleReset = () => {
    isPlaying.current = false;
    setCurrentLineIndex(0);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <h1 className='text-2xl text-slate-600'>บทบูชาพระรัตนตรัย (เลื่อนทุก 1 วินาที)</h1>
      <div className='flex flex-col items-center'>
        {rawPrayerLyrics.map((line, index) => (
          <p
            key={index}
            className={`text-xl leading-relaxed ${index === currentLineIndex ? 'text-blue-500 font-bold' : 'text-gray-700'
              }`}
          >
            {line.text}
          </p>
        ))}
      </div>
      <div className='flex gap-2'>
        <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={handlePlay}>เล่น</button>
        <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded' onClick={handlePause}>หยุด</button>
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleReset}>รีเซ็ต</button>
      </div>
      <p>บรรทัดที่: {currentLineIndex + 1} / {rawPrayerLyrics.length}</p>
    </div>
  );
}