import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Award, Users, TrendingUp, Flag, Shield } from 'lucide-react';
const LandingPage = () => {
  const navigate = useNavigate();
  const logoUrl = "https://horizons-cdn.hostinger.com/a6afdcf9-aaa7-4281-ba79-be0f31c772d0/384adb0a13bc13709264589f14f2ae52.jpg";
  const features = [{
    icon: MapPin,
    title: 'Live Location',
    desc: 'GPS-based issue reporting'
  }, {
    icon: Award,
    title: 'Reward Points',
    desc: 'Earn for resolved issues'
  }, {
    icon: Users,
    title: 'Community Voting',
    desc: 'Vote on important issues'
  }, {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    desc: 'Track issue trends'
  }, {
    icon: Flag,
    title: 'Auto-Tweet',
    desc: 'Viral issues get tweeted'
  }, {
    icon: Shield,
    title: 'Aadhaar Verified',
    desc: 'Secure authentication'
  }];
  return <>
      <Helmet>
        <title>CITIFIX - Report Civic Issues & Earn Rewards</title>
        <meta name="description" content="AI-powered civic issue reporting platform. Report potholes, garbage, broken streetlights, and more. Earn rewards for making your city better." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="fixed top-0 w-full bg-slate-800/80 backdrop-blur-md z-50 border-b border-slate-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="flex items-center gap-2">
              <img src={logoUrl} alt="CITIFIX Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold text-slate-100">CITIFIX </span>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="flex gap-3">
              <Button variant="outline" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600" onClick={() => navigate('/login')}>
                Citizen Login
              </Button>
              <Button variant="outline" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600" onClick={() => navigate('/login')}>
                Admin Login
              </Button>
              <Button className="gradient-saffron text-white" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </motion.div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Your Voice,<br />
                <span className="text-gradient">Your City</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">AI-powered civic issue reporting platform. Report potholes, garbage, broken streetlights, and more. Earn rewards for making your city better.</p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" className="gradient-saffron text-white text-lg px-8" onClick={() => navigate('/register')}>
                  Start Reporting
                </Button>
                <Button size="lg" variant="outline" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600" onClick={() => navigate('/community')}>
                  View Community Issues
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.3,
            duration: 0.6
          }} className="mt-16">
              <img class="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full" alt="CITIFIX platform dashboard showing civic issues" src="https://horizons-cdn.hostinger.com/a6afdcf9-aaa7-4281-ba79-be0f31c772d0/crowdsourced-civic-issue-reporting-and-resolution-system-S1IlK.png" />
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-4">
            <motion.h2 initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} className="text-4xl font-bold text-center mb-16 text-slate-100">
              Powerful Features
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="p-6 rounded-xl bg-slate-700 card-hover border border-slate-600">
                  <feature.icon className="w-12 h-12 text-orange-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-300">{feature.desc}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        <section className="py-20 gradient-deep-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-4xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
              <p className="text-xl mb-8 opacity-90 text-slate-100">
                Join thousands of citizens making their cities better
              </p>
              <Button size="lg" className="bg-white text-blue-800 hover:bg-slate-100 text-lg px-8" onClick={() => navigate('/register')}>
                Join CITIFIX Now
              </Button>
            </motion.div>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={logoUrl} alt="CITIFIX Logo" className="w-8 h-8 rounded" />
              <span className="text-xl font-bold text-slate-100">CITIFIX</span>
            </div>
            <p className="text-slate-500">
              © 2025 CITIFIX. Building better communities together.
            </p>
          </div>
        </footer>
      </div>
    </>;
};
export default LandingPage;