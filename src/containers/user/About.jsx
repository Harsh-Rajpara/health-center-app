// src/components/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const features = [
    "24/7 Emergency Care",
    "Expert Doctors",
    "Modern Equipment",
    "Affordable Care",
  ];
    return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Content */}
          <div>
            

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Welcome to Your{" "}
              <span className="text-teal-600">Health Center</span>
            </h2>

            <p className="text-gray-500 leading-relaxed mb-4 text-sm sm:text-base">
              Welcome to HealthCenter, where your well-being is our foremost priority.
              We provide comprehensive healthcare services with a focus on personalized
              patient care and medical excellence.
            </p>
            <p className="text-gray-500 leading-relaxed mb-7 text-sm sm:text-base">
              Our team of experienced doctors, nurses, and medical staff work tirelessly
              to provide compassionate care in a comfortable environment — because quality
              healthcare should be accessible to everyone.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            {/* Doctor signature */}
            <div className="border-t border-gray-100 pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">Dr</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Dr. Henil Patel</p>
                <p className="text-teal-600 text-sm font-medium">General Principal</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden ">
              <img
                src="images/Doctor_about.png"
                alt="Doctor consulting with patient"
                className="w-full h-[420px] md:h-[480px] object-cover object-top"
              />
            </div>
            {/* Decorative blocks */}
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-teal-600 rounded-xl -z-10" />
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-teal-100 rounded-xl -z-10" />
            {/* Stat card */}
            {/* <div className="absolute bottom-6 -right-4 bg-white rounded-xl shadow-xl px-4 py-3 hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-none">10k+</p>
                <p className="text-gray-500 text-xs mt-0.5">Happy Patients</p>
              </div>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;