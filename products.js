/**
 * BRICK STORE - Product Database
 * Contains all inventory data, tags for search, and variant pricing.
 */

const products = [
    { 
        id: 1, name: "Karambit Doppler", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/631286982/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/631286982/playside.png"], 
        desc: "Premium replica desk toy. Deep sapphire phases.", 
        dateAdded: "2026-03-01", clicks: 450, sales: 85, 
        tags: ["knife", "doppler", "sapphire", "curved", "blue"], 
        variants: [{ name: "Standard (Phase 3)", price: 12 }, { name: "StatTrak™ (Sapphire)", price: 18 }] 
    },
    { 
        id: 2, name: "Karambit Fade", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/609453843/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/609453843/playside.png"], 
        desc: "Premium replica desk toy. 100% fade pattern.", 
        dateAdded: "2026-03-02", clicks: 600, sales: 120, 
        tags: ["knife", "fade", "gradient", "curved"], 
        variants: [{ name: "90% Fade", price: 12 }, { name: "100% Full Fade", price: 20 }] 
    },
    { 
        id: 3, name: "M9 Bayonet Crimson Web", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632372451/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632372451/playside.png"], 
        desc: "Premium replica desk toy. Factory new look with webbing patterns.", 
        dateAdded: "2026-03-03", clicks: 300, sales: 50, 
        tags: ["knife", "bayonet", "crimson", "red", "web"], 
        variants: [{ name: "Field-Tested Look", price: 12 }, { name: "Factory New Look", price: 16 }] 
    },
    { 
        id: 4, name: "Butterfly Knife Marble Fade", price: 12, oldPrice: 18, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632758204/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632758204/playside.png"], 
        desc: "Premium replica desk toy. Smooth flipping action mechanism.", 
        dateAdded: "2026-03-04", clicks: 800, sales: 200, 
        tags: ["knife", "butterfly", "balisong", "marble", "fade"], 
        variants: [{ name: "Standard Mechanism", price: 12 }, { name: "Pro Bearing Pivot", price: 19 }] 
    },
    { 
        id: 5, name: "Butterfly Knife Tiger Tooth", price: 12, oldPrice: 18, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/616083695/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/616083695/playside.png"], 
        desc: "Premium replica desk toy. Golden anodized finish.", 
        dateAdded: "2026-03-05", clicks: 500, sales: 95, 
        tags: ["knife", "butterfly", "balisong", "tiger", "gold", "yellow"], 
        variants: [{ name: "Standard Finish", price: 12 }, { name: "High-Gloss Mirror", price: 17 }] 
    },
    { 
        id: 6, name: "Talon Knife Slaughter", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/631798830/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/631798830/playside.png"], 
        desc: "Premium replica desk toy. Ivory-style handle.", 
        dateAdded: "2026-03-06", clicks: 200, sales: 30, 
        tags: ["knife", "talon", "slaughter", "red", "curved"], 
        variants: [{ name: "Standard", price: 12 }, { name: "Diamond Pattern", price: 15 }] 
    },
    { 
        id: 7, name: "Huntsman Knife Doppler", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/602129942/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/602129942/playside.png"], 
        desc: "Premium replica desk toy. Aggressive serrated spine.", 
        dateAdded: "2026-03-07", clicks: 350, sales: 60, 
        tags: ["knife", "huntsman", "doppler", "serrated", "ruby"], 
        variants: [{ name: "Phase 1", price: 12 }, { name: "Ruby Gem", price: 22 }] 
    },
    { 
        id: 8, name: "Flip Knife Fade", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/625454898/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/625454898/playside.png"], 
        desc: "Premium replica desk toy. Sleek, foldable design.", 
        dateAdded: "2026-03-08", clicks: 400, sales: 75, 
        tags: ["knife", "flip", "fade", "pocket", "foldable"], 
        variants: [{ name: "Standard Lock", price: 12 }, { name: "Spring Assist Lock", price: 14 }] 
    },
    { 
        id: 9, name: "Shadow Daggers Marble Fade", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632307382/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632307382/playside.png"], 
        desc: "Premium replica desk toy. Dual-push daggers.", 
        dateAdded: "2026-03-09", clicks: 150, sales: 20, 
        tags: ["knife", "shadow", "daggers", "push", "dual", "marble"], 
        variants: [{ name: "Standard Grip", price: 12 }, { name: "Weighted Grip", price: 15 }] 
    },
    { 
        id: 10, name: "Bowie Knife Tiger Tooth", price: 12, oldPrice: 15, 
        image: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632900583/playside.png", 
        gallery: ["https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=avif,quality=85,background=transparent/images/screenshots/632900583/playside.png"], 
        desc: "Premium replica desk toy. Massive display piece.", 
        dateAdded: "2026-03-10", clicks: 250, sales: 40, 
        tags: ["knife", "bowie", "tiger", "tooth", "large", "gold"], 
        variants: [{ name: "Standard Edge", price: 12 }, { name: "Sharpened Display Edge", price: 16 }] 
    }
];
