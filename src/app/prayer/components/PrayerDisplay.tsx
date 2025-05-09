import React, { useEffect, useRef } from 'react';

interface PrayerDisplayProps {
  prayerText: string[];
  currentLineIndex: number;
}

const PrayerDisplay: React.FC<PrayerDisplayProps> = ({ prayerText, currentLineIndex }) => {
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);

  // Scroll to current line when it changes
  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLineIndex]);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 mb-6 h-64 md:h-72 lg:h-80 no-scrollbar overflow-y-auto">
      <div className="flex flex-col items-center">
        {prayerText.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">กรุณาเลือกบทสวดจากรายการ</p>
        ) : (
          prayerText.map((line, index) => (
            <p
              key={index}
              ref={index === currentLineIndex ? currentLineRef : null}
              className={`text-lg md:text-2xl lg:text-3xl leading-relaxed text-center py-1 px-3 my-1 w-fit transition-all duration-200 ${
                index === currentLineIndex 
                  ? 'bg-gray-800 text-white font-medium rounded-md' 
                  : 'text-gray-800'
              }`}
            >
              {line}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerDisplay;