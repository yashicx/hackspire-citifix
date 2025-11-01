
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Home, FileText, Users, Award, LogOut, Shield, BarChart2, Map } from 'lucide-react';

const commonLinks = [
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/leaderboard', icon: Award, label: 'Leaderboard' },
];

const citizenLinks = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/my-complaints', icon: FileText, label: 'My Complaints' },
];

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Dashboard' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/map', icon: Map, label: 'Map View' },
];

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to === '/admin'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-orange-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-orange-300'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoUrl = "https://horizons-cdn.hostinger.com/a6afdcf9-aaa7-4281-ba79-be0f31c772d0/384adb0a13bc13709264589f14f2ae52.jpg";


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = user.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex-col justify-between hidden lg:flex">
        <div>
          <div className="flex items-center gap-2 mb-8 p-3">
            <img src={logoUrl} alt="CITIFIX Logo" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-slate-100">CITIFIX</span>
          </div>
          <nav className="space-y-2">
            {links.map(link => <SidebarLink key={link.to} {...link} />)}
            <div className="pt-4 mt-4 border-t border-slate-700">
              {commonLinks.map(link => <SidebarLink key={link.to} {...link} />)}
            </div>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
