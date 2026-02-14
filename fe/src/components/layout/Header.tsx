import { Menu } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {  // Add the prop here
  const { setSidebarOpen } = useAppContext();

  const handleToggle = () => {
    // Use the prop if provided, otherwise fall back to context
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <header className="h-14 bg-app-surface border-b border-app-border flex items-center px-5 shrink-0">
      <button
        onClick={handleToggle}
        className="md:hidden mr-3 text-app-text-muted hover:text-cherry-soda transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h2 className="text-sm font-semibold gradient-text tracking-tight">SMOOTH</h2>
    </header>
  );
};

export default Header;