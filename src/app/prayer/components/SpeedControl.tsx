import React from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">ความเร็ว</span>
        <span className="text-sm text-gray-600">{speed/1000} วินาที</span>
      </div>
      
      <input
        type="range"
        id="speed"
        name="speed"
        min="500"
        max="3000"
        step="100"
        value={speed}
        onChange={onSpeedChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        aria-label="ปรับความเร็วในการเปลี่ยนบรรทัด"
        aria-valuenow={speed}
        aria-valuemin={500}
        aria-valuemax={3000}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>เร็ว</span>
        <span>ช้า</span>
      </div>
    </div>
  );
};

export default SpeedControl;