import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Brain, Target, TrendingUp } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col gap-20">
            {/* Hero Section */}
            <section className="text-center py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Elevate Your <span className="text-indigo-600">Placement</span> Readiness
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        An intelligent system that predicts your placement probability, 
                        analyzes skill gaps, and provides actionable suggestions to land your dream job.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2 shadow-lg shadow-indigo-200">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="px-8 py-3 text-lg font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: "AI Prediction",
                        desc: "Get real-time probability scores for various companies based on your unique profile.",
                        icon: <Brain className="w-10 h-10 text-indigo-600" />
                    },
                    {
                        title: "Skill Gap Analysis",
                        desc: "Identify exactly where you fall short and what you need to improve to meet requirements.",
                        icon: <Target className="w-10 h-10 text-indigo-600" />
                    },
                    {
                        title: "Career Growth",
                        desc: "Receive personalized improvement suggestions to enhance your coding and communication skills.",
                        icon: <TrendingUp className="w-10 h-10 text-indigo-600" />
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">
                        Join hundreds of students who are already using PlaceSense to track their progress and improve their readiness.
                    </p>
                    <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-xl">
                        Create Your Profile
                    </Link>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
            </section>
        </div>
    );
};

export default LandingPage;
