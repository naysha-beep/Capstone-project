import { useState, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1,  name: "Matte Ceramic Mug",      cat: "Kitchen",  price: 28,  emoji: "☕", rating: 4.8, reviews: 124, badge: "new"  },
  { id: 2,  name: "Bamboo Cutting Board",   cat: "Kitchen",  price: 45,  oldPrice: 60,  emoji: "🪵", rating: 4.6, reviews: 89,  badge: "sale" },
  { id: 3,  name: "Copper French Press",    cat: "Kitchen",  price: 75,  emoji: "🫖", rating: 4.9, reviews: 203 },
  { id: 4,  name: "Marble Coaster Set",     cat: "Kitchen",  price: 32,  emoji: "⬜", rating: 4.5, reviews: 67  },
  { id: 5,  name: "Linen Table Runner",     cat: "Textiles", price: 38,  emoji: "🟫", rating: 4.7, reviews: 55,  badge: "new"  },
  { id: 6,  name: "Cashmere Throw",         cat: "Textiles", price: 120, oldPrice: 150, emoji: "🧣", rating: 4.9, reviews: 311, badge: "sale" },
  { id: 7,  name: "Woven Wall Basket",      cat: "Decor",    price: 55,  emoji: "🧺", rating: 4.4, reviews: 42  },
  { id: 8,  name: "Minimal Desk Lamp",      cat: "Lighting", price: 88,  emoji: "💡", rating: 4.8, reviews: 178, badge: "new"  },
  { id: 9,  name: "Edison Pendant Light",   cat: "Lighting", price: 145, oldPrice: 180, emoji: "🔮", rating: 4.7, reviews: 92,  badge: "sale" },
  { id: 10, name: "Ceramic Vase Set",       cat: "Decor",    price: 62,  emoji: "🏺", rating: 4.6, reviews: 136 },
  { id: 11, name: "Wireless Charger Pad",   cat: "Tech",     price: 42,  emoji: "📱", rating: 4.5, reviews: 287, badge: "new"  },
  { id: 12, name: "Smart Plant Sensor",     cat: "Tech",     price: 35,  oldPrice: 50,  emoji: "🌿", rating: 4.3, reviews: 63,  badge: "sale" },
];

const CATEGORIES = ["All", "Kitchen", "Lighting", "Decor", "Textiles", "Tech", "Sale"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#D4A853" : "#ddd", fontSize: 11 }}>★</span>
      ))}
    </span>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
      opacity: visible ? 1 : 0,
      transition: "all 0.3s ease",
      background: "#1A1A2E", color: "#fff",
      padding: "10px 22px", borderRadius: 8,
      fontSize: 13, zIndex: 500, pointerEvents: "none",
      whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────

function CartPanel({ open, onClose, cart, onAdd, onRemove, onClear }) {
  const items = Object.entries(cart);
  const total = items
    .reduce((sum, [id, qty]) => sum + (PRODUCTS.find((p) => p.id === +id)?.price ?? 0) * qty, 0)
    .toFixed(2);

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 200, display: open ? "block" : "none",
        }}
      />
      {/* panel */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 340,
        background: "#fff", borderLeft: "0.5px solid #e5e5e5",
        zIndex: 201, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
      }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "0.5px solid #e5e5e5" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Your Cart</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" }}>✕</button>
        </div>

        {/* items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: "#888", fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🛍</div>
              Your cart is empty.
            </div>
          ) : items.map(([id, qty]) => {
            const p = PRODUCTS.find((x) => x.id === +id);
            if (!p) return null;
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <div style={{ width: 48, height: 48, background: "#f8f7f4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>${p.price} each</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => onRemove(p.id)} style={{ width: 22, height: 22, border: "0.5px solid #ddd", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13 }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16, textAlign: "center" }}>{qty}</span>
                    <button onClick={() => onAdd(p.id)} style={{ width: 22, height: 22, border: "0.5px solid #ddd", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13 }}>+</button>
                  </div>
                </div>
                <button onClick={() => onClear(p.id)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#bbb" }}>✕</button>
              </div>
            );
          })}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div style={{ padding: 20, borderTop: "0.5px solid #e5e5e5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 6 }}>
              <span>Subtotal</span><span style={{ color: "#111" }}>${total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 14 }}>
              <span>Shipping</span><span style={{ color: "#0F6E56" }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
              <span>Total</span><span>${total}</span>
            </div>
            <button style={{
              width: "100%", padding: 13, background: "#C8502A", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, inCart, onAdd }) {
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12,
      overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#ccc"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#e5e5e5"; }}
    >
      {/* image area */}
      <div style={{ height: 140, background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 48 }}>{product.emoji}</span>
        {product.badge && (
          <span style={{
            position: "absolute", top: 8, left: 8, fontSize: 10, padding: "3px 8px", borderRadius: 10, fontWeight: 500,
            background: product.badge === "sale" ? "#FAECE7" : "#E1F5EE",
            color: product.badge === "sale" ? "#993C1D" : "#0F6E56",
          }}>
            {product.badge === "sale" ? "Sale" : "New"}
          </span>
        )}
      </div>

      {/* info */}
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{product.cat}</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 10, color: "#999" }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500 }}>${product.price}</span>
            {product.oldPrice && <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through", marginLeft: 4 }}>${product.oldPrice}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
            style={{
              width: 28, height: 28,
              background: inCart ? "#0F6E56" : "#C8502A",
              border: "none", borderRadius: 8, color: "#fff",
              fontSize: 16, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", transition: "opacity 0.2s",
            }}
          >
            {inCart ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState({});           // { [productId]: qty }
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  // ── cart helpers
  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    showToast("Added to cart!");
  }
  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }
  function clearFromCart(id) {
    setCart((c) => { const next = { ...c }; delete next[id]; return next; });
  }

  function showToast(msg) {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // ── filter products
  const filtered = useMemo(() => PRODUCTS.filter((p) => {
    const catOk = category === "All" || (category === "Sale" && p.badge === "sale") || p.cat === category;
    const searchOk = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  }), [category, search]);

  const featuredHero = PRODUCTS.filter((p) => p.badge).slice(0, 4);

  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#fefefe", color: "#111" }}>

        {/* ── NAV */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 32px", borderBottom: "0.5px solid #e5e5e5",
          position: "sticky", top: 0, background: "#fefefe", zIndex: 100,
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, letterSpacing: "-0.5px", cursor: "pointer" }}>
            Lum<span style={{ color: "#C8502A" }}>è</span>re
          </div>

          <div style={{ display: "flex", gap: 28 }}>
            {["Shop", "Collections", "About"].map((l) => (
              <span key={l} style={{ fontSize: 13, color: l === "Shop" ? "#111" : "#888", cursor: "pointer" }}>{l}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", border: "0.5px solid #e5e5e5", borderRadius: 8 }}>
              <span style={{ color: "#aaa", fontSize: 14 }}>⌕</span>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: 13, width: 180, fontFamily: "'DM Sans', sans-serif", background: "transparent" }}
              />
            </div>
            {/* cart */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                border: "0.5px solid #e5e5e5", borderRadius: 8, background: "none",
                cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 15 }}>🛍</span>
              <span>Cart</span>
              <span style={{
                background: "#C8502A", color: "#fff", fontSize: 10, fontWeight: 500,
                borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cartCount}
              </span>
            </button>
          </div>
        </nav>

        {/* ── HERO */}
        <section style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40,
          padding: "48px 32px 36px", borderBottom: "0.5px solid #e5e5e5", alignItems: "center",
        }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, lineHeight: 1.15, marginBottom: 14 }}>
              Curated <span style={{ color: "#C8502A" }}>Modern</span><br />Lifestyle Goods
            </h1>
            <p style={{ color: "#666", fontSize: 14, lineHeight: 1.75, maxWidth: 380, marginBottom: 28 }}>
              Thoughtfully selected products for the discerning home. From everyday essentials to rare finds — all in one place.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => document.getElementById("products-section").scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "10px 24px", background: "#C8502A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                Browse All
              </button>
              <button
                onClick={() => setCategory("Sale")}
                style={{ padding: "10px 24px", background: "transparent", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                View Sales
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {featuredHero.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p.id)}
                style={{ background: "#f8f7f4", borderRadius: 12, padding: 20, border: "0.5px solid #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                <span style={{ fontSize: 32 }}>{p.emoji}</span>
                <div style={{ fontSize: 12, fontWeight: 500, textAlign: "center" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#C8502A", fontWeight: 500 }}>${p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FILTERS */}
        <div style={{ display: "flex", gap: 10, padding: "16px 32px", borderBottom: "0.5px solid #e5e5e5", overflowX: "auto" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "6px 16px", border: "0.5px solid #e5e5e5", borderRadius: 20,
                fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                background: category === cat ? "#C8502A" : "transparent",
                color: category === cat ? "#fff" : "#444",
                borderColor: category === cat ? "#C8502A" : "#e5e5e5",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS */}
        <section id="products-section" style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>
              {category === "All" ? "All Products" : category === "Sale" ? "On Sale" : category}
            </h2>
            <span style={{ fontSize: 12, color: "#999" }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 16 }}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={!!cart[p.id]}
                onAdd={addToCart}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              No products found for "{search}"
            </div>
          )}
        </section>

        {/* ── CART */}
        <CartPanel
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClear={clearFromCart}
        />

        {/* ── TOAST */}
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}