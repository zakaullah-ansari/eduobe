export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-6xl">🚫</div>
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          You don't have permission to access this page. Please contact your administrator if you
          believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Login with Different Account
          </a>
        </div>
      </div>
    </div>
  );
}
