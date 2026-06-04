import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, FileText, HelpCircle, FileUp, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'My Notes', to: '/dashboard?tab=notes', icon: FileText },
    { name: 'My Study Guides', to: '/dashboard?tab=guides', icon: BookOpen },
    { name: 'My Q&A', to: '/dashboard?tab=questions', icon: HelpCircle },
    { name: 'Upload PDF', to: '/dashboard?tab=pdf', icon: FileUp },
    { name: 'Edit Profile', to: `/profile/${user?.id}`, icon: User }
  ];

  return (
    <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border md:min-h-[calc(100vh-4rem)]">
      <div className="p-4 md:p-6 flex items-center gap-3 border-b border-border">
        <img
          src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`}
          alt={user?.displayName}
          className="h-10 w-10 rounded-full border border-border"
        />
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate text-foreground">{user?.displayName}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
        </div>
      </div>
      <nav className="p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to.includes('?')}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap md:whitespace-normal transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;
