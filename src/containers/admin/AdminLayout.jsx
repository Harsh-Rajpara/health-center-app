// // src/layouts/AdminLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

// const AdminLayout = () => {
//   return (
//     <div className="flex h-screen bg-teal-50/40 overflow-hidden">
//       <Sidebar />
//       <div className="flex flex-col flex-1 min-w-0">
//         <main className="flex-1 overflow-y-auto  p-7">
//           <div className="max-w-8xl mx-auto space-y-7">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;