# PRAGYA — Authoritative Meteorological Data Sources & Pipeline Reference

> **Scientific Core Statement**  
> *"When does a rapidly developing localized extreme convective event first become reliably predictable from the atmospheric information available at that time?"*

PRAGYA distinguishes three fundamental scientific quantities:
1. **EVENT RISK**: Estimated likelihood of localized severe convection.
2. **PREDICTABILITY**: Distinguishability of the current state from alternative plausible futures.
3. **OBSERVATION CONFIDENCE**: Completeness, accuracy, and latency of available observational evidence.

---

## 1. Data Access & Status Honesty Matrix

Every external data source in PRAGYA maintains an explicit, verifiable state:

| Status Code | Definition in PRAGYA | Operational Behavior |
| :--- | :--- | :--- |
| **`CONNECTED`** | Real-time endpoint verified via live HTTP handshake, or local geomorphic grid active. | Programmatic ingestion active. |
| **`CREDENTIALS_REQUIRED`** | Adapter is implemented and schema-ready, but institutional researcher credentials are not set in the server environment. | Standby mode. Does not fake connection. |
| **`AVAILABLE_NOT_CONFIGURED`** | Source API exists, but API key or server network endpoint has not been assigned. | Standby mode. |
| **`UNAVAILABLE`** | Remote portal is offline, rate-limited, or timing out. | Offline cache mode. |
| **`SIMULATED`** | Synthetic atmospheric simulation or controlled scientific benchmark. | Explicitly labeled as simulated. |

---

## 2. Authoritative Source Registry

### A. India Meteorological Department (IMD)
* **Provider:** Ministry of Earth Sciences (MoES), Government of India
* **Data Mode:** `REAL`
* **Category:** Surface AWS Network & Coastal Doppler Weather Radar (DWR) Grid
* **Spatial Resolution:** Point network (~12 km NCR spacing) / 1 km Doppler radial resolution
* **Temporal Cadence:** 15 min (Surface AWS) / 10 min (DWR Volume Scan)
* **Telemetry Latency:** 8–15 minutes
* **Credentials Required:** Yes (`IMD_API_KEY`)
* **Variables Supported:**
  * Surface Temperature ($^{\circ}\text{C}$)
  * Dew Point Temperature ($^{\circ}\text{C}$)
  * Surface Relative Humidity ($\%$)
  * Surface Pressure ($h\text{Pa}$)
  * Wind Speed & Direction ($m/s$, $\text{deg}$)
  * Radar Volumetric Reflectivity ($d\text{BZ}$)
  * Severe Weather Bulletins
* **Limitations:**
  * Requires institutional MoES credentials or National Data Centre authorization.
  * Mountain terrain radar beam blockage above $3.5^{\circ}$ elevation in the Western Himalayas (Kullu/Beas basin).

---

### B. ISRO MOSDAC / INSAT Satellite Family
* **Provider:** Space Applications Centre (SAC / ISRO) & IMD Satellite Meteorology Division
* **Satellites:** INSAT-3D, INSAT-3DR, INSAT-3DS
* **Data Mode:** `REAL`
* **Category:** Geostationary Multi-Spectral Imager & Sounder
* **Spatial Resolution:** 4 km (Thermal IR & Sounder) / 1 km (Visible)
* **Temporal Cadence:** 15 min (Full Subcontinent Disk) / 4 min (Rapid Scan Mode)
* **Telemetry Latency:** 18 minutes from scan completion to available telemetry
* **Credentials Required:** Yes (`MOSDAC_USERNAME`, `MOSDAC_PASSWORD`)
* **Variables Supported:**
  * Thermal Infrared Brightness Temperature (TIR-1 $10.8\,\mu m$, TIR-2 $12.0\,\mu m$)
  * Water Vapour Absorption ($6.8\,\mu m$)
  * Quantitative Precipitation Estimation (QPE)
  * Upper-Tropospheric Humidity (UTH)
  * Lifted Index & Atmospheric Instability
  * Sounder Temperature & Moisture Profiles (19 levels)
* **Limitations:**
  * Requires approved ISRO MOSDAC researcher credentials for HDF5 granule retrieval.
  * Parallax distortion over Northern/Western Himalayan latitudes requires orthorectification.

---

### C. NASA Global Precipitation Measurement (GPM) IMERG
* **Provider:** NASA Goddard Space Flight Center / JAXA / GES DISC
* **Product:** IMERG V07 (Early, Late, Final Runs)
* **Data Mode:** `REAL`
* **Category:** Multi-Satellite Precipitation
* **Spatial Resolution:** $0.1^{\circ} \times 0.1^{\circ}$ (~10 km)
* **Temporal Cadence:** 30 min half-hourly granules
* **Latency:** Early Run ~4 hours; Final Run ~3.5 months (gauge calibrated)
* **Credentials Required:** Yes (`NASA_EARTHDATA_USERNAME`, `NASA_EARTHDATA_PASSWORD`)
* **Variables Supported:**
  * Calibrated Precipitation Rate ($mm/hr$)
  * Precipitation Accumulation ($mm$)
  * Microwave vs. Infrared Precipitation Weights
* **Limitations:**
  * Early run latency of 4 hours precludes real-time nowcast warning; primarily utilized for blind historical reconstruction and post-event analysis.
  * Steep mountainous orographic precipitation can be slightly smoothed.

---

### D. Copernicus ECMWF ERA5 Reanalysis
* **Provider:** European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus C3S
* **Data Mode:** `REANALYSIS` (Strict Scientific Label: Retrospective Historical Context Only)
* **Category:** Synoptic Thermodynamic & Kinematic Reanalysis
* **Spatial Resolution:** $0.25^{\circ} \times 0.25^{\circ}$ (~31 km global grid)
* **Temporal Cadence:** 1 hour
* **Latency:** ~5 days (ERA5T) / ~2-3 months (Quality-Assured Final)
* **Credentials Required:** Yes (`CDS_API_KEY`)
* **Variables Supported:**
  * Temperature, Dew Point, Surface Pressure, MSLP
  * Convective Available Potential Energy (CAPE, $J/kg$)
  * Convective Inhibition (CIN, $J/kg$)
  * 0–6 km Bulk Wind Shear ($m/s$)
  * Vertical Velocity ($\omega$ on pressure levels, $Pa/s$)
  * Geopotential Height ($gpm$) across 37 pressure levels
* **Limitations:**
  * **STRICT SCIENTIFIC RULE:** Reanalysis is never classified as real-time observation.
  * 31 km resolution averages localized micro-convective cores.

---

### E. High-Resolution Digital Elevation Model (Terrain)
* **Provider:** USGS SRTM 30m / ETOPO Global Relief Model / CartoDEM Open Archive
* **Data Mode:** `REAL`
* **Category:** Orographic Elevation & Geomorphic Boundary
* **Spatial Resolution:** 1 arc-second (~30 m), downsampled to 100m for 3D twin
* **Temporal Cadence:** Static Geomorphic Baseline
* **Credentials Required:** None (Zero external cost or paid dependencies)
* **Status:** `CONNECTED`
* **Variables Supported:**
  * Surface Elevation ($m$ above sea level)
  * Terrain Slope ($^{\circ}$)
  * Aspect Orientation ($^{\circ}$)
  * Orographic Lift Potential (Wind-Slope Coupling Vector)
* **Limitations:**
  * Downsampled to 100m in 3D digital twin to ensure steady 60 FPS WebGL rendering on standard laptop hardware.

---

### F. Open Scientific Reanalysis Archive (Open-Meteo / ECMWF Open Pipeline)
* **Provider:** Open-Meteo Research Infrastructure / ECMWF Open Data
* **Data Mode:** `REANALYSIS`
* **Credentials Required:** None (Open access under CC BY 4.0)
* **Status:** `CONNECTED` (Active real historical verification pipeline)
* **Variables Supported:**
  * Hourly temperature ($2m$), dew point, relative humidity, surface pressure, precipitation rate.
* **Limitations:**
  * Rate-limited research tier; used for credential-free end-to-end verification of PRAGYA ingestion pipeline.

---

## 3. Strict Temporal Time-Gating & Future-Data Leakage Prevention

PRAGYA enforces the mathematical condition:
$$\text{availableAt} \le T_{\text{replay}}$$

A sensor measurement observed at $T_{\text{obs}} = 11:00$ with pipeline telemetry latency $\Delta t = 18\text{ min}$ has:
$$\text{availableAt} = 11:18$$

If a blind historical replay query is executed at $T_{\text{replay}} = 11:15$, this observation **is strictly withheld**, exactly as it would have been unavailable to a meteorologist at that historical moment.
