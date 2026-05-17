import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-primary/15 bg-gradient-to-r from-primary/10 via-card to-accent/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
              <span className="text-sm font-bold text-primary-foreground">W</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              {SITE_NAME}
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. Все права защищены.
        </p>
      </footer>
    </div>
  );
}
