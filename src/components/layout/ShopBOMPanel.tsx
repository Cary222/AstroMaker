export function ShopBOMPanel() {
  const items = [
    { name: "Raspberry Pi 5", price: "¥450", note: "入门推荐", img: "/images/raspberry-pi.jpg" },
    { name: "ESP32-S3", price: "¥38", note: "物联网首选", img: "/images/esp32.jpg" },
    { name: "Arduino UNO R4", price: "¥128", note: "教学经典", img: "/images/arduino.jpg" },
    { name: "STM32 BluePill", price: "¥25", note: "嵌入式", img: "/images/microcontroller.jpg" },
  ];

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-title flex items-center gap-2">
        <img src="/images/shop-icon.svg" alt="Shop" className="h-5 w-5" />
        BOM 推荐
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {item.name}
              </div>
              <div className="text-xs text-muted-foreground">{item.note}</div>
            </div>
            <div className="shrink-0 text-sm font-semibold text-accent">
              {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
