import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Icons
import { 
  RiShieldCheckLine, 
  RiTruckLine, 
  RiUserHeartLine, 
  RiCustomerService2Line, 
  RiRefund2Line, 
  RiGlobalLine,
  RiArrowRightLine
} from "react-icons/ri";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-500/5 -skew-x-12 transform translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-red-500 font-black uppercase text-xs tracking-widest bg-red-50 px-3 py-1 rounded-full">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mt-6 mb-8 tracking-tighter leading-tight">
              Revolutionizing the way you <span className="text-red-500">Shop Online.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
              Founded in 2024, CartApp started with a simple mission: to make premium 
              products accessible to everyone through a seamless, secure, and smart 
              digital marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR (Social Proof) */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem number="10K+" label="Active Users" />
            <StatItem number="500+" label="Verified Sellers" />
            <StatItem number="1M+" label="Products Sold" />
            <StatItem number="4.8" label="App Rating" />
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES (The Grid) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              Why Customers Choose Us
            </h2>
            <div className="h-1.5 w-20 bg-red-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<RiShieldCheckLine />} 
              title="Secure Shopping" 
              desc="Your data is protected by industry-leading 256-bit encryption and secure payment gateways."
            />
            <FeatureCard 
              icon={<RiTruckLine />} 
              title="Express Delivery" 
              desc="Our logistics network ensures your products reach your doorstep within 48 hours."
            />
            <FeatureCard 
              icon={<RiUserHeartLine />} 
              title="Customer First" 
              desc="Thousands of happy customers rely on us daily for their essential and luxury needs."
            />
            <FeatureCard 
              icon={<RiRefund2Line />} 
              title="Easy Returns" 
              desc="Not satisfied? Our hassle-free 7-day return policy has you covered with no questions asked."
            />
            <FeatureCard 
              icon={<RiCustomerService2Line />} 
              title="24/7 Support" 
              desc="Our dedicated support team is available around the clock to assist with your queries."
            />
            <FeatureCard 
              icon={<RiGlobalLine />} 
              title="Global Standards" 
              desc="We bring global quality standards to local shopping, ensuring authentic products every time."
            />
          </div>
        </div>
      </section>

      {/* 4. MISSION STATEMENT (Split Design) */}
      {/* <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tight italic text-red-500">
              Our Vision
            </h2>
            <p className="text-gray-400 text-lg leading-loose mb-8">
              To build India's most trusted e-commerce ecosystem that creates 
              life-changing experiences for buyers and sellers alike. We believe 
              in technology that empowers small businesses and delights modern 
              shoppers.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20 active:scale-95"
            >
              Start Shopping <RiArrowRightLine />
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="h-48 bg-red-500 rounded-3xl" />
            <div className="h-48 bg-gray-800 rounded-3xl mt-8" />
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatItem = ({ number, label }) => (
  <div className="text-center">
    <h3 className="text-3xl md:text-4xl font-black text-gray-900">{number}</h3>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-8 rounded-3xl border border-gray-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 bg-white">
    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default AboutPage;