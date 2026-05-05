// src/components/AppointmentSection.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useFormik } from "formik";
import * as Yup from "yup";

const Appointment = () => {
  const [departments, setDepartments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "appointmentConfig"));
        if (snap.exists()) {
          const data = snap.data();
          setDepartments(data.departments || []);
          setTimeSlots(data.timeSlots || []);
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
  }, []);

  const validationSchema = Yup.object({
    fullName: Yup.string().min(3, "Too short").required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Enter valid 10-digit number").required("Phone required"),
    date: Yup.date().min(new Date(), "Cannot select past date").required("Date required"),
    department: Yup.string().required("Select department"),
    time: Yup.string().required("Select time"),
  });

  const formik = useFormik({
    initialValues: { fullName: "", email: "", phone: "", date: "", time: "", department: "", message: "" },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addDoc(collection(db, "appointments"), {
          ...values,
          status: "pending",
          createdAt: Timestamp.now(),
        });
        alert("Appointment booked successfully ✅");
        resetForm();
      } catch (err) {
        console.error(err);
        alert("Error booking appointment ❌");
      }
    },
  });

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm font-medium text-gray-800 bg-white outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Book an Appointment
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">Book your visit with our expert doctors in minutes</p>
          <div className="w-12 h-1 bg-teal-600 mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden ">
              <img
                src="images/appointment-image.png"
                alt="Appointment"
                className="w-full h-[500px] object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-teal-600 rounded-xl -z-10" />
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-teal-100 rounded-xl -z-10" />
            {/* <div className="absolute top-6 -left-5 bg-teal-600 text-white rounded-xl px-4 py-3 shadow-lg shadow-teal-700/30 text-center">
              <p className="text-2xl font-bold leading-none">500+</p>
              <p className="text-xs font-medium opacity-90 mt-1">Appointments/mo</p>
            </div> */}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input type="text" name="fullName" placeholder="Your full name" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("fullName")} />
                  {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" name="email" placeholder="you@email.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("email")} />
                  {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="tel" name="phone" placeholder="10-digit number" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("phone")} />
                  {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Date</label>
                  <input type="date" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("date")} />
                  {formik.touched.date && formik.errors.date && <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Department</label>
                  <select name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("department") + " appearance-none cursor-pointer"}>
                    <option value="">Select Department</option>
                    {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
                  </select>
                  {formik.touched.department && formik.errors.department && <p className="text-red-500 text-sm mt-1">{formik.errors.department}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Time Slot</label>
                  <select name="time" value={formik.values.time} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("time") + " appearance-none cursor-pointer"}>
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                  {formik.touched.time && formik.errors.time && <p className="text-red-500 text-sm mt-1">{formik.errors.time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Message (Optional)</label>
                <textarea name="message" rows={3} placeholder="Any special notes or concerns..." value={formik.values.message} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full px-4 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-sm text-gray-800  outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none transition-all duration-200" />
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5 mt-1"
              >
                {formik.isSubmitting ? "Booking…" : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appointment;