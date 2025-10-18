import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Copy, Home } from 'lucide-react';
import { useState } from 'react';

export default function BettingConfirm() {
  const location = useLocation();
  const paymentInfo = location.state?.paymentInfo;
  const [copied, setCopied] = useState(false);

  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="card text-center max-w-md">
          <p className="text-gray-600 mb-4">No payment information found</p>
          <Link to="/betting" className="btn-primary">
            Go to Betting
          </Link>
        </div>
      </div>
    );
  }

  const copyVenmoUsername = () => {
    navigator.clipboard.writeText(paymentInfo.venmo_username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-bold mb-4">Bets Submitted Successfully!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Almost there! Complete your payment to activate your bets.
          </p>

          {/* Payment Instructions */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold mb-4 text-center">Payment Instructions</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Amount to Send</p>
                <p className="text-4xl font-bold text-primary-600">${paymentInfo.total_amount.toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Send to</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{paymentInfo.venmo_username}</p>
                  <button
                    onClick={copyVenmoUsername}
                    className="btn-secondary py-2 px-4 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Payment ID (Reference)</p>
                <p className="font-mono text-lg">#{paymentInfo.payment_id}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="text-left mb-8">
            <h3 className="text-xl font-bold mb-4">Next Steps:</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <p>Open the Venmo app on your phone</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <p>
                  Send <strong>${paymentInfo.total_amount.toFixed(2)}</strong> to <strong>{paymentInfo.venmo_username}</strong>
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <p>
                  In the payment note, include your email and/or payment ID <strong>#{paymentInfo.payment_id}</strong>
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <p>
                  Wait for admin to validate your payment (usually within 24 hours)
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </span>
                <p>Your bets will be active once payment is confirmed!</p>
              </li>
            </ol>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <p className="font-semibold mb-2">⚠️ Important:</p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Please include your email or payment ID in the Venmo note</li>
              <li>• Payments are validated manually within 24 hours</li>
              <li>• You'll be notified once your bets are active</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="btn-primary flex items-center justify-center gap-2 flex-1">
              <Home size={20} />
              Back to Home
            </Link>
            <Link to="/betting" className="btn-secondary flex-1">
              Place More Bets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
