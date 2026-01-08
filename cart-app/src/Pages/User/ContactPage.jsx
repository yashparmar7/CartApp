import React from "react";
import Navbar from "../../components/Navbar";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <section className="text-gray-600 body-font relative">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gray-300">
          <iframe
            title="map"
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Surat+(My%20Store)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
            style={{
              filter: "grayscale(1) contrast(1.2) opacity(0.4)",
            }}
          />
        </div>

        {/* Contact Card */}
        <div className="container px-5 py-14 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white rounded-xl p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-xl">
            <h2 className="text-gray-900 text-2xl font-semibold mb-1">
              Contact Support
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600">
              Have a question about your order or product? We’re here to help.
            </p>

            {/* Name */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none py-2 px-4"
              />
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="abc@example.com"
                className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none py-2 px-4"
              />
            </div>

            {/* Message */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Message</label>
              <textarea
                placeholder="Write your message here..."
                className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-20 outline-none py-2 px-4 resize-none"
              />
            </div>

            {/* CTA */}
            <button className="bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition">
              Send Message
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Our support team usually replies within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
