import DashboardHome from "../../components/admin/DashboardHome";
import AllEvents from "../../components/admin/AllEvents";
;
import UserList from "../../components/admin/UserList";
import OrganizerList from "../../components/admin/OrganizerList";
import { Navigate, Route, Routes } from "react-router-dom";

import EventApproval from "./EventApproval";
import AdminSidebar from "./AdminSidebar";

import AdminPaymentHistory from "./AdminPaymentHistory";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Routes>
          <Route path="home" element={<DashboardHome />} />
          <Route path="events/all" element={<AllEvents />} />
          <Route path="events/approved" element={<EventApproval />} />
          <Route path="payments" element={<AdminPaymentHistory/>} />

          <Route path="users" element={<UserList />} />
          <Route path="organizers" element={<OrganizerList />} />
          <Route index element={<Navigate to="home" />} />
        </Routes>
      </main>
    </div>
  );
}
