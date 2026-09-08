import { useState, useEffect } from 'react';
import { Wifi, ArrowRight, Filter, RefreshCw, Eye } from 'lucide-react';
import { generateNetworkPackets, NetworkPacket } from '../data/mockData';

export default function NetworkMonitor() {
  const [packets, setPackets] = useState<NetworkPacket[]>(generateNetworkPackets());
  const [filter, setFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);
  const [selectedPacket, setSelectedPacket] = useState<NetworkPacket | null>(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setPackets(generateNetworkPackets());
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredPackets = filter === 'all' ? packets : packets.filter(p => p.status === filter);

  const statusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'suspicious': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'malicious': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const normalCount = packets.filter(p => p.status === 'normal').length;
  const suspiciousCount = packets.filter(p => p.status === 'suspicious').length;
  const maliciousCount = packets.filter(p => p.status === 'malicious').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Network Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time packet capture and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isLive ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            {isLive ? 'Live Capture' : 'Paused'}
          </button>
          <button
            onClick={() => setPackets(generateNetworkPackets())}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-green-400" />
            <span className="text-gray-400 text-sm">Normal Traffic</span>
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">{normalCount}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-amber-400" />
            <span className="text-gray-400 text-sm">Suspicious</span>
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{suspiciousCount}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-red-400" />
            <span className="text-gray-400 text-sm">Malicious</span>
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{maliciousCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter size={14} className="text-gray-400" />
        <div className="flex gap-2">
          {['all', 'normal', 'suspicious', 'malicious'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Packet Table */}
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">ID</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Source IP</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium"></th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Dest IP</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Protocol</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Port</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Size</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Flags</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackets.slice(0, 20).map((packet) => (
                <tr key={packet.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 py-2.5 text-gray-300 font-mono text-xs">{packet.id}</td>
                  <td className="px-4 py-2.5 text-gray-300 font-mono text-xs">{packet.sourceIP}</td>
                  <td className="px-2 py-2.5"><ArrowRight size={12} className="text-gray-500" /></td>
                  <td className="px-4 py-2.5 text-gray-300 font-mono text-xs">{packet.destIP}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">{packet.protocol}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-300 text-xs">{packet.port}</td>
                  <td className="px-4 py-2.5 text-gray-300 text-xs">{packet.size}B</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">{packet.flags}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs border capitalize ${statusColor(packet.status)}`}>
                      {packet.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setSelectedPacket(packet)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packet Detail Modal - Deep Inspection */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedPacket(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-white font-semibold text-lg">Deep Packet Inspection - {selectedPacket.id}</h3>
              <p className="text-gray-400 text-sm mt-1">Analysis results for captured packet</p>
            </div>
            <div className="p-6 space-y-5">
              {/* Packet Header Info */}
              <div>
                <h4 className="text-emerald-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Packet Header
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Source IP</span><span className="text-green-400 text-xs font-mono">{selectedPacket.sourceIP}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Dest IP</span><span className="text-blue-400 text-xs font-mono">{selectedPacket.destIP}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Protocol</span><span className="text-purple-400 text-xs">{selectedPacket.protocol}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Port</span><span className="text-white text-xs">{selectedPacket.port}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Size</span><span className="text-white text-xs">{selectedPacket.size} bytes</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Flags</span><span className="text-amber-400 text-xs font-mono">{selectedPacket.flags}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">TTL</span><span className="text-white text-xs">{Math.floor(Math.random() * 128) + 1}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-xs">Checksum</span><span className="text-gray-300 text-xs font-mono">0x{Math.floor(Math.random() * 65535).toString(16).padStart(4, '0')}</span></div>
                </div>
              </div>

              {/* Analysis Performed */}
              <div>
                <h4 className="text-emerald-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Analysis Performed
                </h4>
                <div className="space-y-2">
                  {[
                    { engine: 'Signature Engine', result: selectedPacket.status === 'malicious' ? 'Match found' : 'No match', status: selectedPacket.status === 'malicious' ? 'threat' : 'clean' },
                    { engine: 'Protocol Analyzer', result: selectedPacket.protocol + ' valid', status: 'clean' },
                    { engine: 'Anomaly Detection', result: selectedPacket.status === 'suspicious' ? 'Deviation detected' : 'Within baseline', status: selectedPacket.status === 'suspicious' ? 'suspicious' : 'clean' },
                    { engine: 'Threat Intelligence', result: selectedPacket.status === 'malicious' ? 'Known malicious IP' : 'Clean reputation', status: selectedPacket.status === 'malicious' ? 'threat' : 'clean' },
                    { engine: 'Behavioral AI', result: selectedPacket.status !== 'normal' ? 'Anomalous pattern' : 'Normal behavior', status: selectedPacket.status !== 'normal' ? 'suspicious' : 'clean' },
                    { engine: 'Payload Inspector', result: selectedPacket.size > 1000 ? 'Large payload flagged' : 'Payload clean', status: selectedPacket.size > 1000 ? 'suspicious' : 'clean' },
                  ].map((analysis, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2">
                      <span className="text-gray-300 text-xs">{analysis.engine}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{analysis.result}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          analysis.status === 'clean' ? 'bg-green-400' :
                          analysis.status === 'suspicious' ? 'bg-amber-400' : 'bg-red-400'
                        }`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hex Payload Preview */}
              <div>
                <h4 className="text-emerald-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Payload Preview (Hex)
                </h4>
                <div className="bg-black rounded-lg p-3 font-mono text-xs text-green-400 leading-relaxed">
                  {Array.from({ length: 4 }, () =>
                    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')
                  ).join('\n')}
                </div>
              </div>

              {/* Verdict */}
              <div className={`rounded-lg p-4 border ${
                selectedPacket.status === 'normal' ? 'bg-green-500/5 border-green-500/20' :
                selectedPacket.status === 'suspicious' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium text-sm ${
                      selectedPacket.status === 'normal' ? 'text-green-400' :
                      selectedPacket.status === 'suspicious' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      Verdict: {selectedPacket.status.toUpperCase()}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {selectedPacket.status === 'normal' ? 'Packet passed all inspection checks - allowed through' :
                       selectedPacket.status === 'suspicious' ? 'Packet flagged for further investigation - logged for review' :
                       'Packet matched threat signature - blocked and alert generated'}
                    </p>
                  </div>
                  <span className={`text-2xl ${
                    selectedPacket.status === 'normal' ? '🟢' :
                    selectedPacket.status === 'suspicious' ? '🟡' : '🔴'
                  }`}>
                    {selectedPacket.status === 'normal' ? '✓' : selectedPacket.status === 'suspicious' ? '⚠' : '✗'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setSelectedPacket(null)}
                className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
