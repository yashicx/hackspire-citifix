
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { getComplaints, getUsers } from '@/utils/storage.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Clock, CheckCircle, BarChart as BarChartIcon } from 'lucide-react';

const COLORS = ['#FF9933', '#138808', '#000080', '#FF7700', '#0A5504', '#87CEEB'];
const DEPARTMENTS = ['Roads', 'Water', 'Waste', 'Electricity', 'Parks', 'Traffic', 'Other'];

const AdminAnalytics = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    setComplaints(getComplaints());
    const allUsers = getUsers();
    setUsers(allUsers.sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0)).slice(0, 5));
  }, []);

  const filteredComplaints = departmentFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.category === departmentFilter);

  const complaintByDept = DEPARTMENTS.map(dep => ({
    name: dep,
    count: complaints.filter(c => c.category === dep).length
  }));

  const statusCounts = {
    open: filteredComplaints.filter(c => c.status === 'open').length,
    assigned: filteredComplaints.filter(c => c.status === 'assigned').length,
    resolved: filteredComplaints.filter(c => c.status === 'resolved').length,
  };

  const trendData = filteredComplaints
    .reduce((acc, c) => {
      const date = new Date(c.createdAt).toISOString().split('T')[0];
      const entry = acc.find(item => item.date === date);
      if (entry) {
        entry.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <Helmet>
        <title>Analytics - CITIFIX</title>
        <meta name="description" content="View real-time analytics for civic issues." />
      </Helmet>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[220px] bg-slate-800 text-slate-100 border-slate-700">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-blue-700 rounded-lg"><Clock className="w-6 h-6 text-white"/></div>
            <div>
              <p className="text-slate-300">Open Issues</p>
              <p className="text-3xl font-bold">{statusCounts.open}</p>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-yellow-700 rounded-lg"><BarChartIcon className="w-6 h-6 text-white"/></div>
            <div>
              <p className="text-slate-300">Assigned Issues</p>
              <p className="text-3xl font-bold">{statusCounts.assigned}</p>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-green-700 rounded-lg"><CheckCircle className="w-6 h-6 text-white"/></div>
            <div>
              <p className="text-slate-300">Resolved Issues</p>
              <p className="text-3xl font-bold">{statusCounts.resolved}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Daily Complaint Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> {/* Darker grid */}
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#f8fafc' }} />
                <Legend />
                <Line type="monotone" dataKey="count" name="New Complaints" stroke="#FF9933" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Top Citizens</h3>
            <ul className="space-y-3">
              {users.map(user => (
                <li key={user.id} className="flex justify-between items-center text-slate-300">
                  <span>{user.name}</span>
                  <span className="font-bold flex items-center gap-1 text-orange-500">
                    <Award className="w-4 h-4"/> {user.rewardPoints || 0}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-3 bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Complaints by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintByDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> {/* Darker grid */}
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="count" name="Complaints" fill="#138808" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={complaintByDept} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {complaintByDept.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminAnalytics;
