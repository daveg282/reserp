'use client';

export default function SidebarOverlay({ sidebarOpen, setSidebarOpen }) {
  return (
    sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )
  );
}