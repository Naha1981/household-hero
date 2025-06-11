
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppSection, UserProfile } from '../types';
import { NAVIGATION_ITEMS, APP_NAME } from '../constants';
import Icon from './icons/IconMap';
import Button from './Button'; // Kept for potential future use, but logout removed

interface NavbarProps {
  userProfile: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ userProfile }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Kept for navigation, not for logout
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Logout functionality removed as Supabase is removed.
  // const handleLogout = async () => { /* ... */ };

  const navItemsToShow = NAVIGATION_ITEMS; // Show all items if navbar is rendered

  const UserAvatar: React.FC<{ size?: string }> = ({ size = "h-8 w-8" }) => {
    if (userProfile?.avatar_url) { // Avatar URL might be placeholder or managed differently now
      return (
        <img
          className={`${size} rounded-full object-cover ring-2 ring-white/50`}
          src={userProfile.avatar_url}
          alt="User avatar"
          onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDJDMTkgMSAxOCAxIDE3IDJDMTUgNCAxMiA0IDEwIDJDOCAxIDcgMSA2IDJDNCA0IDQgNyA0IDEwQzQgMTIgNCAxNSA2IDE3QzggMTkgOSAyMCAxMiAyMEMxNSAyMCAxNiAxOSAxOCAxN0MyMCAxNSAyMCAxMiAyMCAxMFoiIGZpbGw9IiNjY2MiLz4KPHBhdGggZD0iTTIwIDEwQzIwIDEyIDIwIDE1IDE4IDE3QzE2IDE5IDE1IDIwIDEyIDIwQzkgMjAgOCAxOSA2IDE3QzQgMTUgNCAxMiA0IDEwQzQgNyA0IDQgNiAyQzggMSA5IDEgMTIgMkMxNSAxIDE2IDEgMTggMkMyMCA0IDIwIDcgMjAgMTBaIiBmaWxsPSIjY2NjIi8+CjxwYXRoIGQ9Ik0xMiAxMkM5LjMzMyAxMiA4IDEwLjY2NyA4IDlDNCA4IDQgMTIgOCAxNkM4IDE4IDguNSAxOSAxMSAyMEgxM0MyMC41IDE5IDIwIDE4IDIwIDE2QzIwIDEyIDIwIDggMTYgOUMxNiAxMC42NjcgMTQuNjY3IDEyIDEyIDEyWiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K'; e.currentTarget.alt="Error loading avatar"; }}
        />
      );
    }
    const initials = userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : (userProfile?.username ? userProfile.username[0].toUpperCase() : 'HH');
    return (
      <div className={`${size} rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white/50`}>
        {initials}
      </div>
    );
  };

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {navItemsToShow.length > 0 && (
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
          
          <div className={`flex-1 flex items-center ${navItemsToShow.length > 0 ? 'justify-center md:items-stretch md:justify-start' : 'justify-start'}`}>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white text-2xl font-bold" aria-label="Go to Homepage">
                {APP_NAME}
              </Link>
            </div>
            {navItemsToShow.length > 0 && (
              <div className="hidden md:block md:ml-6">
                <div className="flex space-x-4">
                  {navItemsToShow.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm 
                        ${location.pathname === item.path 
                          ? 'bg-slate-100 text-primary font-semibold shadow-inner' 
                          : 'text-gray-200 hover:bg-primary/70 hover:text-white font-medium'}`}
                    >
                      <Icon name={item.icon} className="w-5 h-5 mr-2" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {userProfile && ( // Show avatar and name if profile exists locally
            <div className="hidden md:flex items-center space-x-3">
              <UserAvatar />
              <span className="text-sm text-slate-200 truncate max-w-[120px]" title={userProfile.name || userProfile.username}>
                {userProfile.name || userProfile.username}
              </span>
              {/* Logout button removed */}
            </div>
          )}
        </div>
      </div>

      {navItemsToShow.length > 0 && (
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItemsToShow.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${location.pathname === item.path ? 'bg-slate-100 text-primary' : 'text-gray-200 hover:bg-primary/70 hover:text-white'}`}
              >
                <Icon name={item.icon} className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            ))}
            {userProfile && (
              <div className="border-t border-primary/30 pt-3 mt-3 space-y-2">
                  <div className="flex items-center px-3 py-2">
                      <UserAvatar size="h-10 w-10"/>
                      <div className="ml-3">
                          <p className="text-base font-medium text-white">{userProfile.name || userProfile.username || 'User'}</p>
                          {/* Email is not part of local UserProfile as primary ID anymore */}
                      </div>
                  </div>
                  {/* Logout button removed */}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;