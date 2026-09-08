import {
  Shield,
  AlertTriangle,
  Ban,
  Wifi,
  Cpu,
  HardDrive,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { trafficData, protocolDistribution, systemStats, attackTypes, generateAlerts } from '../data/mockData';

export default function Dashboard() {
  const alerts = generateAlerts();
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  const stats = [
    { label: 'Total Packets Analyzed', value: systemStats.totalPackets.toLocaleString(), icon: Wifi, color: 'from-blue-500 to-blue-600', change: '+12.5%', up: true },
    { label: 'Suspicious Activity', value: systemStats.suspiciousPackets.toLocaleString(), icon: AlertTriangle, color: 'from-amber-500 to-orange-600', change: '+3.2%', up: true },
    { label: 'Threats Blocked', value: systemStats.blockedThreats.toLocaleString(), icon: Ban, color: 'from-red-500 to-red-600', change: '-8.1%', up: false },
    { label: 'Active Connections', value: systemStats.activeConnections.toString(), icon: Shield, color: 'from-emerald-500 to-green-600', change: '+5.7%', up: true },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time intrusion detection monitoring overview</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <Clock size={14} className="text-gray-400" />
          <span className="text-gray-300 text-sm">Uptime: {systemStats.uptime}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-red-400' : 'text-green-400'}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Network Traffic Analysis (24h)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span>Normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-full"></span>Suspicious</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span>Malicious</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="normal" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
              <Area type="monotone" dataKey="malicious" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Protocol Distribution */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Protocol Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={protocolDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {protocolDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {protocolDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300">{item.name}</span>
                </span>
                <span className="text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Threats */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Recent Threats Detected</h3>
          <div className="space-y-3">
            {attackTypes.slice(0, 5).map((attack) => (
              <div key={attack.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    attack.severity === 'critical' ? 'bg-red-500' :
                    attack.severity === 'high' ? 'bg-orange-500' :
                    attack.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-white text-sm font-medium">{attack.name}</p>
                    <p className="text-gray-500 text-xs">{attack.lastSeen}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">{attack.count}</p>
                  <p className="text-gray-500 text-xs">detections</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Resources */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">System Resources</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-gray-300 text-sm">
                  <Cpu size={14} /> CPU Usage
                </span>
                <span className="text-white text-sm font-medium">{systemStats.cpuUsage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${systemStats.cpuUsage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-gray-300 text-sm">
                  <HardDrive size={14} /> Memory Usage
                </span>
                <span className="text-white text-sm font-medium">{systemStats.memoryUsage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all" style={{ width: `${systemStats.memoryUsage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-gray-300 text-sm">
                  <TrendingUp size={14} /> Bandwidth
                </span>
                <span className="text-white text-sm font-medium">{systemStats.bandwidthUsage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all" style={{ width: `${systemStats.bandwidthUsage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Critical Alerts Summary */}
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">{criticalAlerts.length} Critical Alerts Active</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Immediate attention required for {criticalAlerts.length} critical security events</p>
          </div>
        </div>
      </div>
    </div>
  );
}
