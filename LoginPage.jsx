
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getUsers } from '@/utils/storage';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const logoUrl = "https://horizons-cdn.hostinger.com/a6afdcf9-aaa7-4281-ba79-be0f31c772d0/384adb0a13bc13709264589f14f2ae52.jpg";

  const [formData, setFormData] = useState({
    aadhaar: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = getUsers();
    const user = users.find(u => u.aadhaar === formData.aadhaar && u.password === formData.password);
    
    if (user) {
      login(user);
      toast({
        title: "Welcome back! 🎉",
        description: `Logged in as ${user.name}`
      });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid Aadhaar or password",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - CITIFIX</title>
        <meta name="description" content="Login to your CITIFIX account to report issues and track resolutions." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-slate-300 hover:bg-slate-700"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
            <div className="flex items-center justify-center gap-2 mb-8">
              <img src={logoUrl} alt="CITIFIX Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold text-slate-100">CITIFIX</span>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-blue-800">Welcome Back</h2>
            <p className="text-slate-300 text-center mb-8">Login to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="aadhaar" className="text-slate-100">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  required
                  maxLength={12}
                  className="bg-slate-700 text-slate-100 border-slate-600 placeholder:text-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-100">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-slate-700 text-slate-100 border-slate-600 placeholder:text-slate-400"
                />
              </div>

              <Button type="submit" className="w-full gradient-saffron text-white">
                Login
              </Button>
            </form>

            <p className="text-center mt-6 text-slate-300">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-orange-500 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
