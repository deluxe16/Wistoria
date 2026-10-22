import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory campaign slides
const slides = [
  {
    id: 1,
    title: "WISTORIA",
    collection: "RUNWAY WINTER / HAUTE COUTURE",
    caption: "The Fringe Collection — Look 01 & 02",
    image: "/images/campaign_01.jpg",
    mobileImage: "/images/campaign_01.jpg",
    linkText: "EXPLORE THE CAMPAIGN",
    linkUrl: "#campaign"
  },
  {
    id: 2,
    title: "WISTORIA",
    collection: "SCULPTURAL DRAPERY",
    caption: "Architectural Silhouettes in Silk & Gold",
    image: "/images/campaign_02.jpg",
    mobileImage: "/images/campaign_02.jpg",
    linkText: "VIEW COLLECTION",
    linkUrl: "#drapery"
  },
  {
    id: 3,
    title: "WISTORIA",
    collection: "TAILORING & WOOL",
    caption: "Minimalist Structure with Cascading Movement",
    image: "/images/campaign_03.jpg",
    mobileImage: "/images/campaign_03.jpg",
    linkText: "DISCOVER TAILORING",
    linkUrl: "#tailoring"
  }
];

// Product catalog
const products = [
  {
    id: "prod-01",
    name: "Cascading Fringe Batwing Dress",
    color: "Ivory White",
    category: "Ready-to-Wear",
    subcategory: "Dresses",
    price: 150,
    currency: "USD",
    badge: "Runway Exclusive",
    image: "/images/product_fringe_dress.jpg",
    description: "Batwing hooded mini dress rendered in fluid silk jersey with artisanal cascading floor-length fringe trim.",
    details: ["100% Silk Jersey", "Hand-knotted fringe hem & sleeves", "Concealed back zip", "Dry clean only", "Made in France"],
    sizes: ["FR 34", "FR 36", "FR 38", "FR 40"],
    inStock: true
  },
  {
    id: "prod-02",
    name: "Cylindrical Metallic Minaudière",
    color: "Mirror Silver",
    category: "Bags",
    subcategory: "Evening Clutches",
    price: 175,
    currency: "USD",
    badge: "Iconic Piece",
    image: "/images/product_cylinder_clutch.jpg",
    description: "Sculptural high-polish stainless steel cylinder clutch with push-lock jewel clasp and removable fine chain strap.",
    details: ["High-gloss polished metal", "Nappa lambskin lining", "Engraved WISTORIA logo", "Dimensions: 22cm x 9cm"],
    sizes: ["One Size"],
    inStock: true
  },
  {
    id: "prod-03",
    name: "Draped Silk Fringe Tunic Dress",
    color: "Rich Espresso",
    category: "Ready-to-Wear",
    subcategory: "Dresses",
    price: 165,
    currency: "USD",
    badge: "Runway Look 01",
    image: "/images/campaign_01.jpg",
    description: "Deep V-neck draped mini tunic dress in rich espresso brown silk with cascading sleeve fringe.",
    details: ["100% Hammered Silk", "Asymmetric draped silhouette", "Dramatic fringe sleeve detailing", "Made in Italy"],
    sizes: ["FR 36", "FR 38", "FR 40"],
    inStock: true
  },
  {
    id: "prod-04",
    name: "Sculptural Liquid Gold Gown",
    color: "Antique Champagne",
    category: "Ready-to-Wear",
    subcategory: "Gowns",
    price: 185,
    currency: "USD",
    badge: "Couture Edition",
    image: "/images/campaign_02.jpg",
    description: "Grecian draped column gown crafted from molten metallic satin with fluid cowl back.",
    details: ["Metallic Silk Blend", "Bias-cut silhouette", "Floor-sweeping train", "Hand-finished edges"],
    sizes: ["FR 34", "FR 36", "FR 38"],
    inStock: true
  },
  {
    id: "prod-05",
    name: "Architectural Wool Fringe Overcoat",
    color: "Obsidian Black",
    category: "Ready-to-Wear",
    subcategory: "Coats",
    price: 180,
    currency: "USD",
    badge: "New Season",
    image: "/images/campaign_03.jpg",
    description: "Sharp sculpted shoulder overcoat in virgin wool with cascading low-tier fringe accents.",
    details: ["100% Virgin Wool", "Structured padded shoulder", "Silk lining", "Made in Italy"],
    sizes: ["FR 36", "FR 38", "FR 40"],
    inStock: true
  }
];

// In-memory cart
let cart = [
  {
    id: "cart-item-1",
    productId: "prod-01",
    name: "Cascading Fringe Batwing Dress",
    color: "Ivory White",
    size: "FR 36",
    price: 150,
    quantity: 1,
    image: "/images/product_fringe_dress.jpg"
  }
];

// Announcement bar configuration
const announcement = {
  message: "Free shipping for orders over $300",
  freeShippingThreshold: 300,
  currency: "USD",
  currencySymbol: "$",
  enabled: true
};

// Navigation menu tree
const navigationMenu = {
  mainCategories: [
    {
      title: "COLLECTIONS",
      items: [
        { name: "Winter Haute Couture 2026", url: "#winter-2026", isHighlight: true },
        { name: "The Fringe Edit", url: "#fringe-edit" },
        { name: "Runway Lookbook", url: "#lookbook" },
        { name: "Archive & Editions", url: "#archive" }
      ]
    },
    {
      title: "READY-TO-WEAR",
      items: [
        { name: "All Ready-to-Wear", url: "#all-rtw" },
        { name: "Dresses & Gowns", url: "#dresses" },
        { name: "Coats & Outerwear", url: "#coats" },
        { name: "Tailoring & Jackets", url: "#tailoring" },
        { name: "Tops & Tunics", url: "#tops" }
      ]
    },
    {
      title: "ACCESSORIES & BAGS",
      items: [
        { name: "Minaudières & Clutches", url: "#clutches" },
        { name: "Structured Leather Bags", url: "#leather" },
        { name: "Footwear & Boots", url: "#footwear" },
        { name: "Fine Jewellery & Objects", url: "#jewellery" }
      ]
    },
    {
      title: "MAISON WISTORIA",
      items: [
        { name: "The Philosophy", url: "#philosophy" },
        { name: "Craftsmanship & Atelier", url: "#atelier" },
        { name: "Stores & Salons", url: "#stores" },
        { name: "Client Services", url: "#services" }
      ]
    }
  ],
  footerLinks: [
    { name: "Client Advisor", url: "#advisor" },
    { name: "Book an Appointment", url: "#appointment" },
    { name: "Shipping & Returns", url: "#shipping" },
    { name: "Legal & Privacy", url: "#privacy" }
  ]
};

// Helper: Cart summary calculator
const calculateCartSummary = () => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesForFreeShipping = subtotal >= announcement.freeShippingThreshold;
  const remainingForFreeShipping = qualifiesForFreeShipping
    ? 0
    : announcement.freeShippingThreshold - subtotal;

  return {
    items: cart,
    itemCount,
    subtotal,
    currencySymbol: announcement.currencySymbol,
    freeShippingThreshold: announcement.freeShippingThreshold,
    qualifiesForFreeShipping,
    remainingForFreeShipping
  };
};

// Routes
app.get("/api/announcement", (req, res) => {
  res.json(announcement);
});

app.get("/api/slides", (req, res) => {
  res.json(slides);
});

app.get("/api/navigation", (req, res) => {
  res.json(navigationMenu);
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  if (!query) {
    return res.json({ query: "", results: products.slice(0, 3), popular: ["Fringe Dress", "Minaudière", "Runway", "Silk Gown"] });
  }
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.color.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );
  res.json({
    query,
    count: filtered.length,
    results: filtered,
    popular: ["Fringe Dress", "Minaudière", "Runway", "Silk Gown"]
  });
});

app.get("/api/cart", (req, res) => {
  res.json(calculateCartSummary());
});

app.post("/api/cart", (req, res) => {
  const { productId, size } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && item.size === (size || "FR 36")
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: "cart-item-" + Date.now(),
      productId: product.id,
      name: product.name,
      color: product.color,
      size: size || (product.sizes ? product.sizes[0] : "One Size"),
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }

  res.json(calculateCartSummary());
});

app.put("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Item not in cart" });
  }

  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }

  res.json(calculateCartSummary());
});

app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  cart = cart.filter((item) => item.id !== id);
  res.json(calculateCartSummary());
});

// Clear cart endpoint
app.post("/api/cart/clear", (req, res) => {
  cart = [];
  res.json(calculateCartSummary());
});

// Paystack Gateway: Initialize transaction
app.post("/api/checkout/initialize", (req, res) => {
  const { email, fullName, subtotal, shippingFee, total, items } = req.body;
  const reference = `pstk_${Date.now()}_${Math.floor(Math.random() * 900000 + 100000)}`;
  const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || "pk_test_sample_wistoria_sandbox";

  res.json({
    status: true,
    message: "Paystack initialization successful",
    reference,
    publicKey: paystackPublicKey,
    amount: Math.round(Number(total || subtotal) * 100),
    currency: "USD",
    email: email || "client@maisonwistoria.com"
  });
});

// Paystack Gateway: Verify transaction (All test transactions succeed)
app.post("/api/checkout/verify", (req, res) => {
  const { reference, email, fullName, shippingAddress, subtotal, shippingFee, total, items } = req.body;
  const orderId = `WST-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();

  // Clear cart upon successful checkout
  cart = [];

  const completedOrder = {
    orderId,
    reference: reference || `pstk_${Date.now()}`,
    gateway: "Paystack",
    status: "success",
    paid: true,
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paidAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    subtotal: Number(subtotal) || 0,
    shippingFee: Number(shippingFee) || 0,
    total: Number(total) || 0,
    items: items || [],
    customer: {
      fullName: fullName || "Valued Client",
      email: email || "client@maisonwistoria.com",
      address: shippingAddress || "Maison Delivery"
    }
  };

  res.json({
    status: true,
    message: "Transaction verified successfully via Paystack",
    order: completedOrder
  });
});

app.listen(PORT, () => {
  console.log(`[WISTORIA API] Server listening on http://localhost:${PORT}`);
});
