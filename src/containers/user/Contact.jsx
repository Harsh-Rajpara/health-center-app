// src/components/ContactSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* Contact Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 pb-3 border-b-2 border-teal-500 inline-block mb-5">
              Contact Info
            </h3>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Our dedicated team is available 24/7 to assist you with your healthcare needs.
              Reach out anytime for appointments or emergencies.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 text-base">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-base">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                healthcenter@info.com
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 pb-3 border-b-2 border-teal-500 inline-block mb-5">
              Opening Hours
            </h3>
            <div className="space-y-1">
              {[
                { day: "Monday – Friday", time: "09:00 AM – 10:00 PM", closed: false },
                { day: "Saturday", time: "09:00 AM – 08:00 PM", closed: false },
                { day: "Sunday", time: "Closed", closed: true },
              ].map(({ day, time, closed }) => (
                <div key={day} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-base">{day}</span>
                  <span className={`text-base font-semibold ${closed ? "text-red-500" : "text-gray-800"}`}>
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Copyright © 2025 HealthCenter | Design: Tooplate
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            {["Laboratory Tests", "Departments", "Insurance Policy", "Careers"].map((item, i, arr) => (
              <React.Fragment key={item}>
                <Link to="/" className="text-gray-500 hover:text-teal-600 text-sm transition-colors">
                  {item}
                </Link>
                {i < arr.length - 1 && <span className="text-gray-300 text-xs">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;