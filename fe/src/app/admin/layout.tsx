import Sidebar from './SideBar';
import AdminHeader from './AdminHeader';
import AdminGate from "./AdminGate";
export default function AdminLayOut({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AdminGate>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 flex flex-col min-h-screen bg-white shadow">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto bg-gray-300">{children}</div>
        </main>
      </div>
      </AdminGate>;   
    </>
  );
}
