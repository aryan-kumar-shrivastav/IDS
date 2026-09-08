import { useState, useEffect, useRef } from 'react';
import { FileText, Search, Download, Filter, Trash2, Pause, Play } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'DEBUG';
  source: string;
  message: string;
}

const logSources = ['Firewall', 'IDS Engine', 'Network Monitor', 'Auth Module', 'Packet Analyzer', 'Rule Engine', 'Alert System', 'Database'];
const logMessages: Record<string, string[]> = {
  INFO: [
    'Connection established from 192.168.1.{x}',
    'Rule update completed successfully',
    'System health check passed',
    'Packet inspection completed - no threats detected',
    'New signature database loaded ({x} rules)',
    'Backup completed successfully',
    'User admin logged in from 10.0.0.{x}',
    'Network interface eth0 operational',
  ],
  WARN: [
    'High CPU usage detected: {x}%',
    'Connection rate limit approaching threshold',
    'Unusual traffic pattern from 172.16.0.{x}',
    'Certificate expiring in {x} days',
    'Memory usage above 80% threshold',
    'Failed login attempt from 203.0.113.{x}',
    'DNS query rate elevated from subnet 10.0.{x}.0/24',
    'Disk space below 20% on /var/log',
  ],
  ERROR: [
    'Failed to connect to upstream sensor {x}',
    'Rule processing error - invalid pattern in rule #{x}',
    'Database connection timeout after 30s',
    'Packet buffer overflow - dropping packets',
    'SSL handshake failed with 198.51.100.{x}',
    'Failed to update threat intelligence feed',
    'Alert notification delivery failed',
  ],
  CRITICAL: [
    'DDoS attack detected - activating mitigation',
    'Multiple brute force attempts from 203.0.113.{x}',
    'Malware signature match - file quarantined',
    'Unauthorized access attempt to admin panel',
    'Data exfiltration attempt blocked from 10.0.0.{x}',
    'Critical vulnerability exploit attempt detected',
  ],
  DEBUG: [
    'Processing packet #{x} - TCP SYN',
    'Rule #{x} evaluation: pattern match check',
    'Cache hit ratio: {x}%',
    'Thread pool status: {x}/50 active',
    'Packet queue depth: {x}',
    'Memory allocation: {x}MB used',
  ],
};

const generateLog = (id: number): LogEntry => {
  const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'WARN', 'ERROR', 'CRITICAL', 'DEBUG'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const messages = logMessages[level];
  const message = messages[Math.floor(Math.random() * messages.length)].replace('{x}', String(Math.floor(Math.random() * 255)));
  
  return {
    id: `LOG-${String(id).padStart(6, '0')}`,
    timestamp: new Date(Date.now() - id * 1000).toISOString(),
    level,
    source: logSources[Math.floor(Math.random() * logSources.length)],
    message,
  };
};

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(() => Array.from({ length: 100 }, (_, i) => generateLog(i)));
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLogs(prev => [generateLog(Date.now()), ...prev].slice(0, 500));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSearch = searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const levelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-red-400';
      case 'CRITICAL': return 'text-red-500 font-bold';
      case 'DEBUG': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const levelBg = (level: string) => {
    switch (level) {
      case 'INFO': return 'bg-blue-500/10';
      case 'WARN': return 'bg-amber-500/10';
      case 'ERROR': return 'bg-red-500/10';
      case 'CRITICAL': return 'bg-red-500/20';
      case 'DEBUG': return 'bg-gray-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const exportLogs = () => {
    const csv = filteredLogs.map(l => `${l.timestamp},${l.level},${l.source},"${l.message}"`).join('\n');
    const blob = new Blob([`timestamp,level,source,message\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ids-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Logs</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time system event logging and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isPaused ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-green-500/10 text-green-400 border border-green-500/30'
            }`}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {['all', 'CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'].map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                levelFilter === level ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
          />
          Auto-scroll
        </label>
      </div>

      {/* Log Count */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{filteredLogs.length} entries</span>
        <span>•</span>
        <span className="text-red-400">{filteredLogs.filter(l => l.level === 'CRITICAL').length} critical</span>
        <span>•</span>
        <span className="text-red-400">{filteredLogs.filter(l => l.level === 'ERROR').length} errors</span>
        <span>•</span>
        <span className="text-amber-400">{filteredLogs.filter(l => l.level === 'WARN').length} warnings</span>
      </div>

      {/* Log Viewer */}
      <div
        ref={logContainerRef}
        className="flex-1 bg-gray-900 border border-gray-700/50 rounded-xl overflow-auto font-mono text-xs"
        style={{ maxHeight: 'calc(100vh - 320px)' }}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700/50 px-4 py-2 flex items-center gap-4 z-10">
          <span className="text-gray-500 w-28">Timestamp</span>
          <span className="text-gray-500 w-16">Level</span>
          <span className="text-gray-500 w-32">Source</span>
          <span className="text-gray-500 flex-1">Message</span>
        </div>
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`px-4 py-1.5 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors flex items-center gap-4 ${levelBg(log.level)}`}
          >
            <span className="text-gray-500 w-28 flex-shrink-0">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`w-16 flex-shrink-0 ${levelColor(log.level)}`}>
              [{log.level}]
            </span>
            <span className="text-purple-400 w-32 flex-shrink-0 truncate">
              {log.source}
            </span>
            <span className="text-gray-300 flex-1 truncate">
              {log.message}
            </span>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No log entries matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
