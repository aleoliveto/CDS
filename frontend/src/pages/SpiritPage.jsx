// Tailwind-based SpiritPage.jsx
import React from 'react';

const SpiritPage = () => {
  const priorities = [
    'Building Europe’s best network',
    'Transforming revenue',
    'Delivering ease and reliability',
    'Driving our low-cost model'
  ];

  const values = [
    { label: 'BE SAFE', desc: 'Always with safety at our heart' },
    { label: 'BE CHALLENGING', desc: 'Always challenging cost' },
    { label: 'BE BOLD', desc: 'Making a positive difference' },
    { label: 'BE WELCOMING', desc: 'Always warm and welcoming' }
  ];

  return (
    <div className="max-w-screen-xl mx-auto my-6 border-8 border-orange-500 bg-white shadow-xl">
      <div className="flex flex-row p-6">
        {/* PURPOSE triangle */}
        <div className="relative w-64 min-w-[250px]">
          <div className="arrow-shape">
            <h2 className="text-white font-bold text-xl mb-2">PURPOSE</h2>
            <p className="text-white font-semibold text-lg leading-snug">
              Making low-cost<br />travel easy
            </p>
          </div>
        </div>

        {/* PRIORITIES */}
        <div className="flex-1 px-6">
          <h2 className="text-orange-500 font-bold text-2xl mb-4 text-center">PRIORITIES</h2>
          <div className="flex flex-col gap-6">
            {priorities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center priority-row"
              >
                <div className="w-3 h-3 border-2 border-orange-500 rounded-full mr-2" />
                <div className="flex-1 priority-dotted-line mr-3" />
                <div className="w-11 h-11 border-4 border-orange-500 rounded-full flex items-center justify-center bg-white plane-icon mr-3">
                  <img
                    src="https://img.icons8.com/ios-filled/50/ff6600/airplane-take-off.png"
                    alt="Plane"
                    className="w-5 h-5"
                  />
                </div>
                <div className="font-bold text-gray-800 whitespace-nowrap">{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DESTINATION */}
        <div className="w-64 text-center">
          <h2 className="text-orange-500 font-bold text-2xl mb-4">DESTINATION</h2>
          <div className="w-52 h-52 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm px-4 leading-relaxed mx-auto">
            Europe’s most loved airline — winning for our customers,<br />shareholders and people.
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-100 px-6 py-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>Made possible by our people</span>
          <h2 className="text-orange-500 font-bold text-xl">BE ORANGE</h2>
          <span>Being true to our promises</span>
        </div>
        <div className="text-center mb-6">
          <div className="inline-block border-2 border-orange-500 px-4 py-2 text-sm text-gray-500 font-semibold">
            Living the Orange Spirit
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="border-2 border-orange-500 text-center p-4 value-box"
            >
              <h3 className="text-orange-500 font-bold text-sm mb-1">{val.label}</h3>
              <p className="text-sm text-gray-700">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritPage;
