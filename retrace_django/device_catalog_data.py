# Structured Hardware Device Catalog & GSMA TAC (Type Allocation Code) Database
# Supports Smartphones, Laptops, Tablets, Smartwatches, TVs, Appliances, Gaming, Bicycles, etc.

DEVICE_TYPES = [
  'Smartphone',
  'Laptop',
  'Tablet',
  'Smartwatch',
  'Television',
  'Refrigerator',
  'Washing Machine',
  'Gaming Device',
  'Bicycle',
  'Audio',
  'Other'
];

DEVICE_CATALOG = [
  # ==================== SMARTPHONES (WITH TAC PREFIXES FOR IMEI LOOKUP) ====================
  {
    "id": 'cat-sm-samsung-s24u',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy S24 Ultra',
    "modelNumber": 'SM-S928B/DS',
    "releaseYear": 2024,
    "tacPrefixes": ['35824009', '358240', '352940'],
    "specifications": {
    "processor": 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
    "ram": '12GB LPDDR5X',
    "storage": '256GB / 512GB / 1TB UFS 4.0',
    "display": '6.8" Dynamic AMOLED 2X, 120Hz, 2600 nits',
    "batteryHealth": '5000 mAh (100% OEM)',
    "color": 'Titanium Gray, Titanium Black, Titanium Violet',
    "mainCamera": '200 MP Quad Camera',
    "os": 'Android 14 / One UI 6.1 (7 Years OS Updates)'
    },
    "repairabilityScore": 8.5,
    "estimatedResaleMin": 65000,
    "estimatedResaleMax": 82000,
    "warranty": 'Samsung Care+ / 1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-samsung-s24p',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy S24+',
    "modelNumber": 'SM-S926B/DS',
    "releaseYear": 2024,
    "tacPrefixes": ['35823809', '358238'],
    "specifications": {
    "processor": 'Exynos 2400 / Snapdragon 8 Gen 3',
    "ram": '12GB LPDDR5X',
    "storage": '256GB / 512GB UFS 4.0',
    "display": '6.7" Dynamic AMOLED 2X, 120Hz',
    "batteryHealth": '4900 mAh (100% OEM)',
    "color": 'Onyx Black, Marble Gray, Cobalt Violet'
    },
    "repairabilityScore": 8.2,
    "estimatedResaleMin": 52000,
    "estimatedResaleMax": 65000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-samsung-s24',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy S24',
    "modelNumber": 'SM-S921B/DS',
    "releaseYear": 2024,
    "tacPrefixes": ['35823609', '358236'],
    "specifications": {
    "processor": 'Exynos 2400 / Snapdragon 8 Gen 3',
    "ram": '8GB LPDDR5X',
    "storage": '128GB / 256GB',
    "display": '6.2" Dynamic AMOLED 2X, 120Hz',
    "batteryHealth": '4000 mAh (100% OEM)',
    "color": 'Amber Yellow, Onyx Black, Marble Gray'
    },
    "repairabilityScore": 8.0,
    "estimatedResaleMin": 45000,
    "estimatedResaleMax": 55000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-samsung-s23u',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy S23 Ultra',
    "modelNumber": 'SM-S918B/DS',
    "releaseYear": 2023,
    "tacPrefixes": ['35581211', '355812'],
    "specifications": {
    "processor": 'Snapdragon 8 Gen 2 for Galaxy',
    "ram": '12GB LPDDR5X',
    "storage": '256GB / 512GB UFS 4.0',
    "display": '6.8" Dynamic AMOLED 2X 120Hz',
    "batteryHealth": '5000 mAh (96% OEM)',
    "color": 'Phantom Black, Green, Cream, Lavender'
    },
    "repairabilityScore": 7.8,
    "estimatedResaleMin": 48000,
    "estimatedResaleMax": 59000,
    "warranty": 'Standard Warranty Expired',
    "image": 'https:#images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-samsung-s23',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy S23',
    "modelNumber": 'SM-S911B/DS',
    "releaseYear": 2023,
    "tacPrefixes": ['35581011', '355810'],
    "specifications": {
    "processor": 'Snapdragon 8 Gen 2 for Galaxy',
    "ram": '8GB LPDDR5X',
    "storage": '128GB / 256GB',
    "display": '6.1" Dynamic AMOLED 2X',
    "batteryHealth": '3900 mAh (94% OEM)',
    "color": 'Phantom Black, Cream'
    },
    "repairabilityScore": 7.9,
    "estimatedResaleMin": 32000,
    "estimatedResaleMax": 41000,
    "warranty": 'Standard Warranty Expired',
    "image": 'https:#images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-samsung-a54',
    "deviceType": 'Smartphone',
    "brand": 'Samsung',
    "model": 'Galaxy A54 5G',
    "modelNumber": 'SM-A546E/DS',
    "releaseYear": 2023,
    "tacPrefixes": ['35693803', '356938'],
    "specifications": {
    "processor": 'Exynos 1380 Octa-Core',
    "ram": '8GB RAM',
    "storage": '128GB / 256GB microSD expandable',
    "display": '6.4" Super AMOLED 120Hz',
    "batteryHealth": '5000 mAh (95% OEM)',
    "color": 'Awesome Violet, Awesome Graphite'
    },
    "repairabilityScore": 8.4,
    "estimatedResaleMin": 18000,
    "estimatedResaleMax": 24000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-15pm',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 15 Pro Max',
    "modelNumber": 'A3106 / A2849',
    "releaseYear": 2023,
    "tacPrefixes": ['35415411', '354154'],
    "specifications": {
    "processor": 'Apple A17 Pro (3nm)',
    "ram": '8GB Unified',
    "storage": '256GB / 512GB / 1TB NVMe',
    "display": '6.7" Super Retina XDR OLED, ProMotion 120Hz',
    "batteryHealth": '4422 mAh (98% OEM)',
    "color": 'Natural Titanium, Blue Titanium, White Titanium'
    },
    "repairabilityScore": 7.7,
    "estimatedResaleMin": 78000,
    "estimatedResaleMax": 95000,
    "warranty": 'AppleCare+ Active',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-15p',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 15 Pro',
    "modelNumber": 'A3102 / A2848',
    "releaseYear": 2023,
    "tacPrefixes": ['35415211', '354152'],
    "specifications": {
    "processor": 'Apple A17 Pro (3nm)',
    "ram": '8GB Unified',
    "storage": '128GB / 256GB / 512GB',
    "display": '6.1" Super Retina XDR OLED, ProMotion 120Hz',
    "batteryHealth": '3274 mAh (97% OEM)',
    "color": 'Natural Titanium, Black Titanium, White Titanium'
    },
    "repairabilityScore": 7.6,
    "estimatedResaleMin": 68000,
    "estimatedResaleMax": 82000,
    "warranty": 'Apple Limited Warranty Active',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-15plus',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 15 Plus',
    "modelNumber": 'A3094',
    "releaseYear": 2023,
    "tacPrefixes": ['35415011', '354150'],
    "specifications": {
    "processor": 'Apple A16 Bionic',
    "ram": '6GB Unified',
    "storage": '128GB / 256GB',
    "display": '6.7" Super Retina XDR OLED',
    "batteryHealth": '4383 mAh (99% OEM)',
    "color": 'Pink, Yellow, Green, Blue, Black'
    },
    "repairabilityScore": 8.0,
    "estimatedResaleMin": 55000,
    "estimatedResaleMax": 68000,
    "warranty": 'Apple Limited Warranty Active',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-15',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 15',
    "modelNumber": 'A3090 / A2846',
    "releaseYear": 2023,
    "tacPrefixes": ['35414811', '354148'],
    "specifications": {
    "processor": 'Apple A16 Bionic',
    "ram": '6GB Unified',
    "storage": '128GB / 256GB / 512GB',
    "display": '6.1" Super Retina XDR OLED, Dynamic Island',
    "batteryHealth": '3349 mAh (98% OEM)',
    "color": 'Blue, Pink, Yellow, Green, Black'
    },
    "repairabilityScore": 8.1,
    "estimatedResaleMin": 48000,
    "estimatedResaleMax": 60000,
    "warranty": 'Apple Limited Warranty Active',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-14p',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 14 Pro',
    "modelNumber": 'A2890',
    "releaseYear": 2022,
    "tacPrefixes": ['35201411', '352014'],
    "specifications": {
    "processor": 'Apple A16 Bionic',
    "ram": '6GB Unified',
    "storage": '128GB / 256GB',
    "display": '6.1" Super Retina XDR OLED 120Hz',
    "batteryHealth": '3200 mAh (91% OEM)',
    "color": 'Space Black, Deep Purple, Gold'
    },
    "repairabilityScore": 7.2,
    "estimatedResaleMin": 50000,
    "estimatedResaleMax": 62000,
    "warranty": 'Standard Warranty Expired',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-apple-14',
    "deviceType": 'Smartphone',
    "brand": 'Apple',
    "model": 'iPhone 14',
    "modelNumber": 'A2882',
    "releaseYear": 2022,
    "tacPrefixes": ['35201011', '352010'],
    "specifications": {
    "processor": 'Apple A15 Bionic',
    "ram": '6GB Unified',
    "storage": '128GB / 256GB',
    "display": '6.1" Super Retina XDR OLED',
    "batteryHealth": '3279 mAh (92% OEM)',
    "color": 'Midnight, Starlight, Blue, Purple'
    },
    "repairabilityScore": 7.5,
    "estimatedResaleMin": 38000,
    "estimatedResaleMax": 47000,
    "warranty": 'Standard Warranty Expired',
    "image": 'https:#images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-google-px8p',
    "deviceType": 'Smartphone',
    "brand": 'Google',
    "model": 'Pixel 8 Pro',
    "modelNumber": 'GC3VE / G1MNW',
    "releaseYear": 2023,
    "tacPrefixes": ['35876210', '358762'],
    "specifications": {
    "processor": 'Google Tensor G3 (Titan M2)',
    "ram": '12GB LPDDR5X',
    "storage": '128GB / 256GB / 512GB UFS 3.1',
    "display": '6.7" Super Actua OLED, 1-120Hz',
    "batteryHealth": '5050 mAh (96% OEM)',
    "color": 'Bay Blue, Obsidian, Porcelain'
    },
    "repairabilityScore": 8.3,
    "estimatedResaleMin": 50000,
    "estimatedResaleMax": 65000,
    "warranty": 'Google 1-Year Limited Warranty',
    "image": 'https:#images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-google-px8',
    "deviceType": 'Smartphone',
    "brand": 'Google',
    "model": 'Pixel 8',
    "modelNumber": 'GKWS6 / G9BQD',
    "releaseYear": 2023,
    "tacPrefixes": ['35876010', '358760'],
    "specifications": {
    "processor": 'Google Tensor G3',
    "ram": '8GB LPDDR5X',
    "storage": '128GB / 256GB',
    "display": '6.2" Actua OLED, 60-120Hz',
    "batteryHealth": '4575 mAh (97% OEM)',
    "color": 'Hazel, Rose, Obsidian'
    },
    "repairabilityScore": 8.2,
    "estimatedResaleMin": 38000,
    "estimatedResaleMax": 48000,
    "warranty": 'Google 1-Year Limited Warranty',
    "image": 'https:#images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-oneplus-12',
    "deviceType": 'Smartphone',
    "brand": 'OnePlus',
    "model": 'OnePlus 12',
    "modelNumber": 'CPH2573',
    "releaseYear": 2024,
    "tacPrefixes": ['35284611', '352846'],
    "specifications": {
    "processor": 'Snapdragon 8 Gen 3',
    "ram": '16GB LPDDR5X',
    "storage": '512GB UFS 4.0',
    "display": '6.82" 2K 120Hz ProXDR LTPO',
    "batteryHealth": '5400 mAh 100W SUPERVOOC (99% OEM)',
    "color": 'Silky Black, Flowy Emerald'
    },
    "repairabilityScore": 8.0,
    "estimatedResaleMin": 46000,
    "estimatedResaleMax": 56000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sm-xiaomi-14',
    "deviceType": 'Smartphone',
    "brand": 'Xiaomi',
    "model": 'Xiaomi 14',
    "modelNumber": '23127PN0CG',
    "releaseYear": 2024,
    "tacPrefixes": ['86892305', '868923'],
    "specifications": {
    "processor": 'Snapdragon 8 Gen 3',
    "ram": '12GB LPDDR5X',
    "storage": '512GB UFS 4.0',
    "display": '6.36" LTPO OLED 120Hz',
    "batteryHealth": '4610 mAh (98% OEM)',
    "color": 'Black, White, Jade Green'
    },
    "repairabilityScore": 7.9,
    "estimatedResaleMin": 42000,
    "estimatedResaleMax": 52000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== LAPTOPS ====================
  {
    "id": 'cat-lp-dell-insp15',
    "deviceType": 'Laptop',
    "brand": 'Dell',
    "model": 'Inspiron 15 5000',
    "modelNumber": 'Inspiron 3520 / 5510',
    "releaseYear": 2022,
    "specifications": {
    "processor": 'Intel Core i5-1135G7 (4 Cores / 8 Threads)',
    "ram": '16GB DDR4 3200MHz',
    "storage": '512GB NVMe M.2 SSD',
    "display": '15.6" FHD (1920x1080) Anti-Glare LED',
    "batteryHealth": '41 Whr 3-cell (94% OEM health)',
    "color": 'Platinum Silver'
    },
    "repairabilityScore": 8.5,
    "estimatedResaleMin": 18000,
    "estimatedResaleMax": 21000,
    "warranty": 'Standard OEM Warranty Active (12 Months)',
    "image": 'https:#images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-dell-xps13',
    "deviceType": 'Laptop',
    "brand": 'Dell',
    "model": 'XPS 13 Plus',
    "modelNumber": 'XPS 9320',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Intel Core i7-1360P',
    "ram": '16GB LPDDR5',
    "storage": '1TB NVMe PCIe 4.0 SSD',
    "display": '13.4" 3.5K OLED InfinityEdge Touch',
    "batteryHealth": '55 Whr (92% OEM)',
    "color": 'Platinum / Graphite'
    },
    "repairabilityScore": 6.8,
    "estimatedResaleMin": 65000,
    "estimatedResaleMax": 80000,
    "warranty": 'Dell ProSupport Active',
    "image": 'https:#images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-apple-mbp14-m3',
    "deviceType": 'Laptop',
    "brand": 'Apple',
    "model": 'MacBook Pro 14" (M3 Pro)',
    "modelNumber": 'A2992 / MRX33HN/A',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Apple M3 Pro (11-core CPU, 14-core GPU)',
    "ram": '18GB Unified Memory',
    "storage": '512GB High-Speed SSD',
    "display": '14.2" Liquid Retina XDR, ProMotion 120Hz',
    "batteryHealth": '70 Whr (99% OEM - 28 cycles)',
    "color": 'Space Black, Silver'
    },
    "repairabilityScore": 6.5,
    "estimatedResaleMin": 120000,
    "estimatedResaleMax": 145000,
    "warranty": 'Apple Limited Warranty Active',
    "image": 'https:#images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-apple-mba13-m2',
    "deviceType": 'Laptop',
    "brand": 'Apple',
    "model": 'MacBook Air 13" (M2)',
    "modelNumber": 'A2681 / MLY33HN/A',
    "releaseYear": 2022,
    "specifications": {
    "processor": 'Apple M2 (8-core CPU, 8-core GPU)',
    "ram": '8GB Unified Memory',
    "storage": '256GB SSD',
    "display": '13.6" Liquid Retina Display',
    "batteryHealth": '52.6 Whr (95% OEM)',
    "color": 'Midnight, Starlight, Space Gray, Silver'
    },
    "repairabilityScore": 6.8,
    "estimatedResaleMin": 62000,
    "estimatedResaleMax": 74000,
    "warranty": 'Standard Warranty Expired',
    "image": 'https:#images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-lenovo-x1c',
    "deviceType": 'Laptop',
    "brand": 'Lenovo',
    "model": 'ThinkPad X1 Carbon Gen 11',
    "modelNumber": '21HM0004US',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Intel Core i7-1365U vPro',
    "ram": '32GB LPDDR5',
    "storage": '1TB M.2 PCIe 4.0 SSD',
    "display": '14" 2.8K OLED Anti-Glare 400 nits',
    "batteryHealth": '57 Whr (96% OEM)',
    "color": 'Deep Black Carbon Weave'
    },
    "repairabilityScore": 8.8,
    "estimatedResaleMin": 72000,
    "estimatedResaleMax": 88000,
    "warranty": 'Lenovo Premier Support 3 Years',
    "image": 'https:#images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-hp-aero13',
    "deviceType": 'Laptop',
    "brand": 'HP',
    "model": 'Pavilion Aero 13',
    "modelNumber": '13-be2000',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'AMD Ryzen 7 7735U',
    "ram": '16GB LPDDR5',
    "storage": '1TB NVMe SSD',
    "display": '13.3" WQXGA (2560x1600) 400 nits',
    "batteryHealth": '43 Whr (91% OEM)',
    "color": 'Natural Silver, Warm Gold'
    },
    "repairabilityScore": 8.0,
    "estimatedResaleMin": 34000,
    "estimatedResaleMax": 42000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-lp-asus-zephg14',
    "deviceType": 'Laptop',
    "brand": 'ASUS',
    "model": 'ROG Zephyrus G14',
    "modelNumber": 'GA403UI',
    "releaseYear": 2024,
    "specifications": {
    "processor": 'AMD Ryzen 9 8945HS',
    "ram": '32GB LPDDR5X',
    "storage": '1TB PCIe 4.0 SSD',
    "display": '14" 3K 120Hz OLED ROG Nebula',
    "batteryHealth": '73 Whr (98% OEM)',
    "color": 'Eclipse Gray, Platinum White'
    },
    "repairabilityScore": 7.8,
    "estimatedResaleMin": 95000,
    "estimatedResaleMax": 115000,
    "warranty": 'ASUS 2-Year International Warranty',
    "image": 'https:#images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== TABLETS ====================
  {
    "id": 'cat-tb-apple-ipadpro11',
    "deviceType": 'Tablet',
    "brand": 'Apple',
    "model": 'iPad Pro 11" (M4)',
    "modelNumber": 'A2836',
    "releaseYear": 2024,
    "specifications": {
    "processor": 'Apple M4 Chip (9-core CPU)',
    "ram": '8GB Unified',
    "storage": '256GB SSD',
    "display": '11" Ultra Retina Tandem OLED, ProMotion 120Hz',
    "batteryHealth": '31.29 Whr (100% OEM)',
    "color": 'Space Black, Silver'
    },
    "repairabilityScore": 6.2,
    "estimatedResaleMin": 72000,
    "estimatedResaleMax": 88000,
    "warranty": 'Apple 1-Year Limited Warranty',
    "image": 'https:#images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-tb-samsung-tabs9',
    "deviceType": 'Tablet',
    "brand": 'Samsung',
    "model": 'Galaxy Tab S9',
    "modelNumber": 'SM-X710',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Snapdragon 8 Gen 2 for Galaxy',
    "ram": '12GB RAM',
    "storage": '256GB + microSD up to 1TB',
    "display": '11" Dynamic AMOLED 2X 120Hz IP68',
    "batteryHealth": '8400 mAh (97% OEM)',
    "color": 'Graphite, Beige'
    },
    "repairabilityScore": 7.5,
    "estimatedResaleMin": 45000,
    "estimatedResaleMax": 56000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== SMARTWATCHES ====================
  {
    "id": 'cat-sw-apple-watchs9',
    "deviceType": 'Smartwatch',
    "brand": 'Apple',
    "model": 'Apple Watch Series 9',
    "modelNumber": 'A2980 (45mm)',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Apple S9 SiP 64-bit dual-core',
    "storage": '64GB Internal',
    "display": 'Always-On Retina OLED, 2000 nits',
    "batteryHealth": '308 mAh (94% OEM)',
    "color": 'Midnight, Starlight, Silver, (PRODUCT)RED'
    },
    "repairabilityScore": 5.5,
    "estimatedResaleMin": 22000,
    "estimatedResaleMax": 29000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-sw-samsung-watch6',
    "deviceType": 'Smartwatch',
    "brand": 'Samsung',
    "model": 'Galaxy Watch 6 Classic',
    "modelNumber": 'SM-R960 (47mm)',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Exynos W930 Dual-Core',
    "ram": '2GB + 16GB Storage',
    "display": '1.5" Super AMOLED Sapphire Crystal',
    "batteryHealth": '425 mAh (95% OEM)',
    "color": 'Black, Silver'
    },
    "repairabilityScore": 7.0,
    "estimatedResaleMin": 18000,
    "estimatedResaleMax": 24000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== TELEVISIONS ====================
  {
    "id": 'cat-tv-lg-c3',
    "deviceType": 'Television',
    "brand": 'LG',
    "model": 'C3 OLED 4K Smart TV',
    "modelNumber": 'OLED65C3PSA',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'α9 AI Processor Gen6 4K',
    "display": '65" Self-Lighting OLED evo 120Hz, Dolby Vision',
    "audio": '40W 2.2 Channel Dolby Atmos',
    "connectivity": '4x HDMI 2.1 (4K 120Hz, eARC), Wi-Fi 6',
    "os": 'webOS 23 Smart Platform'
    },
    "repairabilityScore": 8.2,
    "estimatedResaleMin": 85000,
    "estimatedResaleMax": 110000,
    "warranty": 'LG 3-Year Panel Warranty',
    "image": 'https:#images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-tv-samsung-s90c',
    "deviceType": 'Television',
    "brand": 'Samsung',
    "model": 'S90C OLED 4K TV',
    "modelNumber": 'QA65S90CAUXZN',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'Neural Quantum Processor 4K',
    "display": '65" Quantum HDR OLED 144Hz',
    "audio": '40W 2.1CH Object Tracking Sound Lite',
    "connectivity": '4x HDMI 2.1 (4K 144Hz)',
    "os": 'Tizen OS'
    },
    "repairabilityScore": 8.0,
    "estimatedResaleMin": 90000,
    "estimatedResaleMax": 115000,
    "warranty": 'Samsung 2-Year Comprehensive Warranty',
    "image": 'https:#images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== HOME APPLIANCES ====================
  {
    "id": 'cat-rf-samsung-bespoke',
    "deviceType": 'Refrigerator',
    "brand": 'Samsung',
    "model": 'Bespoke 4-Door French Door Refrigerator',
    "modelNumber": 'RF29BB8600QL',
    "releaseYear": 2023,
    "specifications": {
    "capacity": '650 Litres Quad Door',
    "compressor": 'Digital Inverter Compressor (20-Year Warranty)',
    "features": 'Beverage Center, Dual Auto Ice Maker, Metal Cooling',
    "energyRating": '4 Star BEE Efficiency',
    "color": 'Custom Glass Clean White / Clean Navy'
    },
    "repairabilityScore": 8.8,
    "estimatedResaleMin": 55000,
    "estimatedResaleMax": 70000,
    "warranty": '10 Years Compressor / 1 Year Product',
    "image": 'https:#images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-wm-bosch-series6',
    "deviceType": 'Washing Machine',
    "brand": 'Bosch',
    "model": 'Series 6 Front Loader 9kg',
    "modelNumber": 'WAJ2846SIN',
    "releaseYear": 2023,
    "specifications": {
    "capacity": '9.0 kg Heavy Duty Front Load',
    "motor": 'EcoSilence Drive Inverter BLDC Motor',
    "spinSpeed": '1400 RPM High Efficiency',
    "features": 'ActiveWater Plus, AntiVibration Design, Hygiene Plus',
    "color": 'Silver Inox'
    },
    "repairabilityScore": 9.1,
    "estimatedResaleMin": 22000,
    "estimatedResaleMax": 29000,
    "warranty": '12 Years Motor Warranty / 2 Years Comprehensive',
    "image": 'https:#images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== GAMING DEVICES ====================
  {
    "id": 'cat-gm-sony-ps5',
    "deviceType": 'Gaming Device',
    "brand": 'Sony',
    "model": 'PlayStation 5 Slim',
    "modelNumber": 'CFI-2000',
    "releaseYear": 2023,
    "specifications": {
    "processor": 'AMD Zen 2 (8 cores / 16 threads, 3.5 GHz)',
    "gpu": 'AMD RDNA 2 based 10.3 TFLOPs',
    "ram": '16GB GDDR6',
    "storage": '1TB Custom High-Speed NVMe SSD',
    "features": 'Detachable Ultra HD Blu-ray Disc Drive, Tempest 3D Audio',
    "color": 'White Matte'
    },
    "repairabilityScore": 8.5,
    "estimatedResaleMin": 34000,
    "estimatedResaleMax": 42000,
    "warranty": 'Sony 1-Year Limited Warranty',
    "image": 'https:#images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },
  {
    "id": 'cat-gm-valve-steamdeck',
    "deviceType": 'Gaming Device',
    "brand": 'Valve',
    "model": 'Steam Deck OLED',
    "modelNumber": '1030 (512GB)',
    "releaseYear": 2023,
    "specifications": {
    "processor": '6nm AMD APU (Zen 2 4c/8t + RDNA 2 8 CUs)',
    "ram": '16GB LPDDR5 6400 MT/s',
    "storage": '512GB NVMe SSD + High-Speed microSD',
    "display": '7.4" HDR OLED 90Hz 1000 nits peak',
    "batteryHealth": '50Whr (97% OEM)',
    "color": 'Matte Black'
    },
    "repairabilityScore": 9.3,
    "estimatedResaleMin": 38000,
    "estimatedResaleMax": 47000,
    "warranty": 'iFixit Official Parts Partner & 1-Year Warranty',
    "image": 'https:#images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== BICYCLES ====================
  {
    "id": 'cat-bk-trek-fx3',
    "deviceType": 'Bicycle',
    "brand": 'Trek',
    "model": 'FX 3 Disc',
    "modelNumber": 'FX3-DISC-2024',
    "releaseYear": 2024,
    "specifications": {
    "frame": 'Alpha Gold Aluminum, DuoTrap S-compatible',
    "fork": 'FX Carbon, flat mount disc, hidden fender mounts',
    "drivetrain": 'Shimano Deore M5120 1x10 speed',
    "brakes": 'Shimano MT201 hydraulic disc',
    "color": 'Matte Dnister Black / Viper Red'
    },
    "repairabilityScore": 9.8,
    "estimatedResaleMin": 35000,
    "estimatedResaleMax": 46000,
    "warranty": 'Trek Lifetime Frame Warranty',
    "image": 'https:#images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  },

  # ==================== AUDIO / OTHER ELECTRONICS ====================
  {
    "id": 'cat-au-sony-wh1000xm5',
    "deviceType": 'Audio',
    "brand": 'Sony',
    "model": 'WH-1000XM5 Wireless Noise Cancelling Headphones',
    "modelNumber": 'WH-1000XM5/BM',
    "releaseYear": 2022,
    "specifications": {
    "drivers": '30mm Carbon Fiber Composite',
    "noiseCancelling": 'Integrated Processor V1 + HD QN1',
    "batteryHealth": '30 Hours with ANC On (95% OEM)',
    "codecs": 'LDAC, AAC, SBC, Hi-Res Audio Wireless',
    "color": 'Black / Silver / Midnight Blue'
    },
    "repairabilityScore": 7.5,
    "estimatedResaleMin": 16000,
    "estimatedResaleMax": 21000,
    "warranty": '1 Year OEM Warranty',
    "image": 'https:#images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    "source": 'OFFICIAL_CATALOG'
  }
];

# Helper to look up device by TAC prefix

def find_device_by_tac(tac):
    if not tac or not isinstance(tac, str):
        return None
    clean_tac = tac.strip()
    for device in DEVICE_CATALOG:
        prefixes = device.get('tacPrefixes')
        if not prefixes or not isinstance(prefixes, list):
            continue
        for prefix in prefixes:
            if clean_tac.startswith(prefix) or prefix.startswith(clean_tac):
                return device
    return None
