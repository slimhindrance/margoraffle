import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, DollarSign, Users, TrendingUp, LogOut, Image } from 'lucide-react';
import { getPayments, validatePayment, getAdminStats } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        getPayments(filter),
        getAdminStats()
      ]);
      setPayments(paymentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id, status) => {
    try {
      await validatePayment(id, { status });
      loadData();
    } catch (error) {
      console.error('Failed to validate payment:', error);
      alert('Failed to validate payment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/admin/images" className="btn-secondary py-2 px-4 flex items-center gap-2">
                <Image size={18} />
                Manage Images
              </Link>
              <button onClick={logout} className="btn-secondary py-2 px-4 flex items-center gap-2">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Total Bets</p>
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{stats.overall.total_bets}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Validated Amount</p>
                <DollarSign className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold">${parseFloat(stats.overall.validated_amount || 0).toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Pending</p>
                <Users className="text-yellow-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{stats.overall.pending_count}</p>
              <p className="text-sm text-gray-500">${parseFloat(stats.overall.pending_amount || 0).toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Total Payments</p>
                <DollarSign className="text-gray-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{stats.overall.total_payments}</p>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {stats && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {stats.categories.map((cat) => (
                <div key={cat.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.total_bets} bets</p>
                  <p className="text-lg font-bold text-primary-600">${parseFloat(cat.pot_amount || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Payments</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('validated')}
                  className={`px-4 py-2 rounded-lg ${filter === 'validated' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                >
                  Validated
                </button>
                <button
                  onClick={() => setFilter('')}
                  className={`px-4 py-2 rounded-lg ${filter === '' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bets</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No payments found</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{payment.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{payment.user_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payment.user_email}</td>
                      <td className="px-6 py-4 text-sm font-bold">${parseFloat(payment.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">{payment.bet_count}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'validated' ? 'bg-green-100 text-green-800' :
                          payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleValidate(payment.id, 'validated')}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                              title="Validate"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleValidate(payment.id, 'rejected')}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
