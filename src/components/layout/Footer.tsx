export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--color-border)",
      background: "var(--color-card)",
      padding: "24px 16px",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2"/>
              <path d="M4.93 4.93l4.24 4.24"/>
              <path d="M14.83 9.17l4.24-4.24"/>
              <path d="M14.83 14.83l4.24 4.24"/>
              <path d="M4.93 19.07l4.24-4.24"/>
              <line x1="12" y1="2" x2="12" y2="4"/>
              <line x1="12" y1="20" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="4" y2="12"/>
              <line x1="20" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-foreground)" }}>
            AstroMaker
          </span>
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginBottom: 4 }}>
          探索宇宙 · 创造无限 · 天文爱好者社区
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
          &copy; 2026 AstroMaker &nbsp;·&nbsp; 基于 Next.js &amp; PostgreSQL 构建
        </div>
      </div>
    </footer>
  );
}
