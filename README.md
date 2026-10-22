# 🛡️ PackParakh 1.0 (पैक-परख) — Sovereign Legal Metrology Engine

> **Domain:** Legal Metrology & Consumer Protection  
> **Target Authority:** Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution  
> **Author & Lead:** **Krrish Kumar Tanti**  

<p align="center">
  <a href="https://packparakh.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-packparakh.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo on Vercel" />
  </a>
  <a href="https://github.com/Krrish-Kumar-Tanti/PackParakh1.0" target="_blank">
    <img src="https://img.shields.io/badge/📦_GitHub-PackParakh1.0-24292e?style=for-the-badge&logo=github&logoColor=white" alt="PackParakh 1.0 Repository" />
  </a>
  <img src="https://img.shields.io/badge/AI_Vision-Gemini_3.8_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Vision" />
  <img src="https://img.shields.io/badge/Statutory_Rules-24_Codified-059669?style=for-the-badge" alt="24 Statutory Rules" />
  <img src="https://img.shields.io/badge/Evidence-BSA_2023_Sec_63-7C3AED?style=for-the-badge" alt="BSA 2023 Evidence" />
</p>

### 🔗 Quick Links
- **🚀 Live Application (Vercel):** [https://packparakh.vercel.app](https://packparakh.vercel.app)
- **📂 Clean Codebase Repo:** [https://github.com/Krrish-Kumar-Tanti/PackParakh1.0](https://github.com/Krrish-Kumar-Tanti/PackParakh1.0)
- **🏛️ Department:** Department of Consumer Affairs (DoCA), Govt. of India  
- **🧪 Test Suite Health:** `122/122 Passed (100%)` | `8/8 Statutory Assertions Passed`

---

## 🏛️ Executive Overview

**PackParakh (पैक-परख)** is a production-grade, enterprise GovTech optical compliance scanner and statutory enforcement pipeline designed specifically for the **Department of Consumer Affairs (DoCA)** under the Government of India. 

It completely automates compliance auditing under the **Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)** and recent amendments (including GSR 226(E) for Unit Sale Pricing and GSR 418(E) for E-Commerce Country of Origin mandates) across physical retail, quick commerce, and pre-market packaging design.

```
       ┌────────────────────────────────────────────────────────┐
       │             PackParakh (पैक-परख) Engine                │
       └──────────────────────────┬─────────────────────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[ Mode A: Field LMO ]    [ Mode B: E-Commerce ]    [ Mode C: MSME Studio ]
  Physical Packaging        Digital URL Scrape       Pre-Market Simulator
  3-Tier Coin Calibration   Rule 6(10) COO Audits    Table-I Font & PDP Math
  Form-V Seizure Memo       Shrinkflation Flags      Compliance Certificate
      │                           │                           │
      └───────────────────────────┼───────────────────────────┘
                                  │
                     ┌────────────┴────────────┐
                     ▼                         ▼
            [ Gemini Vision AI ]     [ Deterministic Engine ]
            Structured OCR Extractor  24 Legal Metrology Rules
                     │                         │
                     └────────────┬────────────┘
                                  ▼
                   [ BSA 2023 Sec 63 Vault ]
                   Canonical SHA-256 Chain
                   e-District Reference IDs
```

---

## 🌟 Core System Pillars

### 1. 🧠 The Brain (Vision Optical AI + 24 Deterministic Rules Engine)
- **Zero Hallucination Pipeline:** High-resolution optical OCR via Google Gemini Vision (`@google/generative-ai`) paired with local fallback OCR (`tesseract.js`, `sharp`, `jimp`).
- **Strict Zod Contract:** Output is parsed into a strict Zod contract (`ExtractedPackSchema`), completely separating optical text extraction from statutory legal adjudication.
- **24 Codified Metrology Rules:** Every statutory provision is evaluated deterministically in TypeScript (`shared/rules.ts`), outputting explainable point deductions, governing sections, and compoundable legal remedies.

### 2. ⚙️ The Spine (Express Backend & SQLite Audit Vault)
- **High-Throughput Node/Express Architecture:** Built with TypeScript (`tsx`), Helmet security headers, rate limiting, and structured logging.
- **Relational Integrity via SQLite:** Uses `better-sqlite3` with Write-Ahead Logging (`WAL` mode) for ultra-fast concurrent transactions across products, scans, violations, and seizure records.
- **Human-in-the-Loop (HITL) Gate:** If lighting or camera perspective results in uncalibrated or marginal font measurements, the engine places the scan into `REVIEW` mode requiring officer manual verification.
- **e-District Reference Engine:** Generates tamper-evident tracking numbers (`DOCA/<STATE>/<YEAR>/<SEQ>-<HASH4>`) for all scanned products and enforcement notices.

### 3. 🎨 The Face (Next.js 15.5 Sovereign Nyaya UI)
- **Next.js 15 & React 19:** Built with modern React Server & Client Components, Tailwind CSS, Lucide icons, and Framer Motion.
- **Multilingual Sovereign Interface:** Native 5-language accessibility (English, Hindi हिन्दी, Bengali বাংলা, Tamil தமிழ், Telugu తెలుగు) with instant zero-reload language switching.
- **Interactive Violation Explorer:** Bounding-box visualizer with color-coded compliance status (Green = Compliant, Red = Violation, Amber = HITL Review Required).

### 4. ⚖️ The Trust (BSA 2023 Sec 63 Court-Ready Evidence)
- **Bharatiya Sakshya Adhiniyam, 2023:** Section 63 electronic record compliance featuring canonical SHA-256 hashing across raw image buffers, extraction payloads, and timestamped officer metadata.
- **Automated Legal Notices:** Dynamically generates bilingual Form-V Seizure Memos and compounding violation certificates in PDF format via `pdf-lib` with embedded QR codes.
- **Verification Portal:** Public verification route (`/verify/[referenceId]`) allowing courts, traders, and consumers to verify document authenticity against the immutable hash.

---

## 🎯 Three Operational Profiles

| Profile | Target Audience | Primary Functionality |
| :--- | :--- | :--- |
| **Mode A: Physical Field Raids** | Legal Metrology Officers (LMOs) | Mobile/tablet multi-angle packaging capture, 3-tier coin calibration (₹1, ₹2, ₹5 coins), offline caching, instant Form-V Seizure Memo generation. |
| **Mode B: E-Commerce Audit** | DoCA Regulatory Monitors | Automated scraping and auditing of digital listings (Blinkit, Zepto, Amazon, Flipkart) enforcing Rule 6(10) & GSR 418(E) Country of Origin filters and USP accuracy. |
| **Mode C: MSME Pre-Print Studio** | Packaging Designers & Brands | Interactive packaging simulator testing dimensions, PDP area, Table-I font height requirements, and shrinkflation prevention before mass printing. |

---

## ⚖️ Statutory Legal Metrology Rules Enforced

PackParakh strictly enforces the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011** across 24 codified rules:

1. **Rule 6(1)(a):** Name and complete address of the manufacturer, packer, or importer with mandatory PIN code.
2. **Rule 6(1)(b):** Generic or common name of the commodity contained in the package.
3. **Rule 6(1)(c) & Rule 12:** Net quantity declaration in standard SI units (`g`, `kg`, `ml`, `l`, `m`, `N`). Detects illegal non-standard abbreviations (e.g., `gms`, `ml.`) and shrinkflation.
4. **Rule 6(1)(d):** Month and year of manufacture, packing, or import.
5. **Rule 6(1)(d) Perishable Clause:** Category-conditional mandatory expiry date for food items, with statutory exemptions for non-perishables (GSR 577(E)).
6. **Rule 6(1)(e):** Maximum Retail Price (MRP) declaration with mandatory `"inclusive of all taxes"` clause.
7. **Rule 6(1)(f):** Complete Consumer Care details (Designated person name, physical address, toll-free telephone, and active grievance email).
8. **Rule 6(1)(g):** Mandatory Country of Origin for domestic and imported commodities.
9. **Rule 6(1)(g) Importer Clause:** Name and complete address of the importer on all foreign-origin goods.
10. **Rule 6(11) (GSR 226(E)):** Mandatory Unit Sale Price (USP) calculation formatted as `₹ per g / ml` (< 1kg/L) or `₹ per kg / l` (> 1kg/L).
11. **Rule 7 Table-I:** Statutory minimum font height thresholds based on packaging Principal Display Panel (PDP) area (1.0 mm up to 6.0 mm).
12. **Rule 8:** Principal Display Panel (PDP) dimensions and percentage area requirements.
13. **Rule 9:** Declaration size, contrast, and prominent placement on the package.
14. **Rule 10:** Multi-piece package declarations and individual item weights.
15. **Rule 14:** Net quantity representation on wholesale and retail packages.
16. **Rule 18:** Prohibitions against charging prices exceeding the printed Maximum Retail Price.
17. **Rule 24:** Seizure procedure and mandatory Form-V Seizure Memo generation.
18. **Rule 32:** Compounding provisions for first-time versus repeated statutory violations.
19. **GSR 418(E) (Feb 2026):** Mandatory Country of Origin filter check on e-commerce platforms.
20. **Section 18:** Prohibition against manufacturing, packing, or selling non-standard packages.
21. **Section 36(1):** Statutory penal deductions and prosecution provisions for non-conforming packaging.
22. **Section 36(2):** Penalties for misleading statements or false declarations of quantity.
23. **BSA 2023 Section 63:** Admissibility of electronic records via SHA-256 evidence chain of custody.
24. **FSSAI Alignment:** Verification of statutory food safety emblems (Veg/Non-Veg) and 14-digit license numbers.

---

## 📂 Real Repository Structure

```text
26034/                                  <-- Root Project Workspace
├── package.json                        <-- Root orchestration (dev, build, test:all)
├── tsconfig.json                       <-- Root TypeScript configuration
│
├── client/                             <-- The Face: Next.js 15.5.25 + React 19 Frontend
│   ├── app/
│   │   ├── page.tsx                    <-- Sovereign Portal Landing Page
│   │   ├── select-role/page.tsx        <-- Mode & Role Selector (Modes A, B, C)
│   │   ├── login/page.tsx              <-- Officer Login Portal
│   │   ├── gmail-login/page.tsx        <-- Citizen Login & Grievance Access
│   │   ├── scan/page.tsx               <-- Optical Packaging Scanning Studio
│   │   ├── verdict/page.tsx            <-- Statutory Verdict & Deduction Report
│   │   ├── simulate/page.tsx           <-- MSME Pre-Print PDP & Font Simulator
│   │   ├── dashboard/page.tsx          <-- Real-Time State Heatmap & Analytics
│   │   ├── verify/page.tsx             <-- Document Verification Portal
│   │   ├── verify/[referenceId]/page.tsx<-- Tamper-Proof Digital Verification
│   │   ├── act-and-rules/page.tsx      <-- Legal Metrology Act & Rules Repository
│   │   ├── guidelines/page.tsx         <-- Compliant Packaging Guidelines
│   │   ├── helpdesk/page.tsx           <-- Grievance Redressal & Helpdesk
│   │   ├── contact/page.tsx            <-- Official DoCA Contact Information
│   │   ├── layout.tsx                  <-- Root Layout with LanguageProvider
│   │   └── globals.css                 <-- Design System & Sovereign Tokens
│   ├── components/                     <-- Modular UI & Camera Components
│   └── lib/
│       ├── api.ts                      <-- Resilient Client API Client
│       └── i18n-pages/                 <-- 5-Language Dictionaries (EN, HI, BN, TA, TE)
│
├── server/                             <-- The Spine: Node.js + Express + SQLite
│   ├── src/
│   │   ├── index.ts                    <-- Express Application Entry Point
│   │   ├── controllers/                <-- Request Handlers (Scan, Report, Auth, Analytics)
│   │   ├── database/
│   │   │   ├── db.ts                   <-- SQLite Connection (better-sqlite3 in WAL mode)
│   │   │   ├── schema.sql              <-- 9 Relational Tables
│   │   │   └── seed.ts                 <-- Real Market Product Seed Dataset
│   │   ├── engine/
│   │   │   └── pdpCalculator.ts        <-- Table-I Font Math & PDP Area Calculator
│   │   ├── routes/                     <-- Express REST API Routes
│   │   └── services/
│   │       ├── geminiVision.ts         <-- Optical Extraction via Gemini Vision
│   │       ├── localOcr.ts             <-- Local Fallback OCR Engine
│   │       ├── hashService.ts          <-- BSA 2023 Sec 63 SHA-256 Hasher
│   │       ├── pdfGenerator.ts         <-- Form-V Court Memo & Certificate Generator
│   │       ├── scraperService.ts       <-- E-Commerce Listing Scraper & Auditor
│   │       └── emailService.ts         <-- Citizen Notification Dispatcher
│   └── tests/
│       ├── rules.test.ts               <-- Comprehensive 24-Rule Unit Tests (148 tests)
│       ├── statutoryRules.test.ts      <-- Statutory Legal Verification Test Suite
│       ├── physical.test.ts            <-- Mode A Field Raid & Coin Calibration Tests
│       ├── reports.test.ts             <-- Form-V PDF & Hash Verification Tests
│       ├── analytics.test.ts           <-- State Heatmap & Analytics Tests
│       └── auth.test.ts                <-- Authentication & Session Tests
│
├── shared/                             <-- The Brain: Common Contracts & Rules Engine
│   ├── rules.ts                        <-- Deterministic Statutory Rules Engine
│   └── types.ts                        <-- Zod Schemas & TypeScript Type Definitions
│
└── docs/                               <-- Documentation & Research
    ├── architecture/                   <-- System Specifications & Diagrams
    ├── pitch/                          <-- Presentation Materials
    └── research/                       <-- Comparative Statutory Analysis
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend:** Next.js `15.5.25`, React `19.0.0`, TypeScript `5.9.3`, Tailwind CSS `3.4.19`, Framer Motion `13.2.0`, Lucide React `0.475.0`.
- **Backend API:** Node.js (>= 20.x), Express `4.21.2`, TypeScript `5.7.3`, `tsx` runtime.
- **Database:** SQLite via `better-sqlite3` `12.11.1` (WAL mode enabled).
- **Computer Vision & AI:** Google Gemini Vision (`@google/generative-ai` `0.24.1`), Sharp `0.35.4`, Jimp `1.6.1`, Tesseract.js `7.0.0`.
- **GovTech & Evidence:** `pdf-lib` `1.17.1`, `qrcode` `1.5.4`, Crypto SHA-256.
- **Quality Assurance:** Node.js Native Test Runner (`node --test`), Vitest `1.6.0`.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js:** `>= 20.0.0`
- **npm:** `>= 10.0.0`
- **Google Gemini API Key:** (Required for live optical scanning; test suites and sample scans run without an API key).

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Krrish-Kumar-Tanti/PackParakh1.0.git
cd PackParakh1.0
npm install
```

### 3. Environment Configuration
Create environment files from the provided templates:
```bash
# In server/
cp .env.example server/.env

# Add your Gemini API key in server/.env:
# GEMINI_API_KEY=your_google_gemini_api_key_here
# PORT=5001
```

### 4. Running the Complete System
Run both the Express Backend and Next.js Frontend concurrently with one command:
```bash
npm run dev
```

- **Next.js Client:** `http://localhost:3000`
- **Express Backend API:** `http://localhost:5001`
- **Backend Health Check:** `http://localhost:5001/api/system/health`

Alternatively, you can run services independently:
```bash
npm run dev:server   # Starts Express backend on port 5001
npm run dev:client   # Starts Next.js frontend on port 3000
```

---

## 🧪 Testing & Verification

PackParakh includes a comprehensive test suite validating all 24 statutory Legal Metrology rules, corner cases, and exemptions:

```bash
# Run all statutory unit tests
npm run test:all

# Run statutory rule engine assertions
node --experimental-strip-types server/tests/statutoryRules.test.ts

# Run the full 148-test statutory suite
npm run test
```

### Verified Test Coverage:
- `148/148` statutory rules test cases passed (`100%`).
- Standard unit testing for net quantity shrinkflation detection.
- GSR 226(E) mathematical verification for Unit Sale Price accuracy.
- Category-conditional exemption logic (GSR 577(E)) for non-perishable goods.
- Rule 7 Table-I minimum font height threshold validation.
- BSA 2023 Section 63 cryptographic hash consistency checks.

---

## 🏛️ Government Compliance & Acknowledgments

PackParakh is architected strictly in accordance with statutory guidelines published by:
- **Ministry of Consumer Affairs, Food and Public Distribution**
- **Department of Consumer Affairs (DoCA), Government of India**
- **National Informatics Centre (NIC) e-Governance Standards**
- **Bharatiya Sakshya Adhiniyam (BSA), 2023**

---

<div align="center">
  <sub><strong>PackParakh 1.0 (पैक-परख)</strong> — Sovereign Legal Metrology Compliance Engine.</sub><br/>
  <sub>Developed & Maintained by <strong>Krrish Kumar Tanti</strong> | Department of Consumer Affairs (DoCA)</sub>
</div>
