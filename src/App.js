// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./containers/user/Home";
import About from "./containers/user/About";
import Doctors from "./containers/user/Doctors";
import News from "./containers/user/News";
import Appointment from "./containers/user/Appointment";
import Contact from "./containers/user/Contact";
import Login from "./auth/Login";
import AdminPanel from "./containers/admin/AdminPanel";
import AdminLayout from "./containers/admin/AdminLayout";
import Dashboard from "./containers/admin/AdminDashboard";
import DoctorsList from "./containers/admin/DoctorList";
import AddDoctor from "./containers/admin/AddDoctor";
import AppointmentsAdmin from "./containers/admin/Appointments";
import NewsAdmin from "./containers/admin/NewsAdmin";
import Users from "./containers/admin/Users";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}

            <Route path="/" element={<><Header /><Home /></>} />
            <Route path="/about" element={<><Header /><About /></>} />
            <Route path="/doctors" element={<><Header /><Doctors /></>} />
            <Route path="/news" element={<><Header /><News /></>} />
            <Route path="/appointment" element={<><Header /><Appointment /></>} />
            <Route path="/contect" element={<><Header /><Contact /></>} />
            <Route path="/login" element={<><Header /><Login /></>} />

            {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="doctors/add" element={<AddDoctor />} />
            <Route path="doctors/edit/:id" element={<AddDoctor />} />
            {/* Appointment Routes */}
            <Route path="appointments" element={<AppointmentsAdmin />} />
            
            {/* Patient Routes */}
            <Route path="users" element={<Users />} />
            
            {/* News Routes */}
            <Route path="news" element={<NewsAdmin />} />
          </Route>

          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
