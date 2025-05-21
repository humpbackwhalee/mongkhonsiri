import React from 'react';

interface LineNavigationProps {
  currentLineIndex: number;
  totalLines: number;
  onPrevLine: () => void;
  onNextLine: () => void;
}

const LineNavigation: React.FC<LineNavigationProps> = ({ 
  currentLineIndex, 
  totalLines, 
  onPrevLine, 
  onNextLine 
}) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <button
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium p-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={onPrevLine}
        disabled={totalLines === 0}
        aria-label="ย้อนกลับบรรทัด"
      >
        <span className="w-6 h-6 flex items-center justify-center">◀</span>
      </button>
      
      <p className="text-sm text-gray-600 w-24 text-center">
        {totalLines > 0 ? `${currentLineIndex + 1} / ${totalLines}` : '-'}
      </p>
      
      <button
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium p-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={onNextLine}
        disabled={totalLines === 0}
        aria-label="ไปบรรทัดถัดไป"
      >
        <span className="w-6 h-6 flex items-center justify-center">▶</span>
      </button>
    </div>
  );
};

export default LineNavigation;