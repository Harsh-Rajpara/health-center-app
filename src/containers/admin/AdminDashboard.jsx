import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config"; // Adjust path as needed
import { collection, getDocs, Timestamp } from "firebase/firestore";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Doctors", value: "0", accent: "bg-teal-500" },
    { title: "Total Appointments", value: "0", accent: "bg-teal-500" },
    { title: "Pending Approvals", value: "0", accent: "bg-teal-500" },
  ]);
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

 

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching data from Firebase...");
        
        // Get ALL collections
        const doctorsRef = collection(db, "doctors");
        const appointmentsRef = collection(db, "appointments");
        const usersRef = collection(db, "users");
        
        // Get ALL documents
        const doctorsSnapshot = await getDocs(doctorsRef);
        const appointmentsSnapshot = await getDocs(appointmentsRef);
        const usersSnapshot = await getDocs(usersRef);
        
        console.log("Doctors count:", doctorsSnapshot.size);
        console.log("Appointments count:", appointmentsSnapshot.size);
        console.log("Users count:", usersSnapshot.size);
        
        // Process appointments data
        let pendingCount = 0;
        const appointmentsList = [];
        
        appointmentsSnapshot.forEach(doc => {
          const data = doc.data();
          console.log("Appointment data:", data);
          
          // Count pending appointments
          if (data.status === "pending") {
            pendingCount++;
          }
          
          appointmentsList.push({ id: doc.id, ...data });
        });
        
        console.log("Pending appointments count:", pendingCount);
        
        // Sort appointments by date (newest first) and take ONLY LAST 4
        const sortedAppointments = appointmentsList.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        }).slice(0, 4);
        
        // Format appointments data
        const formattedAppointments = sortedAppointments.map(apt => ({
          id: apt.id,
          name: apt.fullName || "Unknown Patient",
          initials: getInitials(apt.fullName),
          doctor: apt.doctorName || "Unknown Doctor",
          dept: apt.department || "General",
          date: formatDate(apt.date),
          time: apt.time || "N/A",
          status: apt.status || "pending",
          email: apt.email,
          phone: apt.phone,
          message: apt.message
        }));
        
        console.log("Formatted appointments (last 4):", formattedAppointments);
        
        // Process users data
        const usersList = [];
        usersSnapshot.forEach(doc => {
          const data = doc.data();
          console.log("User data:", data);
          console.log("User createdAt field:", data.createdAt);
          
          usersList.push({ 
            id: doc.id, 
            ...data,
            // If no createdAt, use current date or a default
            sortDate: data.createdAt || data.registeredAt || data.joinDate || new Date()
          });
        });
        
        // Sort by date (newest first) - handle different date formats
        const sortedUsers = usersList.sort((a, b) => {
          let dateA, dateB;
          
          // Handle different date formats for user A
          if (a.createdAt instanceof Timestamp) {
            dateA = a.createdAt.toDate();
          } else if (a.createdAt) {
            dateA = new Date(a.createdAt);
          } else if (a.sortDate instanceof Timestamp) {
            dateA = a.sortDate.toDate();
          } else {
            dateA = new Date(0); // Very old date if no date field
          }
          
          // Handle different date formats for user B
          if (b.createdAt instanceof Timestamp) {
            dateB = b.createdAt.toDate();
          } else if (b.createdAt) {
            dateB = new Date(b.createdAt);
          } else if (b.sortDate instanceof Timestamp) {
            dateB = b.sortDate.toDate();
          } else {
            dateB = new Date(0);
          }
          
          return dateB - dateA;
        }).slice(0, 6);
        
        // Format users data
        const formattedUsers = sortedUsers.map(user => {
          // Get the registration date in a readable format
          let registrationDate = "N/A";
          
          if (user.createdAt instanceof Timestamp) {
            registrationDate = user.createdAt.toDate().toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric",
              year: "numeric"
            });
          } else if (user.createdAt) {
            registrationDate = formatDate(user.createdAt);
          } else if (user.date) {
            registrationDate = formatDate(user.date);
          } else {
            // If no date field found, show a message
            registrationDate = "Date unknown";
          }
          
          return {
            id: user.id,
            name: user.fullName || user.name || "Unknown User",
            initials: getInitials(user.fullName || user.name),
            email: user.email,
            phone: user.phone,
            date: registrationDate,
            rawDate: user.createdAt // Keep for debugging
          };
        });
        
        console.log("Formatted users (last 6):", formattedUsers);
        
        // Update stats
        setStats([
          { title: "Total Doctors", value: doctorsSnapshot.size.toString(), accent: "bg-teal-500" },
          { title: "Total Appointments", value: appointmentsSnapshot.size.toString(), accent: "bg-teal-500" },
          { title: "Pending Approvals", value: pendingCount.toString(), accent: "bg-teal-500" },
        ]);
        
        setAppointments(formattedAppointments);
        setPatients(formattedUsers);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert(`Error loading data: ${error.message}. Check console for details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatusBadge = ({ status }) => {
    const statusLower = (status || "").toLowerCase();
    if ( statusLower === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          Approved
        </span>
      );
    }
    if (statusLower === "cancelled" || statusLower === "canceled") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-7 space-y-6 min-h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gray-200" />
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-1 ${s.accent}`} />
            <div className="p-5">
              <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Appointments Table - Last 4 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Recent Appointments</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {appointments.length > 0 ? (
              appointments.map((apt, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/70 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {apt.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{apt.name}</p>
                    <p className="text-xs text-gray-500 truncate">{apt.dept}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-700 mb-1">{apt.date}</p>
                    <p className="text-xs text-gray-500 mb-1">{apt.time}</p>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No appointments found
              </div>
            )}
          </div>
        </div>

        {/* Recent Users Table - Last 6 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Recent Users</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {patients.length > 0 ? (
              patients.map((user, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/70 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{user.name}</p>
                    {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500">{user.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 