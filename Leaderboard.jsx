
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getUsers } from '@/utils/storage.js';
import { Award, Medal, Star, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const allUsers = getUsers();
        const sortedUsers = allUsers.sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0));
        setUsers(sortedUsers);
    }, []);
    
    const getRankIcon = (rank) => {
        if (rank === 0) return <Medal className="text-yellow-400" />;
        if (rank === 1) return <Medal className="text-gray-400" />;
        if (rank === 2) return <Medal className="text-yellow-600" />;
        return <Star className="text-slate-500" />;
    };

    return (
        <>
            <Helmet>
                <title>Leaderboard - CITIFIX</title>
                <meta name="description" content="See top contributors on CITIFIX." />
            </Helmet>
            <DashboardLayout>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Leaderboard</h1>
                    <p className="text-slate-300">Top citizens making a difference!</p>
                </div>
                
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
                    <ul className="space-y-4">
                        {users.map((user, index) => (
                            <li key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700 border border-slate-600">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold w-8 text-center text-slate-100">{index + 1}</span>
                                    {getRankIcon(index)}
                                    <span className="font-semibold text-slate-100">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-2 font-bold text-orange-500">
                                    <Award className="w-5 h-5"/>
                                    <span>{user.rewardPoints || 0} Points</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Leaderboard;
