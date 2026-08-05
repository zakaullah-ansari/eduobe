export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Active Courses</h3>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Faculty Members</h3>
          <p className="text-3xl font-bold">89</p>
        </div>
      </div>
    </div>
  );
}
