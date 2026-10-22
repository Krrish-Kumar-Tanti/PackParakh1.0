export type Language = "en" | "hi" | "bn" | "ta" | "te";

export const translations = {
  en: {
    // Status Bar
    statusBar: {
      directorate: "Legal Metrology Directorate",
      engine: "PCR 2011 Engine v2.1: ACTIVE",
      vision: "Vision Pipeline: ONLINE",
      evidence: "Evidence Chain: BSA 2023 SECURED",
      doca: "DoCA Legal Metrology",
    },
    top: {
      status: {
        active: "ACTIVE",
        online: "ONLINE",
        secured: "SECURED (SHA-256)",
        text: "Legal Metrology Directorate | PCR 2011 Engine v2.1:",
        vision: "| Vision Pipeline:",
        evidence: "| Evidence Chain:",
      },
    },
    layout: {
      back: "Back to previous",
    },

    // Navbar
    nav: {
      title: "PackParakh",
      titleHindi: "(पैक-परख)",
      badge: "DoCA Engine",
      subtitle: "Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution",
      home: "Home",
      act: "Act & Rules",
      guidelines: "Guidelines",
      helpdesk: "Helpdesk",
      contact: "Contact",
      brand: "e-Maapan",
      subBrand: "Legal Metrology",
      login: "Sign In",
    },

    // Hero
    hero: {
      pill: "MINISTRY OF CONSUMER AFFAIRS • LEGAL METROLOGY DIVISION (DoCA)",
      heading1: "Autonomous Legal Metrology",
      heading2: "Compliance Engine",
      subtext: "Replacing 15-minute manual plastic ruler inspections with instantaneous visual audits, 3-tier optical font calibration, and court-admissible Form-V Seizure Memos.",
    },

    // Metrics
    metrics: {
      speed: { value: "15m ➔ In Seconds", label: "Audit Speed" },
      cost: { value: "₹0.12", label: "Compute Cost / SKU" },
      rules: { value: "24 Rules", label: "Codified PCR 2011" },
      hash: { value: "SHA-256", label: "Sec 63 BSA 2023" },
    },

    // Gateway
    gateway: {
      title: "Operational Access Gateway",
      subtitle: "Select your role to initialize the inspection pipeline",
      ssoReady: "SSO READY",
      tabs: {
        lmo: "LMO Officer",
        msme: "MSME Brand",
        citizen: "Citizen Scan",
      },
    },

    // LMO Form
    lmo: {
      info: "Legal Metrology Officer (LMO) Mode: Conduct physical mandi & kirana market raids with 3-tier calibration, calculate Section 36 penalties, and sign Form-V seizure memos.",
      stateLabel: "State Jurisdiction",
      badgeLabel: "Officer Badge Number",
      badgePlaceholder: "e.g. DL-LMO-2026-0842",
      submit: "Access LMO Workspace",
      demo: "Quick Demo LMO",
      states: {
        DL: "Delhi (NCT)",
        MH: "Maharashtra",
        UP: "Uttar Pradesh",
        KA: "Karnataka",
        TN: "Tamil Nadu",
        WB: "West Bengal",
      },
    },

    // MSME Form
    msme: {
      info: "MSME & FMCG Packaging Portal: Pre-flight vector artwork (PDFs) with 0% camera distortion before engraving commercial cylinders, saving ₹2–5 Lakhs in printing recalls.",
      gstinLabel: "GSTIN / Corporate Entity ID",
      gstinPlaceholder: "e.g. 07AAAAA0000A1Z5",
      submit: "Access Brand Studio",
      demo: "Quick Demo Brand",
    },

    // Citizen Form
    citizen: {
      info: "Public Citizen Instant Audit: Bypasses login credentials. Scan any product packaging or quick-commerce listing to check Unit Sale Price math and generate an official e-District grievance token.",
      submit: "Launch Instant Citizen Scan (1-Tap Bypass)",
    },

    // Simulator Banner
    simulator: {
      title: "Interactive Pre-Market Packaging Simulator",
      subtitle: "Adjust PDP area sliders to compute Rule 7 minimum font heights in real-time",
      cta: "Try Now",
    },

    // Scanner Mockup
    scanner: {
      title: "Live Optical Inspection View",
      verified: "VERIFIED PASS",
      fpsTag: "FPS: 60 | TIER A mm",
      productName: "ROYAL CHAI 500g",
      foodCat: "FOOD CAT",
      sha: "SHA-256 DIGITAL CHAIN",
      shaAuthenticated: "AUTHENTICATED",
      shaHash: "e89b4f2c019d384029471b84920c5d9e...",
      bsa: "Section 63 BSA 2023 Compliant",
      startScan: "Start Scan",
      rules: {
        mrp: "RULE 6(1)(e): MRP PASS",
        mrpText: "MRP ₹ 240.00",
        mrpSub: "(incl. of all taxes)",
        usp: "RULE 6(11): USP PASS",
        uspText: "Unit Sale Price: ₹ 0.48 / g",
        uspSub: "(Math: 240 ÷ 500)",
        font: "RULE 7 TABLE-I: FONT PASS",
        fontText: "Measured Font: 4.2 mm",
        fontSub: "(Statutory Min: 4.0 mm)",
      },
    },

    // Pipeline Cards
    pipeline: {
      heading: "Adaptive 3-in-1 Pipeline",
      subheading: "Engineered for real-world field raids, online quick-commerce, and pre-print manufacturing",
      modes: {
        field: {
          badge: "OFFLINE READY",
          title: "Mode A: Offline Field Kirana Scan",
          desc: "Smartphone camera capture with 3-tier optical mm calibration for retail market raids in rural mandis with zero internet.",
          cta: "Launch Field Mode",
        },
        ecom: {
          badge: "HEADLESS SCRAPER",
          title: "Mode B: Online E-Commerce Audit",
          desc: "Audit Amazon, Blinkit, and quick-commerce product URLs for Rule 6(1)(g) Country of Origin & GSR 226(E) Unit Sale Price.",
          cta: "Launch E-Com Scraper",
        },
        preprint: {
          badge: "0% OPTICAL DISTORTION",
          title: "Mode C: Pre-Print MSME Vector Audit",
          desc: "Pre-flight vector PDF artwork to catch font violations before engraving costly packaging printing cylinders.",
          cta: "Launch Vector Studio",
        },
      },
    },

    // Testimonials
    testimonials: {
      pill: "FIELD & INDUSTRY TESTIMONIALS",
      heading: "Trusted by Officers, FMCG Brands & Advocates",
      subheading: "Transforming statutory packaging compliance across rural kiranas, digital e-commerce, and pre-print manufacturing.",
      items: [
        {
          name: "Rajesh Sharma",
          profession: "Senior Legal Metrology Officer (LMO)",
          description: "PackParakh reduced our mandi packaging raid verification time from 15 minutes to seconds. Generating court-ready Form-V seizure memos with SHA-256 evidence hashes on ground level is revolutionary.",
          badge: "Field LMO Officer",
        },
        {
          name: "Ananya Deshmukh",
          profession: "Quality Assurance Lead, FMCG Brand",
          description: "The Pre-Print MSME Mode saved our packaging printing cylinders before manufacturing 50,000 biscuit wrappers. Finding Rule 7 font undersizing before printing saved us Lakhs in packaging recalls.",
          badge: "MSME Packaging",
        },
        {
          name: "Dr. Vikram Sethi",
          profession: "Consumer Affairs Advocate",
          description: "PackParakh empowers citizens with e-District complaint dossiers and instant WhatsApp handoff. The transparency around Unit Sale Price and Country of Origin compliance is unprecedented.",
          badge: "Public Consumer Rights",
        },
        {
          name: "Priya Nair",
          profession: "E-Commerce Regulatory Auditor",
          description: "Auditing Amazon & Blinkit product listings for Rule 6(1)(g) Country of Origin compliance used to be tedious. Headless scraping and instant deduction scoring makes audits effortless.",
          badge: "E-Com Compliance",
        },
      ],
    },

    // Footer
    footer: {
      name: "PackParakh (पैक-परख)",
      team: "• Developed by Krrish Kumar Tanti",
      doca: "Department of Consumer Affairs (DoCA)",
      act: "• Legal Metrology Act, 2009",
      pcr: "• PCR 2011 Codified",
    },

    // Unnati Monorepo i18n Merged Keys
    login: {
      ministry: "Ministry of Consumer Affairs",
      department: "Legal Metrology (DoCA)",
      hero: {
        title1: "Autonomous Legal",
        title2: "Metrology",
        titleHighlight: "Compliance Engine",
        subtitle: "Replacing 15-minute manual plastic ruler inspections with instantaneous visual audits, 3-tier optical font calibration, and court-admissible Form-V Seizure Memos.",
      },
      stat: {
        speed: { label: "Audit Speed", value: "15m → In Seconds" },
        cost: { label: "Compute Cost", value: "₹0.12 / SKU" },
        rules: { label: "Codified Rules", value: "24 PCR 2011" },
        chain: { label: "Evidence Chain", value: "SHA-256" },
      },
      gateway: {
        title: "Operational Access",
        badge: "SSO READY",
      },
      tab: {
        lmo: "LMO Officer",
        msme: "MSME Brand",
        citizen: "Citizen Scan",
      },
      lmo: {
        desc: "Legal Metrology Officer (LMO) Mode: Conduct physical mandi & kirana market raids with 3-tier calibration, calculate Section 36 penalties, and sign Form-V seizure memos.",
        stateLabel: "State Jurisdiction",
        badgeLabel: "Officer Badge Number",
        badgePlaceholder: "e.g. DL-LMO-2026",
        passLabel: "Password / Access Key",
        passPlaceholder: "••••••••",
        submit: "Authenticate & Enter Workspace",
      },
      msme: {
        desc: "MSME / Designer Mode: Pre-flight vector artwork PDFs to detect font undersizing before engraving costly industrial printing cylinders.",
        gstinLabel: "GSTIN / Company ID",
        gstinPlaceholder: "e.g. 29GGGGG1314R9Z6",
        submit: "Launch Pre-Print Simulator",
      },
      citizen: {
        desc: "Public Citizen Scan: Verify product authenticity and MRP compliance instantly. No registration required.",
        submit: "Instant Citizen Scan",
      },
    },
    audit: {
      title: "Select Audit Modality",
      subtitle: "Choose the appropriate inspection pipeline based on your target operational environment.",
      mode: {
        physical: {
          title: "Offline Field Mode (Retail Kirana)",
          desc: "Smartphone camera scan with 3-tier optical calibration for retail market raids. Works without internet connection.",
          badge: "Offline Ready (PWA)",
        },
        ecom: {
          title: "Online E-Com Audit",
          desc: "Audit Amazon, Blinkit, and quick-commerce listings for Rule 6(1)(g) Country of Origin & GSR 226(E) Unit Sale Price.",
          badge: "Instant Headless",
        },
        pdf: {
          title: "Pre-Print MSME Mode",
          desc: "Pre-flight vector artwork PDFs to detect font undersizing before engraving costly industrial printing cylinders.",
          badge: "0% Optical Distortion",
        },
      },
      simulate: {
        title: "Proactive Compliance Tooling",
        desc: "Validate packaging dimensions against PCR 2011 Rule 7 before manufacturing.",
        btn: "Launch Pre-Market Simulator",
      },
    },
    step: {
      s0: "Ready",
      s1: "Frame Capture",
      s2: "Contour Mapping",
      s3: "OCR Extraction",
      s4: "Rule Verification",
      s5: "Verdict Generated",
    },
    verdict: {
      back: "Back to Scanner",
      status: { pass: "PASS", review: "REVIEW", fail: "FAIL" },
      sub: { pass: "Compliant Packaging", review: "Manual Override Required", fail: "Non-Compliant Packaging" },
      metrics: {
        title: "Optical Metrics",
        pdp: "PDP Surface Area",
        fontReq: "Statutory Min Font",
        fontCalc: "Calculated Min Font",
        confidence: "AI Confidence",
      },
      waterfall: { title: "Explainable Deduction Waterfall", pts: "pts" },
      checklist: { title: "Codified PCR 2011 Rule Execution" },
      action: {
        seal: "Confirm via Calibrated Micrometer & Seal Form-V",
        sealed: "Seizure Memo Signed & Secured (Form-V)",
        override: "LMO Manual Override",
        approve: "Approve Exception",
      },
    },
    scan: {
      camera: {
        unsupported: "Camera API is not supported in this browser or frame environment.",
        denied: "Camera permission was denied. Please allow access.",
        notfound: "No camera device was found on this system.",
        failed: "Camera access failed.",
        requesting: "Requesting camera access...",
      },
      fallback: { btn: "Fallback File Upload" },
      guide: { align: "ALIGN PDP HERE" },
      ecom: {
        title: "Headless E-Com Audit",
        placeholder: "https://amazon.in/dp/...",
        sample1: "Sample Amazon Tea",
        sample2: "Sample Blinkit Pack",
      },
      pdf: {
        drag: "Drag & Drop Vector Artwork PDF",
        support: "Supports high-fidelity font dimension extraction",
      },
      btn: {
        capture: "Capture & Analyze",
        processing: "Processing...",
      },
      config: {
        title: "Workspace Configuration",
        cat: {
          title: "Product Category",
          food: "Food & Beverages",
          cosmetic: "Cosmetics",
          electronics: "Electronics & Hardware",
          general: "General Merchandise",
          desc: "Adjusts rule subsets (e.g. Rule 6(1)(d) bypass for non-perishables).",
        },
        calib: {
          title: "Optical Calibration",
          opt1: "Marker / ID Card",
          opt1desc: "Auto-calibrates via standard ArUco marker.",
          opt2: "Declared Dimensions",
          opt2desc: "Manual reference input.",
          opt3: "Heuristic Fallback",
          opt3desc: "AI-estimated bounding volume.",
          width: "Package Width:",
          mm: "mm",
        },
      },
      demo: {
        title: "Demo Test Suites",
        pass: "100% Compliant Biscuit",
        review: "Partial Review Pack",
        fail: "Multi-Violation Pack",
        badge: { pass: "PASS", review: "REVIEW", fail: "FAIL" },
      },
    },
  },

  hi: {
    // Status Bar
    statusBar: {
      directorate: "विधिक माप-विज्ञान निदेशालय",
      engine: "PCR 2011 इंजन v2.1: सक्रिय",
      vision: "विज़न पाइपलाइन: ऑनलाइन",
      evidence: "साक्ष्य श्रृंखला: BSA 2023 सुरक्षित",
      doca: "DoCA विधिक माप-विज्ञान",
    },
    top: {
      status: {
        active: "सक्रिय",
        online: "ऑनलाइन",
        secured: "सुरक्षित (SHA-256)",
        text: "विधिक माप विज्ञान निदेशालय | PCR 2011 इंजन v2.1:",
        vision: "| विजन पाइपलाइन:",
        evidence: "| साक्ष्य श्रृंखला:",
      },
    },
    layout: {
      back: "पीछे जाएं",
    },

    // Navbar
    nav: {
      title: "पैक-परख",
      titleHindi: "(PackParakh)",
      badge: "DoCA इंजन",
      subtitle: "उपभोक्ता मामले विभाग (DoCA) • उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय",
      home: "मुख्य पृष्ठ",
      act: "अधिनियम और नियम",
      guidelines: "दिशानिर्देश",
      helpdesk: "हेल्पडेस्क",
      contact: "संपर्क",
      brand: "ई-मापन",
      subBrand: "विधिक माप विज्ञान",
      login: "साइन इन",
    },

    // Hero
    hero: {
      pill: "उपभोक्ता मामले मंत्रालय • विधिक माप-विज्ञान प्रभाग (DoCA)",
      heading1: "स्वायत्त विधिक माप-विज्ञान",
      heading2: "अनुपालन इंजन",
      subtext: "15 मिनट की मैन्युअल प्लास्टिक स्केल जाँच को तत्काल दृश्य ऑडिट, 3-स्तरीय ऑप्टिकल फ़ॉन्ट कैलिब्रेशन और न्यायालय-स्वीकार्य फॉर्म-V जब्ती मेमो से बदलना।",
    },

    // Metrics
    metrics: {
      speed: { value: "15मि ➔ सेकंडों में", label: "ऑडिट गति" },
      cost: { value: "₹0.12", label: "गणना लागत / SKU" },
      rules: { value: "24 नियम", label: "PCR 2011 संहिताबद्ध" },
      hash: { value: "SHA-256", label: "धारा 63 BSA 2023" },
    },

    // Gateway
    gateway: {
      title: "परिचालन प्रवेश द्वार",
      subtitle: "निरीक्षण पाइपलाइन शुरू करने के लिए अपनी भूमिका चुनें",
      ssoReady: "SSO तैयार",
      tabs: {
        lmo: "LMO अधिकारी",
        msme: "MSME ब्रांड",
        citizen: "नागरिक स्कैन",
      },
    },

    // LMO Form
    lmo: {
      info: "विधिक माप-विज्ञान अधिकारी (LMO) मोड: 3-स्तरीय कैलिब्रेशन के साथ मंडी व किराना बाज़ार की भौतिक जाँच करें, धारा 36 जुर्माना गणना करें, और फॉर्म-V जब्ती मेमो पर हस्ताक्षर करें।",
      stateLabel: "राज्य क्षेत्राधिकार",
      badgeLabel: "अधिकारी बैज नंबर",
      badgePlaceholder: "उदा. DL-LMO-2026-0842",
      submit: "LMO कार्यक्षेत्र खोलें",
      demo: "त्वरित डेमो LMO",
      states: {
        DL: "दिल्ली (NCT)",
        MH: "महाराष्ट्र",
        UP: "उत्तर प्रदेश",
        KA: "कर्नाटक",
        TN: "तमिलनाडु",
        WB: "पश्चिम बंगाल",
      },
    },

    // MSME Form
    msme: {
      info: "MSME और FMCG पैकेजिंग पोर्टल: व्यावसायिक सिलेंडर उत्कीर्ण करने से पहले 0% कैमरा विरूपण के साथ वेक्टर आर्टवर्क (PDFs) की प्री-फ्लाइट जाँच करें और ₹2–5 लाख की प्रिंटिंग रिकॉल बचाएं।",
      gstinLabel: "GSTIN / कंपनी पहचान संख्या",
      gstinPlaceholder: "उदा. 07AAAAA0000A1Z5",
      submit: "ब्रांड स्टूडियो खोलें",
      demo: "त्वरित डेमो ब्रांड",
    },

    // Citizen Form
    citizen: {
      info: "सार्वजनिक नागरिक तत्काल ऑडिट: लॉगिन क्रेडेंशियल की आवश्यकता नहीं। किसी भी उत्पाद की पैकेजिंग या ई-कॉमर्स लिस्टिंग को स्कैन करें और आधिकारिक e-District शिकायत टोकन प्राप्त करें।",
      submit: "तत्काल नागरिक स्कैन शुरू करें (1-टैप बाईपास)",
    },

    // Simulator Banner
    simulator: {
      title: "इंटरएक्टिव पूर्व-बाज़ार पैकेजिंग सिमुलेटर",
      subtitle: "PDP क्षेत्र स्लाइडर समायोजित करें और नियम 7 के न्यूनतम फ़ॉन्ट ऊंचाई की रियल-टाइम गणना करें",
      cta: "अभी आज़माएं",
    },

    // Scanner Mockup
    scanner: {
      title: "लाइव ऑप्टिकल निरीक्षण दृश्य",
      verified: "सत्यापित पास",
      fpsTag: "FPS: 60 | स्तर-A मिमी",
      productName: "रॉयल चाय 500g",
      foodCat: "खाद्य श्रेणी",
      sha: "SHA-256 डिजिटल श्रृंखला",
      shaAuthenticated: "प्रमाणित",
      shaHash: "e89b4f2c019d384029471b84920c5d9e...",
      bsa: "धारा 63 BSA 2023 अनुपालित",
      startScan: "स्कैन शुरू करें",
      rules: {
        mrp: "नियम 6(1)(e): MRP पास",
        mrpText: "MRP ₹ 240.00",
        mrpSub: "(सभी करों सहित)",
        usp: "नियम 6(11): USP पास",
        uspText: "इकाई बिक्री मूल्य: ₹ 0.48 / ग्रा",
        uspSub: "(गणित: 240 ÷ 500)",
        font: "नियम 7 तालिका-I: फ़ॉन्ट पास",
        fontText: "मापा फ़ॉन्ट: 4.2 मिमी",
        fontSub: "(वैधानिक न्यूनतम: 4.0 मिमी)",
      },
    },

    // Pipeline Cards
    pipeline: {
      heading: "अनुकूली 3-इन-1 पाइपलाइन",
      subheading: "वास्तविक मंडी छापों, ऑनलाइन क्विक-कॉमर्स और पूर्व-मुद्रण निर्माण के लिए डिज़ाइन किया गया",
      modes: {
        field: {
          badge: "ऑफलाइन तैयार",
          title: "मोड A: ऑफलाइन फील्ड किराना स्कैन",
          desc: "ग्रामीण मंडियों में बिना इंटरनेट के खुदरा बाज़ार छापों के लिए 3-स्तरीय ऑप्टिकल मिमी कैलिब्रेशन के साथ स्मार्टफोन कैमरा कैप्चर।",
          cta: "फील्ड मोड खोलें",
        },
        ecom: {
          badge: "हेडलेस स्क्रेपर",
          title: "मोड B: ऑनलाइन ई-कॉमर्स ऑडिट",
          desc: "अमेज़न, ब्लिंकइट और क्विक-कॉमर्स उत्पाद URLs को नियम 6(1)(g) मूल देश और GSR 226(E) इकाई बिक्री मूल्य के लिए ऑडिट करें।",
          cta: "ई-कॉम स्क्रेपर खोलें",
        },
        preprint: {
          badge: "0% ऑप्टिकल विरूपण",
          title: "मोड C: पूर्व-मुद्रण MSME वेक्टर ऑडिट",
          desc: "महंगे पैकेजिंग प्रिंटिंग सिलेंडर उत्कीर्ण करने से पहले फ़ॉन्ट उल्लंघनों का पता लगाने के लिए वेक्टर PDF आर्टवर्क की प्री-फ्लाइट जाँच।",
          cta: "वेक्टर स्टूडियो खोलें",
        },
      },
    },

    // Testimonials
    testimonials: {
      pill: "क्षेत्र और उद्योग प्रशंसापत्र",
      heading: "अधिकारियों, FMCG ब्रांडों और अधिवक्ताओं का भरोसा",
      subheading: "ग्रामीण किराना, डिजिटल ई-कॉमर्स और पूर्व-मुद्रण निर्माण में वैधानिक पैकेजिंग अनुपालन को बदल रहे हैं।",
      items: [
        {
          name: "राजेश शर्मा",
          profession: "वरिष्ठ विधिक माप-विज्ञान अधिकारी (LMO)",
          description: "पैक-परख ने हमारी मंडी पैकेजिंग छापे की जाँच का समय 15 मिनट से घटाकर सेकंड में कर दिया। SHA-256 साक्ष्य हैश के साथ जमीनी स्तर पर न्यायालय-तैयार फॉर्म-V जब्ती मेमो तैयार करना क्रांतिकारी है।",
          badge: "फील्ड LMO अधिकारी",
        },
        {
          name: "अनन्या देशमुख",
          profession: "गुणवत्ता आश्वासन प्रमुख, FMCG ब्रांड",
          description: "पूर्व-मुद्रण MSME मोड ने 50,000 बिस्किट रैपर बनाने से पहले हमारे पैकेजिंग प्रिंटिंग सिलेंडर बचाए। मुद्रण से पहले नियम 7 फ़ॉन्ट अंडरसाइजिंग खोजने से लाखों की पैकेजिंग रिकॉल बची।",
          badge: "MSME पैकेजिंग",
        },
        {
          name: "डॉ. विक्रम सेठी",
          profession: "उपभोक्ता मामले अधिवक्ता",
          description: "पैक-परख नागरिकों को e-District शिकायत दस्तावेज़ और तत्काल WhatsApp हैंडऑफ के साथ सशक्त बनाता है। इकाई बिक्री मूल्य और मूल देश अनुपालन पर पारदर्शिता अभूतपूर्व है।",
          badge: "सार्वजनिक उपभोक्ता अधिकार",
        },
        {
          name: "प्रिया नायर",
          profession: "ई-कॉमर्स नियामक ऑडिटर",
          description: "नियम 6(1)(g) मूल देश अनुपालन के लिए अमेज़न और ब्लिंकइट उत्पाद लिस्टिंग का ऑडिट करना पहले थकाऊ था। हेडलेस स्क्रेपिंग और तत्काल कटौती स्कोरिंग से ऑडिट आसान हो गए।",
          badge: "ई-कॉम अनुपालन",
        },
      ],
    },

    // Footer
    footer: {
      name: "पैक-परख (PackParakh)",
      team: "• निर्माता: क्रिश कुमार तांती",
      doca: "उपभोक्ता मामले विभाग (DoCA)",
      act: "• विधिक माप-विज्ञान अधिनियम, 2009",
      pcr: "• PCR 2011 संहिताबद्ध",
    },
    // Scan workspace (Unnati merged)
    scan: {
      camera: {
        unsupported: "कैमरा API इस ब्राउज़र या फ्रेम वातावरण में समर्थित नहीं है।",
        denied: "कैमरा अनुमति अस्वीकार कर दी गई। कृपया पहुँच की अनुमति दें।",
        notfound: "इस सिस्टम पर कोई कैमरा डिवाइस नहीं मिला।",
        failed: "कैमरा एक्सेस विफल।",
        requesting: "कैमरा एक्सेस का अनुरोध किया जा रहा है...",
      },
      fallback: { btn: "फ़ॉलबैक फ़ाइल अपलोड" },
      guide: { align: "यहाँ PDP संरेखित करें" },
      ecom: {
        title: "हेडलेस ई-कॉम ऑडिट",
        placeholder: "https://amazon.in/dp/...",
        sample1: "नमूना अमेज़ॅन चाय",
        sample2: "नमूना ब्लिंकिट पैक",
      },
      pdf: {
        drag: "वेक्टर आर्टवर्क PDF को खींचें और छोड़ें",
        support: "उच्च-निष्ठा फ़ॉन्ट आयाम निष्कर्षण का समर्थन करता है",
      },
      btn: {
        capture: "कैप्चर करें और विश्लेषण करें",
        processing: "प्रोसेसिंग...",
      },
      config: {
        title: "कार्यक्षेत्र कॉन्फ़िगरेशन",
        cat: {
          title: "उत्पाद श्रेणी",
          food: "खाद्य और पेय पदार्थ",
          cosmetic: "सौंदर्य प्रसाधन",
          electronics: "इलेक्ट्रॉनिक्स और हार्डवेयर",
          general: "सामान्य माल",
          desc: "नियम उपसमुच्चय समायोजित करता है (जैसे गैर-खराब होने वाले सामानों के लिए नियम 6(1)(d) बायपास)।",
        },
        calib: {
          title: "ऑप्टिकल कैलिब्रेशन",
          opt1: "मार्कर / आईडी कार्ड",
          opt1desc: "मानक ArUco मार्कर के माध्यम से स्वतः कैलिब्रेट करता है।",
          opt2: "घोषित आयाम",
          opt2desc: "मैनुअल संदर्भ इनपुट।",
          opt3: "अनुमानी फ़ॉलबैक",
          opt3desc: "AI-अनुमानित बाउंडिंग वॉल्यूम।",
          width: "पैकेज की चौड़ाई:",
          mm: "मिमी",
        },
      },
      demo: {
        title: "डेमो टेस्ट सूट",
        pass: "100% अनुपालक बिस्कुट",
        review: "आंशिक समीक्षा पैक",
        fail: "बहु-उल्लंघन पैक",
        badge: { pass: "पास", review: "समीक्षा", fail: "विफल" },
      },
    },

    // Login page translations
    login: {
      ministry: "उपभोक्ता मामले मंत्रालय",
      department: "विधिक माप-विज्ञान (DoCA)",
      hero: {
        title1: "स्वायत्त विधिक",
        title2: "माप-विज्ञान",
        titleHighlight: "अनुपालन इंजन",
        subtitle: "15 मिनट की मैन्युअल प्लास्टिक स्केल जाँच को तत्काल दृश्य ऑडिट, 3-स्तरीय ऑप्टिकल फ़ॉन्ट कैलिब्रेशन और न्यायालय-स्वीकार्य फॉर्म-V जब्ती मेमो से बदलना।",
      },
      stat: {
        speed: {
          label: "ऑडिट गति",
          value: "15मि → सेकंडों में",
        },
        cost: {
          label: "गणना लागत",
          value: "₹0.12 / SKU",
        },
        rules: {
          label: "संहिताबद्ध नियम",
          value: "24 PCR 2011",
        },
        chain: {
          label: "साक्ष्य श्रृंखला",
          value: "SHA-256",
        },
      },
      gateway: {
        title: "परिचालन प्रवेश द्वार",
        badge: "SSO तैयार",
      },
      tab: {
        lmo: "LMO अधिकारी",
        msme: "MSME ब्रांड",
        citizen: "नागरिक स्कैन",
      },
      lmo: {
        desc: "विधिक माप-विज्ञान अधिकारी (LMO) मोड: 3-स्तरीय कैलिब्रेशन के साथ मंडी व किराना बाजार छापे मारें, धारा 36 के तहत जुर्माने की गणना करें, और फॉर्म-V जब्ती मेमो पर हस्ताक्षर करें।",
        stateLabel: "राज्य क्षेत्राधिकार",
        badgeLabel: "अधिकारी बैज संख्या",
        badgePlaceholder: "उदा. DL-LMO-2026",
        passLabel: "पासवर्ड / एक्सेस कुंजी",
        passPlaceholder: "••••••••",
        submit: "सत्यापित करें और कार्यक्षेत्र में प्रवेश करें",
      },
      msme: {
        desc: "MSME / डिज़ाइनर मोड: महंगे औद्योगिक प्रिंटिंग सिलेंडर उत्कीर्ण करने से पहले फ़ॉन्ट अंडरसाइज़िंग का पता लगाने के लिए वेक्टर आर्टवर्क PDF की प्री-फ्लाइट जाँच करें।",
        gstinLabel: "GSTIN / कंपनी ID",
        gstinPlaceholder: "उदा. 29GGGGG1314R9Z6",
        submit: "प्री-प्रिंट सिम्युलेटर शुरू करें",
      },
      citizen: {
        desc: "सार्वजनिक नागरिक स्कैन: उत्पाद की प्रामाणिकता और MRP अनुपालन को तुरंत सत्यापित करें। किसी पंजीकरण की आवश्यकता नहीं है।",
        submit: "तत्काल नागरिक स्कैन",
      },
    },

    // Audit selection translations
    audit: {
      title: "ऑडिट मोडलिटी चुनें",
      subtitle: "अपने लक्षित परिचालन परिवेश के आधार पर उपयुक्त निरीक्षण पाइपलाइन चुनें।",
      mode: {
        physical: {
          title: "ऑफलाइन फील्ड मोड (खुदरा किराना)",
          desc: "खुदरा बाजार छापों के लिए 3-स्तरीय ऑप्टिकल कैलिब्रेशन के साथ स्मार्टफोन कैमरा स्कैन। बिना इंटरनेट कनेक्शन के काम करता है।",
          badge: "ऑफलाइन तैयार (PWA)",
        },
        ecom: {
          title: "ऑनलाइन ई-कॉमर्स ऑडिट",
          desc: "नियम 6(1)(g) मूल देश और GSR 226(E) इकाई बिक्री मूल्य के लिए अमेज़न, ब्लिंकिट और क्विक-कॉमर्स लिस्टिंग का ऑडिट करें।",
          badge: "इंस्टेंट हेडलेस",
        },
        pdf: {
          title: "प्री-प्रिंट MSME मोड",
          desc: "महंगे औद्योगिक प्रिंटिंग सिलेंडर उत्कीर्ण करने से पहले फ़ॉन्ट अंडरसाइज़िंग खोजने के लिए वेक्टर आर्टवर्क PDF की प्री-फ्लाइट जाँच करें।",
          badge: "0% ऑप्टिकल विरूपण",
        },
      },
      simulate: {
        title: "सक्रिय अनुपालन टूलिंग",
        desc: "निर्माण से पहले PCR 2011 नियम 7 के विरुद्ध पैकेजिंग आयामों को मान्य करें।",
        btn: "प्री-मार्केट सिम्युलेटर शुरू करें",
      },
    },

    // Step pipeline translations
    step: {
      s0: "तैयार",
      s1: "फ़्रेम कैप्चर",
      s2: "समोच्च मानचित्रण",
      s3: "OCR निष्कर्षण",
      s4: "नियम सत्यापन",
      s5: "निर्णय तैयार",
    },

    // Verdict translations
    verdict: {
      back: "स्कैनर पर वापस जाएं",
      status: {
        pass: "पास",
        review: "समीक्षा",
        fail: "विफल",
      },
      sub: {
        pass: "अनुपालक पैकेजिंग",
        review: "मैनुअल ओवरराइड आवश्यक",
        fail: "गैर-अनुपालक पैकेजिंग",
      },
      metrics: {
        title: "ऑप्टिकल मेट्रिक्स",
        pdp: "PDP सतह क्षेत्र",
        fontReq: "वैधानिक न्यूनतम फ़ॉन्ट",
        fontCalc: "परिकलित न्यूनतम फ़ॉन्ट",
        confidence: "AI विश्वास स्कोर",
      },
      waterfall: {
        title: "व्याख्यात्मक कटौती वॉटरफॉल",
        pts: "अंक",
      },
      checklist: {
        title: "संहिताबद्ध PCR 2011 नियम निष्पादन",
      },
      action: {
        seal: "कैलिब्रेटेड माइक्रोमीटर द्वारा पुष्टि करें और फॉर्म-V सील करें",
        sealed: "जब्ती मेमो हस्ताक्षरित और सुरक्षित (फॉर्म-V)",
        override: "LMO मैनुअल ओवरराइड",
        approve: "अपवाद स्वीकृत करें",
      },
    },
  },
  bn: {
    top: { status: { active: "সক্রিয়", online: "অনলাইন", secured: "সুরক্ষিত", text: "লিগ্যাল মেট্রোলজি |", vision: "| ভিশন পাইপলাইন:", evidence: "| প্রমাণ চেইন:" } },
    statusBar: { directorate: "লিগ্যাল মেট্রোলজি ডিরেক্টরেট", engine: "PCR 2011 ইঞ্জিন v2.1: সক্রিয়", vision: "ভিশন পাইপলাইন: অনলাইন", evidence: "প্রমাণ চেইন: সুরক্ষিত (SHA-256)", doca: "DoCA লিগ্যাল মেট্রোলজি" },
    nav: { title: "প্যাক-পরখ", titleHindi: "(PackParakh)", badge: "DoCA ইঞ্জিন", subtitle: "ভোক্তা বিষয়ক বিভাগ (DoCA)", home: "হোম", act: "আইন ও নিয়ম", guidelines: "নির্দেশিকা", helpdesk: "হেল্পডেস্ক", contact: "যোগাযোগ", brand: "ই-মাপন", subBrand: "লিগ্যাল মেট্রোলজি", login: "সাইন ইন" },
    layout: { back: "ফিরে যান" },
    hero: { pill: "ভোক্তা বিষয়ক মন্ত্রণালয় • লিগ্যাল মেট্রোলজি বিভাগ (DoCA)", heading1: "স্বায়ত্তশাসিত লিগ্যাল", heading2: "মেট্রোলজি", subtext: "তাত্ক্ষণিক ভিজ্যুয়াল অডিট এবং 3-স্তরের অপটিক্যাল ফন্ট ক্যালিব্রেশন সহ 15 মিনিটের ম্যানুয়াল পরিদর্শন প্রতিস্থাপন।" },
    metrics: { speed: { value: "15মি ➔ সেকেন্ডে", label: "অডিট গতি" }, cost: { value: "₹0.12", label: "খরচ / SKU" }, rules: { value: "24 নিয়ম", label: "PCR 2011" }, hash: { value: "SHA-256", label: "প্রমাণ চেইন" } },
    gateway: { title: "অপারেশনাল অ্যাক্সেস গেটওয়ে", subtitle: "পরিদর্শন পাইপলাইন শুরু করতে ভূমিকা নির্বাচন করুন", ssoReady: "SSO প্রস্তুত", tabs: { lmo: "LMO অফিসার", msme: "MSME ব্র্যান্ড", citizen: "নাগরিক স্ক্যান" } },
    lmo: { info: "LMO মোড: 3-স্তরের ক্যালিব্রেশন সহ মণ্ডি ও কিরানা বাজার রেইড পরিচালনা করুন।", stateLabel: "রাজ্য", badgeLabel: "অফিসার ব্যাজ নম্বর", badgePlaceholder: "উদা. DL-LMO-2026", submit: "LMO ওয়ার্কস্পেস খুলুন", demo: "ডেমো LMO", states: { DL: "দিল্লি (NCT)", MH: "মহারাষ্ট্র", UP: "উত্তর প্রদেশ", KA: "কর্ণাটক", TN: "তামিলনাড়ু", WB: "পশ্চিমবঙ্গ" } },
    msme: { info: "MSME পোর্টাল: প্রিন্টিং সিলিন্ডার খোদাই করার আগে ভেক্টর আর্টওয়ার্ক যাচাই করুন।", gstinLabel: "GSTIN / কোম্পানি ID", gstinPlaceholder: "উদা. 07AAAAA0000A1Z5", submit: "ব্র্যান্ড স্টুডিও খুলুন", demo: "ডেমো ব্র্যান্ড" },
    citizen: { info: "পাবলিক সিটিজেন স্ক্যান: লগইন ছাড়াই যেকোনো প্যাকেজিং স্ক্যান করুন।", submit: "নাগরিক স্ক্যান শুরু করুন" },
    simulator: { title: "ইন্টারঅ্যাক্টিভ প্যাকেজিং সিমুলেটর", subtitle: "PDP এরিয়া স্লাইডার সমন্বয় করুন", cta: "এখনই চেষ্টা করুন" },
    scanner: { title: "লাইভ অপটিক্যাল ভিউ", verified: "যাচাইকৃত পাস", fpsTag: "FPS: 60", productName: "রয়্যাল চা 500g", foodCat: "খাদ্য", sha: "SHA-256", shaAuthenticated: "প্রমাণিত", shaHash: "e89b4f2c...", bsa: "ধারা 63 BSA", startScan: "স্ক্যান শুরু", rules: { mrp: "নিয়ম 6(1)(e): MRP পাস", mrpText: "MRP ₹ 240", mrpSub: "(সব কর সহ)", usp: "নিয়ম 6(11): USP পাস", uspText: "ইউনিট মূল্য: ₹ 0.48 / g", uspSub: "(গণিত: 240 ÷ 500)", font: "নিয়ম 7: ফন্ট পাস", fontText: "ফন্ট: 4.2 মিমি", fontSub: "(ন্যূনতম: 4.0 মিমি)" } },
    pipeline: { heading: "3-ইন-1 পাইপলাইন", subheading: "ফিল্ড রেইড, অনলাইন এবং প্রি-প্রিন্টের জন্য", modes: { field: { badge: "অফলাইন প্রস্তুত", title: "মোড A: অফলাইন ফিল্ড স্ক্যান", desc: "ইন্টারনেট ছাড়াই স্মার্টফোন ক্যামেরা ক্যাপচার।", cta: "ফিল্ড মোড খুলুন" }, ecom: { badge: "হেডলেস স্ক্র্যাপার", title: "মোড B: অনলাইন ই-কমার্স", desc: "Amazon, Blinkit লিস্টিং অডিট করুন।", cta: "ই-কম খুলুন" }, preprint: { badge: "0% বিকৃতি", title: "মোড C: প্রি-প্রিন্ট ভেক্টর", desc: "ভেক্টর PDF যাচাই করুন।", cta: "ভেক্টর স্টুডিও খুলুন" } } },
    testimonials: { pill: "প্রশংসাপত্র", heading: "অফিসারদের আস্থা", subheading: "প্যাকেজিং সম্মতি রূপান্তর", items: [] },
    footer: { name: "প্যাক-পরখ (PackParakh)", team: "• বিকাশকারী: কৃষ কুমার তাঁতি", doca: "ভোক্তা বিষয়ক বিভাগ (DoCA)", act: "• লিগ্যাল মেট্রোলজি আইন, 2009", pcr: "• PCR 2011" },
    login: { ministry: "ভোক্তা বিষয়ক মন্ত্রণালয়", department: "লিগ্যাল মেট্রোলজি (DoCA)", hero: { title1: "স্বায়ত্তশাসিত লিগ্যাল", title2: "মেট্রোলজি", titleHighlight: "কমপ্লায়েন্স ইঞ্জিন", subtitle: "তাত্ক্ষণিক ভিজ্যুয়াল অডিট..." }, stat: { speed: { label: "অডিট গতি", value: "15m → In Seconds" }, cost: { label: "খরচ", value: "₹0.12 / SKU" }, rules: { label: "নিয়ম", value: "24 PCR 2011" }, chain: { label: "প্রমাণ", value: "SHA-256" } }, gateway: { title: "অপারেশনাল অ্যাক্সেস", badge: "SSO প্রস্তুত" }, tab: { lmo: "LMO অফিসার", msme: "MSME ব্র্যান্ড", citizen: "নাগরিক স্ক্যান" }, lmo: { desc: "LMO মোড: মার্কেট রেইড পরিচালনা করুন...", stateLabel: "রাজ্য", badgeLabel: "অফিসার ব্যাজ নম্বর", badgePlaceholder: "e.g. DL-LMO-2026", passLabel: "পাসওয়ার্ড", passPlaceholder: "••••••••", submit: "প্রবেশ করুন" }, msme: { desc: "MSME মোড: ভেক্টর আর্টওয়ার্ক পরীক্ষা করুন।", gstinLabel: "GSTIN / কোম্পানি ID", gstinPlaceholder: "e.g. 29GGGGG...", submit: "সিমুলেটর চালু করুন" }, citizen: { desc: "পাবলিক সিটিজেন স্ক্যান: তাত্ক্ষণিকভাবে যাচাই করুন।", submit: "সিটিজেন স্ক্যান" } },
    audit: { title: "অডিট মডালিটি নির্বাচন করুন", subtitle: "আপনার লক্ষ্য কর্ম পরিবেশের উপর ভিত্তি করে উপযুক্ত পরিদর্শন পাইপলাইন চয়ন করুন।", mode: { physical: { title: "অফলাইন ফিল্ড মোড", desc: "স্মার্টফোন ক্যামেরা স্ক্যান। ইন্টারনেট ছাড়াই কাজ করে।", badge: "অফলাইন প্রস্তুত" }, ecom: { title: "ই-কমার্স", desc: "URL-ভিত্তিক চিত্র অডিট।", badge: "ইনস্ট্যান্ট হেডলেস" }, pdf: { title: "পিডিএফ সিমুলেটর", desc: "ভেক্টর আর্টওয়ার্ক বিশ্লেষণ করুন।", badge: "0% অপটিক্যাল বিকৃতি" } }, simulate: { title: "সক্রিয় কমপ্লায়েন্স টুলিং", desc: "প্যাকেজিং মাত্রা যাচাই করুন।", btn: "সিমুলেটর চালু করুন" } },
    scan: { camera: { unsupported: "ক্যামেরা সমর্থিত নয়।", denied: "ক্যামেরার অনুমতি অস্বীকার করা হয়েছে।", notfound: "ক্যামেরা পাওয়া যায়নি।", failed: "ক্যামেরা ব্যর্থ।", requesting: "ক্যামেরার অনুরোধ করা হচ্ছে..." }, fallback: { btn: "ফাইল আপলোড করুন" }, guide: { align: "এখানে PDP সারিবদ্ধ করুন" }, ecom: { title: "ই-কম অডিট", placeholder: "https://amazon...", sample1: "নমুনা 1", sample2: "নমুনা 2" }, pdf: { drag: "পিডিএফ ড্র্যাগ করুন", support: "উচ্চ-মানের ফন্ট নিষ্কাশন সমর্থন করে" }, btn: { capture: "ক্যাপচার এবং বিশ্লেষণ", processing: "প্রসেসিং..." }, config: { title: "কনফিগারেশন", cat: { title: "বিভাগ", food: "খাদ্য", cosmetic: "প্রসাধন", electronics: "ইলেকট্রনিক্স", general: "সাধারণ", desc: "নিয়ম সমন্বয় করে।" }, calib: { title: "ক্যালিব্রেশন", opt1: "মার্কার / আইডি", opt1desc: "স্বয়ংক্রিয়", opt2: "ম্যানুয়াল মাত্রা", opt2desc: "ম্যানুয়াল", opt3: "AI অনুমান", opt3desc: "AI", width: "প্রস্থ:", mm: "মিমি" } }, demo: { title: "ডেমো টেস্ট", pass: "100% সঠিক", review: "পর্যালোচনা", fail: "ভুল", badge: { pass: "পাস", review: "রিভিউ", fail: "ফেইল" } } },
    step: { s0: "প্রস্তুত", s1: "ক্যাপচার", s2: "ম্যাপিং", s3: "OCR", s4: "যাচাইকরণ", s5: "রায়" },
    verdict: { back: "ফিরে যান", status: { pass: "পাস", review: "রিভিউ", fail: "ফেইল" }, sub: { pass: "সঠিক", review: "রিভিউ প্রয়োজন", fail: "সঠিক নয়" }, metrics: { title: "মেট্রিক্স", pdp: "PDP এলাকা", fontReq: "ন্যূনতম ফন্ট", fontCalc: "গণনাকৃত ফন্ট", confidence: "AI আত্মবিশ্বাস" }, waterfall: { title: "কর্তন", pts: "পয়েন্ট" }, checklist: { title: "নিয়ম সম্পাদন" }, action: { seal: "মেমো তৈরি করুন", sealed: "স্বাক্ষরিত", override: "ওভাররাইড", approve: "অনুমোদন করুন" } },
  },
  ta: {
    top: { status: { active: "செயலில்", online: "ஆன்லைன்", secured: "பாதுகாக்கப்பட்டது", text: "சட்ட அளவியல் |", vision: "| பார்வை குழாய்:", evidence: "| சான்று சங்கிலி:" } },
    statusBar: { directorate: "சட்ட அளவியல் இயக்குனரகம்", engine: "PCR 2011 இயந்திரம் v2.1: செயலில்", vision: "பார்வை பைப்லைன்: ஆன்லைன்", evidence: "சான்று சங்கிலி: பாதுகாக்கப்பட்டது (SHA-256)", doca: "DoCA சட்ட அளவியல்" },
    nav: { title: "பேக்-பராக்", titleHindi: "(PackParakh)", badge: "DoCA இயந்திரம்", subtitle: "நுகர்வோர் விவகாரத் துறை (DoCA)", home: "முகப்பு", act: "சட்டம் & விதிகள்", guidelines: "வழிகாட்டுதல்கள்", helpdesk: "உதவி மையம்", contact: "தொடர்பு", brand: "இ-மாபன்", subBrand: "சட்ட அளவியல்", login: "சைன் இன்" },
    layout: { back: "திரும்பிச் செல்" },
    hero: { pill: "நுகர்வோர் விவகார அமைச்சகம் • சட்ட அளவியல் பிரிவு (DoCA)", heading1: "தன்னாட்சி சட்ட", heading2: "அளவியல்", subtext: "15 நிமிட கையேடு ஆய்வை உடனடி காட்சி தணிக்கையுடன் மாற்றுதல்।" },
    metrics: { speed: { value: "15நி ➔ நொடிகளில்", label: "தணிக்கை வேகம்" }, cost: { value: "₹0.12", label: "செலவு / SKU" }, rules: { value: "24 விதிகள்", label: "PCR 2011" }, hash: { value: "SHA-256", label: "சான்று சங்கிலி" } },
    gateway: { title: "செயல்பாட்டு அணுகல் நுழைவாயில்", subtitle: "ஆய்வு பைப்லைனைத் தொடங்க பங்கு தேர்வு செய்யவும்", ssoReady: "SSO தயார்", tabs: { lmo: "LMO அதிகாரி", msme: "MSME பிராண்ட்", citizen: "குடிமகன் ஸ்கேன்" } },
    lmo: { info: "LMO பயன்முறை: 3-நிலை அளவுத்திருத்தத்துடன் சந்தை சோதனைகளை நடத்துங்கள்।", stateLabel: "மாநிலம்", badgeLabel: "அதிகாரி எண்", badgePlaceholder: "உதா. DL-LMO-2026", submit: "LMO பணியிடத்தைத் திறக்கவும்", demo: "டெமோ LMO", states: { DL: "டெல்லி (NCT)", MH: "மகாராஷ்டிரா", UP: "உத்தரப்பிரதேசம்", KA: "கர்நாடகா", TN: "தமிழ்நாடு", WB: "மேற்கு வங்காளம்" } },
    msme: { info: "MSME போர்டல்: அச்சு சிலிண்டர்களை செதுக்குவதற்கு முன் வெக்டார் கலையை சரிபார்க்கவும்।", gstinLabel: "GSTIN / நிறுவனம் ID", gstinPlaceholder: "உதா. 07AAAAA0000A1Z5", submit: "பிராண்ட் ஸ்டுடியோவைத் திறக்கவும்", demo: "டெமோ பிராண்ட்" },
    citizen: { info: "பொது குடிமகன் ஸ்கேன்: உள்நுழைவு இல்லாமல் எந்த பேக்கேஜிங்கையும் ஸ்கேன் செய்யுங்கள்।", submit: "குடிமகன் ஸ்கேனைத் தொடங்குங்கள்" },
    simulator: { title: "ஊடாடும் பேக்கேஜிங் சிமுலேட்டர்", subtitle: "PDP பகுதி ஸ்லைடர்களை சரிசெய்யவும்", cta: "இப்போது முயற்சிக்கவும்" },
    scanner: { title: "நேரடி ஒளியியல் பார்வை", verified: "சரிபார்க்கப்பட்டது", fpsTag: "FPS: 60", productName: "ராயல் தேநீர் 500g", foodCat: "உணவு", sha: "SHA-256", shaAuthenticated: "அங்கீகரிக்கப்பட்டது", shaHash: "e89b...", bsa: "பிரிவு 63 BSA", startScan: "ஸ்கேன் தொடங்கு", rules: { mrp: "விதி 6(1)(e): MRP தேர்ச்சி", mrpText: "MRP ₹ 240", mrpSub: "(வரி உட்பட)", usp: "விதி 6(11): USP தேர்ச்சி", uspText: "அலகு விலை: ₹ 0.48 / g", uspSub: "(கணிதம்: 240 ÷ 500)", font: "விதி 7: எழுத்துரு தேர்ச்சி", fontText: "எழுத்துரு: 4.2 மிமீ", fontSub: "(குறைந்தபட்சம்: 4.0 மிமீ)" } },
    pipeline: { heading: "3-இன்-1 பைப்லைன்", subheading: "கள சோதனை, ஆன்லைன் மற்றும் முன் அச்சுக்காக", modes: { field: { badge: "ஆஃப்லைன் தயார்", title: "முறை A: ஆஃப்லைன் கள ஸ்கேன்", desc: "இணையம் இல்லாமல் ஸ்மார்ட்போன் கேமரா।", cta: "கள பயன்முறையைத் திறக்கவும்" }, ecom: { badge: "ஹெட்லெஸ் ஸ்க்ராப்பர்", title: "முறை B: ஆன்லைன் இ-காமர்ஸ்", desc: "Amazon, Blinkit பட்டியல்களை தணிக்கை செய்யுங்கள்।", cta: "இ-காம் திறக்கவும்" }, preprint: { badge: "0% சிதைவு", title: "முறை C: முன் அச்சு வெக்டார்", desc: "வெக்டார் PDF ஐ சரிபார்க்கவும்।", cta: "வெக்டார் ஸ்டுடியோவைத் திறக்கவும்" } } },
    testimonials: { pill: "சான்றுகள்", heading: "அதிகாரிகளின் நம்பிக்கை", subheading: "பேக்கேஜிங் இணக்கத்தை மாற்றுதல்", items: [] },
    footer: { name: "பேக்-பராக் (PackParakh)", team: "• உருவாக்கியவர்: கிரிஷ் குமார் தாந்தி", doca: "நுகர்வோர் விவகாரத் துறை (DoCA)", act: "• சட்ட அளவியல் சட்டம், 2009", pcr: "• PCR 2011" },
    login: { ministry: "நுகர்வோர் விவகார அமைச்சகம்", department: "சட்ட அளவியல் (DoCA)", hero: { title1: "தன்னாட்சி சட்ட", title2: "அளவியல்", titleHighlight: "இணக்க இயந்திரம்", subtitle: "உடனடி காட்சி தணிக்கைகள்..." }, stat: { speed: { label: "வேகம்", value: "15m → In Seconds" }, cost: { label: "செலவு", value: "₹0.12 / SKU" }, rules: { label: "விதிகள்", value: "24 PCR 2011" }, chain: { label: "சான்று", value: "SHA-256" } }, gateway: { title: "அணுகல்", badge: "SSO தயார்" }, tab: { lmo: "LMO அதிகாரி", msme: "MSME பிராண்ட்", citizen: "குடிமகன் ஸ்கேன்" }, lmo: { desc: "LMO பயன்முறை: சந்தை சோதனைகளை நடத்துங்கள்...", stateLabel: "மாநிலம்", badgeLabel: "அதிகாரி எண்", badgePlaceholder: "e.g. DL-LMO-2026", passLabel: "கடவுச்சொல்", passPlaceholder: "••••••••", submit: "உள்நுழைக" }, msme: { desc: "MSME பயன்முறை: வெக்டார் கலையை சரிபார்க்கவும்.", gstinLabel: "GSTIN / நிறுவனம் ID", gstinPlaceholder: "e.g. 29GGGGG...", submit: "தொடங்கு" }, citizen: { desc: "பொது ஸ்கேன்: உடனடியாக சரிபார்க்கவும்.", submit: "ஸ்கேன்" } },
    audit: { title: "தணிக்கை முறையைத் தேர்ந்தெடுக்கவும்", subtitle: "தகுந்த ஆய்வு பைப்லைனைத் தேர்ந்தெடுக்கவும்.", mode: { physical: { title: "ஆஃப்லைன் கள முறை", desc: "ஸ்மார்ட்போன் கேமரா ஸ்கேன். இணையம் இல்லாமல் வேலை செய்கிறது.", badge: "ஆஃப்லைன் தயார்" }, ecom: { title: "ஆன்லைன் இ-காமர்ஸ்", desc: "URL அடிப்படையிலான பட தணிக்கை.", badge: "உடனடி ஹெட்லெஸ்" }, pdf: { title: "PDF சிமுலேட்டர்", desc: "வெக்டார் கலையை பகுப்பாய்வு செய்யவும்.", badge: "0% ஆப்டிகல் சிதைவு" } }, simulate: { title: "செயல்திறன் இணக்கக் கருவி", desc: "பேக்கேஜிங் பரிமாணங்களை சரிபார்க்கவும்.", btn: "சிமுலேட்டரைத் தொடங்கு" } },
    scan: { camera: { unsupported: "கேமரா ஆதரிக்கப்படவில்லை.", denied: "அனுமதி மறுக்கப்பட்டது.", notfound: "கேமரா கிடைக்கவில்லை.", failed: "கேமரா தோல்வி.", requesting: "கோருகிறது..." }, fallback: { btn: "கோப்பை பதிவேற்றவும்" }, guide: { align: "இங்கே PDP சீரமைக்க" }, ecom: { title: "இ-காம் தணிக்கை", placeholder: "https://amazon...", sample1: "மாதிரி 1", sample2: "மாதிரி 2" }, pdf: { drag: "PDF ஐ இழுக்கவும்", support: "எழுத்துரு பிரித்தெடுத்தலை ஆதரிக்கிறது" }, btn: { capture: "பிடிப்பு & பகுப்பாய்வு", processing: "செயலாக்குகிறது..." }, config: { title: "கட்டமைப்பு", cat: { title: "வகை", food: "உணவு", cosmetic: "அழகுசாதன", electronics: "மின்னணு", general: "பொது", desc: "விதிகளை சரிசெய்கிறது." }, calib: { title: "அளவுத்திருத்தம்", opt1: "மார்க்கர் / ஐடி", opt1desc: "தானியங்கி", opt2: "கையேடு பரிமாணங்கள்", opt2desc: "கையேடு", opt3: "AI கணிப்பு", opt3desc: "AI", width: "அகலம்:", mm: "மிமீ" } }, demo: { title: "சோதனை", pass: "100% இணக்கம்", review: "மதிப்பாய்வு", fail: "தோல்வி", badge: { pass: "தேர்ச்சி", review: "மதிப்பாய்வு", fail: "தோல்வி" } } },
    step: { s0: "தயார்", s1: "பிடிப்பு", s2: "மேப்பிங்", s3: "OCR", s4: "சரிபார்ப்பு", s5: "தீர்ப்பு" },
    verdict: { back: "திரும்பிச் செல்", status: { pass: "தேர்ச்சி", review: "மதிப்பாய்வு", fail: "தோல்வி" }, sub: { pass: "இணக்கமானது", review: "கையேடு தேவை", fail: "இணங்கவில்லை" }, metrics: { title: "அளவீடுகள்", pdp: "PDP பகுதி", fontReq: "குறைந்தபட்ச எழுத்துரு", fontCalc: "கணக்கிடப்பட்ட எழுத்துரு", confidence: "AI நம்பிக்கை" }, waterfall: { title: "கழிவுகள்", pts: "புள்ளிகள்" }, checklist: { title: "விதி செயல்படுத்தல்" }, action: { seal: "குறிப்பாணை உருவாக்கு", sealed: "கையெழுத்திடப்பட்டது", override: "புறக்கணிப்பு", approve: "ஒப்புதல்" } },
  },
  te: {
    top: { status: { active: "సక్రియం", online: "ఆన్‌లైన్", secured: "సురక్షితం", text: "లీగల్ మెట్రాలజీ |", vision: "| విజన్ పైప్‌లైన్:", evidence: "| ఆధారాల చైన్:" } },
    statusBar: { directorate: "లీగల్ మెట్రాలజీ డైరెక్టరేట్", engine: "PCR 2011 ఇంజిన్ v2.1: సక్రియం", vision: "విజన్ పైప్‌లైన్: ఆన్‌లైన్", evidence: "సాక్ష్య గొలుసు: భద్రపరచబడింది (SHA-256)", doca: "DoCA లీగల్ మెట్రాలజీ" },
    nav: { title: "ప్యాక్-పరఖ్", titleHindi: "(PackParakh)", badge: "DoCA ఇంజిన్", subtitle: "వినియోగదారుల వ్యవహారాల విభాగం (DoCA)", home: "హోమ్", act: "చట్టం & నియమాలు", guidelines: "మార్గదర్శకాలు", helpdesk: "హెల్ప్‌డెస్క్", contact: "సంప్రదించండి", brand: "ఇ-మాపన్", subBrand: "లీగల్ మెట్రాలజీ", login: "సైన్ ఇన్" },
    layout: { back: "వెనుకకు" },
    hero: { pill: "వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ • లీగల్ మెట్రాలజీ విభాగం (DoCA)", heading1: "స్వయంప్రతిపత్త న్యాయ", heading2: "మెట్రాలజీ", subtext: "15 నిమిషాల మాన్యువల్ తనిఖీని తక్షణ దృశ్య ఆడిట్‌తో భర్తీ చేయడం।" },
    metrics: { speed: { value: "15ని ➔ సెకన్లలో", label: "ఆడిట్ వేగం" }, cost: { value: "₹0.12", label: "ఖర్చు / SKU" }, rules: { value: "24 నియమాలు", label: "PCR 2011" }, hash: { value: "SHA-256", label: "సాక్ష్య గొలుసు" } },
    gateway: { title: "కార్యాచరణ ప్రాప్యత గేట్‌వే", subtitle: "తనిఖీ పైప్‌లైన్ ప్రారంభించడానికి పాత్రను ఎంచుకోండి", ssoReady: "SSO సిద్ధం", tabs: { lmo: "LMO అధికారి", msme: "MSME బ్రాండ్", citizen: "పౌర స్కాన్" } },
    lmo: { info: "LMO మోడ్: 3-స్థాయి కాలిబ్రేషన్‌తో మార్కెట్ తనిఖీలు నిర్వహించండి।", stateLabel: "రాష్ట్రం", badgeLabel: "అధికారి నంబర్", badgePlaceholder: "ఉదా. DL-LMO-2026", submit: "LMO వర్క్‌స్పేస్ తెరవండి", demo: "డెమో LMO", states: { DL: "ఢిల్లీ (NCT)", MH: "మహారాష్ట్ర", UP: "ఉత్తర ప్రదేశ్", KA: "కర్ణాటక", TN: "తమిళనాడు", WB: "పశ్చిమ బెంగాల్" } },
    msme: { info: "MSME పోర్టల్: ప్రింటింగ్ సిలిండర్లు చెక్కడానికి ముందు వెక్టర్ ఆర్ట్‌వర్క్‌ను ధృవీకరించండి।", gstinLabel: "GSTIN / కంపెనీ ID", gstinPlaceholder: "ఉదా. 07AAAAA0000A1Z5", submit: "బ్రాండ్ స్టూడియో తెరవండి", demo: "డెమో బ్రాండ్" },
    citizen: { info: "పబ్లిక్ సిటిజన్ స్కాన్: లాగిన్ లేకుండా ఏ ప్యాకేజింగ్‌నైనా స్కాన్ చేయండి।", submit: "పౌర స్కాన్ ప్రారంభించండి" },
    simulator: { title: "ఇంటరాక్టివ్ ప్యాకేజింగ్ సిమ్యులేటర్", subtitle: "PDP ప్రాంత స్లయిడర్‌లను సర్దుబాటు చేయండి", cta: "ఇప్పుడే ప్రయత్నించండి" },
    scanner: { title: "ప్రత్యక్ష ఆప్టికల్ వీక్షణ", verified: "ధృవీకరించబడింది", fpsTag: "FPS: 60", productName: "రాయల్ టీ 500g", foodCat: "ఆహారం", sha: "SHA-256", shaAuthenticated: "ప్రమాణీకరించబడింది", shaHash: "e89b...", bsa: "సెక్షన్ 63 BSA", startScan: "స్కాన్ ప్రారంభించండి", rules: { mrp: "నియమం 6(1)(e): MRP పాస్", mrpText: "MRP ₹ 240", mrpSub: "(అన్ని పన్నులతో సహా)", usp: "నియమం 6(11): USP పాస్", uspText: "యూనిట్ ధర: ₹ 0.48 / g", uspSub: "(గణితం: 240 ÷ 500)", font: "నియమం 7: ఫాంట్ పాస్", fontText: "ఫాంట్: 4.2 మిమీ", fontSub: "(కనీస: 4.0 మిమీ)" } },
    pipeline: { heading: "3-ఇన్-1 పైప్‌లైన్", subheading: "ఫీల్డ్ తనిఖీ, ఆన్‌లైన్ మరియు ప్రీ-ప్రింట్ కోసం", modes: { field: { badge: "ఆఫ్‌లైన్ సిద్ధం", title: "మోడ్ A: ఆఫ్‌లైన్ ఫీల్డ్ స్కాన్", desc: "ఇంటర్నెట్ లేకుండా స్మార్ట్‌ఫోన్ కెమెరా।", cta: "ఫీల్డ్ మోడ్ తెరవండి" }, ecom: { badge: "హెడ్‌లెస్ స్క్రాపర్", title: "మోడ్ B: ఆన్‌లైన్ ఇ-కామర్స్", desc: "Amazon, Blinkit జాబితాలను ఆడిట్ చేయండి।", cta: "ఇ-కామ్ తెరవండి" }, preprint: { badge: "0% వక్రీకరణ", title: "మోడ్ C: ప్రీ-ప్రింట్ వెక్టర్", desc: "వెక్టర్ PDF ను ధృవీకరించండి।", cta: "వెక్టర్ స్టూడియో తెరవండి" } } },
    testimonials: { pill: "టెస్టిమోనియల్స్", heading: "అధికారుల నమ్మకం", subheading: "ప్యాకేజింగ్ సమ్మతిని మార్చడం", items: [] },
    footer: { name: "ప్యాక్-పరఖ్ (PackParakh)", team: "• రూపకర్త: క్రిష్ కుమార్ తాంతి", doca: "వినియోగదారుల వ్యవహారాల విభాగం (DoCA)", act: "• లీగల్ మెట్రాలజీ చట్టం, 2009", pcr: "• PCR 2011" },
    login: { ministry: "వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ", department: "లీగల్ మెట్రాలజీ (DoCA)", hero: { title1: "స్వయంప్రతిపత్త న్యాయ", title2: "మెట్రాలజీ", titleHighlight: "కంప్లయన్స్ ఇంజిన్", subtitle: "తక్షణ దృశ్య ఆడిట్‌లు..." }, stat: { speed: { label: "వేగం", value: "15m → In Seconds" }, cost: { label: "ఖర్చు", value: "₹0.12 / SKU" }, rules: { label: "నియమాలు", value: "24 PCR 2011" }, chain: { label: "ఆధారం", value: "SHA-256" } }, gateway: { title: "యాక్సెస్", badge: "SSO సిద్ధం" }, tab: { lmo: "LMO అధికారి", msme: "MSME బ్రాండ్", citizen: "పౌర స్కాన్" }, lmo: { desc: "LMO మోడ్: తనిఖీలు నిర్వహించండి...", stateLabel: "రాష్ట్రం", badgeLabel: "అధికారి నంబర్", badgePlaceholder: "e.g. DL-LMO-2026", passLabel: "పాస్‌వర్డ్", passPlaceholder: "••••••••", submit: "లాగిన్" }, msme: { desc: "MSME మోడ్: వెక్టర్ ఆర్ట్‌వర్క్ తనిఖీ చేయండి.", gstinLabel: "GSTIN / కంపెనీ ID", gstinPlaceholder: "e.g. 29GGGGG...", submit: "ప్రారంభించండి" }, citizen: { desc: "పబ్లిక్ స్కాన్: తక్షణమే ధృవీకరించండి.", submit: "స్కాన్ చేయండి" } },
    audit: { title: "ఆడిట్ విధానాన్ని ఎంచుకోండి", subtitle: "తగిన తనిఖీ పైప్‌లైన్‌ను ఎంచుకోండి.", mode: { physical: { title: "ఆఫ్‌లైన్ ఫీల్డ్ మోడ్", desc: "స్మార్ట్‌ఫోన్ కెమెరా స్కాన్. ఇంటర్నెట్ లేకుండా పనిచేస్తుంది.", badge: "ఆఫ్‌లైన్ సిద్ధం" }, ecom: { title: "ఆన్‌లైన్ ఈ-కామర్స్", desc: "URL ఆధారిత ఆడిట్.", badge: "ఇన్‌స్టంట్ హెడ్‌లెస్" }, pdf: { title: "PDF సిమ్యులేటర్", desc: "వెక్టర్ ఆర్ట్‌వర్క్ విశ్లేషించండి.", badge: "0% ఆప్టికల్ వక్రీకరణ" } }, simulate: { title: "చురుకైన కంప్లయన్స్ టూలింగ్", desc: "ప్యాకేజింగ్ కొలతలు ధృవీకరించండి.", btn: "సిమ్యులేటర్‌ను ప్రారంభించండి" } },
    scan: { camera: { unsupported: "కెమెరా మద్దతు లేదు.", denied: "అనుమతి నిరాకరించబడింది.", notfound: "కెమెరా కనుగొనబడలేదు.", failed: "కెమెరా విఫలమైంది.", requesting: "అభ్యర్థిస్తోంది..." }, fallback: { btn: "ఫైల్‌ను అప్‌లోడ్ చేయండి" }, guide: { align: "ఇక్కడ PDP ని సమలేఖనం చేయండి" }, ecom: { title: "ఈ-కామ్ ఆడిట్", placeholder: "https://amazon...", sample1: "నమూనా 1", sample2: "నమూనా 2" }, pdf: { drag: "PDF లాగండి", support: "ఫాంట్ వెలికితీతకు మద్దతు ఇస్తుంది" }, btn: { capture: "క్యాప్చర్ & విశ్లేషణ", processing: "ప్రాసెస్ చేస్తోంది..." }, config: { title: "ఆకృతీకరణ", cat: { title: "వర్గం", food: "ఆహారం", cosmetic: "సౌందర్య", electronics: "ఎలక్ట్రానిక్స్", general: "సాధారణ", desc: "నియమాలను సర్దుబాటు చేస్తుంది." }, calib: { title: "కాలిబ్రేషన్", opt1: "మార్కర్ / ID", opt1desc: "ఆటోమేటిక్", opt2: "మాన్యువల్ కొలతలు", opt2desc: "మాన్యువల్", opt3: "AI అంచనా", opt3desc: "AI", width: "వెడల్పు:", mm: "మిమీ" } }, demo: { title: "పరీక్ష", pass: "100% కంప్లయంట్", review: "సమీక్ష", fail: "విఫలమైంది", badge: { pass: "పాస్", review: "సమీక్ష", fail: "ఫెయిల్" } } },
    step: { s0: "సిద్ధం", s1: "క్యాప్చర్", s2: "మ్యాపింగ్", s3: "OCR", s4: "ధృవీకరణ", s5: "తీర్పు" },
    verdict: { back: "వెనుకకు", status: { pass: "పాస్", review: "సమీక్ష", fail: "ఫెయిల్" }, sub: { pass: "కంప్లయంట్", review: "మాన్యువల్ అవసరం", fail: "కంప్లయంట్ కాదు" }, metrics: { title: "కొలమానాలు", pdp: "PDP ప్రాంతం", fontReq: "కనీస ఫాంట్", fontCalc: "లెక్కించిన ఫాంట్", confidence: "AI నమ్మకం" }, waterfall: { title: "తగ్గింపులు", pts: "పాయింట్లు" }, checklist: { title: "నియమ అమలు" }, action: { seal: "మెమో సృష్టించండి", sealed: "సంతకం చేయబడింది", override: "ఓవర్‌రైడ్", approve: "ఆమోదించండి" } },
  },
};
