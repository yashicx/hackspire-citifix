
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getComplaints, voteComplaint } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MapPin, Tag, Calendar, TrendingUp, Flame as Fire, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const CommunityPortal = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('Most Voted');
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const allComplaints = getComplaints();
        const sorted = sortComplaints(allComplaints, filter);
        setComplaints(sorted);
    }, [filter]);
    
    const sortComplaints = (complaints, filter) => {
        switch (filter) {
            case 'Most Voted':
                return [...complaints].sort((a, b) => b.votes - a.votes);
            case 'Most Recent':
                return [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return complaints;
        }
    };

    const handleVote = (id) => {
        if (!user) {
            toast({ title: 'Please login to vote', variant: 'destructive' });
            return;
        }
        const result = voteComplaint(id, user.id);
        if (result && !result.error) {
            toast({ title: 'Vote counted!', description: 'Thank you for your feedback.' });
            const updatedComplaints = getComplaints();
            setComplaints(sortComplaints(updatedComplaints, filter));
        } else if (result.error) {
            toast({ title: result.error, variant: 'destructive' });
        }
    };

    return (
        <>
            <Helmet>
                <title>Community Portal - CITIFIX</title>
                <meta name="description" content="View and vote on issues reported by the community." />
            </Helmet>
            <div className="container mx-auto px-4 py-8">
                 <Button
                  variant="ghost"
                  className="mb-4 text-slate-300 hover:bg-slate-700"
                  onClick={() => navigate(user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <h1 className="text-4xl font-bold text-center mb-4">Community Portal</h1>
                <p className="text-slate-300 text-center mb-8">See what's happening in your city. Your vote matters!</p>

                <div className="flex justify-center gap-2 mb-8">
                    {['Most Voted', 'Most Recent'].map(f => (
                        <Button key={f} variant={filter === f ? 'default' : 'outline'} className={filter === f ? 'gradient-saffron text-white' : 'bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600'} onClick={() => setFilter(f)}>
                            {f}
                        </Button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {complaints.map((c, i) => (
                            <motion.div
                                key={c.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-lg overflow-hidden card-hover border border-slate-700"
                            >
                                <img src={c.image || 'https://via.placeholder.com/400x250?text=No+Image'} alt={c.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                                        {c.votes > 20 && <span className="bg-red-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Fire className="w-3 h-3"/> Trending</span>}
                                        {c.tweetPosted && <span className="bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Zap className="w-3 h-3"/> Tweeted</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                        <Tag className="w-4 h-4 text-green-500" />
                                        <span>{c.category}</span>
                                    </div>
                                    <p className="text-slate-300 mb-4 h-12 overflow-hidden">{c.description}</p>
                                    
                                    <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <ThumbsUp className="w-5 h-5 text-slate-400" />
                                            <span className="font-bold text-lg">{c.votes}</span>
                                        </div>
                                        <Button onClick={() => handleVote(c.id)} disabled={user && c.votedBy.includes(user.id)} className="gradient-saffron">
                                            <ThumbsUp className="mr-2 h-4 w-4" /> {user && c.votedBy.includes(user.id) ? 'Voted' : 'Upvote'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default CommunityPortal;
