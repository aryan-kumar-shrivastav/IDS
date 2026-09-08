export interface Alert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved' | 'blocked';
  port?: number;
}

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  protocol: string;
  size: number;
  port: number;
  flags: string;
  status: 'normal' | 'suspicious' | 'malicious';
}

export interface SystemStats {
  totalPackets: number;
  suspiciousPackets: number;
  blockedThreats: number;
  activeConnections: number;
  bandwidthUsage: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

export interface AttackType {
  name: string;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  lastSeen: string;
  description: string;
}

export const attackTypes: AttackType[] = [
  { name: 'DDoS Attack', count: 23, severity: 'critical', lastSeen: '2 min ago', description: 'Distributed Denial of Service flooding detected' },
  { name: 'Port Scanning', count: 156, severity: 'medium', lastSeen: '5 min ago', description: 'Sequential port scanning activity detected' },
  { name: 'Brute Force', count: 45, severity: 'high', lastSeen: '8 min ago', description: 'Multiple failed login attempts detected' },
  { name: 'SQL Injection', count: 12, severity: 'critical', lastSeen: '12 min ago', description: 'Malicious SQL queries in HTTP requests' },
  { name: 'XSS Attack', count: 8, severity: 'high', lastSeen: '15 min ago', description: 'Cross-site scripting attempts in payloads' },
  { name: 'Malware C2', count: 3, severity: 'critical', lastSeen: '20 min ago', description: 'Command and control communication detected' },
  { name: 'DNS Tunneling', count: 7, severity: 'medium', lastSeen: '25 min ago', description: 'Suspicious DNS queries indicating data exfiltration' },
  { name: 'ARP Spoofing', count: 2, severity: 'high', lastSeen: '30 min ago', description: 'ARP cache poisoning attempts detected' },
];

export const generateAlerts = (): Alert[] => [
  {
    id: 'ALT-001',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    severity: 'critical',
    type: 'DDoS Attack',
    sourceIP: '192.168.1.105',
    destinationIP: '10.0.0.1',
    protocol: 'TCP',
    description: 'SYN flood detected - 50,000 packets/sec from multiple sources',
    status: 'active',
    port: 80,
  },
  {
    id: 'ALT-002',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    severity: 'high',
    type: 'Brute Force',
    sourceIP: '203.0.113.45',
    destinationIP: '10.0.0.5',
    protocol: 'SSH',
    description: 'Multiple failed SSH login attempts - 500 attempts in 5 minutes',
    status: 'investigating',
    port: 22,
  },
  {
    id: 'ALT-003',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    severity: 'critical',
    type: 'SQL Injection',
    sourceIP: '198.51.100.23',
    destinationIP: '10.0.0.10',
    protocol: 'HTTP',
    description: 'Malicious SQL payload detected in POST request parameter',
    status: 'blocked',
    port: 443,
  },
  {
    id: 'ALT-004',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    severity: 'medium',
    type: 'Port Scanning',
    sourceIP: '172.16.0.50',
    destinationIP: '10.0.0.0/24',
    protocol: 'TCP',
    description: 'Sequential port scan detected across subnet - ports 1-1024',
    status: 'active',
  },
  {
    id: 'ALT-005',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    severity: 'high',
    type: 'Malware C2',
    sourceIP: '10.0.0.25',
    destinationIP: '185.220.101.34',
    protocol: 'HTTPS',
    description: 'Outbound connection to known C2 server detected',
    status: 'active',
    port: 443,
  },
  {
    id: 'ALT-006',
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    severity: 'low',
    type: 'Policy Violation',
    sourceIP: '10.0.0.30',
    destinationIP: '8.8.8.8',
    protocol: 'DNS',
    description: 'Unauthorized DNS resolver usage detected',
    status: 'resolved',
    port: 53,
  },
  {
    id: 'ALT-007',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    severity: 'medium',
    type: 'XSS Attack',
    sourceIP: '198.51.100.78',
    destinationIP: '10.0.0.10',
    protocol: 'HTTP',
    description: 'Reflected XSS attempt in search parameter',
    status: 'blocked',
    port: 80,
  },
  {
    id: 'ALT-008',
    timestamp: new Date(Date.now() - 2100000).toISOString(),
    severity: 'critical',
    type: 'DNS Tunneling',
    sourceIP: '10.0.0.42',
    destinationIP: '91.215.85.10',
    protocol: 'DNS',
    description: 'High volume DNS queries with encoded data in subdomain',
    status: 'investigating',
    port: 53,
  },
];

export const generateNetworkPackets = (): NetworkPacket[] => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP'];
  const statuses: ('normal' | 'suspicious' | 'malicious')[] = ['normal', 'normal', 'normal', 'normal', 'suspicious', 'malicious'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `PKT-${String(i + 1).padStart(4, '0')}`,
    timestamp: new Date(Date.now() - i * 1000).toISOString(),
    sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    destIP: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    size: Math.floor(Math.random() * 1500) + 64,
    port: [22, 53, 80, 443, 3306, 8080, 8443][Math.floor(Math.random() * 7)],
    flags: ['SYN', 'ACK', 'SYN-ACK', 'FIN', 'RST', 'PSH-ACK'][Math.floor(Math.random() * 6)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

export const trafficData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  normal: Math.floor(Math.random() * 5000) + 3000,
  suspicious: Math.floor(Math.random() * 200) + 50,
  malicious: Math.floor(Math.random() * 50) + 5,
}));

export const protocolDistribution = [
  { name: 'TCP', value: 45, color: '#3b82f6' },
  { name: 'UDP', value: 25, color: '#10b981' },
  { name: 'HTTP/HTTPS', value: 20, color: '#f59e0b' },
  { name: 'DNS', value: 7, color: '#8b5cf6' },
  { name: 'ICMP', value: 3, color: '#ef4444' },
];

export const systemStats: SystemStats = {
  totalPackets: 1284567,
  suspiciousPackets: 3421,
  blockedThreats: 892,
  activeConnections: 156,
  bandwidthUsage: 67,
  cpuUsage: 34,
  memoryUsage: 52,
  uptime: '14d 7h 23m',
};

export const detectionRules = [
  { id: 'RULE-001', name: 'SYN Flood Detection', enabled: true, threshold: '10000 packets/sec', action: 'Block & Alert' },
  { id: 'RULE-002', name: 'Port Scan Detection', enabled: true, threshold: '100 ports/min', action: 'Alert' },
  { id: 'RULE-003', name: 'Brute Force SSH', enabled: true, threshold: '5 failed attempts', action: 'Block IP' },
  { id: 'RULE-004', name: 'SQL Injection Pattern', enabled: true, threshold: 'Pattern match', action: 'Block & Log' },
  { id: 'RULE-005', name: 'XSS Detection', enabled: true, threshold: 'Pattern match', action: 'Block & Log' },
  { id: 'RULE-006', name: 'DNS Tunneling', enabled: false, threshold: '50 queries/min', action: 'Alert' },
  { id: 'RULE-007', name: 'Malware Signature', enabled: true, threshold: 'Signature DB match', action: 'Quarantine' },
  { id: 'RULE-008', name: 'Data Exfiltration', enabled: true, threshold: '100MB/hr outbound', action: 'Block & Alert' },
];
