import React, { useEffect, useRef } from 'react';

interface PrayerDisplayProps {
  prayerText: string[];
  currentLineIndex: number;
  onSelectLine?: (index: number) => void;
}

const PrayerDisplay: React.FC<PrayerDisplayProps> = ({
  prayerText,
  currentLineIndex,
  onSelectLine
}) => {
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      currentLineRef.current.focus(); // โฟกัสที่บรรทัดปัจจุบัน
    }
  }, [currentLineIndex]);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 mb-6 h-64 md:h-72 lg:h-96 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center">
        {prayerText.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">กรุณาเลือกบทสวดจากรายการ</p>
        ) : (
          prayerText.map((line, index) => (
            <p
              key={index} // ใช้ index เป็น key เพื่อป้องกัน duplicate keys
              ref={index === currentLineIndex ? currentLineRef : null}
              aria-current={index === currentLineIndex ? 'true' : 'false'}
              aria-label={`บรรทัด ${index + 1}: ${line}`} // Accessibility
              className={`text-lg md:text-2xl lg:text-3xl leading-relaxed text-center py-1 px-3 my-1 w-fit transition-all duration-250 hover:bg-gray-100 ${
                index === currentLineIndex
                  ? 'bg-gray-800 text-white font-medium rounded-md'
                  : 'text-gray-800'
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectLine?.(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectLine?.(index);
                  e.preventDefault(); // ป้องกันการเลื่อนหน้า
                }
              }}
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