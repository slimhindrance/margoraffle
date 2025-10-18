import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Betting from './pages/Betting';
import BettingConfirm from './pages/BettingConfirm';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminImages from './pages/admin/Images';
import AdminBets from './pages/admin/Bets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/betting" element={<Betting />} />
        <Route path="/betting/confirm" element={<BettingConfirm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/images" element={<AdminImages />} />
        <Route path="/admin/bets" element={<AdminBets />} />
      </Routes>
    </Router>
  );
}

export default App;
