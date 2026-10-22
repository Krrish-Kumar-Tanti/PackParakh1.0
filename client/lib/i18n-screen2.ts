import {
  MapPin, Globe, FileText, Camera,
  Cpu, ShieldCheck, Zap,
} from "lucide-react";

// Screen 2 translations
const screen2 = {
  en: {
    pill: "AUDIT MODE SELECTOR • SCREEN 02 / 07",
    heading: "Select Inspection Mode",
    subheading: "PackParakh adapts to three distinct audit scenarios — field raids, online listings, or pre-print manufacturing. Choose your pipeline.",
    stepper: {
      active: "Mode Selection",
      steps: ["Ingestion", "OCR Engine", "24-Rule Check", "Evidence Vault", "e-District Slip"],
    },
    simulator: {
      chip: "QUICK ACCESS",
      title: "Pre-Market Packaging Simulator",
      sub: "Real-time Rule 7 font height calculator for brand designers — zero API latency.",
      cta: "Launch Simulator",
    },
    cards: [
      {
        badge: "OFFLINE READY · PWA",
        badgeColor: "amber",
        title: "Mode A — Offline Field Kirana Scan",
        subtitle: "Physical Market Raid Mode",
        desc: "Deploy to rural mandis without internet. Smartphone rear-camera capture with 3-tier optical mm calibration (ArUco marker / declared dimensions / heuristic fallback). Generates court-admissible Form-V seizure memos on-device.",
        bullets: [
          "3-tier optical font calibration (±0.1mm accuracy)",
          "Offline IndexedDB evidence caching",
          "Auto Section 36 penalty computation",
          "GPS geotagging & SHA-256 evidence lock",
        ],
        cta: "Launch Field Scan",
        href: "/scan?mode=field",
      },
      {
        badge: "HEADLESS SCRAPER",
        badgeColor: "blue",
        title: "Mode B — Online E-Commerce Audit",
        subtitle: "Quick-Commerce Listing Audit",
        desc: "Paste any Amazon, Blinkit, or quick-commerce product URL. Headless scraper extracts listing data and checks Rule 6(1)(g) Country of Origin compliance against the Feb 2026 GSR 226(E) E-Commerce Mandate.",
        bullets: [
          "Feb 2026 COO filter mandate compliance",
          "GSR 418(E) 2026 import declaration check",
          "Unit Sale Price math auto-verification",
          "Instant deduction score with XAI waterfall",
        ],
        cta: "Launch E-Com Audit",
        href: "/scan?mode=ecom",
      },
      {
        badge: "0% OPTICAL DISTORTION",
        badgeColor: "violet",
        title: "Mode C — Pre-Print MSME Vector Audit",
        subtitle: "Pre-Manufacturing Artwork Check",
        desc: "Drag-and-drop vector PDF artwork before engraving commercial printing cylinders. Detects Rule 7 font undersizing at ±0% distortion, saving ₹2–5 Lakhs in packaging recalls before a single unit is manufactured.",
        bullets: [
          "PDF vector artwork zero-distortion analysis",
          "Rule 7 Table-I font threshold check",
          "Dual unit declaration (Rule 12) verification",
          "Mandatory declarations checklist preview",
        ],
        cta: "Launch Vector Studio",
        href: "/scan?mode=preprint",
      },
    ],
    pipeline: {
      label: "5-Stage Compliance Pipeline",
      stages: [
        { num: "01", name: "Ingestion & Homography", icon: Camera },
        { num: "02", name: "Dual-Script OCR", icon: Cpu },
        { num: "03", name: "24-Rule Engine", icon: ShieldCheck },
        { num: "04", name: "Evidence Vault", icon: ShieldCheck },
        { num: "05", name: "e-District Slip", icon: Zap },
      ],
    },
  },
  hi: {
    pill: "ऑडिट मोड चयनकर्ता • स्क्रीन 02 / 07",
    heading: "निरीक्षण मोड चुनें",
    subheading: "पैक-परख तीन अलग-अलग ऑडिट परिदृश्यों के लिए अनुकूल है — फील्ड छापे, ऑनलाइन लिस्टिंग, या पूर्व-मुद्रण निर्माण। अपनी पाइपलाइन चुनें।",
    stepper: {
      active: "मोड चयन",
      steps: ["अंतर्ग्रहण", "OCR इंजन", "24-नियम जाँच", "साक्ष्य वॉल्ट", "e-District स्लिप"],
    },
    simulator: {
      chip: "त्वरित पहुँच",
      title: "पूर्व-बाज़ार पैकेजिंग सिमुलेटर",
      sub: "ब्रांड डिज़ाइनरों के लिए रियल-टाइम नियम 7 फ़ॉन्ट ऊंचाई कैलकुलेटर — शून्य API विलंब।",
      cta: "सिमुलेटर खोलें",
    },
    cards: [
      {
        badge: "ऑफलाइन तैयार · PWA",
        badgeColor: "amber",
        title: "मोड A — ऑफलाइन फील्ड किराना स्कैन",
        subtitle: "भौतिक बाज़ार छापा मोड",
        desc: "बिना इंटरनेट के ग्रामीण मंडियों में तैनात करें। 3-स्तरीय ऑप्टिकल मिमी कैलिब्रेशन के साथ स्मार्टफोन रियर-कैमरा कैप्चर। डिवाइस पर न्यायालय-स्वीकार्य फॉर्म-V जब्ती मेमो तैयार करता है।",
        bullets: [
          "3-स्तरीय ऑप्टिकल फ़ॉन्ट कैलिब्रेशन (±0.1mm सटीकता)",
          "ऑफलाइन IndexedDB साक्ष्य कैशिंग",
          "स्वतः धारा 36 जुर्माना गणना",
          "GPS जियोटैगिंग और SHA-256 साक्ष्य लॉक",
        ],
        cta: "फील्ड स्कैन खोलें",
        href: "/scan?mode=field",
      },
      {
        badge: "हेडलेस स्क्रेपर",
        badgeColor: "blue",
        title: "मोड B — ऑनलाइन ई-कॉमर्स ऑडिट",
        subtitle: "क्विक-कॉमर्स लिस्टिंग ऑडिट",
        desc: "कोई भी Amazon, Blinkit या क्विक-कॉमर्स उत्पाद URL पेस्ट करें। हेडलेस स्क्रेपर लिस्टिंग डेटा निकालता है और फरवरी 2026 GSR 226(E) ई-कॉमर्स जनादेश के विरुद्ध नियम 6(1)(g) मूल देश अनुपालन की जाँच करता है।",
        bullets: [
          "फरवरी 2026 COO फ़िल्टर जनादेश अनुपालन",
          "GSR 418(E) 2026 आयात घोषणा जाँच",
          "इकाई बिक्री मूल्य गणित स्वतः सत्यापन",
          "XAI वाटरफॉल के साथ तत्काल कटौती स्कोर",
        ],
        cta: "ई-कॉम ऑडिट खोलें",
        href: "/scan?mode=ecom",
      },
      {
        badge: "0% ऑप्टिकल विरूपण",
        badgeColor: "violet",
        title: "मोड C — पूर्व-मुद्रण MSME वेक्टर ऑडिट",
        subtitle: "पूर्व-निर्माण आर्टवर्क जाँच",
        desc: "व्यावसायिक प्रिंटिंग सिलेंडर उत्कीर्ण करने से पहले वेक्टर PDF आर्टवर्क ड्रैग-एंड-ड्रॉप करें। ±0% विरूपण पर नियम 7 फ़ॉन्ट अंडरसाइजिंग का पता लगाता है।",
        bullets: [
          "PDF वेक्टर आर्टवर्क शून्य-विरूपण विश्लेषण",
          "नियम 7 तालिका-I फ़ॉन्ट थ्रेशोल्ड जाँच",
          "दोहरी इकाई घोषणा (नियम 12) सत्यापन",
          "अनिवार्य घोषणाएँ चेकलिस्ट पूर्वावलोकन",
        ],
        cta: "वेक्टर स्टूडियो खोलें",
        href: "/scan?mode=preprint",
      },
    ],
    pipeline: {
      label: "5-चरण अनुपालन पाइपलाइन",
      stages: [
        { num: "01", name: "अंतर्ग्रहण और होमोग्राफी", icon: Camera },
        { num: "02", name: "द्विलिपि OCR", icon: Cpu },
        { num: "03", name: "24-नियम इंजन", icon: ShieldCheck },
        { num: "04", name: "साक्ष्य वॉल्ट", icon: ShieldCheck },
        { num: "05", name: "e-District स्लिप", icon: Zap },
      ],
    },
  },
} as const;

export default screen2;
export type Screen2Lang = typeof screen2;
