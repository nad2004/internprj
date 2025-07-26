

const dashboardStats = [
  { label: 'Total Books', value: '1,250' },
  { label: 'Total Users', value: '500' },
  { label: 'Recent Borrowings', value: '25' },
];

const recentActivities = [
  {
    title: 'The Secret Garden',
    user: 'Alice Johnson',
    borrowDate: '2024-07-15',
    returnDate: '2024-07-29',
  },
  {
    title: 'Pride and Prejudice',
    user: 'Bob Williams',
    borrowDate: '2024-07-16',
    returnDate: '2024-07-30',
  },
  {
    title: 'To Kill a Mockingbird',
    user: 'Charlie Davis',
    borrowDate: '2024-07-17',
    returnDate: '2024-07-31',
  },
  {
    title: '1984',
    user: 'Diana Evans',
    borrowDate: '2024-07-18',
    returnDate: '2024-08-01',
  },
  {
    title: 'The Great Gatsby',
    user: 'Ethan Brown',
    borrowDate: '2024-07-19',
    returnDate: '2024-08-02',
  },
];

export default function Dashboard() {
  return (
        <>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Overview of library operations</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {dashboardStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-md shadow-sm border p-4 text-center"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Borrow Date</th>
                  <th className="px-4 py-2 text-left">Return Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{activity.title}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">{activity.user}</td>
                    <td className="px-4 py-2">{activity.borrowDate}</td>
                    <td className="px-4 py-2">{activity.returnDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
  );
}
