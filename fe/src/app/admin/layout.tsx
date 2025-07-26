import Sidebar from "./SideBar";
export default function AdminLayOut({children}: {children: React.ReactNode}) {
  return (
    <>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
       
        <div className="bg-white shadow rounded-lg p-6">
          {children}
        </div>
      </main>
      </div>
    </>
  );
}