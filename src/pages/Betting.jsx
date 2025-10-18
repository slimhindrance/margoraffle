import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, DollarSign, Plus, Trash2 } from 'lucide-react';
import { getCategories, submitBets } from '../utils/api';

export default function Betting() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedBets, setSelectedBets] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Failed to load betting categories');
    }
  };

  const addBet = (categoryId) => {
    setSelectedBets([...selectedBets, { category_id: categoryId, guess_value: '' }]);
  };

  const removeBet = (index) => {
    setSelectedBets(selectedBets.filter((_, i) => i !== index));
  };

  const updateBetValue = (index, value) => {
    const updated = [...selectedBets];
    updated[index].guess_value = value;
    setSelectedBets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedBets.length === 0) {
        setError('Please add at least one bet');
        setLoading(false);
        return;
      }

      if (selectedBets.some(bet => !bet.guess_value.trim())) {
        setError('Please fill in all bet values');
        setLoading(false);
        return;
      }

      const { data } = await submitBets({
        user: userInfo,
        bets: selectedBets
      });

      navigate('/betting/confirm', { state: { paymentInfo: data } });
    } catch (error) {
      console.error('Failed to submit bets:', error);
      setError(error.response?.data?.error || 'Failed to submit bets');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedBets.length * 5.0;
  const canSubmit = selectedBets.length > 0 && selectedBets.every(b => b.guess_value.trim()) && userInfo.name && userInfo.email;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-primary-600" />
          <h1 className="text-4xl font-bold mb-4">Place Your Bets!</h1>
          <p className="text-xl text-gray-600">
            Each category costs $5.00 per bet. The closest guess without going over wins 50% of that category's total pot!
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary-600" size={20} />
              <span className="font-semibold">$5.00 per bet</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="text-primary-600" size={20} />
              <span className="font-semibold">Winner takes 50%</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Current Bets Summary */}
        {selectedBets.length > 0 && (
          <div className="card mb-8 bg-primary-50 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Your Current Bets</h3>
              <p className="text-sm text-gray-600">{selectedBets.length} bet(s) across {new Set(selectedBets.map(b => b.category_id)).size} categories</p>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <div className="text-3xl font-bold text-primary-600">${totalAmount.toFixed(2)}</div>
              <p className="text-gray-600">Total Amount</p>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-6 mb-8">
          {categories.map((category) => {
            const categoryBets = selectedBets.filter(b => b.category_id === category.id);
            return (
              <div key={category.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">$5.00</p>
                    <p className="text-xs text-gray-500">per bet</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Pot:</span>
                    <span className="font-bold">${category.current_pot.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Bets:</span>
                    <span className="font-bold">{category.total_bets}</span>
                  </div>
                </div>

                {/* Bet inputs for this category */}
                {categoryBets.map((bet, idx) => {
                  const betIndex = selectedBets.indexOf(bet);
                  return (
                    <div key={betIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`Your guess (e.g., ${
                          category.unit === 'date' ? 'March 15, 2025' :
                          category.unit === 'lbs-oz' ? '7 lbs 8 oz' :
                          category.unit === 'inches' ? '20 inches' :
                          category.unit === 'cm' ? '35 cm' :
                          category.unit === 'letter' ? 'S' :
                          category.unit === 'time' ? '3:45 PM' :
                          'Your guess'
                        })`}
                        value={bet.guess_value}
                        onChange={(e) => updateBetValue(betIndex, e.target.value)}
                        className="input-field flex-1"
                      />
                      <button
                        onClick={() => removeBet(betIndex)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={() => addBet(category.id)}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                  <Plus size={20} />
                  Add Bet (+$5.00)
                </button>
              </div>
            );
          })}
        </div>

        {/* User Info Form */}
        {selectedBets.length > 0 && (
          <form onSubmit={handleSubmit} className="card mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </form>
        )}

        {/* Submit */}
        <div className="card text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h3 className="text-2xl font-bold mb-2">Ready to Submit?</h3>
          <p className="text-gray-600 mb-4">
            {selectedBets.length === 0
              ? 'Add some bets to continue'
              : `${selectedBets.length} bet(s) totaling $${totalAmount.toFixed(2)}`}
          </p>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Submitting...' : `Review & Submit - $${totalAmount.toFixed(2)}`}
          </button>
          {!canSubmit && selectedBets.length > 0 && (
            <p className="text-sm text-red-600 mt-2">Please fill in all bet values and your information to continue</p>
          )}
        </div>
      </main>
    </div>
  );
}
