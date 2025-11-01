
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { getComplaints, updateComplaint, updateUserPoints } from '@/utils/storage.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, Clock, CheckCircle, BarChart, ThumbsUp, User, MapPin, Tag } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const DEPARTMENTS = ['Roads', 'Water', 'Waste', 'Electricity', 'Parks', 'Traffic', 'Other'];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', department: 'all', search: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const allComplaints = getComplaints();
    setComplaints(allComplaints);
    setFilteredComplaints(allComplaints);
  }, []);

  useEffect(() => {
    let result = complaints;
    if (filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters.department !== 'all') {
      result = result.filter(c => c.category === filters.department);
    }
    if (filters.search) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredComplaints(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [filters, complaints]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id, status, userId) => {
    const updated = updateComplaint(id, { status });
    if (updated) {
      if (status === 'resolved') {
        updateUserPoints(userId, 10);
        toast({ title: "Issue Resolved!", description: "Citizen has been awarded 10 points." });
      } else {
        toast({ title: "Status Updated!" });
      }
      setComplaints(getComplaints());
      setSelectedComplaint(null);
    }
  };
  
  const handleAssignDepartment = (id, department) => {
    const updated = updateComplaint(id, { assignedDepartment: department, status: 'assigned' });
    if (updated) {
      toast({ title: "Department Assigned!" });
      setComplaints(getComplaints());
      setSelectedComplaint(null);
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
        case 'open': return <span className="bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Open</span>
        case 'assigned': return <span className="bg-yellow-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><BarChart className="w-3 h-3"/> Assigned</span>
        case 'resolved': return <span className="bg-green-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>
        default: return null;
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CITIFIX</title>
        <meta name="description" content="Manage and resolve civic issues." />
      </Helmet>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-slate-800 p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-center border border-slate-700">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search by title or description..." 
              className="pl-10 bg-slate-700 text-slate-100 border-slate-600 placeholder:text-slate-400"
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[180px] bg-slate-700 text-slate-100 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.department} onValueChange={value => handleFilterChange('department', value)}>
              <SelectTrigger className="w-[180px] bg-slate-700 text-slate-100 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map(c => (
            <motion.div
              key={c.id}
              layout
              className="bg-slate-800 rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer border border-slate-700"
              onClick={() => setSelectedComplaint(c)}
            >
              <img class="w-full h-40 object-cover" alt={c.title} src={c.image || "https://images.unsplash.com/photo-1516180500701-0685eb8301a2"} />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg truncate pr-2">{c.title}</h3>
                  {getStatusChip(c.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1"><Tag className="w-3 h-3"/>{c.category}</div>
                  <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3"/>{c.votes}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedComplaint && (
          <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
            <DialogContent className="max-w-3xl bg-slate-800 text-slate-100 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedComplaint.title}</DialogTitle>
                <DialogDescription>{getStatusChip(selectedComplaint.status)}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-1">
                <div>
                  <img class="w-full rounded-lg shadow-md mb-4" alt={selectedComplaint.title} src={selectedComplaint.image || "https://images.unsplash.com/photo-1681582383536-bdae40763642"} />
                  <p className="font-semibold text-slate-100">Description</p>
                  <p className="text-slate-300 mb-4">{selectedComplaint.description}</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-slate-300"><User className="w-4 h-4 text-slate-400"/> <strong>Reported by:</strong> {selectedComplaint.userName}</p>
                    <p className="flex items-center gap-2 text-slate-300"><Tag className="w-4 h-4 text-slate-400"/> <strong>AI Category:</strong> {selectedComplaint.category}</p>
                    <p className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-400"/> <strong>Location:</strong> {selectedComplaint.address}</p>
                    <p className="flex items-center gap-2 text-slate-300"><ThumbsUp className="w-4 h-4 text-slate-400"/> <strong>Votes:</strong> {selectedComplaint.votes}</p>
                  </div>
                </div>
                <div>
                  <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
                    <MapContainer center={[selectedComplaint.location.latitude, selectedComplaint.location.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[selectedComplaint.location.latitude, selectedComplaint.location.longitude]}>
                        <Popup>{selectedComplaint.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-100">Assign Department</Label>
                      <Select onValueChange={value => handleAssignDepartment(selectedComplaint.id, value)} defaultValue={selectedComplaint.assignedDepartment}>
                        <SelectTrigger className="bg-slate-700 text-slate-100 border-slate-600">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          {DEPARTMENTS.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedComplaint.status !== 'resolved' && (
                      <Button 
                        className="w-full gradient-green text-white"
                        onClick={() => handleStatusChange(selectedComplaint.id, 'resolved', selectedComplaint.userId)}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
