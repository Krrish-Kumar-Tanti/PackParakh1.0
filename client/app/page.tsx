"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  Landmark, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  FileCheck2, 
  Cpu, 
  Hash, 
  FileText, 
  HelpCircle, 
  Layers, 
  ScanLine, 
  AlertTriangle, 
  Building2, 
  User, 
  Coins, 
  Check, 
  ExternalLink, 
  Sparkles,
  Zap,
  Clock,
  Shield,
  FileCode,
  FileSpreadsheet,
  Star,
  Play
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroIntroOverlay from "@/components/HeroIntroOverlay";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { language } = useLanguage();
  const isHi = language !== "en"; // Enables translated state for Hindi, Bengali, Tamil, Telugu
  const user = useAuth();
  const [showHeroIntro, setShowHeroIntro] = useState(true);

  const tr = (en: string, hi: string, bn?: string, ta?: string, te?: string) => {
    if (language === "hi") return hi;
    if (language === "bn") return bn || hi;
    if (language === "ta") return ta || hi;
    if (language === "te") return te || hi;
    return en;
  };

  // FAQ Accordion State (default closed so questions do not automatically open)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const revealRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = revealRootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    // Reveal every heading and paragraph in the below-the-fold sections,
    // not just the section intros.
    root
      .querySelectorAll<HTMLElement>(
        "#trust-strip, #how-it-works, #eligibility, #faq"
      )
      .forEach((section) => {
        section.querySelectorAll<HTMLElement>("h2, h3, p").forEach((element) => {
          if (!element.hasAttribute("data-reveal")) {
            element.setAttribute("data-reveal", "text");
          }
        });
      });

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (targets.length === 0) return;

    // Stagger items that share a parent (headings, card grids, FAQ list).
    targets.forEach((target) => {
      const parent = target.parentElement;
      if (!parent) return;
      const siblings = Array.from(
        parent.querySelectorAll<HTMLElement>(":scope > [data-reveal]")
      );
      const index = siblings.indexOf(target);
      target.style.setProperty(
        "--scroll-reveal-delay",
        `${Math.min(Math.max(index, 0), 5) * 60}ms`
      );
    });

    const createObserver = (threshold: number, rootMargin: string) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("scroll-reveal-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold, rootMargin }
      );
      return observer;
    };

    // Text waits until it is clearly inside the viewport so the reveal is
    // visible while scrolling; boxes start as soon as they edge into view.
    const textObserver = createObserver(0.45, "0px 0px -18% 0px");
    const boxObserver = createObserver(0.12, "0px 0px -10% 0px");

    targets.forEach((target) => {
      const observer =
        target.getAttribute("data-reveal") === "box"
          ? boxObserver
          : textObserver;
      observer.observe(target);
    });

    root.classList.add("scroll-reveal-ready");

    return () => {
      textObserver.disconnect();
      boxObserver.disconnect();
      root.classList.remove("scroll-reveal-ready");
    };
  }, []);

  // FAQ Content Grounded in Legal Metrology Domain
  const faqs = [
    {
      q: isHi
        ? "पैक-परख क्या है और यह किस वैधानिक अधिनियम को लागू करता है?"
        : "What is PackParakh and what statutory law does it enforce?",
      a: isHi
        ? "पैक-परख भारत सरकार के उपभोक्ता मामले विभाग (DoCA) के अंतर्गत विकसित एक स्वायत्त डिजिटल अनुपालन इंजन है। यह विधिक मापविज्ञान अधिनियम 2009 और विधिक मापविज्ञान (पैकेज्ड कमोडिटीज) नियम 2011 (PCR 2011) तथा नवीन जीएसआर 418(ई) 2026 अधिसूचना को लागू करता है। यह प्लास्टिक स्केल से 15 मिनट में होने वाले हस्तचालित निरीक्षण को सेकंडों में सटीक कंप्यूटर विजन ऑडिट में बदल देता है।"
        : "PackParakh is an autonomous Legal Metrology compliance and enforcement engine developed under the Department of Consumer Affairs (DoCA), Government of India. It enforces the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011) along with the GSR 418(E) 2026 mandate. It replaces tedious 15-minute manual plastic ruler inspections with instantaneous computer vision audits in seconds.",
      citation: "Legal Metrology Act, 2009 • PCR Rules 2011",
    },
    {
      q: isHi
        ? "3-स्तरीय ऑप्टिकल कैलिब्रेशन घुमावदार या लचीली पैकेजिंग पर फोंट ऊंचाई कैसे मापता है?"
        : "How does the 3-tier optical calibration accurately measure font height on curved packaging?",
      a: isHi
        ? "पारंपरिक ओसीआर केवल टेक्स्ट पढ़ता है, भौतिक मिलीमीटर ऊंचाई नहीं नाप सकता। पैक-परख एक 3-स्तरीय भौतिक संदर्भ प्रणाली का उपयोग करता है: (1) मानक सिक्का संदर्भ (₹1, ₹2, ₹5 सिक्के, जिनका व्यास 20.0–25.0 मिमी प्रमाणित है), (2) आईएसओ/आईईसी 7810 आईडी-1 कार्ड संदर्भ (85.60 × 53.98 मिमी), या (3) संकुल किनारे की बाउंडिंग। यह पिक्सल-से-मिलीमीटर अनुपात की गणना करके नियम 7 सारणी-I के अनुसार सटीक फोंट ऊंचाई सत्यापित करता है।"
        : "Standard OCR merely extracts character strings without spatial scale. PackParakh uses a deterministic 3-tier optical calibration pipeline: (1) Sovereign coin reference marker (standardized ₹1, ₹2, ₹5 Indian coins with known 20.0mm–25.0mm diameters), (2) ISO/IEC 7810 ID-1 card bounding (85.60 × 53.98mm), or (3) packaging boundary aspect calibration. This calculates an exact pixel-to-millimeter ratio, allowing sub-millimeter font height verification strictly against Rule 7 Table-I mandates.",
      citation: "Rule 7 Table-I & Table-II PCR 2011",
    },
    {
      q: isHi
        ? "नियम 6(11) के अंतर्गत यूनिट सेल प्राइस (USP) के क्या अनिवार्य नियम हैं?"
        : "What are the statutory mandates regarding Unit Sale Price (USP) under Rule 6(11)?",
      a: isHi
        ? "विधिक मापविज्ञान नियम 6(11) के तहत, सभी प्री-पैकेज्ड वस्तुओं पर यूनिट सेल प्राइस (इकाई विक्रय मूल्य) घोषित करना अनिवार्य है। यदि शुद्ध मात्रा 1 किग्रा या 1 लीटर से कम है, तो मूल्य प्रति ग्राम या प्रति मिलीलीटर होना चाहिए; यदि अधिक है, तो प्रति किग्रा या प्रति लीटर। साथ ही, यूएसपी का फोंट आकार अधिकतम खुदरा मूल्य (एमआरपी) के फोंट आकार से छोटा नहीं हो सकता और इसे दो दशमलव स्थानों तक पूर्णांकित किया जाना चाहिए।"
        : "Under Rule 6(11) of PCR 2011, every pre-packaged commodity must declare the Unit Sale Price (USP) to protect consumers from hidden shrinkflation. If net quantity is under 1 kg or 1 L, USP must be declared per gram or per milliliter; if over 1 kg or 1 L, per kg or per liter. Furthermore, the font height of the USP declaration cannot be smaller than the font size of the declared MRP, rounded strictly to two decimal places.",
      citation: "Rule 6(11) PCR 2011 & GSR 418(E)",
    },
    {
      q: isHi
        ? "भारतीय साक्ष्य अधिनियम 2023 की धारा 63 के तहत डिजिटल साक्ष्य न्यायालय में कैसे ग्राह्य है?"
        : "How does PackParakh ensure evidence is court-admissible under Section 63 BSA 2023?",
      a: isHi
        ? "प्रत्येक निरीक्षण के दौरान, कैप्चर की गई छवियां, ओसीआर बाउंडिंग बॉक्स टोकन, अधिकारी बैज आईडी, जीपीएस निर्देशांक और टाइमस्टैम्प को एक कैनोनिकल जेसन पेलोड में संकलित किया जाता है। इसका SHA-256 क्रिप्टोग्राफिक हैश तैयार करके ई-डिस्ट्रिक्ट लेजर में सुरक्षित किया जाता है। यह भारतीय साक्ष्य अधिनियम 2023 की धारा 63 (पूर्ववर्ती भारतीय साक्ष्य अधिनियम की धारा 65बी) के तहत पूर्ण न्यायालयी साक्ष्य श्रृंखला की पुष्टि करता है।"
        : "Every field inspection, camera frame, OCR coordinate token, officer badge ID, GPS coordinate, and device timestamp is serialized into a canonical JSON payload and hashed using cryptographic SHA-256. This creates an immutable digital chain of custody with a verifiable cryptographic token, satisfying all statutory requirements of Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (formerly Section 65B of the Indian Evidence Act, 1872).",
      citation: "Section 63, Bharatiya Sakshya Adhiniyam, 2023",
    },
    {
      q: isHi
        ? "जन विश्वास अधिनियम 2023 के तहत पैकेजिंग उल्लंघनों पर जुर्माने की क्या व्यवस्था है?"
        : "How does the Jan Vishwas Act 2023 alter packaging compounding penalties?",
      a: isHi
        ? "जन विश्वास (उपबंधों का संशोधन) अधिनियम 2023 ने विधिक मापविज्ञान अधिनियम की धारा 36(1) के तहत प्रथम बार किए गए पैकेजिंग अपराधों को अपराधमुक्त (डिक्रिमिनलाइज) कर दिया है। आपराधिक मुकदमों के स्थान पर अब श्रेणीबद्ध वैधानिक कंपाउंडिंग जुर्माने (प्रथम अपराध के लिए ₹25,000 तक, और बार-बार उल्लंघन पर ₹1,25,000 तक) का प्रावधान है, जिसे स्वचालित फॉर्म-वी मेमो के जरिए अधिरोपित किया जाता है।"
        : "The Jan Vishwas (Amendment of Provisions) Act, 2023 decriminalized first-time packaging non-compliance under Section 36(1) of the Legal Metrology Act. Instead of criminal court prosecution, offenses are resolved through graded statutory compounding penalties (up to ₹25,000 for first offence, and up to ₹1,25,000 for repeated violations) assessed instantaneously through auto-generated Form-V Seizure Memos.",
      citation: "Jan Vishwas Act 2023 • Section 36(1) LM Act",
    },
  ];

  // Domain Testimonials for Infinite Moving Cards
  const testimonials = [
    {
      id: "test-1",
      title: isHi ? "निरीक्षण समय 15 मिनट से घटकर सेकंडों में" : "Field Audits Cut from 15m to Seconds",
      description: isHi
        ? "सिक्का कैलिब्रेशन और नियम 7 फोंट माप एल्गोरिदम ने खुदरा दुकानों में हमारे औचक छापों को अत्यंत तीव्र और अचूक बना दिया है। धारा 63 साक्ष्य सील अभूतपूर्व है।"
        : "The coin calibration and Rule 7 font measurement algorithm has drastically accelerated field inspections across retail chains. Evidence hash generation under BSA Section 63 is solid.",
      rating: 5,
      tags: ["LMO Enforcement", "GSR 418(E)"],
      name: "Rajesh Kumar",
      role: isHi ? "राज्य विधिक मापविज्ञान प्रवर्तन अधिकारी" : "State Metrology Enforcement Officer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "test-2",
      title: isHi ? "सिलेंडर निर्माण में ₹4.2 लाख की बचत" : "Saved ₹4.2 Lakhs in Cylinder Recalls",
      description: isHi
        ? "प्रिंटिंग सिलेंडरों को उकेरने से पहले हमारे पीडीएफ वेक्टर आर्टवर्क की जांच ने दो गंभीर फोंट अनुपात उल्लंघनों को पकड़ लिया। रीकॉल का लाखों का खर्च बच गया।"
        : "Pre-flighting our vector artwork before engraving gravure cylinders detected two critical font ratio violations. Saved our brand massive recall expenses and penalties.",
      rating: 5,
      tags: ["MSME Brand", "Pre-Print Studio"],
      name: "Priya Sharma",
      role: isHi ? "अनुपालन प्रमुख, एफएमसीजी पैकेजिंग" : "Compliance Head, FMCG Packaging Hub",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "test-3",
      title: isHi ? "श्रिंकफ्लेशन तुरंत पकड़ा गया" : "Consumer Shrinkflation Caught Instantly",
      description: isHi
        ? "नियम 6(11) के तहत स्वचालित यूनिट सेल प्राइस कैलकुलेटर ने 400 ग्राम के पैकेट पर छिपी हुई प्रति-ग्राम मूल्य वृद्धि को तुरंत चिन्हित कर दिया।"
        : "The automated Unit Sale Price calculator under Rule 6(11) spotted a hidden per-gram price hike on a 400g package. Instant e-District grievance token generated seamlessly.",
      rating: 5,
      tags: ["Consumer Rights", "Rule 6(11) USP"],
      name: "Amit Verma",
      role: isHi ? "राष्ट्रीय उपभोक्ता अधिकार संरक्षक" : "Public Consumer Rights Advocate",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "test-4",
      title: isHi ? "जन विश्वास वैधानिक जुर्माना मैट्रिक्स" : "Decriminalized Jan Vishwas Matrix",
      description: isHi
        ? "जन विश्वास अधिनियम 2023 के तहत श्रेणीबद्ध कंपाउंडिंग जुर्माने के साथ फॉर्म-वी जब्ती नोटिस का स्वतः सृजन फील्ड अधिकारियों के लिए पूर्ण पारदर्शिता देता है।"
        : "The instantaneous Form-V auto-generation with deterministic compounding penalties under the Jan Vishwas Act 2023 provides absolute transparency for field officers.",
      rating: 5,
      tags: ["DoCA Legal Cell", "Form-V Notice"],
      name: "Dr. K. Radhakrishnan",
      role: isHi ? "उप नियंत्रक, विधिक मापविज्ञान" : "Deputy Controller of Legal Metrology",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "test-5",
      title: isHi ? "मानकीकृत 24-नियम पार्सर ओसीआर" : "Standardized Multi-Panel OCR Extraction",
      description: isHi
        ? "हमारी विनिर्माण लाइन 50 से अधिक एसकेयू संभालती है। पैक-परख का पार्सर सुनिश्चित करता है कि प्रत्येक अनिवार्य घोषणा पीसीआर 2011 का पूर्ण अनुपालन करे।"
        : "Our manufacturing line processes over 50 SKU varieties. PackParakh's 24-rule deterministic parser ensures every single mandatory declaration complies with PCR 2011.",
      rating: 5,
      tags: ["Quality Assurance", "PCR 2011 Rules"],
      name: "Sunita Deshmukh",
      role: isHi ? "गुणवत्ता निदेशक, नेशनल फूडवर्क्स" : "Lead QA Director, National Foodworks",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div
      ref={revealRootRef}
      className="relative min-h-screen font-sans text-[#2B231B] selection:bg-amber-200 selection:text-amber-950 flex flex-col justify-between overflow-x-hidden bg-transparent"
    >
      
      {/* 0. CINEMATIC HERO INTRO VIDEO OVERLAY (Plays once per visit or whenever requested) */}
      <HeroIntroOverlay 
        isOpen={showHeroIntro} 
        onClose={() => setShowHeroIntro(false)} 
      />

      {/* 1. FIXED BACKGROUND PHOTO (Subtle 2.5px blur for depth-of-field while keeping metrology elements crisp & recognizable) */}
      <div 
        className="fixed -inset-2 -z-30 bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none opacity-100 filter blur-[2.5px]"
        style={{ backgroundImage: "url('/landing-bg.jpg')" }}
      />

      {/* 2. SUBTLE WARM LIGHT-BEIGE TRANSLUCENT TINT OVERLAY (Smooth contrast without washing out the photo) */}
      <div className="fixed inset-0 -z-20 bg-[#FAF7F0]/25 backdrop-blur-[1px] pointer-events-none" />

      <div>
        {/* SECTION 1: HEADER / NAVBAR (Light Beige Frosted Glass) */}
        <TopStatusBar />
        <Navbar />

        {/* SECTION 2: HERO SECTION (Transparent with Light Beige Frosted Elements) */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#E8DFC8]/60 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              
              {/* Official Ministry Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F0]/35 backdrop-blur-md border border-[#FAF7F0]/50 shadow-xs text-[#2B231B] text-[11px] sm:text-xs font-bold mb-6 uppercase tracking-[0.16em]"
              >
                <Landmark className="h-3.5 w-3.5 text-amber-700" />
                <span>{tr("Ministry of Consumer Affairs", "उपभोक्ता मामले मंत्रालय", "ভোক্তা বিষয়ক মন্ত্রণালয়", "நுகர்வோர் விவகார அமைச்சகம்", "వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ")}</span>
                <span className="text-[#B8A892]">•</span>
                <span>{tr("Legal Metrology Division (DoCA)", "विधिक मापविज्ञान प्रभाग (DoCA)", "লিগ্যাল মেট্রোলজি বিভাগ (DoCA)", "சட்ட அளவியல் பிரிவு (DoCA)", "లీగల్ మెట్రాలజీ విభాగం (DoCA)")}</span>
              </motion.div>

              {/* Genuine Domain Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[62px] font-black tracking-tight mb-6 leading-[1.18] heading-hero"
              >
                {tr("Autonomous Legal Metrology", "स्वायत्त विधिक मापविज्ञान", "স্বায়ত্তশাসিত লিগ্যাল মেট্রোলজি", "தன்னாட்சி சட்ட அளவியல்", "స్వయంప్రతిపత్త న్యాయ మెట్రాలజీ")}<br />
                <span className="heading-hero-accent">
                  {tr("Compliance & Enforcement Engine", "पैकेजिंग अनुपालन एवं प्रवर्तन इंजन", "কমপ্লায়েন্স ও এনফোর্সমেন্ট ইঞ্জিন", "இணக்க மற்றும் அமலாக்க இயந்திரம்", "కంప్లయన్స్ మరియు ఎన్‌ఫోర్స్‌మెంట్ ఇంజిన్")}
                </span>
              </motion.h1>

              {/* Subtitle Grounded in Legal Metrology */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-[22px] max-w-4xl mx-auto leading-relaxed mb-10 heading-hero-subtitle"
              >
                {language === "hi" && (
                  <>
                    पारंपरिक 15-मिनट के प्लास्टिक स्केल निरीक्षण के स्थान पर{" "}
                    <span className="text-amber-300 font-bold">सेकंडों में त्वरित विजुअल ऑडिट</span>
                    । 3-स्तरीय ऑप्टिकल कैलिब्रेशन, नियम 6(11) यूएसपी सत्यापन, और{" "}
                    <span className="text-amber-300 font-bold">कोर्ट-स्वीकृत फॉर्म-वी जब्ती मेमो</span>{" "}
                    (धारा 63 बीएसए 2023)।
                  </>
                )}
                {language === "bn" && (
                  <>
                    15 মিনিটের ম্যানুয়াল প্লাস্টিক রুলার পরিদর্শনের পরিবর্তে{" "}
                    <span className="text-amber-300 font-bold">সেকেন্ডে তাত্ক্ষণিক ভিজ্যুয়াল অডিট</span>
                    , 3-স্তরের অপটিক্যাল ক্যালিব্রেশন এবং{" "}
                    <span className="text-amber-300 font-bold">আদালত-অনুমোদিত ফর্ম-V সিজার মেমো</span>{" "}
                    (ধারা 63 BSA 2023)।
                  </>
                )}
                {language === "ta" && (
                  <>
                    15 நிமிட கையேடு அளவுகோல் ஆய்வுக்குப் பதிலாக{" "}
                    <span className="text-amber-300 font-bold">நொடிகளில் உடனடி பார்வை தணிக்கை</span>
                    , 3-நிலை அளவுத்திருத்தம் மற்றும்{" "}
                    <span className="text-amber-300 font-bold">நீதிமன்ற-ஏற்கத்தக்க படிவம்-V பறிமுதல் குறிப்பாணை</span>{" "}
                    (பிரிவு 63 BSA 2023).
                  </>
                )}
                {language === "te" && (
                  <>
                    15 నిమిషాల మాన్యువల్ స్కేల్ తనిఖీ స్థానంలో{" "}
                    <span className="text-amber-300 font-bold">సెకన్లలో తక్షణ విజువల్ ఆడిట్</span>
                    , 3-స్థాయి ఆప్టికల్ కాలిబ్రేషన్ మరియు{" "}
                    <span className="text-amber-300 font-bold">కోర్టు-ఆమోదిత ఫారం-V జప్తు మెమో</span>{" "}
                    (సెక్షన్ 63 BSA 2023).
                  </>
                )}
                {language === "en" && (
                  <>
                    Replacing 15-minute manual ruler inspections with{" "}
                    <span className="text-amber-300 font-bold">instantaneous optical audits in seconds</span>
                    , 3-tier coin calibration for{" "}
                    <span className="text-amber-300 font-bold">Rule 7 font compliance</span>
                    , and court-admissible{" "}
                    <span className="text-amber-300 font-bold">Form-V Seizure Memos</span>{" "}
                    under Section 63 BSA 2023.
                  </>
                )}
              </motion.p>

              {/* CTAs with interactive hover animations */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
              >
                {/* Primary CTA */}
                <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 450, damping: 20 }}>
                  <Link
                    href={user ? "/scan" : "/gmail-login"}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-400/35 via-amber-300/30 to-amber-500/35 hover:from-amber-400/50 hover:to-amber-500/50 border border-amber-400/55 hover:border-amber-400/80 text-[#0F172A] font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.22)] backdrop-blur-xl flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
                  >
                    <ScanLine className="w-5 h-5 text-[#0F172A]" />
                    <span>{tr("Start Package Inspection", "पैकेज निरीक्षण शुरू करें", "প্যাকেজ পরিদর্শন শুরু করুন", "பேக்கேஜ் ஆய்வைத் தொடங்குங்கள்", "ప్యాకేజీ తనిఖీని ప్రారంభించండి")}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>

                {/* Secondary CTA */}
                <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 450, damping: 20 }}>
                  <Link
                    href={user ? "/simulate" : "/gmail-login"}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-400/30 via-teal-300/25 to-emerald-500/30 hover:from-emerald-400/45 hover:to-emerald-500/45 text-[#0F172A] font-black text-sm sm:text-base px-7 py-4 rounded-2xl border border-emerald-400/50 hover:border-emerald-400/75 shadow-[0_8px_25px_rgba(16,185,129,0.18)] backdrop-blur-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-[#0F172A]" />
                    <span>{tr("Pre-Print Simulator", "एमएसएमई प्री-प्रिंट स्टूडियो", "প্রি-প্রিন্ট সিমুলেটর", "முன் அச்சு சிமுலேட்டர்", "ప్రీ-ప్రింట్ సిమ్యులేటర్")}</span>
                  </Link>
                </motion.div>

                {/* 3D Intro Video CTA */}
                <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 450, damping: 20 }}>
                  <button
                    onClick={() => setShowHeroIntro(true)}
                    type="button"
                    className="w-full sm:w-auto bg-[#FAF7F0]/40 hover:bg-[#FAF7F0]/70 text-[#0F172A] font-black text-sm sm:text-base px-6 py-4 rounded-2xl border border-[#D5C7A3] hover:border-amber-500/60 shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur-xl flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{tr("Watch 3D Intro", "3D इंट्रो देखें", "3D ইন্ট্রো দেখুন", "3D அறிமுகத்தைப் பார்க்கவும்", "3D పరిచయాన్ని చూడండి")}</span>
                  </button>
                </motion.div>
              </motion.div>

              {/* Animated Scroll Down Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col items-center justify-center transition-colors"
              >
                <a
                  href="#trust-strip"
                  className="flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group cursor-pointer"
                >
                  <span className="bg-black/35 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/25">
                    {isHi ? "वैधानिक अधिदेश देखें" : "Explore Statutory Framework"}
                  </span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full border border-amber-400/50 bg-amber-950/60 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:border-amber-300 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-amber-300" />
                  </motion.div>
                </a>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION 3: TRUST / INFO STRIP (Transparent with Light Beige Frosted Glass Cards) */}
        <section id="trust-strip" className="py-14 bg-transparent border-b border-[#E8DFC8]/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span data-reveal className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C4E3D] bg-[#FAF7F0]/80 px-4 py-1 rounded-full border border-[#E8DFC8]/80 backdrop-blur-md inline-block">
                {isHi ? "भारत सरकार के विधिक मापविज्ञान ढांचे द्वारा अधिकृत" : "Anchored to the Sovereign Legal Metrology Framework"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                {
                  title: isHi ? "उपभोक्ता मामले विभाग" : "DoCA Directorate",
                  code: "Govt of India",
                  desc: isHi ? "केंद्रीय विधिक मापविज्ञान नियंत्रण" : "Central Regulatory Authority",
                  icon: Landmark,
                  color: "text-amber-800",
                  bg: "bg-amber-100/90 border-amber-300/80",
                },
                {
                  title: isHi ? "पीसीआर 2011 व जीएसआर 418(ई)" : "PCR 2011 & GSR 418(E)",
                  code: "24 Rules Codified",
                  desc: isHi ? "2026 अनिवार्य डिजिटल मानक" : "2026 Statutory Mandates",
                  icon: FileCheck2,
                  color: "text-amber-700",
                  bg: "bg-amber-100/90 border-amber-300/80",
                },
                {
                  title: isHi ? "धारा 63 बीएसए 2023" : "Section 63 BSA 2023",
                  code: "Court Evidence",
                  desc: isHi ? "क्रिप्टोग्राफिक साक्ष्य श्रृंखला" : "Court-Admissible SHA-256",
                  icon: Hash,
                  color: "text-emerald-800",
                  bg: "bg-emerald-100/90 border-emerald-300/80",
                },
                {
                  title: isHi ? "जन विश्वास अधिनियम 2023" : "Jan Vishwas Act 2023",
                  code: "Compounding Matrix",
                  desc: isHi ? "अपराधमुक्त श्रेणीबद्ध जुर्माना" : "Decriminalized Penalty Matrix",
                  icon: Scale,
                  color: "text-amber-800",
                  bg: "bg-amber-100/90 border-amber-300/80",
                },
                {
                  title: isHi ? "राष्ट्रीय ई-डिस्ट्रिक्ट प्रणाली" : "National e-District",
                  code: "Grievance Registry",
                  desc: isHi ? "क्यूआर व टोकन सत्यापन" : "Tamper-Proof QR Ledgers",
                  icon: ShieldCheck,
                  color: "text-teal-800",
                  bg: "bg-teal-100/90 border-teal-300/80",
                },
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.18 }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#FAF7F0]/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#FAF7F0]/60 shadow-xs hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-500/80 hover:bg-[#FAF7F0]/75 transition-all duration-100 flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-transform duration-100 group-hover:scale-120 group-hover:rotate-6", badge.bg)}>
                    <badge.icon className={cn("w-5 h-5", badge.color)} />
                  </div>
                  <span className="text-xs font-black text-[#1A140F] mb-1 leading-tight group-hover:text-amber-800 transition-colors">
                    {badge.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#786551] uppercase tracking-wider mb-1">
                    {badge.code}
                  </span>
                  <span className="text-[11px] text-[#2B231B] font-medium leading-tight">{badge.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: PROCESS SECTION ("HOW IT WORKS" - Transparent with Light Beige Frosted Glass) */}
        <section id="how-it-works" className="py-20 bg-transparent border-b border-[#E8DFC8]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span data-reveal className="text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full inline-block heading-pill">
                {isHi ? "चरणबद्ध कार्यप्रणाली" : "Deterministic Workflow"}
              </span>
              <h2 data-reveal className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 heading-section">
                {isHi ? (
                  <>पैक-परख <span className="heading-hero-accent">कैसे कार्य करता है</span></>
                ) : (
                  <>How It Works: <span className="heading-hero-accent">6-Step Audit Pipeline</span></>
                )}
              </h2>
              <p data-reveal className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed heading-section-sub">
                {isHi ? (
                  <>
                    छवि अभिग्रहण से लेकर{" "}
                    <span className="text-amber-300 font-bold">कोर्ट-स्वीकृत फॉर्म-वी जब्ती मेमो</span>{" "}
                    तक, मात्र <span className="text-amber-300 font-bold">सेकंडों में</span> पूर्ण अनुपालन।
                  </>
                ) : (
                  <>
                    From raw optical capture to court-admissible electronic{" "}
                    <span className="text-amber-300 font-bold">Form-V seizure notices</span>{" "}
                    <span className="text-amber-300 font-bold">in seconds</span>.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "01",
                  title: isHi ? "बहु-पैनल पैकेज अभिग्रहण" : "Multi-Face Package Ingest",
                  desc: isHi
                    ? "मोबाइल कैमरे से उत्पाद के सामने, पीछे व पार्श्व पैनलों की तस्वीरें लें या हाई-रेजोल्यूशन वेक्टर पीडीएफ आर्टवर्क सीधे अपलोड करें।"
                    : "Capture multi-perspective mobile photos of front, back, and side display panels, or upload pre-print vector PDF packaging artwork.",
                  icon: Camera,
                  badge: "Ingest Pipeline",
                },
                {
                  step: "02",
                  title: isHi ? "3-स्तरीय ऑप्टिकल कैलिब्रेशन" : "Three-Tier Optical Calibration",
                  desc: isHi
                    ? "सिक्के (₹1/₹2/₹5), आईएसओ कार्ड या पैकेज बॉर्डर का उपयोग करके पिक्सल-टू-मिलीमीटर रूपांतरण अनुपात को 0.1 मिमी सटीकता के साथ लॉक करें।"
                    : "Calibrate spatial pixels-to-millimeters using standardized Indian currency coins, ISO/IEC 7810 ID-1 cards, or optical edge bounding.",
                  icon: Coins,
                  badge: "Rule 7 Table-I",
                },
                {
                  step: "03",
                  title: isHi ? "24-नियम पार्सर व ओसीआर" : "Deterministic 24-Rule OCR Parser",
                  desc: isHi
                    ? "ओसीआर एक्सट्रैक्टर सभी 9 अनिवार्य घोषणाओं (MRP, शुद्ध मात्रा, निर्माण तिथि, एक्सपायरी, निर्माता पता, आदि) की उपस्थिति व आकार की जांच करता है।"
                    : "Instant OCR extraction verifying all 9 mandatory declarations: MRP, Net Qty, Mfg Date, Best Before, Consumer Care, Address, Origin, and Batch No.",
                  icon: Cpu,
                  badge: "Rule 6 Mandatory",
                },
                {
                  step: "04",
                  title: isHi ? "यूनिट सेल प्राइस (यूएसपी) गणित" : "USP Arithmetic Validation",
                  desc: isHi
                    ? "नियम 6(11) के अनुसार प्रति ग्राम/मिली या प्रति किग्रा/लीटर मूल्य गणना का सत्यापन, दो दशमलव राउंडिंग और एमआरपी फोंट अनुपात की जांच।"
                    : "Rule 6(11) math audit: validates base unit normalization (per g/ml vs per kg/L), 2-decimal rounding, and ensures USP font size matches MRP.",
                  icon: FileSpreadsheet,
                  badge: "Rule 6(11) Mandate",
                },
                {
                  step: "05",
                  title: isHi ? "धारा 63 बीएसए क्रिप्टोग्राफिक सील" : "Sec 63 BSA Cryptographic Hash",
                  desc: isHi
                    ? "छवि, ओसीआर टोकन, अधिकारी आईडी, जीपीएस निर्देशांक और टाइमस्टैम्प को SHA-256 हैश द्वारा कोर्ट-स्वीकृत ई-डिस्ट्रिक्ट टोकन में सील किया जाता है।"
                    : "Generates canonical JSON SHA-256 digest locking raw image, OCR bounding boxes, officer ID, and GPS coordinates for court admissibility.",
                  icon: Hash,
                  badge: "Sec 63 BSA 2023",
                },
                {
                  step: "06",
                  title: isHi ? "फॉर्म-वी जब्ती मेमो व जुर्माना" : "Form-V Seizure Notice & Penalty",
                  desc: isHi
                    ? "जन विश्वास अधिनियम के तहत वैधानिक कंपाउंडिंग जुर्माने की तत्काल गणना और ई-डिस्ट्रिक्ट पोर्टल पर सीधे फॉर्म-वी जब्ती नोटिस का प्रेषण।"
                    : "Auto-populates official Form-V Seizure Notice, computes statutory compounding fee under Jan Vishwas Act, and registers e-District grievance.",
                  icon: FileText,
                  badge: "Form-V Registry",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.25, delay: (idx % 3) * 0.03 }}
                  whileHover={{ y: -8, scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FAF7F0]/40 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#FAF7F0]/60 relative hover:border-amber-500/90 hover:bg-[#FAF7F0]/75 hover:shadow-2xl hover:shadow-amber-900/15 transition-colors duration-150 flex flex-col justify-between shadow-xs cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-amber-800 font-mono group-hover:scale-115 group-hover:text-amber-600 transition-all duration-150 origin-left">
                          {item.step}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-150">
                          <item.icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAF7F0]/80 border border-[#FAF7F0] text-[#1A140F] group-hover:border-amber-400 group-hover:bg-amber-100/90 transition-all duration-150">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#1A140F] mb-2 group-hover:text-amber-800 transition-colors duration-150">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2B231B] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: ELIGIBILITY / REQUIREMENTS SECTION (Light Beige Frosted Glass) */}
        <section id="eligibility" className="py-20 bg-transparent border-b border-[#E8DFC8]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span data-reveal className="text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full inline-block heading-pill">
                {isHi ? "हितधारक एवं क्रेडेंशियल आवश्यकताएं" : "Stakeholder Access & Prerequisites"}
              </span>
              <h2 data-reveal className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 heading-section">
                {isHi ? (
                  <>प्लेटफ़ॉर्म <span className="heading-hero-accent">पात्रता एवं भूमिकाएं</span></>
                ) : (
                  <>Clearance & <span className="heading-hero-accent">Eligibility Requirements</span></>
                )}
              </h2>
              <p data-reveal className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed heading-section-sub">
                {isHi ? (
                  <>
                    विधिक मापविज्ञान प्रणाली में{" "}
                    <span className="text-amber-300 font-bold">प्रवर्तन अधिकारियों</span>,{" "}
                    <span className="text-amber-300 font-bold">ब्रांड निर्माताओं</span>, और{" "}
                    <span className="text-amber-300 font-bold">नागरिकों</span> के लिए आवश्यक वैधानिक पहचान।
                  </>
                ) : (
                  <>
                    Statutory prerequisites and authorized clearances for{" "}
                    <span className="text-amber-300 font-bold">government officers</span>,{" "}
                    <span className="text-amber-300 font-bold">brand manufacturers</span>, and{" "}
                    <span className="text-amber-300 font-bold">public citizens</span>.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Stakeholder 1: LMO Officers */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.32, delay: 0.04 }}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FAF7F0]/40 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-[#FAF7F0]/60 shadow-sm hover:border-amber-500/90 hover:bg-[#FAF7F0]/75 hover:shadow-2xl hover:shadow-amber-900/15 transition-colors duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-5 group-hover:scale-120 group-hover:rotate-6 transition-transform duration-150">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#1A140F] mb-1 group-hover:text-amber-800 transition-colors">
                    {isHi ? "विधिक मापविज्ञान अधिकारी (LMO)" : "Legal Metrology Officers"}
                  </h3>
                  <p className="text-xs text-amber-900 font-extrabold mb-4">
                    {isHi ? "राज्य प्रवर्तन शाखा एवं निरीक्षण दल" : "State Enforcement Wings & Raid Squads"}
                  </p>
                  <p className="text-xs text-[#2B231B] font-medium leading-relaxed mb-6">
                    {isHi
                      ? "भौतिक बाजारों, मंडियों और कारखानों में औचक निरीक्षण करने तथा गैर-अनुपालन पर धारा 36 के अंतर्गत जब्ती ज्ञापन जारी करने के लिए अधिकृत।"
                      : "Authorized to conduct surprise market raids, measure display panel font compliance, and issue Form-V seizure notices under Section 36."}
                  </p>

                  <div className="border-t border-[#FAF7F0]/60 pt-4 mb-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A140F] block mb-2.5">
                      {isHi ? "आवश्यक क्रेडेंशियल:" : "Required Prerequisites:"}
                    </span>
                    <ul className="space-y-2 text-xs text-[#2B231B] font-medium">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>State Controller of Legal Metrology Authorization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Active Officer Badge ID (e.g. DL-LMO-2026)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Govt / NIC Email or Biometric SSO Token</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>GPS-enabled mobile capture device</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link
                  href={user ? "/scan?mode=field" : "/gmail-login"}
                  className="w-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/35 hover:border-orange-500/60 text-[#0F172A] font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs backdrop-blur-xl"
                >
                  <span>{user ? (isHi ? "अधिकारी कार्यक्षेत्र खोलें" : "Open Officer Workspace") : isHi ? "अधिकारी लॉगिन (जीमेल द्वारा)" : "Officer Login (via Gmail)"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />
                </Link>
              </motion.div>

              {/* Stakeholder 2: MSME Brands */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.32, delay: 0.08 }}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FAF7F0]/40 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-[#FAF7F0]/60 shadow-sm hover:border-amber-500/90 hover:bg-[#FAF7F0]/75 hover:shadow-2xl hover:shadow-amber-900/15 transition-colors duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-5 group-hover:scale-120 group-hover:rotate-6 transition-transform duration-150">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#1A140F] mb-1 group-hover:text-amber-800 transition-colors">
                    {isHi ? "एमएसएमई एवं ब्रांड निर्माता" : "MSME Brands & Packagers"}
                  </h3>
                  <p className="text-xs text-amber-900 font-extrabold mb-4">
                    {isHi ? "पैकेजिंग डिजाइनर, आयातक एवं निर्माता" : "FMCG Packagers, Importers & Designers"}
                  </p>
                  <p className="text-xs text-[#2B231B] font-medium leading-relaxed mb-6">
                    {isHi
                      ? "व्यावसायिक प्रिंटिंग सिलेंडरों को उकेरने से पहले अपनी पैकेजिंग के पीडीएफ लेआउट को सत्यापित करें और रिकॉल तथा जुर्माने से बचें।"
                      : "Pre-flight packaging vector PDFs prior to commercial cylinder engraving to eliminate font violations, recalls, and compounding penalties."}
                  </p>

                  <div className="border-t border-[#FAF7F0]/60 pt-4 mb-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A140F] block mb-2.5">
                      {isHi ? "आवश्यक क्रेडेंशियल:" : "Required Prerequisites:"}
                    </span>
                    <ul className="space-y-2 text-xs text-[#2B231B] font-medium">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                        <span>Valid 15-digit GSTIN or Corporate Entity ID</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                        <span>FSSAI License No. (for food/beverage commodities)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                        <span>Vector packaging artwork (PDF / AI format)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                        <span>Authorized brand representative key</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link
                  href={user ? "/simulate" : "/gmail-login"}
                  className="w-full bg-blue-600/15 hover:bg-blue-600/25 border border-blue-600/35 hover:border-blue-600/60 text-[#0F172A] font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs backdrop-blur-xl"
                >
                  <span>{user ? (isHi ? "प्री-प्रिंट स्टूडियो खोलें" : "Open Pre-Print Studio") : isHi ? "प्री-प्रिंट सिम्युलेटर (जीमेल द्वारा)" : "Launch Pre-Print Studio (via Gmail)"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />
                </Link>
              </motion.div>

              {/* Stakeholder 3: Citizen Consumers */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.32, delay: 0.12 }}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FAF7F0]/40 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-[#FAF7F0]/60 shadow-sm hover:border-emerald-600/90 hover:bg-[#FAF7F0]/75 hover:shadow-2xl hover:shadow-emerald-900/15 transition-colors duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-5 group-hover:scale-120 group-hover:rotate-6 transition-transform duration-150">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#1A140F] mb-1 group-hover:text-emerald-800 transition-colors">
                    {isHi ? "उपभोक्ता एवं नागरिक" : "Consumer Citizens"}
                  </h3>
                  <p className="text-xs text-emerald-950 font-extrabold mb-4">
                    {isHi ? "त्वरित-वाणिज्य व खुदरा खरीदार" : "Public Retail & Quick-Commerce Shoppers"}
                  </p>
                  <p className="text-xs text-[#2B231B] font-medium leading-relaxed mb-6">
                    {isHi
                      ? "खरीदे गए सामान पर एमआरपी और यूनिट सेल प्राइस (यूएसपी) गणित की तुरंत जांच करें। किसी भी गड़बड़ी पर साक्ष्य टोकन प्राप्त करें।"
                      : "Scan retail packaged goods or paste e-commerce product links to audit Unit Sale Price math and obtain court-admissible grievance tokens."}
                  </p>

                  <div className="border-t border-[#FAF7F0]/60 pt-4 mb-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A140F] block mb-2.5">
                      {isHi ? "आवश्यक क्रेडेंशियल:" : "Required Prerequisites:"}
                    </span>
                    <ul className="space-y-2 text-xs text-[#2B231B] font-medium">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Authentication & Identification Clearance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Smartphone camera or package photo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Standard e-commerce product listing URL</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Direct link to National Consumer Helpline (1915)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link
                  href={user ? "/scan" : "/gmail-login"}
                  className="w-full bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-600/35 hover:border-emerald-600/55 text-[#0F172A] font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs backdrop-blur-xl"
                >
                  <span>{user ? (isHi ? "स्कैन शुरू करें" : "Open Package Inspector") : isHi ? "नागरिक सत्यापन (जीमेल द्वारा)" : "Instant Citizen Scan (via Gmail)"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ ACCORDION SECTION (Light Beige Frosted Cards) */}
        <section id="faq" className="py-20 bg-transparent border-b border-[#E8DFC8]/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span data-reveal className="text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full inline-block heading-pill">
                {isHi ? "सामान्य प्रश्न एवं उत्तर" : "Statutory Knowledge Base"}
              </span>
              <h2 data-reveal className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 heading-section">
                {isHi ? (
                  <>अक्सर पूछे जाने वाले <span className="heading-hero-accent">महत्वपूर्ण प्रश्न</span></>
                ) : (
                  <>Frequently Asked <span className="heading-hero-accent">Questions</span></>
                )}
              </h2>
              <p data-reveal className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed heading-section-sub">
                {isHi ? (
                  <>
                    <span className="text-amber-300 font-bold">विधिक मापविज्ञान अधिनियम</span>,{" "}
                    <span className="text-amber-300 font-bold">पीसीआर 2011</span>, ऑप्टिकल कैलिब्रेशन एवं{" "}
                    <span className="text-amber-300 font-bold">धारा 63 बीएसए</span> साक्ष्य से जुड़े महत्वपूर्ण प्रश्न।
                  </>
                ) : (
                  <>
                    Clarifications on{" "}
                    <span className="text-amber-300 font-bold">Legal Metrology Act</span>,{" "}
                    <span className="text-amber-300 font-bold">PCR 2011 Rules</span>, optical calibration, and{" "}
                    <span className="text-amber-300 font-bold">Section 63 BSA evidence</span>.
                  </>
                )}
              </p>
            </div>

            {/* Interactive Accordion with Clear Translucent Cards */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    data-reveal="box"
                    className="border border-[#FAF7F0]/60 rounded-2xl overflow-hidden bg-[#FAF7F0]/40 backdrop-blur-md shadow-xs transition-all duration-150 ease-out hover:border-amber-400 hover:bg-[#FAF7F0]/65 hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none transition-colors"
                    >
                      <span className="text-sm sm:text-base font-black text-[#1A140F] leading-snug">
                        {faq.q}
                      </span>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border border-slate-300/80 flex items-center justify-center shrink-0 text-slate-800 transition-transform duration-200 bg-white/70 shadow-xs",
                          isOpen && "rotate-180 text-amber-800 border-amber-400 bg-amber-100/90"
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#2B231B] font-medium leading-relaxed border-t border-[#FAF7F0]/60">
                            <p className="mb-4 text-[#2B231B] leading-relaxed">{faq.a}</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-400/50 text-amber-950 text-[11px] font-mono font-bold shadow-xs">
                              <FileCheck2 className="w-3.5 h-3.5 text-amber-800" />
                              <span>{faq.citation}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Helpline Box */}
            <div 
              data-reveal="box"
              className="mt-10 bg-[#FAF7F0]/35 backdrop-blur-md border border-[#FAF7F0]/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs hover:shadow-md transition-all duration-150"
            >
              <div>
                <h3 className="text-sm font-black text-[#1A140F] mb-1">
                  {isHi ? "अतिरिक्त विधिक मापविज्ञान सहायता की आवश्यकता है?" : "Need statutory legal metrology clarification?"}
                </h3>
                <p className="text-xs text-[#2B231B] font-medium">
                  {isHi
                    ? "राष्ट्रीय उपभोक्ता हेल्पलाइन (1915) या उपभोक्ता मामले मंत्रालय की तकनीकी सहायता से संपर्क करें।"
                    : "Connect with the National Consumer Helpline (1915) or DoCA Technical Legal Cell."}
                </p>
              </div>
              <Link
                href="/helpdesk"
                className="bg-amber-600/15 hover:bg-amber-600/25 border border-amber-600/35 hover:border-amber-600/55 text-[#0F172A] font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5 backdrop-blur-xl active:scale-95"
              >
                <HelpCircle className="w-4 h-4 text-[#0F172A]" />
                <span>{isHi ? "हेल्पडेस्क टिकट खोलें" : "Open Helpdesk"}</span>
              </Link>
            </div>

          </div>
        </section>

        {/* SECTION 8: TESTIMONIALS (Static Grid - Clean, Responsive, No Sliding) */}
        <section id="testimonials" className="py-20 bg-transparent border-b border-[#E8DFC8]/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center max-w-3xl mx-auto">
              <span data-reveal className="text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full inline-block heading-pill">
                {isHi ? "प्रशंसापत्र एवं व्यावहारिक प्रभाव" : "Real-World Statutory Impact"}
              </span>
              <h2 data-reveal className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 heading-section">
                {isHi ? (
                  <>प्रवर्तन अधिकारियों एवं उद्योग जगत द्वारा <span className="heading-hero-accent">विश्वसनीय</span></>
                ) : (
                  <>Trusted by Metrology Officers & <span className="heading-hero-accent">Packaging Leaders</span></>
                )}
              </h2>
              <p data-reveal className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed heading-section-sub">
                {isHi ? (
                  <>
                    <span className="text-amber-300 font-bold">राज्य प्रवर्तन शाखाओं</span>,{" "}
                    <span className="text-amber-300 font-bold">एमएसएमई ब्रांड्स</span>, और उपभोक्ता संरक्षकों को{" "}
                    <span className="text-amber-300 font-bold">स्वचालित विधिक अनुपालन</span> से सशक्त बनाना।
                  </>
                ) : (
                  <>
                    Empowering{" "}
                    <span className="text-amber-300 font-bold">state enforcement wings</span>,{" "}
                    <span className="text-amber-300 font-bold">MSME brand packagers</span>, and consumer advocates with{" "}
                    <span className="text-amber-300 font-bold">automated Legal Metrology compliance</span>.
                  </>
                )}
              </p>
            </div>
          </div>

          <div data-reveal="box" className="w-full">
            <InfiniteMovingCards
              items={testimonials}
              speed="normal"
              direction="left"
              pauseOnHover={true}
              cardClassName="bg-[#FAF7F0]/85 backdrop-blur-xl border-[#E8DFC8] shadow-md hover:shadow-xl hover:border-amber-500"
            />
          </div>
        </section>

      </div>

      {/* Floating Replay 3D Intro Launcher */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setShowHeroIntro(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          title="Play 3D Intro Video"
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-950/85 hover:bg-slate-950 text-amber-400 hover:text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>3D Video</span>
        </motion.button>
      </div>

      <Footer />
    </div>
  );
}
