import { useEffect, useState } from 'react';
import { ServerCrash, RefreshCcw, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react';

const StatusDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Thay URL này bằng domain API thật sau khi deploy xong (qua Cloudflare Tunnel)
  // Ví dụ: https://api.portfolio.com/api/status
  const API_URL = "http://192.168.1.145:8000/api/status";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching status:", error);
      setError("Failed to connect to the monitor server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh mỗi 60 giây
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ item }) => (
    <div className="group relative overflow-hidden bg-white/5 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${item.is_up ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
            <Globe size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-[200px] sm:max-w-[250px]" title={item.url}>
              {new URL(item.url).hostname}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {new Date(item.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${item.is_up ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30'
          }`}>
          {item.is_up ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {item.is_up ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
          <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Latency</span>
          <span className={`text-lg font-bold ${item.response_time_ms < 500 ? 'text-green-500' : item.response_time_ms < 1000 ? 'text-yellow-500' : 'text-red-500'}`}>
            {item.response_time_ms}ms
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
          <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Status</span>
          <span className={`text-lg font-mono font-bold ${item.is_up ? 'text-blue-500' : 'text-red-500'}`}>
            {item.status_code}
          </span>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/20 max-w-2xl mx-auto mt-10 text-center animate-fade-in">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-6">
          <ServerCrash className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Connection Lost</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          We couldn't connect to the monitoring server. Please check your internet connection or try again later.
        </p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <RefreshCcw size={20} />}
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 md:p-8 max-w-6xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            🚦 System Health
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time infrastructure monitoring dashboard</p>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-full">
            <Clock size={16} />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {loading && !data.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <StatusCard key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDashboard;