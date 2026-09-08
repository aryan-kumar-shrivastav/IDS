import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LiveAnalysis from './components/LiveAnalysis';
import NetworkMonitor from './components/NetworkMonitor';
import ThreatDetection from './components/ThreatDetection';
import AlertManager from './components/AlertManager';
import LogViewer from './components/LogViewer';
import DetectionRules from './components/DetectionRules';

export default function App() {
  const [activeTab, setActiveTab] = useState('live');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live':
        return <LiveAnalysis />;
      case 'network':
        return <NetworkMonitor />;
      case 'threats':
        return <ThreatDetection />;
      case 'alerts':
        return <AlertManager />;
      case 'logs':
        return <LogViewer />;
      case 'rules':
        return <DetectionRules />;
      default:
        return <LiveAnalysis />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
