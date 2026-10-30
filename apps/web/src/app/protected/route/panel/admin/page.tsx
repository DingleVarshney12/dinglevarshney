import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return <AdminDashboard email={adminEmail ?? ""} />;
}
