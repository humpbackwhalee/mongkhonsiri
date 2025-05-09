import React from 'react';

interface MobileHeaderProps {
  title: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <h1 className="text-xl font-medium">{title}</h1>
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        aria-label={isSidebarOpen ? "ปิดรายการบทสวด" : "เปิดรายการบทสวด"}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>
    </div>
  );
};

export default MobileHeader;