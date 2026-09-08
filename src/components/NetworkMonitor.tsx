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

      {/* Packet Detail Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedPacket(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-4">Packet Details - {selectedPacket.id}</h3>
            <div className="space-y-3">
              {Object.entries(selectedPacket).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white text-sm font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedPacket(null)}
              className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
