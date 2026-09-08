import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Eye,
  Cpu,
  Brain,
  Shield,
  Zap,
  FileSearch,
  Network,
  Lock,
  Globe,
  Server,
  ChevronRight,
  Radio,
  Binary,
  Fingerprint,
  Scan,
} from 'lucide-react';

interface AnalysisEvent {
  id: string;
  timestamp: number;
  engine: string;
  engineIcon: string;
  target: string;
  action: string;
  detail: string;
  result: 'clean' | 'suspicious' | 'threat' | 'analyzing';
  packetSize?: number;
  ruleId?: string;
  confidence?: number;
}

interface InspectionTarget {
  ip: string;
  hostname: string;
  ports: number[];
  protocol: string;
  status: 'scanning' | 'analyzing' | 'monitored' | 'blocked';
  packetsInspected: number;
  threatsFound: number;
  lastActivity: string;
}

interface DetectionEngine {
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'processing' | 'idle';
  packetsPerSec: number;
  totalProcessed: number;
  threatsDetected: number;
  color: string;
  description: string;
}

const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP', 'ICMP'];
const ports = [22, 53, 80, 443, 3306, 8080, 8443, 25, 110, 993, 21, 3389];
const ips = [
  '192.168.1.105', '192.168.1.42', '10.0.0.15', '10.0.0.22',
  '172.16.0.50', '203.0.113.45', '198.51.100.78', '185.220.101.34',
  '91.215.85.10', '45.33.32.156', '104.26.10.78', '151.101.1.140'
];
const hostnames = [
  'web-server-01', 'db-primary', 'mail-gateway', 'vpn-concentrator',
  'file-server', 'dns-resolver', 'api-gateway', 'unknown-host',
  'workstation-12', 'iot-sensor-03', 'printer-floor2', 'camera-lobby'
];

const analysisActions = [
  { action: 'Header inspection', detail: 'Parsing TCP/IP header fields' },
  { action: 'Payload analysis', detail: 'Scanning payload for known patterns' },
  { action: 'Signature matching', detail: 'Comparing against 45,230 signatures' },
  { action: 'Anomaly detection', detail: 'Statistical deviation analysis' },
  { action: 'Protocol validation', detail: 'Verifying protocol compliance' },
  { action: 'State tracking', detail: 'Monitoring connection state machine' },
  { action: 'Flow analysis', detail: 'Analyzing bidirectional traffic flow' },
  { action: 'Entropy analysis', detail: 'Checking data randomness (encrypted/tunneled)' },
  { action: 'Geolocation lookup', detail: 'Resolving IP to geographic location' },
  { action: 'Reputation check', detail: 'Querying threat intelligence database' },
  { action: 'Behavioral profiling', detail: 'Comparing against baseline behavior' },
  { action: 'SSL/TLS inspection', detail: 'Analyzing certificate and handshake' },
  { action: 'DNS analysis', detail: 'Inspecting query patterns and responses' },
  { action: 'Fragmentation check', detail: 'Reassembling fragmented packets' },
  { action: 'Rate analysis', detail: 'Computing packet rate per source' },
];

const engines: DetectionEngine[] = [
  {
    name: 'Signature Engine',
    icon: <Fingerprint size={18} />,
    status: 'active',
    packetsPerSec: 12450,
    totalProcessed: 892341,
    threatsDetected: 234,
    color: 'blue',
    description: 'Pattern matching against known attack signatures (Snort/Suricata rules)',
  },
  {
    name: 'Anomaly Detection',
    icon: <Activity size={18} />,
    status: 'processing',
    packetsPerSec: 8920,
    totalProcessed: 654122,
    threatsDetected: 89,
    color: 'purple',
    description: 'Statistical analysis detecting deviations from normal traffic patterns',
  },
  {
    name: 'Behavioral AI',
    icon: <Brain size={18} />,
    status: 'active',
    packetsPerSec: 5670,
    totalProcessed: 421890,
    threatsDetected: 45,
    color: 'emerald',
    description: 'Machine learning model analyzing traffic behavior and user patterns',
  },
  {
    name: 'Protocol Analyzer',
    icon: <Network size={18} />,
    status: 'active',
    packetsPerSec: 15200,
    totalProcessed: 1102345,
    threatsDetected: 156,
    color: 'amber',
    description: 'Deep packet inspection and protocol compliance verification',
  },
  {
    name: 'Threat Intel',
    icon: <Globe size={18} />,
    status: 'processing',
    packetsPerSec: 3400,
    totalProcessed: 234567,
    threatsDetected: 67,
    color: 'red',
    description: 'Cross-referencing IPs/domains against threat intelligence feeds',
  },
  {
    name: 'Heuristic Engine',
    icon: <Scan size={18} />,
    status: 'active',
    packetsPerSec: 7800,
    totalProcessed: 567890,
    threatsDetected: 112,
    color: 'cyan',
    description: 'Rule-based heuristic analysis for zero-day threat detection',
  },
];

const generateAnalysisEvent = (id: number): AnalysisEvent => {
  const analysisAction = analysisActions[Math.floor(Math.random() * analysisActions.length)];
  const results: AnalysisEvent['result'][] = ['clean', 'clean', 'clean', 'clean', 'clean', 'suspicious', 'threat', 'analyzing'];
  const result = results[Math.floor(Math.random() * results.length)];
  const engineNames = ['Signature', 'Anomaly', 'Behavioral AI', 'Protocol', 'Threat Intel', 'Heuristic'];
  const engine = engineNames[Math.floor(Math.random() * engineNames.length)];

  return {
    id: `AN-${String(id).padStart(6, '0')}`,
    timestamp: Date.now(),
    engine,
    engineIcon: engine === 'Signature' ? '🔍' : engine === 'Anomaly' ? '📊' : engine === 'Behavioral AI' ? '🧠' : engine === 'Protocol' ? '🔌' : engine === 'Threat Intel' ? '🌐' : '⚡',
    target: `${ips[Math.floor(Math.random() * ips.length)]}:${ports[Math.floor(Math.random() * ports.length)]}`,
    action: analysisAction.action,
    detail: analysisAction.detail,
    result,
    packetSize: Math.floor(Math.random() * 1400) + 64,
    ruleId: result !== 'clean' ? `SIG-${Math.floor(Math.random() * 9999)}` : undefined,
    confidence: result === 'threat' ? Math.floor(Math.random() * 20) + 80 : result === 'suspicious' ? Math.floor(Math.random() * 30) + 50 : undefined,
  };
};

const generateInspectionTarget = (): InspectionTarget => ({
  ip: ips[Math.floor(Math.random() * ips.length)],
  hostname: hostnames[Math.floor(Math.random() * hostnames.length)],
  ports: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ports[Math.floor(Math.random() * ports.length)]),
  protocol: protocols[Math.floor(Math.random() * protocols.length)],
  status: (['scanning', 'analyzing', 'monitored', 'blocked'] as const)[Math.floor(Math.random() * 4)],
  packetsInspected: Math.floor(Math.random() * 50000),
  threatsFound: Math.floor(Math.random() * 10),
  lastActivity: `${Math.floor(Math.random() * 60)}s ago`,
});

export default function LiveAnalysis() {
  const [events, setEvents] = useState<AnalysisEvent[]>(() =>
    Array.from({ length: 30 }, (_, i) => generateAnalysisEvent(i))
  );
  const [targets, setTargets] = useState<InspectionTarget[]>(() =>
    Array.from({ length: 8 }, () => generateInspectionTarget())
  );
  const [engineStats, setEngineStats] = useState(engines);
  const [totalAnalyzed, setTotalAnalyzed] = useState(2847291);
  const [currentPacket, setCurrentPacket] = useState({
    raw: '',
    decoded: { src: '', dst: '', proto: '', len: 0, ttl: 0, flags: '' },
  });
  const eventsRef = useRef<HTMLDivElement>(null);

  // Generate random hex for packet display
  const generateHexDump = () => {
    const bytes = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(' ');
    return bytes;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateAnalysisEvent(Date.now());
      setEvents(prev => [newEvent, ...prev].slice(0, 100));
      setTotalAnalyzed(prev => prev + Math.floor(Math.random() * 50) + 10);

      // Update engine stats
      setEngineStats(prev => prev.map(engine => ({
        ...engine,
        packetsPerSec: engine.packetsPerSec + Math.floor(Math.random() * 200) - 100,
        totalProcessed: engine.totalProcessed + Math.floor(Math.random() * 100),
      })));

      // Update current packet
      setCurrentPacket({
        raw: generateHexDump(),
        decoded: {
          src: ips[Math.floor(Math.random() * ips.length)],
          dst: ips[Math.floor(Math.random() * ips.length)],
          proto: protocols[Math.floor(Math.random() * protocols.length)],
          len: Math.floor(Math.random() * 1400) + 64,
          ttl: Math.floor(Math.random() * 128) + 1,
          flags: ['SYN', 'ACK', 'SYN-ACK', 'FIN', 'PSH-ACK'][Math.floor(Math.random() * 5)],
        },
      });

      // Occasionally update targets
      if (Math.random() > 0.7) {
        setTargets(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            packetsInspected: updated[idx].packetsInspected + Math.floor(Math.random() * 100),
            lastActivity: 'just now',
          };
          return updated;
        });
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const resultColor = (result: string) => {
    switch (result) {
      case 'clean': return 'text-green-400';
      case 'suspicious': return 'text-amber-400';
      case 'threat': return 'text-red-400';
      case 'analyzing': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const resultBg = (result: string) => {
    switch (result) {
      case 'clean': return 'bg-green-500/5';
      case 'suspicious': return 'bg-amber-500/5';
      case 'threat': return 'bg-red-500/10';
      case 'analyzing': return 'bg-blue-500/5';
      default: return '';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'scanning': return 'text-blue-400 bg-blue-500/10';
      case 'analyzing': return 'text-purple-400 bg-purple-500/10';
      case 'monitored': return 'text-green-400 bg-green-500/10';
      case 'blocked': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const engineColorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  const engineBarColor: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="relative">
              <Eye size={24} className="text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></span>
            </div>
            Live Analysis
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time deep packet inspection and threat analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">INSPECTING</span>
          </div>
          <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-300 text-sm font-mono">{totalAnalyzed.toLocaleString()} packets analyzed</span>
          </div>
        </div>
      </div>

      {/* Detection Engines Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engineStats.map((engine) => (
          <div key={engine.name} className={`rounded-xl p-4 border ${engineColorMap[engine.color]}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-current">{engine.icon}</div>
                <h4 className="text-white font-medium text-sm">{engine.name}</h4>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                engine.status === 'active' ? 'bg-green-500/20 text-green-400' :
                engine.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  engine.status === 'active' ? 'bg-green-400 animate-pulse' :
                  engine.status === 'processing' ? 'bg-amber-400 animate-pulse' :
                  'bg-gray-400'
                }`}></span>
                {engine.status}
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{engine.description}</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-white font-bold text-sm">{engine.packetsPerSec.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">pkt/sec</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{(engine.totalProcessed / 1000).toFixed(0)}K</p>
                <p className="text-gray-500 text-xs">processed</p>
              </div>
              <div>
                <p className="text-red-400 font-bold text-sm">{engine.threatsDetected}</p>
                <p className="text-gray-500 text-xs">threats</p>
              </div>
            </div>
            <div className="mt-3 w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${engineBarColor[engine.color]} transition-all duration-500`}
                style={{ width: `${Math.min((engine.packetsPerSec / 16000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Analysis Stream */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSearch size={16} className="text-emerald-400" />
              <h3 className="text-white font-semibold text-sm">Analysis Stream</h3>
              <span className="text-xs text-gray-500 ml-2">Live feed of inspection operations</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Clean</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>Suspicious</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span>Threat</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span>Analyzing</span>
            </div>
          </div>
          <div ref={eventsRef} className="overflow-auto font-mono text-xs" style={{ maxHeight: '420px' }}>
            {events.map((event, i) => (
              <div
                key={event.id + i}
                className={`px-4 py-2 border-b border-gray-800/50 hover:bg-gray-700/20 transition-colors flex items-center gap-3 ${resultBg(event.result)} ${i === 0 ? 'animate-pulse-once' : ''}`}
              >
                <span className="text-gray-600 w-16 flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-lg w-6 flex-shrink-0">{event.engineIcon}</span>
                <span className="text-gray-400 w-20 flex-shrink-0">{event.engine}</span>
                <ChevronRight size={10} className="text-gray-600 flex-shrink-0" />
                <span className="text-cyan-400 w-36 flex-shrink-0 truncate">{event.target}</span>
                <span className="text-gray-300 flex-1 truncate">{event.action}</span>
                {event.packetSize && (
                  <span className="text-gray-500 w-14 text-right flex-shrink-0">{event.packetSize}B</span>
                )}
                {event.confidence && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${event.confidence > 80 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {event.confidence}%
                  </span>
                )}
                <span className={`w-16 text-right flex-shrink-0 font-medium capitalize ${resultColor(event.result)}`}>
                  {event.result === 'analyzing' ? '...' : event.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Packet Inspection */}
        <div className="space-y-4">
          {/* Live Packet */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Binary size={16} className="text-emerald-400" />
              <h3 className="text-white font-semibold text-sm">Current Packet</h3>
              <span className="ml-auto text-xs text-gray-500 animate-pulse">LIVE</span>
            </div>
            
            {/* Decoded Header */}
            <div className="bg-gray-900 rounded-lg p-3 mb-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="text-green-400">{currentPacket.decoded.src}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dest:</span>
                <span className="text-blue-400">{currentPacket.decoded.dst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Protocol:</span>
                <span className="text-purple-400">{currentPacket.decoded.proto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Length:</span>
                <span className="text-white">{currentPacket.decoded.len} bytes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TTL:</span>
                <span className="text-white">{currentPacket.decoded.ttl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flags:</span>
                <span className="text-amber-400">{currentPacket.decoded.flags}</span>
              </div>
            </div>

            {/* Hex Dump */}
            <div className="bg-black rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">HEX DUMP:</p>
              <p className="text-green-400 text-xs font-mono break-all leading-relaxed">
                {currentPacket.raw}
              </p>
            </div>
          </div>

          {/* Active Inspection Targets */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server size={16} className="text-purple-400" />
              <h3 className="text-white font-semibold text-sm">Inspection Targets</h3>
            </div>
            <div className="space-y-2 max-h-52 overflow-auto">
              {targets.map((target, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cyan-400 text-xs font-mono">{target.ip}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${statusColor(target.status)}`}>
                      {target.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{target.hostname}</span>
                    <span className="text-gray-400">{target.packetsInspected.toLocaleString()} pkts</span>
                  </div>
                  {target.threatsFound > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={10} className="text-red-400" />
                      <span className="text-red-400 text-xs">{target.threatsFound} threats found</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary Bar */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-emerald-400" />
          <h3 className="text-white font-semibold text-sm">Analysis Pipeline Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{(totalAnalyzed / 1000000).toFixed(2)}M</p>
            <p className="text-gray-400 text-xs mt-1">Total Inspected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{(totalAnalyzed * 0.97 / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-xs mt-1">Clean Traffic</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{Math.floor(totalAnalyzed * 0.025)}</p>
            <p className="text-gray-400 text-xs mt-1">Suspicious</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{Math.floor(totalAnalyzed * 0.005)}</p>
            <p className="text-gray-400 text-xs mt-1">Threats Blocked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">6</p>
            <p className="text-gray-400 text-xs mt-1">Active Engines</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">45,230</p>
            <p className="text-gray-400 text-xs mt-1">Signatures Loaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
