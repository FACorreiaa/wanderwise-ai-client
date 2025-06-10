import { createSignal, For, Show, createEffect } from 'solid-js';
import { BarChart3, Users, MapPin, MessageCircle, Star, Settings, Activity, AlertTriangle, TrendingUp, Eye, Search, Filter, Plus, Download, RefreshCw } from 'lucide-solid';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = createSignal('overview');
    const [timeRange, setTimeRange] = createSignal('7d'); // '24h', '7d', '30d', '90d'
    const [refreshing, setRefreshing] = createSignal(false);

    // Sample admin data
    const [stats] = createSignal({
        users: {
            total: 12450,
            active: 8920,
            new: 234,
            growth: 12.5
        },
        pois: {
            total: 45230,
            verified: 38940,
            pending: 892,
            flagged: 23
        },
        reviews: {
            total: 28940,
            recent: 156,
            avgRating: 4.2,
            flagged: 12
        },
        chat: {
            sessions: 5890,
            messages: 45230,
            avgSessionLength: '8m 32s',
            satisfaction: 94.2
        }
    });

    const [recentActivity] = createSignal([
        {
            id: 'act-1',
            type: 'user_registration',
            description: 'New user registered: john.doe@email.com',
            timestamp: '2024-01-20T14:30:00Z',
            severity: 'info'
        },
        {
            id: 'act-2',
            type: 'poi_flagged',
            description: 'POI "Fake Restaurant" flagged by 3 users',
            timestamp: '2024-01-20T14:25:00Z',
            severity: 'warning'
        },
        {
            id: 'act-3',
            type: 'review_flagged',
            description: 'Review flagged for inappropriate content',
            timestamp: '2024-01-20T14:20:00Z',
            severity: 'warning'
        },
        {
            id: 'act-4',
            type: 'system_error',
            description: 'API rate limit exceeded for external service',
            timestamp: '2024-01-20T14:15:00Z',
            severity: 'error'
        },
        {
            id: 'act-5',
            type: 'poi_approved',
            description: 'POI "New Art Gallery" approved and published',
            timestamp: '2024-01-20T14:10:00Z',
            severity: 'success'
        }
    ]);

    const [flaggedContent] = createSignal([
        {
            id: 'flag-1',
            type: 'poi',
            title: 'Suspicious Restaurant Listing',
            description: 'Multiple users reported this as a fake business',
            reportCount: 5,
            status: 'pending',
            priority: 'high',
            createdAt: '2024-01-20T12:00:00Z'
        },
        {
            id: 'flag-2',
            type: 'review',
            title: 'Inappropriate Review Content',
            description: 'Contains offensive language and personal attacks',
            reportCount: 3,
            status: 'pending',
            priority: 'medium',
            createdAt: '2024-01-20T10:30:00Z'
        },
        {
            id: 'flag-3',
            type: 'user',
            title: 'Spam Account Activity',
            description: 'User posting duplicate reviews across multiple places',
            reportCount: 8,
            status: 'investigating',
            priority: 'high',
            createdAt: '2024-01-19T16:45:00Z'
        }
    ]);

    const [topPOIs] = createSignal([
        { name: 'Livraria Lello', views: 15420, rating: 4.5, reviews: 340 },
        { name: 'Ponte Luís I', views: 12890, rating: 4.6, reviews: 280 },
        { name: 'Cais da Ribeira', views: 11230, rating: 4.4, reviews: 250 },
        { name: 'Torre dos Clérigos', views: 9870, rating: 4.3, reviews: 190 },
        { name: 'Palácio da Bolsa', views: 8450, rating: 4.2, reviews: 160 }
    ]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'content', label: 'Content', icon: MapPin },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'chat', label: 'AI Chat', icon: MessageCircle },
        { id: 'flags', label: 'Flags', icon: AlertTriangle },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const timeRanges = [
        { value: '24h', label: 'Last 24 hours' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' }
    ];

    const refreshData = async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const getActivityIcon = (type) => {
        const icons = {
            'user_registration': '👤',
            'poi_flagged': '🚩',
            'review_flagged': '⚠️',
            'system_error': '❌',
            'poi_approved': '✅'
        };
        return icons[type] || '📝';
    };

    const getActivityColor = (severity) => {
        const colors = {
            'info': 'text-blue-600 bg-blue-50',
            'success': 'text-green-600 bg-green-50',
            'warning': 'text-yellow-600 bg-yellow-50',
            'error': 'text-red-600 bg-red-50'
        };
        return colors[severity] || 'text-gray-600 bg-gray-50';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'high': 'text-red-600 bg-red-50',
            'medium': 'text-yellow-600 bg-yellow-50',
            'low': 'text-green-600 bg-green-50'
        };
        return colors[priority] || 'text-gray-600 bg-gray-50';
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const renderOverview = () => (
        <div class="space-y-6">
            {/* Stats Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="cb-card">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Users</p>
                                <p class="text-2xl font-bold text-gray-900">{stats().users.total.toLocaleString()}</p>
                                <p class="text-sm text-green-600 mt-1">+{stats().users.growth}% this month</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users class="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cb-card">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total POIs</p>
                                <p class="text-2xl font-bold text-gray-900">{stats().pois.total.toLocaleString()}</p>
                                <p class="text-sm text-yellow-600 mt-1">{stats().pois.pending} pending approval</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <MapPin class="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cb-card">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Reviews</p>
                                <p class="text-2xl font-bold text-gray-900">{stats().reviews.total.toLocaleString()}</p>
                                <p class="text-sm text-blue-600 mt-1">Avg rating: {stats().reviews.avgRating}/5</p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Star class="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cb-card">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Chat Sessions</p>
                                <p class="text-2xl font-bold text-gray-900">{stats().chat.sessions.toLocaleString()}</p>
                                <p class="text-sm text-purple-600 mt-1">{stats().chat.satisfaction}% satisfaction</p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MessageCircle class="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top POIs and Recent Activity */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top POIs */}
                <div class="cb-card">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing POIs</h3>
                        <div class="space-y-4">
                            <For each={topPOIs()}>
                                {(poi) => (
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <h4 class="font-medium text-gray-900">{poi.name}</h4>
                                            <p class="text-sm text-gray-600">{poi.views.toLocaleString()} views • {poi.reviews} reviews</p>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                            <span class="text-sm font-medium">{poi.rating}</span>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div class="cb-card">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div class="space-y-4">
                            <For each={recentActivity().slice(0, 5)}>
                                {(activity) => (
                                    <div class="flex items-start gap-3">
                                        <span class="text-lg">{getActivityIcon(activity.type)}</span>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm text-gray-900">{activity.description}</p>
                                            <p class="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                                        </div>
                                        <span class={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.severity)}`}>
                                            {activity.severity}
                                        </span>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flagged Content Summary */}
            <div class="cb-card">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Flagged Content Requiring Attention</h3>
                        <button
                            onClick={() => setActiveTab('flags')}
                            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All →
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <For each={flaggedContent().slice(0, 3)}>
                            {(item) => (
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="font-medium text-gray-900 text-sm">{item.title}</h4>
                                        <span class={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-2">{item.description}</p>
                                    <p class="text-xs text-gray-500">{item.reportCount} reports</p>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFlags = () => (
        <div class="space-y-6">
            <div class="cb-card">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Flagged Content</h3>
                        <div class="flex items-center gap-3">
                            <select class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option>All Types</option>
                                <option>POIs</option>
                                <option>Reviews</option>
                                <option>Users</option>
                            </select>
                            <select class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option>All Priorities</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <For each={flaggedContent()}>
                            {(item) => (
                                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2 mb-2">
                                                <h4 class="font-medium text-gray-900">{item.title}</h4>
                                                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    {item.type}
                                                </span>
                                                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                                    {item.priority} priority
                                                </span>
                                            </div>
                                            <p class="text-gray-600 mb-2">{item.description}</p>
                                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{item.reportCount} reports</span>
                                                <span>Created {formatTimestamp(item.createdAt)}</span>
                                                <span class={`px-2 py-1 rounded-full text-xs ${
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    item.status === 'investigating' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2 ml-4">
                                            <button class="cb-button cb-button-secondary px-3 py-1 text-sm">
                                                Investigate
                                            </button>
                                            <button class="cb-button bg-red-600 text-white hover:bg-red-700 px-3 py-1 text-sm">
                                                Take Action
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab()) {
            case 'overview':
                return renderOverview();
            case 'flags':
                return renderFlags();
            case 'users':
                return <div class="cb-card p-6 text-center text-gray-500">User management interface coming soon...</div>;
            case 'content':
                return <div class="cb-card p-6 text-center text-gray-500">Content management interface coming soon...</div>;
            case 'reviews':
                return <div class="cb-card p-6 text-center text-gray-500">Review management interface coming soon...</div>;
            case 'chat':
                return <div class="cb-card p-6 text-center text-gray-500">Chat analytics interface coming soon...</div>;
            case 'settings':
                return <div class="cb-card p-6 text-center text-gray-500">System settings interface coming soon...</div>;
            default:
                return renderOverview();
        }
    };

    return (
        <div class="min-h-screen bg-gray-50">
            {/* Header */}
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p class="text-gray-600 mt-1">Monitor and manage your travel platform</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <select
                                value={timeRange()}
                                onChange={(e) => setTimeRange(e.target.value)}
                                class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <For each={timeRanges}>
                                    {(range) => <option value={range.value}>{range.label}</option>}
                                </For>
                            </select>
                            <button
                                onClick={refreshData}
                                disabled={refreshing()}
                                class="cb-button cb-button-secondary px-3 py-2 flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw class={`w-4 h-4 ${refreshing() ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2">
                                <Download class="w-4 h-4" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div class="lg:w-64 flex-shrink-0">
                        <div class="cb-card">
                            <div class="p-4">
                                <nav class="space-y-1">
                                    <For each={tabs}>
                                        {(tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    onClick={() => setActiveTab(tab.id)}
                                                    class={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                                                        activeTab() === tab.id
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Icon class="w-5 h-5" />
                                                    {tab.label}
                                                    {tab.id === 'flags' && (
                                                        <span class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                                            {flaggedContent().length}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        }}
                                    </For>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div class="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}