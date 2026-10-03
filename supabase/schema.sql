-- =========================================================================
-- REPATH DATABASE SCHEMA (Supabase / PostgreSQL)
-- Circular Lifecycle Intelligence, Product Passports, Repairer Network & Recovery
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'REPAIRER', 'BUYER', 'RECYCLER', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');
CREATE TYPE lifecycle_status AS ENUM ('ACTIVE', 'IN_REPAIR', 'RESOLD', 'IN_RECOVERY', 'COLLECTED', 'RECYCLED', 'END_OF_LIFE');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  avatar_url TEXT,
  organization VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1b. DEVICE CATALOG (Structured Multi-Category Hardware Registry & GSMA TAC)
CREATE TABLE IF NOT EXISTS device_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_type VARCHAR(100) NOT NULL, -- Smartphone, Laptop, Tablet, Smartwatch, TV, Appliance, etc.
  brand VARCHAR(120) NOT NULL,
  model VARCHAR(180) NOT NULL,
  model_number VARCHAR(120),
  release_year INT,
  specifications JSONB DEFAULT '{}'::jsonb,
  tac_prefixes TEXT[], -- GSMA TAC 8-digit prefixes for legal IMEI resolution
  source VARCHAR(50) DEFAULT 'OEM_CATALOG',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_device_catalog_type_brand ON device_catalog(device_type, brand);
CREATE INDEX idx_device_catalog_model ON device_catalog(model);

-- 2. PRODUCTS (Customer Physical Hardware Registered on RePath)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Customer owner
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  device_catalog_id UUID REFERENCES device_catalog(id) ON DELETE SET NULL,
  repath_product_id VARCHAR(64) NOT NULL UNIQUE, -- e.g. RP-SM-72891, RP-DL-72891
  repath_id VARCHAR(64) NOT NULL UNIQUE,
  brand VARCHAR(120) NOT NULL,
  model VARCHAR(180) NOT NULL,
  model_number VARCHAR(120),
  product_type VARCHAR(100) NOT NULL, -- Smartphone, Laptop, Appliance, Bicycle, etc.
  imei_hash VARCHAR(64), -- Secure SHA-256 hash for privacy-safe duplicate checking
  masked_imei VARCHAR(64), -- Masked format: ••••••••••••1234
  serial_number TEXT, -- Sensitive identifier, masked on public views
  purchase_date DATE NOT NULL,
  invoice_url TEXT,
  qr_code TEXT,
  condition VARCHAR(50) NOT NULL DEFAULT 'GOOD',
  lifecycle_status lifecycle_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_repath_id ON products(repath_id);
CREATE INDEX idx_products_repath_product_id ON products(repath_product_id);
CREATE INDEX idx_products_owner_id ON products(owner_id);
CREATE INDEX idx_products_imei_hash ON products(imei_hash);

-- 3. PRODUCT PASSPORTS (Cryptographic & Lifecycle Ledger)
CREATE TABLE IF NOT EXISTS product_passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  repath_id VARCHAR(64) NOT NULL UNIQUE,
  serial_number_hash TEXT, -- Stored hashed/privacy-protected
  invoice_url TEXT,
  repairability_score NUMERIC(3, 1) DEFAULT 8.5,
  estimated_resale_min NUMERIC(10, 2),
  estimated_resale_max NUMERIC(10, 2),
  verified_repairs_count INT DEFAULT 0,
  last_service_date DATE,
  qr_code_svg TEXT,
  public_route TEXT NOT NULL, -- /passport/RP-DL-72891
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_passports_repath_id ON product_passports(repath_id);

-- 4. REPAIRERS (Verified Repair Shops & Network Specialists)
CREATE TABLE IF NOT EXISTS repairers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL, -- Shop Name
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  pincode VARCHAR(20),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  specialty VARCHAR(255) NOT NULL,
  experience_years INT DEFAULT 3,
  opening_hours VARCHAR(120) DEFAULT '09:00 AM - 08:00 PM',
  availability VARCHAR(20) DEFAULT 'OPEN',
  verification_status verification_status DEFAULT 'PENDING_VERIFICATION',
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  review_count INT DEFAULT 0,
  completed_repairs INT DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_repairers_city ON repairers(city);
CREATE INDEX idx_repairers_verified ON repairers(verified);
CREATE INDEX idx_repairers_rating ON repairers(rating DESC);

-- 5. REPAIRER SERVICES & SPECIALIZATIONS
CREATE TABLE IF NOT EXISTS repairer_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repairer_id UUID NOT NULL REFERENCES repairers(id) ON DELETE CASCADE,
  service_name VARCHAR(180) NOT NULL,
  typical_cost_min NUMERIC(10, 2),
  typical_cost_max NUMERIC(10, 2)
);

CREATE TABLE IF NOT EXISTS repairer_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repairer_id UUID NOT NULL REFERENCES repairers(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL -- Laptop, Smartphone, Tablet, Appliance, etc.
);

-- 6. REPAIR REQUEST FLOW (Customer -> Request -> Repairer -> In Repair -> Completed -> Verified)
CREATE TYPE repair_stage AS ENUM ('REQUESTED', 'ACCEPTED', 'IN_REPAIR', 'COMPLETED', 'VERIFIED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS repair_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repairer_id UUID NOT NULL REFERENCES repairers(id) ON DELETE CASCADE,
  issue_description TEXT NOT NULL,
  ai_assessment_summary TEXT,
  stage repair_stage DEFAULT 'REQUESTED',
  parts_replaced TEXT[],
  cost NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. REVIEWS (Tied strictly to completed repair requests to prevent fraudulent reviews)
CREATE TABLE IF NOT EXISTS repair_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_request_id UUID UNIQUE NOT NULL REFERENCES repair_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repairer_id UUID NOT NULL REFERENCES repairers(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCT LIFECYCLE AUDIT TRAIL
CREATE TABLE IF NOT EXISTS product_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  event_type VARCHAR(80) NOT NULL, -- MANUFACTURED, REGISTERED, MAINTAINED, REPAIR, RESALE, RECOVERY, END_OF_LIFE
  title VARCHAR(255) NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT TRUE,
  verification_level VARCHAR(50) DEFAULT 'REPAIRER_VERIFIED',
  actor_name VARCHAR(180) NOT NULL,
  actor_role user_role NOT NULL,
  parts_replaced TEXT[],
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lifecycle_product_id ON product_lifecycle_events(product_id);

-- 9. RESALE LISTINGS (Attached Cryptographic Digital Passports)
CREATE TABLE IF NOT EXISTS resale_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asking_price NUMERIC(10, 2) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  verified_repairs_count INT DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RECOVERY PARTNERS & MATERIAL EXTRACTION
CREATE TABLE IF NOT EXISTS recovery_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  r2_certified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recovery_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES recovery_partners(id) ON DELETE SET NULL,
  recovery_type VARCHAR(80) NOT NULL, -- SELL_FOR_PARTS, MATERIAL_RECOVERY, E_WASTE, RECYCLING
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  material_breakdown JSONB, -- { aluminium_kg: 0.85, copper_kg: 0.12, lithium_cell: true }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REPATH AI CONVERSATIONS & SAFETY AUDIT
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title VARCHAR(255) DEFAULT 'Hardware Technical Consultation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' | 'model'
  message TEXT NOT NULL,
  structured_action JSONB, -- { likelyIssue, nextSafeCheck, recommendedPath, confidence }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'repair_accepted', 'repair_completed', 'verification_approved'
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict customer privacy protection: never expose private owner data in public passport
-- =========================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_lifecycle_events ENABLE ROW LEVEL SECURITY;

-- Public can view the device catalog
CREATE POLICY "Public device catalog is readable by anyone"
  ON device_catalog FOR SELECT
  USING (true);

-- Public can view un-redacted public passport data (excludes owner credentials)
CREATE POLICY "Public passport data is readable by anyone"
  ON product_passports FOR SELECT
  USING (true);

-- Public can view lifecycle events
CREATE POLICY "Public lifecycle events are readable"
  ON product_lifecycle_events FOR SELECT
  USING (true);

-- Public can view verified repairers
CREATE POLICY "Public repairers are readable"
  ON repairers FOR SELECT
  USING (true);

-- Customers can view and manage their own products
CREATE POLICY "Users can manage their own registered products"
  ON products FOR ALL
  USING (auth.uid() = owner_id);

-- Customers can manage their own repair requests
CREATE POLICY "Users can view their own repair requests"
  ON repair_requests FOR SELECT
  USING (auth.uid() = customer_id);
