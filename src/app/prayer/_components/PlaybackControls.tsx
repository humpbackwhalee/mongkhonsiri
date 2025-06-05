import React from 'react';
import { usePrayerContext } from '../_context/PrayerContext';

interface PlaybackControlsProps {
  // isPlaying: boolean; // From context
  // onPlay: () => void; // From context
  // onPause: () => void; // From context
  // onReset: () => void; // From context
  // disabled: boolean; // Derived from context
}

const PlaybackControls: React.FC<PlaybackControlsProps> = (
  // {
  // isPlaying, // Removed
  // onPlay, // Removed
  // onPause, // Removed
  // onReset, // Removed
  // disabled // Removed
  // }
) => {
  const { state, dispatch } = usePrayerContext();
  const { isPlaying, selectedPrayer } = state;

  const handlePlay = () => dispatch({ type: 'PLAY' });
  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleReset = () => dispatch({ type: 'RESET' });

  const disabled = !selectedPrayer?.prayerText?.length;

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      <button
        className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={handlePlay}
        disabled={isPlaying || disabled}
        aria-label="เริ่มอ่านบทสวด"
      >
        เล่น
      </button>
      
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={handlePause}
        disabled={!isPlaying}
        aria-label="หยุดอ่านบทสวด"
      >
        หยุด
      </button>
      
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={handleReset}
        disabled={disabled}
        aria-label="รีเซ็ตการอ่าน"
      >
        รีเซ็ต
      </button>
    </div>
  );
};

export default PlaybackControls;