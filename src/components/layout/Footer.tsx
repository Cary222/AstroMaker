export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
      <div className="mb-2 flex justify-center">
        <img src="/images/logo.svg" alt="AstroMaker" className="h-6 w-auto opacity-60" />
      </div>
      <div>社区 &middot; 基于 Next.js 与 PostgreSQL</div>
      <div className="mt-1">&copy; 2026</div>
    </footer>
  );
}
