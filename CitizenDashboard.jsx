
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getComplaints } from '@/utils/storage';
import { Award, FileText, TrendingUp, Plus, LogOut, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const complaints = getComplaints();
  const userComplaints = complaints.filter(c => c.userId === user.id);
  
  const stats = [
    { 
      icon: FileText, 
      label: 'Total Complaints', 
      value: userComplaints.length,
      color: 'from-blue-700 to-blue-800'
    },
    { 
      icon: TrendingUp, 
      label: 'Resolved', 
      value: userComplaints.filter(c => c.status === 'resolved').length,
      color: 'from-green-700 to-green-800'
    },
    { 
      icon: Award, 
      label: 'Reward Points', 
      value: user.rewardPoints || 0,
      color: 'from-orange-700 to-orange-800'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - CITIFIX</title>
        <meta name="description" content="View your complaints, track resolutions, and manage your CITIFIX account." />
      </Helmet>
      
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}! 👋</h1>
              <p className="text-slate-300 mt-2">Track your civic contributions</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 shadow-lg card-hover border border-slate-700"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl p-8 text-white cursor-pointer card-hover"
              onClick={() => navigate('/report')}
            >
              <Plus className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Report New Issue</h3>
              <p className="opacity-90">Help improve your community</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-8 text-white cursor-pointer card-hover"
              onClick={() => navigate('/my-complaints')}
            >
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">My Complaints</h3>
              <p className="opacity-90">Track your submissions</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 shadow-lg cursor-pointer card-hover border border-slate-700"
              onClick={() => navigate('/community')}
            >
              <Users className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Community Portal</h3>
              <p className="text-slate-300">View and vote on community issues</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 rounded-xl p-6 shadow-lg cursor-pointer card-hover border border-slate-700"
              onClick={() => navigate('/leaderboard')}
            >
              <Award className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-slate-300">See top contributors</p>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CitizenDashboard;
