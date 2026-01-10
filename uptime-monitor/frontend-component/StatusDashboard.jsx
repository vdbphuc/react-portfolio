import { useEffect, useState } from 'react';

const StatusDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thay URL này bằng domain API thật sau khi deploy xong (qua Cloudflare Tunnel)
  // Ví dụ: https://api.portfolio.com/api/status
  const API_URL = "http://192.168.1.145:8000/api/status"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Auto refresh mỗi 60 giây
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-xl max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
        🚦 System Health Monitor
      </h2>
      
      {loading ? (
        <p className="text-gray-400">Loading metrics...</p>
      ) : (
        <div className="grid gap-4">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-gray-800 rounded-md border border-gray-700 hover:bg-gray-750 transition"
            >
              <div className="flex items-center gap-3">
                {/* Đèn tín hiệu xanh/đỏ */}
                <span className={`w-3 h-3 rounded-full ${item.is_up ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></span>
                
                <div>
                  <p className="text-white font-medium">{item.url}</p>
                  <p className="text-xs text-gray-400">
                    Last checked: {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-sm font-bold ${item.response_time_ms < 500 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {item.response_time_ms}ms
                  </p>
                  <p className="text-xs text-gray-500">Latency</p>
                </div>
                
                <div className="text-right min-w-[60px]">
                  <span className={`px-2 py-1 text-xs rounded ${item.is_up ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {item.status_code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDashboard;