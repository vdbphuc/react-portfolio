import StatusDashboard from '../components/StatusDashboard';

const MonitorPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
                System Health Monitor 🚦
            </h1>
            <div className="max-w-4xl mx-auto">
                <StatusDashboard />
            </div>
        </div>
    );
};

export default MonitorPage;
