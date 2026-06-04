import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Search, LogOut, User, BookOpen, GraduationCap, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0 transition-opacity hover:opacity-90">
          <GraduationCap className="h-6 w-6 text-indigo-600" />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">OpenEd</span>
        </Link>

        {/* Global Desktop Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            id="desktop-search-input"
            type="search"
            placeholder="Search notes, guides, questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/explore?tab=questions" className="text-muted-foreground hover:text-foreground transition-colors">Q&A Forum</Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`}
                  alt={user?.displayName}
                  className="h-8 w-8 rounded-full border border-border"
                />
                <span className="max-w-[120px] truncate text-foreground">{user?.displayName}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-popover text-popover-foreground shadow-md py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-destructive hover:text-destructive transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/explore" className="px-3 py-1.5 text-sm hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/explore" className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="mobile-search-input"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-muted/50 text-sm focus:outline-none"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </form>

          <nav className="flex flex-col gap-3 font-medium">
            <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-muted-foreground hover:text-foreground">Explore</Link>
            <Link to="/explore?tab=questions" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-muted-foreground hover:text-foreground">Q&A Forum</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-2 flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to={`/profile/${user?.id}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 flex items-center gap-2 text-destructive text-left"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-2 text-center rounded-md border border-border">
                  Sign In
                </Link>
                <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-2 text-center rounded-md bg-indigo-600 text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
