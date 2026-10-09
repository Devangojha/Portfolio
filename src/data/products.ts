import { Product, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-vortex-aero',
    name: 'VORTEX Aero Pro',
    tagline: 'Planar Magnetic ANC Headphones with Spatial Audio',
    description: 'Engineered for audiophiles and digital creators. Features custom 50mm planar magnetic transducers, hybrid active noise cancellation up to -48dB, and uncompressed 24-bit/192kHz low-latency wireless transmission.',
    price: 389,
    originalPrice: 449,
    category: 'Audio',
    brand: 'NEXUS Acoustics',
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockCount: 6,
    reservedCount: 3,
    activeViewers: 14,
    sku: 'NX-AUD-902',
    accentColor: '#06b6d4',
    iconType: 'headphone',
    badge: 'Flash Sale',
    warranty: '3-Year Nexus Hardware Guarantee',
    features: [
      '50mm Planar Magnetic Diaphragms',
      '-48dB Hybrid Adaptive Active Noise Cancellation',
      'Ultra-low 18ms ultra-wideband wireless latency',
      'Aircraft-grade milled magnesium alloy frame',
      '65-hour battery life with 10-minute fast charge for 8 hours'
    ],
    specs: [
      { label: 'Driver Type', value: '50mm Planar Magnetic Ultra-Thin Foil' },
      { label: 'Frequency Response', value: '5 Hz – 48,000 Hz' },
      { label: 'Impedance', value: '32 Ω @ 1kHz' },
      { label: 'Wireless Protocol', value: 'Bluetooth 5.4 + 2.4GHz Dongle (LE Audio LC3+)' },
      { label: 'Weight', value: '298 grams' },
      { label: 'Battery Capacity', value: '1,100 mAh (65h playback)' }
    ],
    colorOptions: [
      { name: 'Obsidian Matte', hex: '#0f172a' },
      { name: 'Cyber Silver', hex: '#94a3b8' },
      { name: 'Midnight Teal', hex: '#0e7490' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-aura-watch',
    name: 'AURA Gen-4 Cybernetic Watch',
    tagline: 'Titanium Smartwatch with Micro-OLED & Biosensor Telemetry',
    description: 'Precision forged from Grade 5 aerospace titanium. Houses a sapphire crystal 1.6-inch Micro-OLED panel with 2,400 nits peak brightness, continuous HRV tracking, VO2 max estimation, and dual-frequency GPS routing.',
    price: 499,
    originalPrice: 569,
    category: 'Wearables',
    brand: 'NEXUS Biometrics',
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    stockCount: 4,
    reservedCount: 2,
    activeViewers: 19,
    sku: 'NX-BIO-410',
    accentColor: '#10b981',
    iconType: 'watch',
    badge: 'Bestseller',
    warranty: '3-Year Nexus Hardware Guarantee',
    features: [
      'Grade 5 Aerospace Titanium Case with Sapphire Crystal',
      '1.6-inch Micro-OLED Display (2,400 nits peak sunlight readability)',
      'Sub-millimeter Photoplethysmography (PPG) Heart & HRV telemetry',
      'Multi-band L1+L5 Precision Dual-Frequency GNSS',
      '14-day battery life with solar reserve trickle charge'
    ],
    specs: [
      { label: 'Case Material', value: 'Milled Grade 5 Aerospace Titanium' },
      { label: 'Water Resistance', value: '10 ATM (100m ISO 22810 standard)' },
      { label: 'Display', value: '1.6" Micro-OLED 480x480 (462 ppi)' },
      { label: 'Battery Life', value: 'Up to 14 days typical (48h full GPS)' },
      { label: 'Sensors', value: 'Optical Blood O2, ECG, Barometer, Skin Temp' },
      { label: 'Weight', value: '52 grams (case only)' }
    ],
    colorOptions: [
      { name: 'Raw Titanium', hex: '#64748b' },
      { name: 'Stealth Black', hex: '#0f172a' },
      { name: 'Emerald Circuit', hex: '#065f46' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-cyberdeck-75',
    name: 'CYBERDECK Apex 75',
    tagline: 'Custom Gasket-Mount Mechanical Keyboard with Brass Weight',
    description: 'An acoustic masterpiece built for speed and tactile satisfaction. Features a seamless CNC aluminum chassis, hot-swappable tactile hall-effect magnetic switches, gasket isolation mount, and customizable per-key OLED telemetry display.',
    price: 249,
    originalPrice: 289,
    category: 'Computing',
    brand: 'NEXUS Matrix',
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    stockCount: 8,
    reservedCount: 4,
    activeViewers: 11,
    sku: 'NX-INP-750',
    accentColor: '#8b5cf6',
    iconType: 'keyboard',
    badge: 'Limited Batch',
    warranty: '2-Year Nexus Hardware Guarantee',
    features: [
      'Rapid Trigger Hall-Effect Magnetic Switches (0.1mm - 4.0mm actuation)',
      'Custom CNC 6063 Aluminum Chassis with Internal Brass Weight',
      'Five-layer Acoustic PORON foam dampening matrix',
      'South-facing RGB with custom poly-carbonate keycaps',
      'Tri-mode connectivity: 2.4Ghz wireless (8,000Hz polling), BT, Type-C'
    ],
    specs: [
      { label: 'Layout', value: '75% Compact (82 keys + rotary encoder)' },
      { label: 'Polling Rate', value: '8,000 Hz wired & 2.4Ghz' },
      { label: 'Switches', value: 'NEXUS Magnetic Flux Analog Switches' },
      { label: 'Plate', value: 'FR4 with flex cuts + Gasket Mount' },
      { label: 'Weight', value: '1,840 grams' },
      { label: 'Battery', value: '8,000 mAh dual-cell' }
    ],
    colorOptions: [
      { name: 'Smoky Translucent', hex: '#334155' },
      { name: 'Dark Slate', hex: '#0f172a' },
      { name: 'Cyber Violet', hex: '#581c87' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-spectrum-ar',
    name: 'SPECTRUM Titan Smart AR Visor',
    tagline: 'Ultra-Lightweight Spatial Computing Glasses',
    description: 'Next-generation augmented reality glasses in a silhouette that weighs only 76g. Micro-LED optical wave-guides project a crisp 1080p floating 130-inch virtual workspace with real-time gesture tracking and spatial beamforming audio.',
    price: 649,
    originalPrice: 729,
    category: 'Optics',
    brand: 'NEXUS Spatial',
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    stockCount: 3,
    reservedCount: 1,
    activeViewers: 23,
    sku: 'NX-OPT-130',
    accentColor: '#3b82f6',
    iconType: 'glasses',
    badge: 'New Release',
    warranty: '2-Year Nexus Hardware Guarantee',
    features: [
      'Dual Micro-LED Optical Waveguide engines (1080p per eye)',
      'Simulated 130-inch workspace at 4 meters distance',
      'Dual 6DoF spatial tracking cameras with hand-tracking',
      'Directional acoustic temples with zero sound leakage',
      'Electrochromic tint adjustment from 10% to 90% opacity'
    ],
    specs: [
      { label: 'Field of View', value: '52° Diagonal Field of View' },
      { label: 'Display Type', value: 'Dual Micro-LED 1920x1080 @ 120Hz' },
      { label: 'Weight', value: '76 grams' },
      { label: 'Audio', value: 'Open-ear acoustic stereo with bone mic' },
      { label: 'Connectivity', value: 'USB-C DisplayPort Alt Mode + Wireless Puck' },
      { label: 'Lens Tint', value: 'Smart Electrochromic 4-level dimming' }
    ],
    colorOptions: [
      { name: 'Titanium Graphite', hex: '#1e293b' },
      { name: 'Carbon Black', hex: '#020617' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-phantom-drone',
    name: 'NEXUS Phantom 8K Cine Drone',
    tagline: 'Pocket Foldable 8K Cine Drone with 360° LiDAR Avoidance',
    description: 'Equipped with a 1-inch CMOS Hasselblad sensor delivering 8K/30fps and 4K/120fps HDR video. Solid-state LiDAR obstacle avoidance sensors ensure fail-safe autonomous tracking and cinematic orbital maneuvers.',
    price: 899,
    originalPrice: 999,
    category: 'Drones',
    brand: 'NEXUS Aerial',
    rating: 4.9,
    reviewCount: 54,
    inStock: true,
    stockCount: 5,
    reservedCount: 2,
    activeViewers: 17,
    sku: 'NX-DRN-800',
    accentColor: '#f43f5e',
    iconType: 'drone',
    badge: 'Flash Sale',
    warranty: '3-Year Nexus Hardware Guarantee',
    features: [
      '1-inch CMOS Sensor capturing 8K/30fps 10-bit D-Log M',
      'Solid-State LiDAR 360° Omnidirectional Obstacle Sensing',
      '42-minute flight time on Intelligent Flight Battery',
      'OcuLink-4 HD transmission up to 18km range',
      'Sub-249g ultralight foldable architecture'
    ],
    specs: [
      { label: 'Sensor', value: '1" CMOS, 48MP Effective Pixels' },
      { label: 'Max Flight Time', value: '42 minutes (no wind)' },
      { label: 'Max Transmission Range', value: '18 km (FCC standard)' },
      { label: 'Takeoff Weight', value: '249 grams' },
      { label: 'Video Resolution', value: '8K @ 30fps / 4K @ 120fps' },
      { label: 'Internal Storage', value: '128GB High-Speed SSD' }
    ],
    colorOptions: [
      { name: 'Matte Storm Gray', hex: '#475569' },
      { name: 'Stealth Onyx', hex: '#090d16' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-pulse-core',
    name: 'PULSE Core 200W GaN Station',
    tagline: 'Desktop GaN III Fast Charger with Live Wattage Meter',
    description: 'Power all your devices from a single compact hub. Features 4x USB-C PD 3.1 ports (up to 140W on port 1) and 1x USB-A port with an interactive color OLED screen monitoring real-time power draw, voltage, and thermal curves.',
    price: 119,
    originalPrice: 139,
    category: 'Power',
    brand: 'NEXUS PowerLab',
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 12,
    reservedCount: 3,
    activeViewers: 8,
    sku: 'NX-PWR-200',
    accentColor: '#a855f7',
    iconType: 'power',
    badge: 'Bestseller',
    warranty: '3-Year Nexus Hardware Guarantee',
    features: [
      '200W Total Combined Output via GaN III Gallium Nitride Architecture',
      '140W Single-Port USB-C PD 3.1 Fast Charging for M3/M4 Laptops',
      'Color OLED Diagnostic Display showing live wattage and temperature',
      'Active CoolAir Dynamic Heat Dissipation Technology',
      'Zero-Overshoot intelligent power distribution algorithm'
    ],
    specs: [
      { label: 'Total Output', value: '200W Max' },
      { label: 'Ports', value: '4x USB-C (PD 3.1 / PPS), 1x USB-A (QC 4.0)' },
      { label: 'Technology', value: 'Navitas GaNFast III Semiconductor' },
      { label: 'Safety Systems', value: 'Over-temp, over-voltage, short-circuit, surge' },
      { label: 'Weight', value: '420 grams' },
      { label: 'Dimensions', value: '105 x 82 x 34 mm' }
    ],
    colorOptions: [
      { name: 'Obsidian Gray', hex: '#1e293b' },
      { name: 'Pure Dark', hex: '#090d16' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-orbital-glide',
    name: 'ORBITAL Glide Ultra Mouse',
    tagline: '38g Carbon Fiber Composite Wireless Gaming Mouse',
    description: 'Built with an aerospace-grade carbon fiber unibody structure weighing a featherlight 38 grams. Packed with the 42,000 DPI Optical Sensor, optical switches rated for 100M clicks, and 8,000Hz hyper-polling wireless dongle.',
    price: 149,
    originalPrice: 179,
    category: 'Computing',
    brand: 'NEXUS Matrix',
    rating: 4.8,
    reviewCount: 164,
    inStock: true,
    stockCount: 7,
    reservedCount: 2,
    activeViewers: 9,
    sku: 'NX-INP-038',
    accentColor: '#eab308',
    iconType: 'mouse',
    badge: 'Limited Batch',
    warranty: '2-Year Nexus Hardware Guarantee',
    features: [
      'Aerospace-Grade Carbon Fiber Skeleton weighing only 38 grams',
      'Flagship 42,000 DPI Optical Sensor with 750 IPS tracking',
      '8,000Hz True Wireless Polling Rate dongle included',
      'Zero-debounce Optical Microswitches rated for 100M clicks',
      'Pure virgin-grade PTFE curved mouse skates for effortless glide'
    ],
    specs: [
      { label: 'Weight', value: '38 grams ± 1g' },
      { label: 'Sensor', value: 'PixArt Flagship Optical (42K DPI)' },
      { label: 'Polling Rate', value: 'Up to 8,000 Hz' },
      { label: 'Battery Life', value: '80 hours @ 1,000Hz / 25 hours @ 8,000Hz' },
      { label: 'Connectivity', value: '2.4GHz Wireless, USB-C Paracord' }
    ],
    colorOptions: [
      { name: 'Forged Carbon', hex: '#0f172a' },
      { name: 'Chalk White', hex: '#e2e8f0' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-astro-bot',
    name: 'ASTRO Desk Companion Bot',
    tagline: 'AI Robotic Desktop Assistant with Expressive OLED Eyes',
    description: 'An intelligent desktop robotics companion with kinetic head articulation, touch sensors, edge AI voice synthesis, and pomodoro focus coaching. Keeps your workspace lively while notifying you of incoming emails and calendar commitments.',
    price: 279,
    originalPrice: 320,
    category: 'Robotics',
    brand: 'NEXUS Robotics',
    rating: 4.9,
    reviewCount: 88,
    inStock: true,
    stockCount: 5,
    reservedCount: 1,
    activeViewers: 15,
    sku: 'NX-ROB-101',
    accentColor: '#14b8a6',
    iconType: 'robot',
    badge: 'New Release',
    warranty: '2-Year Nexus Hardware Guarantee',
    features: [
      'Dual-Axis Micro-Servos for expressive head gestures and tilt',
      'Curved 1.9-inch OLED display rendering over 80 mood expressions',
      'Capacitive touch sensors on forehead and chin for tactile feedback',
      'Integrated ambient noise meter & Pomodoro work timer',
      'Local privacy-first Neural Processing Unit (no audio sent to cloud)'
    ],
    specs: [
      { label: 'Processor', value: 'Quad-Core RISC-V with 1.2 TOPS NPU' },
      { label: 'Servos', value: 'Brushless High-Precision Magnetic Micro-Servos' },
      { label: 'Display', value: '1.9" Curved OLED 320x240' },
      { label: 'Connectivity', value: 'Wi-Fi 6, Bluetooth 5.3, USB-C' },
      { label: 'Sensors', value: 'Time-of-Flight Distance, Quad Far-Field Mics' }
    ],
    colorOptions: [
      { name: 'Cyber Teal', hex: '#0f766e' },
      { name: 'Lunar White', hex: '#f8fafc' },
      { name: 'Stealth Black', hex: '#090d16' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    productId: 'prod-vortex-aero',
    author: 'Marcus Vance',
    rating: 5,
    date: '2 days ago',
    title: 'The cleanest soundstage on any wireless headphone, hands down',
    comment: 'The planar drivers deliver acoustic separation that blows conventional dynamic drivers away. The ANC is smooth with zero ear cabin pressure. Premium build quality and the latency dongle is seamless for competitive gaming.',
    verifiedPurchase: true,
    helpfulVotes: 34,
    userHelpful: false
  },
  {
    id: 'rev-102',
    productId: 'prod-vortex-aero',
    author: 'Elena Rostova',
    rating: 5,
    date: '1 week ago',
    title: 'Worth every dollar for music production on the go',
    comment: 'Battery life easily lasts me through long flights and studio sessions. The magnesium chassis feels indestructible without weighing your neck down.',
    verifiedPurchase: true,
    helpfulVotes: 19,
    userHelpful: false
  },
  {
    id: 'rev-103',
    productId: 'prod-aura-watch',
    author: 'David Chen',
    rating: 5,
    date: '3 days ago',
    title: 'Titanium craftsmanship is comparable to luxury mechanical watches',
    comment: 'The Micro-OLED screen is astonishingly bright even under direct sunlight. Battery lasts almost 2 full weeks with continuous biometric tracking enabled. Exceptional piece of engineering.',
    verifiedPurchase: true,
    helpfulVotes: 28,
    userHelpful: false
  },
  {
    id: 'rev-104',
    productId: 'prod-cyberdeck-75',
    author: 'Liam O’Connor',
    rating: 5,
    date: '5 days ago',
    title: 'Rapid trigger switch responsiveness is next-level',
    comment: 'The acoustic profile is deep and thocky without being irritating. Magnetic actuation points make typing and gaming insanely effortless. Heavy brass weight anchors it firmly on my desk.',
    verifiedPurchase: true,
    helpfulVotes: 42,
    userHelpful: false
  },
  {
    id: 'rev-105',
    productId: 'prod-pulse-core',
    author: 'Sarah Jenkins',
    rating: 5,
    date: '2 weeks ago',
    title: 'Replaced all 5 chargers in my bag with this single beast',
    comment: 'The live OLED power readout is so addictive to watch. Powers my 16" MacBook Pro at full 140W while charging my phone, watch, and tablet simultaneously. Stays remarkably cool.',
    verifiedPurchase: true,
    helpfulVotes: 51,
    userHelpful: false
  }
];
