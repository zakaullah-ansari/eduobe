export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 border-r bg-card min-h-screen p-4">
          <div className="font-bold text-xl mb-4">EduOBE</div>
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-accent">
              Dashboard
            </a>
            <a href="/academic/years" className="block px-3 py-2 rounded hover:bg-accent">
              Academic Years
            </a>
            <a href="/departments" className="block px-3 py-2 rounded hover:bg-accent">
              Departments
            </a>
            <a href="/students" className="block px-3 py-2 rounded hover:bg-accent">
              Students
            </a>
            <a href="/faculty" className="block px-3 py-2 rounded hover:bg-accent">
              Faculty
            </a>
            <a href="/courses" className="block px-3 py-2 rounded hover:bg-accent">
              Courses
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
