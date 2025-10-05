'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, isActive }) => (
  <Link href={href}>
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}>
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Attendance', href: '/attendance', icon: UserCheck },
    { name: 'Leave Management', href: '/leaves', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                label={item.name}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                label={item.name}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-4 ml-auto">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};