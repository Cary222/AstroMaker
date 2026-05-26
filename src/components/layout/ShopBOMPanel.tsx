export function ShopBOMPanel() {
  const items = [
    { name: "Raspberry Pi 5", price: "¥450", note: "入门推荐", icon: "🖥️" },
    { name: "ESP32-S3", price: "¥38", note: "物联网首选", icon: "📡" },
    { name: "Arduino UNO R4", price: "¥128", note: "教学经典", icon: "🔧" },
    { name: "STM32 BluePill", price: "¥25", note: "嵌入式神器", icon: "⚡" },
  ];

  return (
    <div className="sidebar-card">
      <div className="section-header">
        <div className="sidebar-card-title" style={{ marginBottom: 0 }}>
          <ShopIcon />
          BOM 推荐
        </div>
        <a href="#" className="section-more">查看全部</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 0",
            borderBottom: i < items.length - 1 ? "1px solid var(--color-border-light)" : "none",
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--color-input-bg)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.125rem",
              flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-foreground)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {item.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                {item.note}
              </div>
            </div>
            <div style={{
              flexShrink: 0,
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--color-accent)",
            }}>
              {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}
