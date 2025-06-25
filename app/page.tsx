import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="section sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">Member&apos;s Point</div>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="section py-24 md:py-32">
          <div className="container">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Manage your membership points in one place
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Track your points, monitor your progress, and access exclusive
                rewards through our member portal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Log in to your account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section py-16 bg-muted">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Track Points</h3>
                <p className="text-muted-foreground">
                  Monitor your points balance and track your earning history in
                  real-time.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">View Statistics</h3>
                <p className="text-muted-foreground">
                  Access detailed analytics about your membership points and
                  progress.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Manage Profile</h3>
                <p className="text-muted-foreground">
                  Update your personal information and preferences anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="section py-6 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Points Center. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:underline"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
