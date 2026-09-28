# PRAGYA
### Predictability & Rapid Atmospheric Genesis Intelligence Architecture

> **"Finding the moment extreme weather becomes predictable."**  
> An experimental atmospheric intelligence platform for studying the predictability of rapidly developing severe convection (0–6 hour nowcasting of thunderstorms, hail, cloudbursts, and rapid convective genesis).

---

## 🔬 Core Scientific Principles

### 1. Orthogonal Separation of Risk and Predictability
PRAGYA strictly enforces that **Event Risk** and **Predictability** are mathematically and physically orthogonal variables:
- **EVENT RISK:** Estimated likelihood ($P(\text{severe})$) that severe convection will occur in the domain based on thermodynamic instability (CAPE, CIN, bulk shear).
- **PREDICTABILITY:** How confidently current atmospheric information and phase-space divergence allow this event to be distinguished from plausible alternative futures (e.g., dry failure, capping inversion hold, ordinary benign showers).

An operational warning should only be triggered when **Predictability** crosses the critical threshold (e.g. $\ge 70\%$), reaching the **Earliest Defensible Warning Window**.

### 2. Scientific Integrity Rule
All demonstration values in this research prototype are explicitly marked as:
`DEMO / SIMULATED DATA — Research Prototype. Not an official forecast.`  
On evaluation screens, PRAGYA states:  
`"Awaiting validated experimental results."`

---

## 🛠️ Tech Stack & Architecture

- **React 18 & TypeScript:** Strict types, modular component hierarchy.
- **Vite 6:** Rapid HMR development and optimized production bundling.
- **Tailwind CSS:** Aerospace/meteorological mission-control design system (deep graphite `#0b0f14`, scientific panel surfaces, semantic accent colors).
- **React Router v6:** 12 full-featured mission-control navigation views.
- **Three.js, @react-three/fiber & @react-three/drei:**
  - Interactive 0–12 km Atmospheric Digital Twin volume with altitude grid, terrain elevation, dynamic convective columns, multi-tier wind shear vectors, updraft/downdraft vectors, moisture flux particles, precipitation volume, hail-growth zone (-10°C to -40°C), and procedural lightning discharge.
  - Layer toggles & timeline stages (-3h, -2h, -1h, NOW, +30m, +1h, +3h, +6h).
  - Robust `WebGLFallback` and `ThreeErrorBoundary` ensuring graceful degradation on systems without hardware acceleration.
- **Recharts:** High-precision scientific radar charts, dual trajectory curves, and distribution histograms.
- **Lucide React:** Consistent iconography.

---

## 📂 Architecture Structure

```
PRAGYA/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── RiskGauge.tsx                 # Distinct Event Risk gauge
│   │   │   ├── PredictabilityGauge.tsx       # Distinct Predictability circular gauge
│   │   │   ├── SimulatedDataBadge.tsx        # Standard scientific disclaimer badge
│   │   │   └── AtmosphericFingerprintChart.tsx # Radar & bar model contribution view
│   │   └── three/
│   │       ├── ThreeErrorBoundary.tsx        # Resilient WebGL failure boundary
│   │       ├── WebGLFallback.tsx             # Schematic 2D scientific fallback SVG
│   │       ├── TerrainSurface.tsx            # Mountainous/orographic elevation mesh
│   │       ├── AtmosphericGrid.tsx           # 0–12 km vertical coordinate planes
│   │       ├── ConvectiveColumn.tsx          # Dynamic cloud column across timeline
│   │       ├── WindVectors.tsx               # Multi-level vertical shear streamlines
│   │       ├── UpdraftDowndraftArrows.tsx    # Rising updrafts & sinking downdrafts
│   │       ├── MoistureParticles.tsx         # Water vapor density particle flux
│   │       ├── PrecipitationVolume.tsx       # Rain streaks below cloud base
│   │       ├── HailGrowthZone.tsx            # -10°C to -40°C frozen nucleation slab
│   │       ├── LightningVisual.tsx           # Procedural electric discharge flashes
│   │       ├── ObservationGapHighlight.tsx   # 3D bounding box for data gaps
│   │       ├── AtmosphericScene.tsx          # Composite interactive Digital Twin
│   │       └── HeroAtmosphericCanvas.tsx     # Landing page hero 3D visual
│   ├── context/
│   │   └── AtmosphericContext.tsx            # Global state, layers, time, and focus cell
│   ├── data/
│   │   └── demoAtmosphericData.ts            # Central simulated dataset (cells, events, gaps)
│   ├── layouts/
│   │   └── AppShell.tsx                      # Workstation top bar, sidebar, and settings
│   ├── pages/
│   │   ├── LandingPage.tsx                   # Hero with 3D atmospheric visual & overview
│   │   ├── OverviewPage.tsx                  # Schematic field, cell selection, gauges
│   │   ├── LiveAtmospherePage.tsx            # Doppler radar PPI & AWS station telemetry
│   │   ├── DigitalTwinPage.tsx               # 0–12 km 3D atmospheric volume & layer HUD
│   │   ├── PredictabilityPage.tsx            # Risk vs Predictability timeline & entropy
│   │   ├── FutureEnsemblesPage.tsx           # 16 ensemble cards & distribution chart
│   │   ├── StormLaboratoryPage.tsx           # Event A vs Event B counterfactual comparison
│   │   ├── HistoricalReplayPage.tsx          # Causal blind replay with locked future steps
│   │   ├── ImpactSimulatorPage.tsx           # Topographic rainfall & runoff simulation
│   │   ├── ObservationGapsPage.tsx           # "What is limiting this forecast?" with 3D box
│   │   ├── ModelPerformancePage.tsx          # Scientific metrics (awaiting validated results)
│   │   ├── CitizenAlertsPage.tsx             # Trilingual advisory (English, Hindi, Marathi)
│   │   └── ResearchPage.tsx                  # Methodology, hypothesis, and official disclaimer
│   ├── services/
│   │   └── atmosphericService.ts             # Central data service & backend API interfaces
│   ├── types/
│   │   └── index.ts                          # Comprehensive TypeScript interfaces
│   ├── App.tsx                               # Router configuration
│   ├── index.css                             # Scientific grid patterns & styling
│   └── main.tsx                              # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Running Locally

To run the development server locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production (generates Prisma client, compiles TS, builds bundle)
npm run build

# 4. Preview production build
npm run preview
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Vercel Production Deployment

To deploy PRAGYA to Vercel:

1. Connect the GitHub repository to your Vercel account.
2. In the **Vercel Project Dashboard**, navigate to:
   - **Settings** → **Environment Variables**
3. Add the following required environment variable:
   - `DATABASE_URL`: Your Neon PostgreSQL pooled connection string (with `?sslmode=require`).
4. (Optional) Configure server-side meteorological credentials if connecting external providers:
   - `MOSDAC_USERNAME`, `MOSDAC_PASSWORD`
   - `IMD_API_KEY`
   - `CDS_API_KEY`
   - `NASA_EARTHDATA_USERNAME`, `NASA_EARTHDATA_PASSWORD`
5. Deploy. Vercel automatically runs `npm run build` which invokes `prisma generate`, TypeScript type verification, and Vite production bundling. All serverless endpoints under `/api/*` run seamlessly via Vercel serverless execution.

---

## ⚠️ Statutory Notice
PRAGYA is an experimental scientific research architecture. It does **NOT** replace official meteorological warnings issued by the India Meteorological Department (IMD) or State Disaster Management Authorities.

