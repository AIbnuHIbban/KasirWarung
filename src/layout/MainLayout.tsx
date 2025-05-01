import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CupSoda, 
  ReceiptText, 
  PieChart, 
  Menu as MenuIcon, 
  X,
  Sun,
  Moon,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import icon from '../assets/images/icon.png';

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Menu', path: '/menu', icon: <CupSoda className="w-5 h-5" /> },
    { name: 'Transaksi', path: '/transaksi', icon: <ReceiptText className="w-5 h-5" /> },
    { name: 'Laporan', path: '/laporan', icon: <PieChart className="w-5 h-5" /> },
  ];

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return navigationItems.find(item => item.path === path)?.name || '';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex">
      <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-black">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <img src={icon} alt="KasirWarung Icon" className="h-10 w-8" />
            <span className='ml-[-5px]'>KasirWarung</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active dark:bg-primary-900/50 dark:text-primary-400' : 'dark:text-neutral-400 dark:hover:bg-neutral-700/50'}`
              }
              end={item.path === '/'}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                {user?.username.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white">{user?.username}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-700">
          <div className="px-4 h-[4.5rem] flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
              <NavLink 
                to="/" 
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                KasirWarung
              </NavLink>
              {location.pathname !== '/' && (
                <>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {getCurrentPageName()}
                  </span>
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/50 rounded-lg flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 md:hidden"
              >
                {isMobileMenuOpen ? 
                  <X className="h-6 w-6" /> : 
                  <MenuIcon className="h-6 w-6" />
                }
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black py-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active dark:bg-primary-900/50 dark:text-primary-400' : 'dark:text-neutral-400 dark:hover:bg-neutral-700/50'}`
                  }
                  end={item.path === '/'}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          <p>© 2025 KasirWarung - Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;