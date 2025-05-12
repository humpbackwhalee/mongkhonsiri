import React from 'react';

interface MobileHeaderProps {
  title: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="lg:hidden flex justify-between items-center p-4 border-b border-muted bg-background sticky top-0 z-10">
      <h1 className="text-xl font-medium text-text">{title}</h1>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md bg-muted hover:bg-secondary text-text"
        aria-label={isSidebarOpen ? 'ปิดรายการบทสวด' : 'เปิดรายการบทสวด'}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>
    </div>
  );
};

export default MobileHeader;