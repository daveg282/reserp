export default function SidebarMenuItem({
  item,
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
  badgeCount
}) {
  const Icon = item.icon;
  
  const handleClick = () => {
    setActiveView(item.view);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
        activeView === item.view 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'hover:bg-gray-700 text-gray-300'
      }`}
      aria-label={item.label}
      aria-current={activeView === item.view ? 'page' : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {sidebarOpen && (
        <>
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {badgeCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-6 flex items-center justify-center">
              {badgeCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}