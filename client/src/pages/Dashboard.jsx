import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


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
                <div className="container mx-auto px-8 py-12 pt-28">
                    <p className="text-center text-[var(--color-warm-gray)] text-xl">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-cream)]">
                <Navbar />
                <div className="container mx-auto px-8 py-12 pt-28">
                    <p className="text-center text-red-600 text-xl">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900
  dark:to-slate-800">
            <div className="container mx-auto px-8 py-12 pt-28">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-serif text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Welcome back, {user?.name}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Projects */}
                    <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all
  duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-lg bg-blue-500 dark:bg-blue-400"></div>
                                </div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{stats?.totalProjects || 0}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active projects</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Income */}
                    <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 shadow-lg
  hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-lg bg-white/40"></div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Income</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-bold text-white">${stats?.totalIncome?.toFixed(2) || '0.00'}</p>
                                <p className="text-sm text-emerald-100">Total earnings</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Expenses */}
                    <Card className="border-0 bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 shadow-lg
  hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-lg bg-white/40"></div>
                                </div>
                                <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">Expenses</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-bold text-white">${stats?.totalExpenses?.toFixed(2) || '0.00'}</p>
                                <p className="text-sm text-rose-100">Total spent</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profit/Loss */}
                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stats?.profitLoss >= 0 ? 'bg-gradient-to-br         from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700' : 'bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600dark:to-red-700'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-lg bg-white/40"></div>
                                </div>
                                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Net</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-bold text-white">${stats?.profitLoss?.toFixed(2) || '0.00'}</p>
                                <p className="text-sm text-white/90">{stats?.profitLoss >= 0 ? 'Profit' : 'Loss'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg mb-8">
                    <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
                        <CardDescription className="dark:text-slate-400">Your latest transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {stats?.recentActivity?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50      
  border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${activity.type === 'expense' ?
                                                'bg-rose-100 dark:bg-rose-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
                                                <div className={`h-5 w-5 rounded ${activity.type === 'expense' ? 'bg-rose-500 dark:bg-rose-400' :
                                                    'bg-emerald-500 dark:bg-emerald-400'}`}></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Badge variant={activity.type === 'expense' ? 'destructive' : 'default'} className="text-xs">
                                                        {activity.type}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-slate-900
  dark:text-slate-100">{activity.project_name}</span>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                                        {new Date(activity.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{activity.category || activity.source}</p>
                                            </div>
                                        </div>
                                        <p className={`text-xl font-bold ${activity.type === 'expense' ? 'text-rose-600 dark:text-rose-400' :
                                            'text-emerald-600 dark:text-emerald-400'}`}>
                                            ${parseFloat(activity.amount).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent activity. Start tracking your projects!</p>
                        )}
                    </CardContent>
                </Card>

                {/* Projects Grid */}
                <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                    <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Projects</CardTitle>
                        <CardDescription className="dark:text-slate-400">Manage your active projects</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {stats?.projects?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.projects.map((project) => (
                                    <div key={project.id} className="group p-5 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50
  dark:from-slate-700 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300
  hover:-translate-y-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600
  dark:group-hover:text-blue-400 transition-colors">{project.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => window.location.href = `/projects/${project.id}/expenses`}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white
  dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                Expenses
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/projects/${project.id}/income`}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-600 rounded-lg      
  hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors"
                                            >
                                                Income
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No projects yet. Create your first project to get
                                started!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;