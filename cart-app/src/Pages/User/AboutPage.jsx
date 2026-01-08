import React from "react";
import Navbar from "../../components/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar />

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">
              About Our Store
            </h1>
            <p className="lg:w-2/3 text-gray-500">
              We are a modern ecommerce platform focused on delivering quality
              products, smooth shopping experience, and reliable customer
              support.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap -m-4">
            {/* Feature Card */}
            {[
              {
                title: "Fast & Secure Checkout",
                desc: "Experience smooth and secure payments with trusted gateways.",
                icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
              },
              {
                title: "Wide Product Range",
                desc: "From daily essentials to premium products, we’ve got you covered.",
                icon: (
                  <>
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
                  </>
                ),
              },
              {
                title: "Trusted by Customers",
                desc: "Thousands of happy customers shop with us every month.",
                icon: (
                  <>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                ),
              },
              {
                title: "Easy Returns",
                desc: "Hassle-free returns and refunds on eligible products.",
                icon: <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3" />,
              },
              {
                title: "24/7 Support",
                desc: "Our support team is always ready to help you.",
                icon: <path d="M21 12.79A9 9 0 1111.21 3" />,
              },
              {
                title: "Secure Shopping",
                desc: "Your data and transactions are always protected.",
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              },
            ].map((item, i) => (
              <div key={i} className="xl:w-1/3 md:w-1/2 p-4">
                <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <h2 className="text-lg text-gray-900 font-medium mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="flex mx-auto mt-14 bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition">
            Start Shopping
          </button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
