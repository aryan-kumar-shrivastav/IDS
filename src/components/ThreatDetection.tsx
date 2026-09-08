import { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Zap,
  Globe,
  Lock,
  Server,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { attackTypes, AttackType } from '../data/mockData';

export default function ThreatDetection() {
  const [selectedThreat, setSelectedThreat] = useState<AttackType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'count' | 'severity'>('count');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredThreats = attackTypes
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count;
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  const totalThreats = attackTypes.reduce((sum, t) => sum + t.count, 0);
  const criticalCount = attackTypes.filter(t => t.severity === 'critical').length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Zap size={16} className="text-red-400" />;
      case 'high': return <AlertTriangle size={16} className="text-orange-400" />;
      case 'medium': return <Shield size={16} className="text-amber-400" />;
      default: return <Lock size={16} className="text-blue-400" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'high': return 'bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const mitigationSteps: Record<string, string[]> = {
    'DDoS Attack': [
      'Enable rate limiting on firewall',
      'Activate DDoS protection service',
      'Implement traffic scrubbing',
      'Configure SYN cookies on servers',
      'Contact ISP for upstream filtering',
    ],
    'Port Scanning': [
      'Block source IP at firewall',
      'Enable port scan detection rules',
      'Review exposed services',
      'Implement port knocking if needed',
      'Monitor for follow-up exploitation attempts',
    ],
    'Brute Force': [
      'Implement account lockout policy',
      'Enable CAPTCHA after failed attempts',
      'Block source IP temporarily',
      'Enforce multi-factor authentication',
      'Review password complexity requirements',
    ],
    'SQL Injection': [
      'Implement parameterized queries',
      'Deploy Web Application Firewall (WAF)',
      'Sanitize all user inputs',
      'Review database access permissions',
      'Enable SQL injection detection rules',
    ],
    'XSS Attack': [
      'Implement Content Security Policy (CSP)',
      'Sanitize and encode user inputs',
      'Enable HttpOnly and Secure flags on cookies',
      'Deploy input validation on all forms',
      'Use output encoding for dynamic content',
    ],
    'Malware C2': [
      'Isolate affected host immediately',
      'Block C2 server IP/domain at firewall',
      'Perform full malware scan on endpoint',
      'Analyze network traffic for data exfiltration',
      'Reset all credentials on affected system',
    ],
    'DNS Tunneling': [
      'Monitor DNS query patterns',
      'Implement DNS query length restrictions',
      'Block suspicious DNS resolvers',
      'Enable DNS logging and analysis',
      'Deploy DNS security solutions (DNSSEC)',
    ],
    'ARP Spoofing': [
      'Enable Dynamic ARP Inspection (DAI)',
      'Implement static ARP entries for critical hosts',
      'Deploy ARP monitoring tools',
      'Segment network with VLANs',
      'Use encrypted protocols (HTTPS, SSH)',
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Detection</h1>
          <p className="text-gray-400 text-sm mt-1">Identified attack patterns and threat classification</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
            <span className="text-red-400 text-sm font-medium">{criticalCount} Critical Threats</span>
          </div>
          <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-300 text-sm font-medium">{totalThreats} Total Detections</span>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search threats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'count' | 'severity')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="count">Count</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      {/* Threat Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-blue-400" />
            <span className="text-gray-400 text-sm">Network Attacks</span>
          </div>
          <p className="text-2xl font-bold text-white">{attackTypes.filter(t => ['DDoS Attack', 'Port Scanning', 'ARP Spoofing'].includes(t.name)).reduce((s, t) => s + t.count, 0)}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server size={16} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Application Attacks</span>
          </div>
          <p className="text-2xl font-bold text-white">{attackTypes.filter(t => ['SQL Injection', 'XSS Attack'].includes(t.name)).reduce((s, t) => s + t.count, 0)}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-red-400" />
            <span className="text-gray-400 text-sm">Authentication Attacks</span>
          </div>
          <p className="text-2xl font-bold text-white">{attackTypes.filter(t => ['Brute Force'].includes(t.name)).reduce((s, t) => s + t.count, 0)}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-gray-400 text-sm">Advanced Threats</span>
          </div>
          <p className="text-2xl font-bold text-white">{attackTypes.filter(t => ['Malware C2', 'DNS Tunneling'].includes(t.name)).reduce((s, t) => s + t.count, 0)}</p>
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-3">
        {filteredThreats.map((threat) => (
          <div
            key={threat.name}
            className={`bg-gray-800/50 border rounded-xl overflow-hidden transition-all ${
              selectedThreat?.name === threat.name ? 'border-emerald-500/30' : 'border-gray-700/50'
            }`}
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
              onClick={() => {
                setSelectedThreat(threat);
                setExpanded(expanded === threat.name ? null : threat.name);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getSeverityIcon(threat.severity)}
                  <div>
                    <h4 className="text-white font-medium">{threat.name}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{threat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold">{threat.count}</p>
                    <p className="text-gray-500 text-xs">detections</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getSeverityBg(threat.severity)} ${
                    threat.severity === 'critical' ? 'text-red-400' :
                    threat.severity === 'high' ? 'text-orange-400' :
                    threat.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {threat.severity}
                  </span>
                  <span className="text-gray-500 text-xs">{threat.lastSeen}</span>
                  {expanded === threat.name ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === threat.name && (
              <div className="px-4 pb-4 border-t border-gray-700/30 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-gray-300 text-sm font-medium mb-2">Detection Details</h5>
                    <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">First Detected</span>
                        <span className="text-white text-xs">2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Last Seen</span>
                        <span className="text-white text-xs">{threat.lastSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Total Detections</span>
                        <span className="text-white text-xs">{threat.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Unique Sources</span>
                        <span className="text-white text-xs">{Math.floor(threat.count * 0.6)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-gray-300 text-sm font-medium mb-2">Recommended Mitigation</h5>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <ol className="space-y-1.5">
                        {(mitigationSteps[threat.name] || ['Review security logs', 'Update detection rules', 'Monitor for recurrence']).map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 text-xs font-bold mt-0.5">{i + 1}.</span>
                            <span className="text-gray-300 text-xs">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
