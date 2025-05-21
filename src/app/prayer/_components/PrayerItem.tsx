import { Prayer } from "../_utils/types";

interface PrayerItemProps {
  prayer: Prayer;
  isSelected: boolean;
  onSelect: (prayer: Prayer) => void;
}

export default function PrayerItem({ prayer, isSelected, onSelect }: PrayerItemProps) {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
        isSelected 
          ? 'bg-gray-100 text-black'
          : 'bg-card text-text hover:bg-secondary/10'
      }`}
      onClick={() => onSelect(prayer)}
    >
      <h3 className="font-medium">{prayer.title}</h3>
      {/* <div className="text-xs my-0.5 flex items-center">
        <span className="mr-2">{prayer.prayerText.length} บรรทัด</span>
        {prayer.audioSrc && (
          <span className="flex items-center">
            <svg 
              className="w-3 h-3 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9 9 9 0 112.828 12.728"
              />
            </svg>
            มีเสียง
          </span>
        )}
      </div> */}
    </div>
  );
}