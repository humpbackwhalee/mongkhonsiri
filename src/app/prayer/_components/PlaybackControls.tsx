import React from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  disabled
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      <button
        className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={onPlay}
        disabled={isPlaying || disabled}
        aria-label="เริ่มอ่านบทสวด"
      >
        เล่น
      </button>
      
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={onPause}
        disabled={!isPlaying}
        aria-label="หยุดอ่านบทสวด"
      >
        หยุด
      </button>
      
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={onReset}
        disabled={disabled}
        aria-label="รีเซ็ตการอ่าน"
      >
        รีเซ็ต
      </button>
    </div>
  );
};

export default PlaybackControls;