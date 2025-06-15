import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { CursorGlow } from '@/components/CursorGlow';
import { InteractiveCard } from '@/components/InteractiveCard';
import { 
  Kanban, 
  Calendar, 
  FileText, 
  Link, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import Logo from '@/components/Logo';
import LandingNavbar from '@/components/LandingNavbar';
import { SparklesCore } from '@/components/ui/sparkles';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing = ({ onGetStarted }: LandingProps) => {
  const features = [
    {
      icon: Kanban,
      title: "Kanban Boards",
      description: "Organize your tasks with intuitive drag-and-drop boards"
    },
    {
      icon: Calendar,
      title: "Calendar View",
      description: "Track deadlines and milestones with integrated calendar"
    },
    {
      icon: FileText,
      title: "Project Notes",
      description: "Keep all your project documentation in one place"
    },
    {
      icon: Link,
      title: "Quick Links",
      description: "Access important resources and links instantly"
    }
  ];

  const benefits = [
    "100% Free to use",
    "No credit card required",
    "Unlimited projects",
    "Real-time collaboration",
    "Mobile responsive",
    "Dark mode interface"
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Navbar */}
      <LandingNavbar />

      {/* HERO SECTION WITH SPARKLES EFFECT */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Sparkles background effect */}
        <div className="absolute inset-0 h-full w-full pointer-events-none z-0">
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={80}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={1}
          />
          {/* subtle radial gradient for edge fade */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(600px_300px_at_top,transparent_20%,white)]"></div>
        </div>
        <div className="container mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex flex-col items-center"
          >
            <Logo className="h-20 mb-4" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Agile<span className="text-white">/</span>Anchor
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate project management platform that keeps your team anchored to success. 
              Organize, collaborate, and deliver with precision.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold text-yellow-500">100% Free Forever</span>
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <InteractiveCard className="p-6 h-full">
                  <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why choose
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> AgileAnchor?</span>
              </h2>
            </motion.div>

            <InteractiveCard className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center">
                    <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                    Free & Powerful
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                  >
                    <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Secure & Reliable</h4>
                    <p className="text-gray-300">Your data is protected with enterprise-grade security</p>
                  </motion.div>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who trust AgileAnchor to manage their projects efficiently.
            </p>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Start Your Free Journey
              <Users className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 relative z-10">
        <div className="container mx-auto text-center flex flex-col items-center gap-2">
          <Logo className="h-8 mb-1" />
          <p className="text-gray-400">
            Made with vibe coding by Neel R⚡
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
