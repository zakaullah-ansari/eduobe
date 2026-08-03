export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your EduOBE account
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full px-3 py-2 border rounded-md"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border rounded-md"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
