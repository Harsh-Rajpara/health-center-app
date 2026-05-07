import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "doctors"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const random = list.sort(() => 0.5 - Math.random()).slice(0, 4);
        setDoctors(random);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Our Doctors
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              <div className="h-64 bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden">
                <img
                  src={doctor.img}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-xl mb-0.5">
                  Dr. {doctor.name}
                </h3>
                <p className="text-teal-600 text-base font-medium mb-3">
                  {doctor.specialization}
                </p>
                
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold text-base shadow-md shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            View All Doctors
           
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;