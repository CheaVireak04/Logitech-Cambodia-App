// =========================================================================
// 🛒 PRODUCT DATA (Expanded GravaStar Arsenal)
// =========================================================================
const products = [
    // --- SPEAKERS ---
    { 
        id: 1, name: "Mars Pro Bluetooth Speaker", price: 229, oldPrice: 279, 
        image: "https://gravastar.com/cdn/shop/files/MarsPro-Black.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/MarsPro-Black.png"],
        desc: "Dual-speaker system with a passive bass radiator. Zinc alloy shell with a sci-fi mecha design and dynamic RGB lighting. Room-filling heavy bass.",
        dateAdded: "2026-03-01", clicks: 1200, sales: 340,
        category: "speakers", tags: ["audio", "speaker", "bluetooth", "mars", "bass", "mecha"],
        variants: [{ name: "Matte Black", price: 229 }, { name: "War Damaged Yellow", price: 299 }, { name: "Shark 14 (Special)", price: 349 }]
    },
    { 
        id: 2, name: "Supernova Bluetooth Speaker", price: 179, oldPrice: 199, 
        image: "https://gravastar.com/cdn/shop/files/Supernova-White.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Supernova-White.png"],
        desc: "Mecha-inspired design featuring a glass camping lantern core. 25W DSP acoustics and rhythmic ambient lighting synced to your music.",
        dateAdded: "2026-03-04", clicks: 950, sales: 210,
        category: "speakers", tags: ["audio", "speaker", "lantern", "supernova", "rgb"],
        variants: [{ name: "Dawn White", price: 179 }, { name: "Midnight Black", price: 179 }]
    },
    { 
        id: 3, name: "Venus Portable Speaker", price: 89, oldPrice: 119, 
        image: "https://gravastar.com/cdn/shop/files/Venus-Red.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Venus-Red.png"],
        desc: "Ultra-portable 1.75-inch 10W speaker housed in a heavy-duty zinc alloy sphere. Surprisingly loud with 6 RGB lights.",
        dateAdded: "2026-03-09", clicks: 800, sales: 450,
        category: "speakers", tags: ["audio", "speaker", "bluetooth", "venus", "mini"],
        variants: [{ name: "Flame Red", price: 89 }, { name: "Shadow Black", price: 89 }, { name: "Dawn White", price: 89 }]
    },

    // --- MICE ---
    { 
        id: 4, name: "Mercury M1 Pro Gaming Mouse", price: 99, oldPrice: 129, 
        image: "https://gravastar.com/cdn/shop/files/M1-Pro-Silver.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/M1-Pro-Silver.png"],
        desc: "Magnesium alloy skeletal body. 26,000 DPI PAW3395 sensor with 4K polling rate support. Cyberpunk battle-tested aesthetic.",
        dateAdded: "2026-03-02", clicks: 2500, sales: 850,
        category: "mice", tags: ["mouse", "gaming", "wireless", "mercury", "m1", "magnesium"],
        variants: [{ name: "Gunmetal Gray", price: 99 }, { name: "Battle-Worn Silver (4K)", price: 129 }]
    },
    { 
        id: 5, name: "Mercury M2 Gaming Mouse", price: 79, oldPrice: 99, 
        image: "https://gravastar.com/cdn/shop/files/M2-Black.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/M2-Black.png"],
        desc: "Ultra-lightweight hollowed-out ergonomic design. High-precision 26,000 DPI sensor with 5 programmable buttons and vivid RGB.",
        dateAdded: "2026-03-07", clicks: 1500, sales: 430,
        category: "mice", tags: ["mouse", "gaming", "wireless", "mercury", "m2", "lightweight"],
        variants: [{ name: "Stealth Black", price: 79 }, { name: "Alien Green", price: 89 }]
    },
    { 
        id: 6, name: "Mercury M3 Gaming Mouse", price: 59, oldPrice: 79, 
        image: "https://gravastar.com/cdn/shop/files/M3-White.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/M3-White.png"],
        desc: "The perfect entry point into GravaStar gear. Features the signature hollowed-out back, solid performance, and 1K polling rate.",
        dateAdded: "2026-03-11", clicks: 900, sales: 320,
        category: "mice", tags: ["mouse", "gaming", "budget", "mercury", "m3"],
        variants: [{ name: "Ghost White", price: 59 }, { name: "Onyx Black", price: 59 }]
    },

    // --- EARBUDS ---
    { 
        id: 7, name: "Sirius Pro Earbuds", price: 129, oldPrice: 149, 
        image: "https://gravastar.com/cdn/shop/files/Sirius-Pro-Space-Grey.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Sirius-Pro-Space-Grey.png"],
        desc: "Zinc alloy charging case with a built-in bottle opener. Hybrid drivers (Knowles balanced armatures + 7.2mm dynamic) for crisp 3D sound.",
        dateAdded: "2026-03-03", clicks: 1800, sales: 620,
        category: "earbuds", tags: ["audio", "earbuds", "tws", "sirius", "wireless", "bottle-opener"],
        variants: [{ name: "Space Grey", price: 129 }, { name: "Neon Green", price: 149 }, { name: "War Damaged Yellow", price: 149 }]
    },
    { 
        id: 8, name: "Sirius P5 Earbuds", price: 89, oldPrice: 109, 
        image: "https://gravastar.com/cdn/shop/files/Sirius-P5.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Sirius-P5.png"],
        desc: "Interchangeable sci-fi armor cases. Open-ear comfort with massive 12mm dynamic drivers and Qualcomm aptX support.",
        dateAdded: "2026-03-08", clicks: 1100, sales: 320,
        category: "earbuds", tags: ["audio", "earbuds", "tws", "sirius", "p5", "custom"],
        variants: [{ name: "Defense Armor", price: 89 }, { name: "Defense Mecha", price: 89 }, { name: "3-Case Combo Pack", price: 139 }]
    },
    { 
        id: 9, name: "Sirius Pro 2 Earbuds", price: 149, oldPrice: 169, 
        image: "https://gravastar.com/cdn/shop/files/Sirius-Pro2.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Sirius-Pro2.png"],
        desc: "Next-generation audio transmission. Features enhanced active noise cancellation (ANC), multipoint connection, and refined mecha case.",
        dateAdded: "2026-03-12", clicks: 2100, sales: 710,
        category: "earbuds", tags: ["audio", "earbuds", "tws", "sirius", "anc", "pro2"],
        variants: [{ name: "Cyber Black", price: 149 }, { name: "Cosmic Silver", price: 149 }]
    },

    // --- KEYBOARDS ---
    { 
        id: 10, name: "K1 Pro Keyboard (HE)", price: 149, oldPrice: 179, 
        image: "https://gravastar.com/cdn/shop/files/K1-Pro.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/K1-Pro.png"],
        desc: "75% layout equipped with Hall Effect magnetic switches. Adjustable actuation points (0.1mm - 4.0mm) and Rapid Trigger technology for elite gaming.",
        dateAdded: "2026-03-06", clicks: 4200, sales: 500,
        category: "keyboards", tags: ["keyboard", "gaming", "hall-effect", "magnetic", "rapid-trigger", "k1"],
        variants: [{ name: "Cyber Black (Linear)", price: 149 }, { name: "Neon Green (Linear)", price: 149 }]
    },
    { 
        id: 11, name: "K1 Mechanical Keyboard", price: 119, oldPrice: 139, 
        image: "https://gravastar.com/cdn/shop/files/K1-Mech.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/K1-Mech.png"],
        desc: "Premium 75% hot-swappable mechanical keyboard. Tri-mode connectivity (Wired, 2.4GHz, Bluetooth) with custom-lubed linear switches.",
        dateAdded: "2026-03-14", clicks: 1300, sales: 290,
        category: "keyboards", tags: ["keyboard", "gaming", "mechanical", "hot-swap", "k1"],
        variants: [{ name: "Space Silver (Tactile)", price: 119 }, { name: "Cyber Black (Linear)", price: 119 }]
    },

    // --- POWER & CHARGING ---
    { 
        id: 12, name: "Alpha65 Fast Charger", price: 59, oldPrice: 79, 
        image: "https://gravastar.com/cdn/shop/files/Alpha65-Yellow.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Alpha65-Yellow.png"],
        desc: "65W GaN fast charger shaped like a classic sci-fi mecha robot. Triple ports (2x USB-C, 1x USB-A). The robot legs are poseable.",
        dateAdded: "2026-03-05", clicks: 3100, sales: 1200,
        category: "power", tags: ["charger", "power", "gan", "alpha65", "mecha", "type-c"],
        variants: [{ name: "War Damaged Yellow", price: 59 }, { name: "Dawn White", price: 59 }, { name: "Matrix Black", price: 65 }]
    },
    { 
        id: 13, name: "Delta35 GaN Charger", price: 39, oldPrice: 49, 
        image: "https://gravastar.com/cdn/shop/files/Delta35.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Delta35.png"],
        desc: "Compact 35W dual-port GaN charger. Features a retro-futuristic mecha design, perfect for charging phones, tablets, and earbuds on the go.",
        dateAdded: "2026-03-10", clicks: 1800, sales: 900,
        category: "power", tags: ["charger", "power", "gan", "delta35", "mini"],
        variants: [{ name: "Mecha White", price: 39 }, { name: "Mecha Pink", price: 39 }]
    },

    // --- ACCESSORIES ---
    { 
        id: 14, name: "GravaStar Gaming Mousepad", price: 29, oldPrice: 39, 
        image: "https://gravastar.com/cdn/shop/files/Mousepad.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/Mousepad.png"],
        desc: "XL Size (900x400mm) gaming mousepad featuring high-density weaving for ultra-smooth mouse gliding. Cyberpunk mecha artwork.",
        dateAdded: "2026-03-15", clicks: 500, sales: 150,
        category: "accessories", tags: ["mousepad", "gaming", "deskmat", "accessories"],
        variants: [{ name: "Cyber Neon Art", price: 29 }, { name: "Dark Matrix Art", price: 29 }]
    },
    { 
        id: 15, name: "Sirius P5 Interchangeable Shell", price: 19, oldPrice: 25, 
        image: "https://gravastar.com/cdn/shop/files/P5-Shell.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/P5-Shell.png"],
        desc: "Upgrade the look of your Sirius P5 Earbuds. Crafted from durable zinc alloy and detailed with premium sci-fi paint finishes.",
        dateAdded: "2026-03-16", clicks: 300, sales: 80,
        category: "accessories", tags: ["shell", "case", "sirius", "p5", "accessories"],
        variants: [{ name: "Crystal Blue", price: 19 }, { name: "Defense Armor", price: 19 }]
    },
    { 
        id: 16, name: "GravaStar Storage Display Case", price: 49, oldPrice: 69, 
        image: "https://gravastar.com/cdn/shop/files/DisplayCase.png", 
        gallery: ["https://gravastar.com/cdn/shop/files/DisplayCase.png"],
        desc: "Premium acrylic and metal display case built to showcase your GravaStar gear. Features built-in base LED lighting.",
        dateAdded: "2026-03-18", clicks: 600, sales: 110,
        category: "accessories", tags: ["case", "display", "led", "accessories", "storage"],
        variants: [{ name: "Standard (No LED)", price: 49 }, { name: "Pro (RGB Base)", price: 69 }]
    }
];
