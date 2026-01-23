import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  RiMailSendLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiCustomerService2Line,
  RiSendPlaneFill 
} from "react-icons/ri";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. HEADER SECTION */}
        <section className="bg-white border-b border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-red-500 font-black uppercase text-xs tracking-[0.2em] mb-4 block">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              WE'RE HERE TO <span className="text-red-500">HELP.</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              Have a question about a product, your order, or just want to say hi? 
              Choose your preferred way to get in touch.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* 2. LEFT: CONTACT INFO (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <ContactInfoCard 
                icon={<RiPhoneLine />} 
                title="Call Us Directly" 
                detail="+91 98765 43210" 
                sub="Mon-Sat, 9am - 6pm"
              />
              <ContactInfoCard 
                icon={<RiMailSendLine />} 
                title="Email Support" 
                detail="support@cartapp.com" 
                sub="Average response: 24h"
              />
              <ContactInfoCard 
                icon={<RiMapPinLine />} 
                title="Headquarters" 
                detail="123 Business Hub, Surat, Gujarat" 
                sub="India - 395001"
              />

              {/* Decorative Support Banner */}
              <div className="bg-red-500 rounded-3xl p-8 text-white relative overflow-hidden group">
                <RiCustomerService2Line className="absolute -right-4 -bottom-4 text-white/10 text-9xl transition-transform group-hover:scale-110 duration-500" />
                <h3 className="text-xl font-black mb-2 relative z-10">Live Chat Support</h3>
                <p className="text-red-100 text-sm mb-6 relative z-10">Our agents are online to help you with instant queries.</p>
                <button className="bg-white text-red-500 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest relative z-10 hover:bg-gray-100 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>

            {/* 3. RIGHT: CONTACT FORM (7 Columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight uppercase">Send a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                  <select className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium appearance-none">
                    <option>Order Status</option>
                    <option>Product Question</option>
                    <option>Payment Issue</option>
                    <option>Seller Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={5} 
                    placeholder="Describe your issue in detail..." 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium resize-none"
                  />
                </div>

                <button className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3">
                  Send Message <RiSendPlaneFill size={18} />
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* 4. MAP (Full Width Modern) */}
        <section className="h-[400px] w-full bg-gray-200 grayscale contrast-125 opacity-70">
           <iframe
            title="map"
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=Surat,Gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* --- UI HELPERS --- */

const ContactInfoCard = ({ icon, title, detail, sub }) => (
  <div className="flex gap-5 p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-lg font-black text-gray-900 leading-none mb-1">{detail}</p>
      <p className="text-xs text-gray-500 font-medium">{sub}</p>
    </div>
  </div>
);

export default ContactPage;