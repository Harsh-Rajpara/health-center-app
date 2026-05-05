// // src/containers/admin/Users.jsx - COMPLETELY FIXED VERSION
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../../redux/slices/userSlice";
// import { 
//   Users as UsersIcon,
//   Mail, 
//   Phone, 
//   Calendar,
//   Activity,
//   Search
// } from "lucide-react";

// function Users() {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => {
//     console.log('Current state:', state);
//     return state.users || { users: [], loading: false, error: null };
//   });
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     console.log('Dispatching fetchUsers...');
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const usersArray = Array.isArray(users) ? users : [];
  
//   const filteredUsers = usersArray.filter(user =>
//     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-lg">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 p-8">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-4xl font-bold text-teal-900 tracking-tight">
//             User Management
//           </h1>
//           <p className="text-teal-500 text-base mt-1">
//             View and manage all registered users
//           </p>
//         </div>
//         <div className="flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-teal-200">
//           <UsersIcon size={16} />
//           <span>Total: {usersArray.length} Users</span>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-lg">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-14 pr-4 py-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//         />
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-lg">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-teal-50/50 to-white border-b border-teal-100">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wide">
//                   Uid
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wide">
//                   Name
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wide">
//                   Email
//                 </th>
               
                
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wide">
//                   Joined
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-teal-50">
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <UsersIcon className="w-16 h-16 text-teal-200 mb-4" />
//                       <p className="text-teal-500 text-lg font-medium">No users found</p>
//                       <p className="text-teal-400 text-sm mt-1">Try adjusting your search</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user, index) => (
//                   <tr key={user.id || index} className="hover:bg-teal-50/30 transition-all duration-200 group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
                       
//                         <div>
                       
//                           <p className="font-semibold text-teal-900">
//                           {user.id?.slice(0, 8) || `PAT${index + 1}`}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
                       
//                         <div>
//                           <p className="font-semibold text-teal-900">
//                             {user.name || user.name || "N/A"}
//                           </p>
                        
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Mail className="w-4 h-4 text-teal-400" />
//                           <span className="text-teal-700 text-sm">{user.email}</span>
//                         </div>
                        
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4 text-teal-400" />
//                         <span className="text-teal-700 text-sm">
//                           {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer Stats */}
//       {filteredUsers.length > 0 && searchTerm && (
//         <div className="flex items-center justify-between pt-4">
//           <p className="text-sm text-teal-500">
//             Showing {filteredUsers.length} of {usersArray.length} users
//           </p>
//           <button
//             onClick={() => setSearchTerm('')}
//             className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
//           >
//             Clear Search
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Users;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";

function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(s => s.users || { users: [], loading: false, error: null });
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const usersArray = Array.isArray(users) ? users : [];
  const filtered = usersArray.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="m-7 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
  );

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">{usersArray.length} registered users</p>
        </div>
        
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["id", "User", "Email", "Joined"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No users found</p>
                    <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              ) : filtered.map((user, i) => {
                const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
                const colors = ['bg-teal-100 text-teal-700'];
                const color = colors[i % colors.length];
                return (
                  <tr key={user.id || i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                      {user.id?.slice(0, 8) || `#${String(i + 1).padStart(4, '0')}`}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
                          {initials}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{user.name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && search && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">Showing {filtered.length} of {usersArray.length} users</p>
            <button onClick={() => setSearch('')} className="text-xs text-teal-600 font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;