import { useState } from 'react';
import {
  Settings,
  Plus,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  Zap,
  Save,
  X,
} from 'lucide-react';
import { detectionRules } from '../data/mockData';

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  threshold: string;
  action: string;
}

export default function DetectionRules() {
  const [rules, setRules] = useState<Rule[]>(detectionRules);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    threshold: '',
    action: 'Alert',
    enabled: true,
  });

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const saveNewRule = () => {
    if (!newRule.name || !newRule.threshold) return;
    const rule: Rule = {
      id: `RULE-${String(rules.length + 1).padStart(3, '0')}`,
      name: newRule.name || '',
      enabled: newRule.enabled ?? true,
      threshold: newRule.threshold || '',
      action: newRule.action || 'Alert',
    };
    setRules([...rules, rule]);
    setIsCreating(false);
    setNewRule({ name: '', threshold: '', action: 'Alert', enabled: true });
  };

  const saveEdit = () => {
    if (!editingRule) return;
    setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    setEditingRule(null);
  };

  const enabledCount = rules.filter(r => r.enabled).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Detection Rules</h1>
          <p className="text-gray-400 text-sm mt-1">Configure intrusion detection rules and policies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-300 text-sm">{enabledCount}/{rules.length} rules active</span>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium"
          >
            <Plus size={14} />
            Add Rule
          </button>
        </div>
      </div>

      {/* Configuration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-gray-400 text-sm">Detection Engine</span>
          </div>
          <p className="text-white font-medium">Signature + Anomaly Based</p>
          <p className="text-gray-500 text-xs mt-1">Hybrid detection methodology</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-gray-400 text-sm">Processing Mode</span>
          </div>
          <p className="text-white font-medium">Real-time Inline</p>
          <p className="text-gray-500 text-xs mt-1">Packets analyzed in real-time</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-gray-400 text-sm">Response Action</span>
          </div>
          <p className="text-white font-medium">Block & Alert</p>
          <p className="text-gray-500 text-xs mt-1">Auto-block with admin notification</p>
        </div>
      </div>

      {/* Create New Rule Form */}
      {isCreating && (
        <div className="bg-gray-800/50 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Create New Detection Rule</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., ICMP Flood Detection"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Threshold</label>
              <input
                type="text"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                placeholder="e.g., 500 packets/sec"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Response Action</label>
              <select
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Alert">Alert Only</option>
                <option value="Block IP">Block IP</option>
                <option value="Block & Alert">Block & Alert</option>
                <option value="Block & Log">Block & Log</option>
                <option value="Quarantine">Quarantine</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={saveNewRule}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
              >
                <Save size={14} />
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-gray-800/50 border rounded-xl p-4 transition-all ${
              rule.enabled ? 'border-gray-700/50' : 'border-gray-700/30 opacity-60'
            }`}
          >
            {editingRule?.id === rule.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-mono">{rule.id}</span>
                  <button onClick={() => setEditingRule(null)} className="text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Rule Name</label>
                    <input
                      type="text"
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Threshold</label>
                    <input
                      type="text"
                      value={editingRule.threshold}
                      onChange={(e) => setEditingRule({ ...editingRule, threshold: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Action</label>
                    <select
                      value={editingRule.action}
                      onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Alert">Alert Only</option>
                      <option value="Block IP">Block IP</option>
                      <option value="Block & Alert">Block & Alert</option>
                      <option value="Block & Log">Block & Log</option>
                      <option value="Quarantine">Quarantine</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="flex-shrink-0"
                  >
                    {rule.enabled ? (
                      <ToggleRight size={28} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-500" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium text-sm">{rule.name}</h4>
                      <span className="text-gray-500 text-xs font-mono">{rule.id}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-400 text-xs">Threshold: {rule.threshold}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-emerald-400/70 text-xs">Action: {rule.action}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    rule.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => setEditingRule({ ...rule })}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rule Statistics */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Rule Engine Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{rules.length}</p>
            <p className="text-gray-500 text-xs mt-1">Total Rules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{enabledCount}</p>
            <p className="text-gray-500 text-xs mt-1">Active Rules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">1.2ms</p>
            <p className="text-gray-500 text-xs mt-1">Avg Processing Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">99.7%</p>
            <p className="text-gray-500 text-xs mt-1">Detection Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
