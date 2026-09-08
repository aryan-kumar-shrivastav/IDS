import { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Network,
  AlertTriangle,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Eye,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live', label: 'Live Analysis', icon: Eye },
  { id: 'network', label: 'Network Monitor', icon: Network },
  { id: 'threats', label: 'Threat Detection', icon: AlertTriangle },
  { id: 'alerts', label: 'Alert Manager', icon: Bell },
  { id: 'logs', label: 'System Logs', icon: FileText },
  { id: 'rules', label: 'Detection Rules', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm tracking-wide">SecureNet IDS</h1>
            <p className="text-gray-500 text-xs">Intrusion Detection</p>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">System Active</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">Monitoring 156 connections</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
