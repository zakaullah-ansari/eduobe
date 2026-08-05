export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">EduOBE</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Outcome-Based Education & NBA Accreditation Platform
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
