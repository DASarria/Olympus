/**
 * Tab interface represents a single tab with an identifier and a label.
 * 
 * @interface Tab
 */
interface Tab {
  id: string;
  label: string;
}


/**
 * TabsProps interface describes the props for the Tabs component.
 * 
 * @interface TabsProps
 */
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Tabs Component
 * 
 * A UI component that renders a set of tabs. Each tab has a label and can be clicked to activate it.
 * The component applies dynamic styling to highlight the active tab and triggers a callback when a tab is clicked.
 * 
 * @component
 * @example
 * // Usage example of the Tabs component
 * <Tabs 
 *   tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]} 
 *   activeTab="tab1" 
 *   onTabChange={(tabId) => console.log(`Selected tab: ${tabId}`)} 
 * />
 * 
 * @param {TabsProps} props - The props for the Tabs component.
 * @returns {JSX.Element} The rendered tabs with dynamic styling based on the active tab.
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="inline-flex items-center justify-center gap-[60px] px-8 py-2.5 relative flex-[0_0_auto] bg-[#bec9ed] rounded-[50px] overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-2 px-8 rounded-full text-sm cursor-pointer [font-family: "Montserrat-Bold",Helvetica] ${
            activeTab === tab.id
              ? 'bg-[var(--lavender)] text-white relative w-fit mt-[-1.00px] font-bold text-lg tracking-[0] leading-[18px] whitespace-nowrap'
              : 'text-[#716c6c] font-bold'
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