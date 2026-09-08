import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Shield,
  Ban,
  Eye,
} from 'lucide-react';
import { generateAlerts, Alert } from '../data/mockData';

export default function AlertManager() {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sourceIP.includes(searchQuery) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const updateAlertStatus = (id: string, status: Alert['status']) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status });
    }
  };

  const blockSourceIP = (ip: string) => {
    alert(`IP ${ip} has been blocked at the firewall level.`);
  };

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle size={16} className="text-red-400" />;
      case 'high': return <AlertTriangle size={16} className="text-orange-400" />;
      case 'medium': return <Bell size={16} className="text-amber-400" />;
      case 'low': return <Clock size={16} className="text-blue-400" />;
      default: return <Eye size={16} className="text-gray-400" />;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'investigating': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'blocked': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const counts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    blocked: alerts.filter(a => a.status === 'blocked').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and respond to security alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
            <span className="text-red-400 text-xs font-medium">{counts.active} Active</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            <span className="text-amber-400 text-xs font-medium">{counts.investigating} Investigating</span>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', count: counts.total, color: 'text-white', bg: 'bg-gray-800/50' },
          { label: 'Active', count: counts.active, color: 'text-red-400', bg: 'bg-red-500/5' },
          { label: 'Investigating', count: counts.investigating, color: 'text-amber-400', bg: 'bg-amber-500/5' },
          { label: 'Resolved', count: counts.resolved, color: 'text-green-400', bg: 'bg-green-500/5' },
          { label: 'Blocked', count: counts.blocked, color: 'text-gray-400', bg: 'bg-gray-500/5' },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} border border-gray-700/50 rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-gray-500 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-800/50 border rounded-xl p-4 transition-all hover:border-gray-600 ${
              selectedAlert?.id === alert.id ? 'border-emerald-500/30' : 'border-gray-700/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {severityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{alert.type}</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-500 text-xs">{alert.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border capitalize ${statusBadge(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="font-mono">{alert.sourceIP} → {alert.destinationIP}</span>
                    <span>{alert.protocol}</span>
                    {alert.port && <span>Port: {alert.port}</span>}
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {alert.status !== 'blocked' && (
                  <button
                    onClick={() => blockSourceIP(alert.sourceIP)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Block Source IP"
                  >
                    <Ban size={14} />
                  </button>
                )}
                {alert.status === 'active' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'investigating')}
                    className="p-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
                    title="Mark as Investigating"
                  >
                    <Eye size={14} />
                  </button>
                )}
                {(alert.status === 'active' || alert.status === 'investigating') && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                    title="Mark as Resolved"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
                <button
                  onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                  className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
                  title="View Details"
                >
                  <Shield size={14} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedAlert?.id === alert.id && (
              <div className="mt-4 pt-4 border-t border-gray-700/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Source IP</p>
                    <p className="text-white text-sm font-mono mt-1">{alert.sourceIP}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Destination IP</p>
                    <p className="text-white text-sm font-mono mt-1">{alert.destinationIP}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Protocol</p>
                    <p className="text-white text-sm mt-1">{alert.protocol}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Timestamp</p>
                    <p className="text-white text-sm mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 bg-gray-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Full Description</p>
                  <p className="text-gray-300 text-sm">{alert.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No alerts matching your filters</p>
        </div>
      )}
    </div>
  );
}
