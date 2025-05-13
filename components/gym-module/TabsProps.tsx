interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="inline-flex rounded-full bg-blue-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-2 px-8 rounded-full text-sm ${
            activeTab === tab.id
              ? 'bg-blue-400 text-white'
              : 'text-blue-900'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;