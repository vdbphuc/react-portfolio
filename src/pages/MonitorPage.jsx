import StatusDashboard from '../components/StatusDashboard';
import ClusterDashboard from '../components/ClusterDashboard';

const MonitorPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 min-h-screen space-y-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-900 dark:text-white">
                Infrastructure Health Status 🚦
            </h1>
            <div className="max-w-5xl mx-auto">
                <StatusDashboard />
            </div>
            <div className="max-w-5xl mx-auto">
                <ClusterDashboard />
            </div>
        </div>
    );
};

export default MonitorPage;
