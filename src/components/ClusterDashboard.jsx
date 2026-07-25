import { useEffect, useState } from 'react';
import { Server, Layers, Cpu, Database, Activity, RefreshCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import HistoryChart from './HistoryChart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ClusterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // AI Diagnostics state
  const [diagnosticReport, setDiagnosticReport] = useState("");
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagError, setDiagError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace("/api/status", "/api/cluster/status")
    : "https://distributors-marshall-accepted-athens.trycloudflare.com/api/cluster/status";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_URL, {
        headers: {
          "X-Admin-Token": token || ""
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "Unhealthy") {
        throw new Error(result.error || "Backend reports metrics server unavailable.");
      }
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching cluster metrics:", err);
      setError(err.message || "Failed to connect to the cluster API.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnostics = async () => {
    setDiagLoading(true);
    setDiagError("");
    setDiagnosticReport("");
    try {
      const token = localStorage.getItem("adminToken");
      const diagUrl = API_URL.replace("/api/cluster/status", "/api/cluster/diagnose");
      const response = await fetch(diagUrl, {
        headers: {
          "X-Admin-Token": token || ""
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setDiagnosticReport(result.report);
    } catch (err) {
      console.error("Error generating diagnostics:", err);
      setDiagError(err.message || "Failed to generate diagnostics.");
    } finally {
      setDiagLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Tải lại mỗi 15 giây
    return () => clearInterval(interval);
  }, []);

  const UsageBar = ({ label, percentage, valueText, colorClass }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
        <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-gray-900 dark:text-white font-mono">{valueText} ({percentage}%)</span>
      </div>
      <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-700/30">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  const NodeCard = ({ node }) => {
    const isCpuHigh = node.cpu_usage_pct > 80;
    const isMemHigh = node.memory_usage_pct > 85;

    const isMaster = node.role === "control-plane";
    const cpuHist = isMaster ? data?.history?.cpu_master : data?.history?.cpu_agent;
    const memHist = isMaster ? data?.history?.mem_master : data?.history?.mem_agent;

    return (
      <div className="group relative bg-white/5 dark:bg-gray-850/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <Server size={18} className="text-indigo-500" />
              {node.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                {node.role}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                node.status === "Ready" 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}>
                {node.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <UsageBar 
            label="CPU Utilization" 
            percentage={node.cpu_usage_pct} 
            valueText={`${node.cpu_usage_m} mCore / ${node.cpu_cores * 1000} mCore`}
            colorClass={isCpuHigh ? "bg-red-500" : node.cpu_usage_pct > 50 ? "bg-yellow-500" : "bg-gradient-to-r from-indigo-500 to-cyan-400"}
          />
          <UsageBar 
            label="Memory (RAM)" 
            percentage={node.memory_usage_pct} 
            valueText={`${node.memory_usage_mb} MB / ${node.memory_capacity_mb} MB`}
            colorClass={isMemHigh ? "bg-red-500" : node.memory_usage_pct > 65 ? "bg-yellow-500" : "bg-gradient-to-r from-purple-500 to-pink-400"}
          />
        </div>

        {/* Resource History Charts */}
        <div className="mt-6 pt-4 border-t border-gray-150 dark:border-gray-800/80 space-y-4">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">CPU History (15s intervals)</span>
            <HistoryChart data={cpuHist} strokeColor="#6366f1" height={45} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Memory History (15s intervals)</span>
            <HistoryChart data={memHist} strokeColor="#a855f7" height={45} />
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-yellow-100 dark:border-yellow-900/20 max-w-2xl mx-auto mt-10 text-center animate-fade-in">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-full mb-6">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Metrics Server Unavailable</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transform hover:-translate-y-0.5"
        >
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <RefreshCcw size={20} />}
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const nodes = data?.nodes || [];
  const pods = data?.pods || { total: 0, running: 0, pending: 0, failed: 0 };
  const hostDisk = data?.host_disk || { total_gb: 0, used_gb: 0, pct: 0 };
  const hostUptime = data?.host_uptime || "Unknown";

  // Lấy node đóng vai trò control-plane đại diện cho Host VM chính
  const masterNode = nodes.find(n => n.role === "control-plane") || nodes[0] || {};
  const hostCpuPct = masterNode.cpu_usage_pct !== undefined ? masterNode.cpu_usage_pct : 0;
  const hostCpuCores = masterNode.cpu_cores || 0;
  const hostMemPct = masterNode.memory_usage_pct !== undefined ? masterNode.memory_usage_pct : 0;
  const hostMemUsed = masterNode.memory_usage_mb || 0;
  const hostMemTotal = masterNode.memory_capacity_mb || 0;

  return (
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 md:p-8 max-w-6xl mx-auto mt-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            📊 Infrastructure Status
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Live nodes CPU/RAM metrics and workloads metrics</p>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-full">
            <Clock size={16} />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Tầng 1: Kubernetes Cluster Overview */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Kubernetes Cluster</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Server className="mx-auto text-indigo-500 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Nodes</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{nodes.length}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Layers className="mx-auto text-green-500 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Running Pods</span>
            <span className="text-2xl font-bold text-green-500">{pods.running}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Pods</span>
            <span className="text-2xl font-bold text-yellow-500">{pods.pending}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Activity className="mx-auto text-cyan-500 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Pods</span>
            <span className="text-2xl font-bold text-cyan-500">{pods.total}</span>
          </div>
        </div>
      </div>

      {/* Tầng 2: Host VM Server Overview */}
      <div className="mb-10">
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Host VM Server</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Cpu className="mx-auto text-indigo-400 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Host CPU</span>
            <span className="text-2xl font-bold text-indigo-500" title={`${masterNode.cpu_usage_m} mCore used`}>
              {hostCpuPct}%
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Database className="mx-auto text-purple-400 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Host RAM</span>
            <span className="text-2xl font-bold text-purple-500" title={`${(hostMemUsed / 1024).toFixed(1)} GB used / ${(hostMemTotal / 1024).toFixed(1)} GB total`}>
              {hostMemPct}%
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Database className="mx-auto text-pink-400 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Host Disk</span>
            <span className="text-2xl font-bold text-pink-500" title={`${hostDisk.used_gb} GB used / ${hostDisk.total_gb} GB total`}>
              {hostDisk.pct}%
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-center">
            <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Host Uptime</span>
            <span className="text-sm font-bold text-gray-950 dark:text-white block mt-1 truncate" title={hostUptime}>
              {hostUptime}
            </span>
          </div>
        </div>
      </div>

      {loading && !nodes.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nodes.map((node, index) => (
            <NodeCard key={index} node={node} />
          ))}
        </div>
      )}

      {/* AI Diagnostics Panel */}
      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🧠 AI System Diagnostics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Let Gemini/Claude analyze and diagnose system bottlenecks</p>
          </div>
          <button
            onClick={fetchDiagnostics}
            disabled={diagLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40"
          >
            {diagLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing Cluster...</span>
              </>
            ) : (
              <span>Run AI Diagnostics</span>
            )}
          </button>
        </div>

        {diagError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
            Error: {diagError}
          </div>
        )}

        {diagnosticReport && (
          <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 font-sans prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed shadow-inner">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {diagnosticReport}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClusterDashboard;
