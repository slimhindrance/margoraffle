import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getBets } from '../../utils/api';

export default function AdminBets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    try {
      const { data } = await getBets();
      setBets(data);
    } catch (error) {
      console.error('Failed to load bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBets = filter === 'all'
    ? bets
    : bets.filter(bet => bet.payment_status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">All Bets</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
              >
                All ({bets.length})
              </button>
              <button
                onClick={() => setFilter('validated')}
                className={`px-4 py-2 rounded-lg ${filter === 'validated' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
              >
                Validated ({bets.filter(b => b.payment_status === 'validated').length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
              >
                Pending ({bets.filter(b => b.payment_status === 'pending').length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guess</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : filteredBets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No bets found</td>
                  </tr>
                ) : (
                  filteredBets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{bet.category_name}</td>
                      <td className="px-6 py-4 text-sm">{bet.guess_value}</td>
                      <td className="px-6 py-4 text-sm">{bet.user_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{bet.user_email}</td>
                      <td className="px-6 py-4 text-sm font-bold">${parseFloat(bet.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          bet.payment_status === 'validated' ? 'bg-green-100 text-green-800' :
                          bet.payment_status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bet.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(bet.created_at).toLocaleDateString()}
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
