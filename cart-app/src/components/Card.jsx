import React from "react";

const Card = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-20 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-4 w-full border-2 border-gray-200 rounded"
              >
                <a className="block relative h-48 rounded overflow-hidden">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s"
                    alt="product"
                    className="object-cover object-center w-full h-full block"
                  />
                </a>

                <div className="mt-4">
                  <h3 className="text-gray-500 text-xs tracking-widest mb-1">
                    CATEGORY
                  </h3>
                  <h2 className="text-gray-900 text-lg font-medium">Shoes</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-medium text-gray-500">₹16,000</p>

                    <button className="inline-flex items-center font-semibold bg-gray-100 text-base py-1.5 px-4 rounded hover:bg-gray-200 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Card;
