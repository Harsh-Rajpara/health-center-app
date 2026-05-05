import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

function Admin() {
  return (
    <div>
      <Sidebar />
      <Topbar />
      <div className="p-4" style={{ marginLeft: '280px', marginTop: '70px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;