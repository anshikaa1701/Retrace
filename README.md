# ReTrace — Give Every Product a Next Path

> A futuristic, circular hardware intelligence platform that gives physical products a digital identity and lifecycle passport: **Repair → Resell → Recover → Recycle**.

---

## 🌟 Brand & Core Concept

**ReTrace** transforms consumer electronics from disposable hardware into traceable, serviceable, circular assets. When a device develops a fault, ReTrace determines what should happen next:
- **Repair**: Diagnostics, compatible parts sourcing, and cryptographically verified technician sign-offs.
- **Resell**: Transparent circular marketplace with verified maintenance pedigree and battery health telemetry.
- **Recover**: Salvaging working RAM, SSDs, and displays for educational reuse or second-life projects.
- **Recycle**: R2v3 certified hydrometallurgical smelting and closed-loop rare-earth extraction.

---

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark-First Glassmorphism Design System
- **State Management & Persistence**: LocalStorage-synced React Context (`AppContext`)
- **Visualizations & Charts**: Recharts + Dynamic SVG Gauges
- **Digital Passports & QR**: `qrcode.react` (with download & copy link)
- **Icons**: Lucide React
- **Celebration Effects**: `canvas-confetti`

---

## 🚀 Getting Started & Execution Workflows

ReTrace supports two independent workflows: standard local development via `npm`, and production-ready containerization via Docker.

---

### Workflow A: Local Development (Recommended for Development)

Docker is completely optional. You can continue running the application locally using the standard npm toolchain:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server with Hot Module Reloading
npm run dev
```

The application will be accessible at:
```bash
http://127.0.0.1:5173/
```

To create a production bundle locally:
```bash
npm run build
```

To test the production build locally via the production Node.js server:
```bash
npm start
# Server listens at http://localhost:3000/
```

---

### Workflow B: Production Docker Deployment

ReTrace provides production-ready Docker support with multi-stage builds, non-root user execution, health checks, and secure backend proxying.

#### 1. Configuration (`.env`)
Before launching the container, configure your environment file:
```bash
# Copy the example environment template
cp .env.example .env
```
Open `.env` and set your API keys:
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key. If omitted, ReTrace operates using its built-in offline technical diagnostic engine.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: *(Optional)* Supabase connection credentials.

> 🔒 **Security Notice:** `GEMINI_API_KEY` is strictly a server-side secret. It is handled exclusively by the server backend and is never baked into or exposed to client-side JavaScript.

---

#### 2. Standalone Docker Container (Single Container)
Build and run the all-in-one production container (serves optimized static assets and handles `/api/ai/chat`):

```bash
# 1. Build the production image
docker build -t repath .

# 2. Run the container with your environment configuration
docker run --name repath-app -d --env-file .env -p 3000:3000 repath
```

Access the application in your browser at:
```bash
http://localhost:3000/
```

Verify container health:
```bash
docker inspect --format='{{json .State.Health.Status}}' repath-app
# Output: "healthy"
```

To stop and remove the container:
```bash
docker stop repath-app
docker rm repath-app
```

---

#### 3. Multi-Container Microservices (Docker Compose)
For enterprise or production architectures requiring separate reverse-proxy (Nginx) and API (Node.js) containers:

```bash
# Build and start all services (frontend on port 3000, backend on port 3001)
docker compose up --build -d
```

- **Frontend (Nginx Web Server):** `http://localhost:3000/`
- **Backend (Node.js API & AI Service):** `http://localhost:3001/`
- **Health Checks:**
  - Frontend: `http://localhost:3000/health`
  - Backend: `http://localhost:3001/health`

To view container logs:
```bash
docker compose logs -f
```

To stop and tear down the containers:
```bash
docker compose down
```

---

## 🧭 Implemented Routes

| Route | View | Description |
|---|---|---|
| `/` | Landing Page | Cinematic Hero, interactive lifecycle pipeline emulator, scroll storytelling, core concept comparison |
| `/login` & `/signup` | Auth Experience | Dark interface with animated particles, scanlines, hex telemetry data, and role selection |
| `/dashboard` | Owner Dashboard | Hardware fleet overview, quick status badges, verification counters, and passport links |
| `/scan` | QR Scanner | Viewfinder with laser scan beam, camera toggle, manual ID fallback, and animated verification transition |
| `/passport/:productId` | Product Passport | Central feature (specs, 8.5/10 repairability index, vertical lifecycle timeline, verified badges, QR code) |
| `/ai-assistant` | AI Diagnostic Engine | Conversational hardware assistant with symptom analysis, trade-off matrices, and repair vs replacement charts |
| `/repairers` | Repairer Finder | Verified directory with radius filtering, specialties, ratings, and service request flow |
| `/repairer/dashboard` | Repairer Portal | Interface for TechFix Solutions to accept, complete, invoice, and verify repairs on-chain |
| `/parts` | Spare Parts | 15+ compatible OEM and tier-1 replacement components with stock status |
| `/resale` | Circular Resale | Marketplace with verified passport badges and dynamic resale calculator |
| `/recovery` | Recovery Center | Sell for Parts, Material Recovery, and E-Waste courier dispatch |
| `/recycler/dashboard` | Recycler Portal | GreenCycle interface for pickup dispatch and minting End-of-Life destruction certificates |
| `/admin` | Admin Governance | Platform statistics, audit ledgers, verified hubs, and consensus monitoring |
| `/products/new` | Mint Passport | Register a new device with hardware hash and instant QR generation |

---

## ⚡ Step-by-Step Hackathon Walkthrough

Use the **floating Demo Control Bar** docked at the top of the screen to jump through or test each phase:

1. **Open Homepage** (`http://127.0.0.1:5173/`):
   - Notice the dark-first aesthetic, ambient lighting, and interactive lifecycle emulator.
2. **Scan Product** (`/scan`):
   - Click the preset `RP-DL-72891` (or click Step 1 on the top bar).
   - Watch the animated transition: **SCANNING → IDENTITY FOUND → PASSPORT VERIFIED**.
3. **Inspect Passport** (`/passport/RP-DL-72891`):
   - Shows Dell Inspiron 15, Good Condition, 2 Verified Repairs, Repairability Index (8.5/10).
   - Click **"View Document"** on the 2026 Thermal Cleaning event to inspect the cryptographic invoice receipt modal.
4. **Ask AI Diagnostics** (`/ai-assistant`):
   - Click the prompt *"My laptop is overheating and shutting down."*
   - AI outputs:
     - **Possible Issue**: Cooling / Thermal Management Fault
     - **Repairability**: HIGH
     - **Professional Inspection**: RECOMMENDED
     - **Part Availability**: AVAILABLE
5. **Check Repairability**:
   - Opens the **Repair vs Replacement** chart: Repair (₹3,000) vs Replacement (₹15,000) with a 2–3 year lifespan extension.
   - Compares the 4 circular paths: Repair, Resell, Recover, Recycle.
6. **Request Service**:
   - Select **TechFix Solutions** and send the service ticket.
7. **Switch to Repairer**:
   - Click **"ROLE: Repairer"** on the top bar to open `/repairer/dashboard`.
   - Accept the ticket, review the attached invoice, and click **"VERIFY REPAIR & SYNC TO PASSPORT"**.
8. **View Updated Passport**:
   - Return to `/passport/RP-DL-72891`.
   - The timeline immediately reflects the newly verified repair, updates the badge count, and appends the cryptographic record!
9. **Explore Resale & Recovery**:
   - Test listing a device on `/resale` with passport included.
   - Schedule courier collection on `/recovery` and verify pickup in `/recycler/dashboard`.

---

© 2026 ReTrace Protocol Foundation. Give Every Product a Next Path.
