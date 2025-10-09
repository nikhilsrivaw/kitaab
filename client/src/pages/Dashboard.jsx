import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getDashboardStats();

            setStats(response.data)
            setError("")
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError(error.response?.data?.message || 'Failed to load dashboard data');

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardStats()

    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-cream)]">
                <Navbar />
                <div className="container mx-auto px-8 py-12">
                    <p className="text-center text-[var(--color-warm-gray)] text-xl">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-cream)]">
                <Navbar />
                <div className="container mx-auto px-8 py-12">
                    <p className="text-center text-red-600 text-xl">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <Navbar />
            <div className="container mx-auto px-8 py-12">
                <h1 className="font-serif text-5xl font-semibold text-[var(--color-charcoal)] mb-12">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Summary Cards */}
                    <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
                            Projects</h3>
                        <p className="font-serif text-5xl font-bold text-[var(--color-charcoal)]">{stats?.totalProjects || 0}</p>
                    </div>

                    <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
                            Income</h3>
                        <p className="font-serif text-5xl font-bold text-[var(--color-forest-green)]">${stats?.totalIncome?.toFixed(2) || '0.00'}</p>
                    </div>

                    <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
                            Expenses</h3>
                        <p className="font-serif text-5xl font-bold text-[var(--color-terracotta)]">${stats?.totalExpenses?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm hover:shadow-md
  transition-shadow duration-300">
                        <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Profit/Loss</h3>
                        <p className={`font-serif text-5xl font-bold ${stats?.profitLoss >= 0 ? 'text-[var(--color-forest-green)]' : 'text-red-600'}`}>
                            ${stats?.profitLoss?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12 bg-[var(--color-off-white)] p-10 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm">
                    <h2 className="font-serif text-3xl font-semibold text-[var(--color-charcoal)] mb-6">Recent Activity</h2>

                    {stats?.recentActivity?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white rounded border border-[var(--color-warm-gray)]/10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded text-xs font-semibold uppercase ${activity.type === 'expense'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                                }`}>
                                                {activity.type}
                                            </span>
                                            <span className="text-[var(--color-warm-gray)] text-sm">{activity.project_name}</span>
                                            <span className="text-[var(--color-warm-gray)] text-sm">•</span>
                                            <span className="text-[var(--color-warm-gray)] text-sm">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[var(--color-charcoal)] font-medium">
                                            {activity.category || activity.source}
                                        </p>
                                        {activity.description && (
                                            <p className="text-[var(--color-warm-gray)] text-sm mt-1">{activity.description}</p>
                                        )}
                                    </div>
                                    <div className={`font-serif text-2xl font-bold ${activity.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                          ${parseFloat(activity.amount).toFixed(2)}
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <p className="text-[var(--color-warm-gray)]">No recent activity. Start by adding expenses or income to your projects!</p>
                    )}
                </div>
                {/* Quick Links to Projects */}
                <div className="mt-12 bg-[var(--color-off-white)] p-10 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm">
                    <h2 className="font-serif text-3xl font-semibold text-[var(--color-charcoal)] mb-6">Your Projects</h2>

                    {stats?.projects?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.projects.map((project) => (
                                <div key={project.id} className="bg-white p-6 rounded border border-[var(--color-warm-gray)]/10 hover:shadow-md
  transition-shadow duration-200">
                                    <h3 className="font-serif text-xl font-semibold text-[var(--color-charcoal)] mb-2">{project.name}</h3>
                                    <p className="text-[var(--color-warm-gray)] text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.location.href = `/projects/${project.id}/expenses`}
                                            className="flex-1 px-4 py-2 bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded
  hover:bg-[var(--color-terracotta)] transition-colors duration-200 text-sm"
                                        >
                                            Expenses
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `/projects/${project.id}/income`}
                                            className="flex-1 px-4 py-2 bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded
  hover:bg-[var(--color-terracotta)] transition-colors duration-200 text-sm"
                                        >
                                            Income
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[var(--color-warm-gray)]">No projects yet. Create your first project from the Projects page!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;