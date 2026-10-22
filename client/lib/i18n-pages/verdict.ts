export const verdictDict: Record<"en" | "hi" | "bn" | "ta" | "te", Record<string, unknown>> = {
  en: {
    loading: "Loading statutory adjudication...",
    suspenseLoading: "Loading Statutory Verdict...",
    back: "Back to previous",
    topBar: {
      source: "Source: LIVE CAMERA · MOCK FALLBACK",
      hash: "HASH:",
    },
    reticle: "Optical Reticles Calibrated & Section 63 BSA Sealed",
    canvas: {
      sampleBrand: "SAMPLE BRAND",
      sampleProduct: "Consumer Packaged Commodity",
      passBadge: "PASS: Net Qty {qty}",
      netWeight: "Net Weight: {value} {unit}",
      reviewBadge: "REVIEW: Date {pct}",
      mfgGlare: "Mfg: {date} (Glare Detected)",
      failBadge: "FAIL: Rule 6(11) USP Missing",
      missingUsp: "Missing Mandatory Unit Sale Price",
      mrp: "MRP: {mrp}",
    },
    alt: {
      main: "Packaging panel {n}",
      thumb: "Panel {n}",
    },
    panelCounter: "Panel {n}/{total}",
    metaBar: {
      lens: "LENS: 1x {mode}",
      panelOf: " · Panel {n} of {total}",
      timestamp: "TIMESTAMP: ",
    },
    fields: {
      declaredMrp: "Declared MRP",
      mrpValue: "MRP ₹ {value}",
      notDetected: "Declaration Not Detected",
      netQuantity: "Net Quantity",
      netQtyValue: "{value} {unit}",
      unitSalePrice: "Unit Sale Price",
      notAvailable: "Not Available",
      countryOfOrigin: "Country of Origin",
    },
    scoreOutOf: "/ 100",
    status: {
      pass: "STATUTORY COMPLIANT",
      review: "HUMAN IN LOOP REQUIRED",
      fail: "NON-COMPLIANT / SEIZURE",
    },
    statusBox: {
      pass: "REVIEW STATUS: Officer Verified on Physical Label",
      review: "REVIEW STATUS: Declaration Not Clearly Detected",
      fail: "VIOLATION STATUS: Statutory Breach Recorded",
    },
    statusBody: {
      pass: "Officer visually confirmed the printed value on the physical label. Form-V memo verified and digitally sealed.",
      review:
        "The optical engine could not clearly read the declaration(s) below — they may be obscured, faded, or genuinely missing from the capture. Verify each value directly on the physical product label before Form-V sealing.",
      fail: "Mandatory declarations absent under Section 36(1) LM Act. Form-V seizure warrant ready for execution.",
    },
    fieldLabels: {
      expiry: "Best Before / Expiry Date",
      mfg: "Manufacturing Date",
      notRead: "Not read",
    },
    gate: {
      question: "Does the printed value on the physical label match the extraction?",
      recording: "Recording...",
      yes: "Yes — Matches Label",
      no: "No — Missing / Does Not Match",
      note: "A mandatory declaration that cannot be visually verified is treated as absent — a Rule 6(1) violation, offence under Section 36(1) of the Legal Metrology Act, 2009 (up to ₹2,00,000 second/continuing offence).",
    },
    gateNote: {
      confirmed: "Officer visually verified the printed value on the physical label; marker matches OCR extraction.",
      rejected: "Officer reviewed the physical label; OCR extraction does not match the printed value.",
    },
    gateViolation: {
      ruleNumber: "Rule 6(1) / Officer Override (HITL)",
      title: "Mandatory declaration not verifiable on physical label",
      description:
        "Officer could not visually confirm the OCR-extracted declaration on the physical label — treated as absent under Rule 6(1). OFFICER_REJECTED audit event recorded for the Form-V dossier.",
      penaltyClause: "Section 36(1) LM Act",
      severity: "CRITICAL",
      recommendation:
        "Obtain a fresh, high-resolution capture of the affected declaration zone and re-run the extraction before seizure proceedings.",
    },
    waterfall: {
      title: "Explainable Deduction Waterfall",
      pts: "-{pts} pts",
      zero: "Zero deductions — 100% compliant with 24 codified rules.",
    },
    violations: {
      deduction: "-{deduction}",
      title: "{rule}: {title}",
    },
    waterfallReview: {
      a: {
        deduction: "-10",
        rule: "Rule 6(1)(d)",
        detail: "Best before date illegible (OCR < 70%)",
      },
      b: {
        deduction: "-5",
        rule: "Rule 5",
        detail: "Standard weight mismatch (240g instead of 250g schedule)",
      },
    },
    accordion: {
      title: "Codified PCR 2011 Rule Execution",
      rule5: {
        title: "Rule 5: Second Schedule",
        detail: "Mandatory standard packaging weights and standard size enforcement.",
      },
      rule6: {
        title: "Rule 6: Mandatory Declarations",
        detail:
          "MRP found. Net Qty found. Mfg Date found. Best Before requires manual review due to glare.",
      },
      rule7: {
        title: "Rule 7 Table-I: Font Threshold",
        detail: "Minimum numeral & letter height for declared Principal Display Panel (PDP).",
      },
      rule611: {
        title: "Rule 6(11): Unit Sale Price",
        detail: "Mandatory calculation of Unit Sale Price (₹ per g / kg / ml) under GSR 226(E).",
      },
    },
    actions: {
      formV: "Form-V Seizure Memo (PDF)",
      ack: "Generate e-District Slip",
    },
    modal: {
      ministry: "GOVERNMENT OF INDIA · DOCA",
      title: "e-District Acknowledgement Slip",
      subtitle: "Official grievance tracking token & digital statutory receipt",
      refId: "STATUTORY REFERENCE ID",
      hearingDue: "Hearing Due Date:",
      jurisdiction: "Jurisdiction:",
      delhi: "Delhi (NCT)",
      statutoryMandate: "Statutory Mandate:",
      mandateValue: "Section 15 / Rule 6 PCR 2011",
      shareWhatsapp: "Share on WhatsApp",
      track: "Track on e-District",
    },
    whatsappText: "🏛️ PackParakh Legal Metrology Grievance\nRef: {ref}\nProduct: {product}\nScore: {score}/100",
  },
  hi: {
    loading: "वैधानिक अधिनिर्णय लोड हो रहा है...",
    suspenseLoading: "वैधानिक निर्णय लोड हो रहा है...",
    back: "पीछे जाएं",
    topBar: {
      source: "स्रोत: लाइव कैमरा · मॉक फ़ॉलबैक",
      hash: "HASH:",
    },
    reticle: "ऑप्टिकल रेटिकल कैलिब्रेटेड और धारा 63 BSA सीलबंद",
    canvas: {
      sampleBrand: "नमूना ब्रांड",
      sampleProduct: "उपभोक्ता पैक कमोडिटी",
      passBadge: "पास: शुद्ध मात्रा {qty}",
      netWeight: "शुद्ध भार: {value} {unit}",
      reviewBadge: "समीक्षा: तिथि {pct}",
      mfgGlare: "निर्माण: {date} (चमक पाई गई)",
      failBadge: "विफल: Rule 6(11) USP अनुपस्थित",
      missingUsp: "अनिवार्य इकाई बिक्री मूल्य अनुपस्थित",
      mrp: "MRP: {mrp}",
    },
    alt: {
      main: "पैकेजिंग पैनल {n}",
      thumb: "पैनल {n}",
    },
    panelCounter: "पैनल {n}/{total}",
    metaBar: {
      lens: "लेंस: 1x {mode}",
      panelOf: " · पैनल {n} / {total}",
      timestamp: "टाइमस्टैम्प: ",
    },
    fields: {
      declaredMrp: "घोषित MRP",
      mrpValue: "MRP ₹ {value}",
      notDetected: "घोषणा का पता नहीं चला",
      netQuantity: "शुद्ध मात्रा",
      netQtyValue: "{value} {unit}",
      unitSalePrice: "इकाई बिक्री मूल्य",
      notAvailable: "उपलब्ध नहीं",
      countryOfOrigin: "मूल देश",
    },
    scoreOutOf: "/ 100",
    status: {
      pass: "वैधानिक रूप से अनुपालक",
      review: "मानव-इन-लूप आवश्यक",
      fail: "गैर-अनुपालक / ज़ब्ती",
    },
    statusBox: {
      pass: "समीक्षा स्थिति: अधिकारी द्वारा भौतिक लेबल पर सत्यापित",
      review: "समीक्षा स्थिति: घोषणा स्पष्ट रूप से पहचानी नहीं गई",
      fail: "उल्लंघन स्थिति: वैधानिक उल्लंघन दर्ज",
    },
    statusBody: {
      pass: "अधिकारी ने भौतिक लेबल पर मुद्रित मान की दृष्टि से पुष्टि की। फॉर्म-V मेमो सत्यापित और डिजिटल रूप से सील हो गया।",
      review:
        "ऑप्टिकल इंजन नीचे दी गई घोषणा(ओं) को स्पष्ट रूप से नहीं पढ़ सका — वे अस्पष्ट, फीकी या कैप्चर से वास्तव में लुप्त हो सकती हैं। फॉर्म-V सीलिंग से पहले प्रत्येक मान को सीधे उत्पाद के भौतिक लेबल पर सत्यापित करें।",
      fail: "धारा 36(1) LM अधिनियम के अंतर्गत अनिवार्य घोषणाएँ अनुपस्थित हैं। फॉर्म-V ज़ब्ती वारंट निष्पादन के लिए तैयार है।",
    },
    fieldLabels: {
      expiry: "बेस्ट बिफोर / समाप्ति तिथि",
      mfg: "निर्माण तिथि",
      notRead: "पढ़ी नहीं गई",
    },
    gate: {
      question: "क्या भौतिक लेबल पर मुद्रित मान निष्कर्षण से मेल खाता है?",
      recording: "रिकॉर्ड किया जा रहा है...",
      yes: "हाँ — लेबल से मेल खाता है",
      no: "नहीं — अनुपस्थित / मेल नहीं खाता",
      note: "जिस अनिवार्य घोषणा का दृष्टि से सत्यापन संभव नहीं है, उसे अनुपस्थित माना जाता है — Rule 6(1) उल्लंघन, Legal Metrology Act, 2009 की धारा 36(1) के अंतर्गत अपराध (₹2,00,000 तक द्वितीय/निरंतर अपराध)।",
    },
    gateNote: {
      confirmed: "अधिकारी ने भौतिक लेबल पर मुद्रित मान का दृष्टि से सत्यापन किया; मार्कर OCR निष्कर्षण से मेल खाता है।",
      rejected: "अधिकारी ने भौतिक लेबल की समीक्षा की; OCR निष्कर्षण मुद्रित मान से मेल नहीं खाता।",
    },
    gateViolation: {
      ruleNumber: "Rule 6(1) / अधिकारी ओवरराइड (HITL)",
      title: "अनिवार्य घोषणा भौतिक लेबल पर सत्यापन योग्य नहीं",
      description:
        "अधिकारी भौतिक लेबल पर OCR-निकाली गई घोषणा की दृष्टि से पुष्टि नहीं कर सका — इसे Rule 6(1) के अंतर्गत अनुपस्थित माना गया। फॉर्म-V दस्तावेज़ के लिए OFFICER_REJECTED ऑडिट घटना दर्ज की गई।",
      penaltyClause: "Section 36(1) LM Act",
      severity: "CRITICAL",
      recommendation:
        "ज़ब्ती कार्यवाही से पहले प्रभावित घोषणा क्षेत्र की नई उच्च-रिज़ॉल्यूशन छवि लें और निष्कर्षण फिर से चलाएँ।",
    },
    waterfall: {
      title: "व्याख्यात्मक कटौती वॉटरफॉल",
      pts: "-{pts} अंक",
      zero: "शून्य कटौती — 24 संहिताबद्ध नियमों के साथ 100% अनुपालक।",
    },
    violations: {
      deduction: "-{deduction}",
      title: "{rule}: {title}",
    },
    waterfallReview: {
      a: {
        deduction: "-10",
        rule: "Rule 6(1)(d)",
        detail: "बेस्ट बिफोर तिथि अस्पष्ट (OCR < 70%)",
      },
      b: {
        deduction: "-5",
        rule: "Rule 5",
        detail: "मानक भार बेमेल (अनुसूची में 250g के स्थान पर 240g)",
      },
    },
    accordion: {
      title: "संहिताबद्ध PCR 2011 नियम निष्पादन",
      rule5: {
        title: "Rule 5: द्वितीय अनुसूची",
        detail: "अनिवार्य मानक पैकेजिंग भार और मानक आकार का प्रवर्तन।",
      },
      rule6: {
        title: "Rule 6: अनिवार्य घोषणाएँ",
        detail: "MRP मिला। शुद्ध मात्रा मिली। निर्माण तिथि मिली। बेस्ट बिफोर के लिए चमक के कारण मैन्युअल समीक्षा आवश्यक है।",
      },
      rule7: {
        title: "Rule 7 Table-I: फ़ॉन्ट सीमा",
        detail: "घोषित मुख्य प्रदर्शन पैनल (PDP) के लिए न्यूनतम अंक व अक्षर ऊंचाई।",
      },
      rule611: {
        title: "Rule 6(11): इकाई बिक्री मूल्य",
        detail: "GSR 226(E) के अंतर्गत इकाई बिक्री मूल्य (₹ प्रति ग्रा / किग्रा / मि.ली.) की अनिवार्य गणना।",
      },
    },
    actions: {
      formV: "फॉर्म-V ज़ब्ती मेमो (PDF)",
      ack: "e-District स्लिप बनाएं",
    },
    modal: {
      ministry: "भारत सरकार · DOCA",
      title: "e-District स्वीकृति पर्ची",
      subtitle: "आधिकारिक शिकायत ट्रैकिंग टोकन और डिजिटल वैधानिक रसीद",
      refId: "वैधानिक संदर्भ आईडी",
      hearingDue: "सुनवाई नियत तिथि:",
      jurisdiction: "क्षेत्राधिकार:",
      delhi: "दिल्ली (NCT)",
      statutoryMandate: "वैधानिक दायित्व:",
      mandateValue: "Section 15 / Rule 6 PCR 2011",
      shareWhatsapp: "WhatsApp पर साझा करें",
      track: "e-District पर ट्रैक करें",
    },
    whatsappText: "🏛️ PackParakh विधिक माप-विज्ञान शिकायत\nरेफ: {ref}\nउत्पाद: {product}\nस्कोर: {score}/100",
  },
  bn: {
    loading: "আইনগত বিচার লোড হচ্ছে...",
    suspenseLoading: "আইনগত রায় লোড হচ্ছে...",
    back: "ফিরে যান",
    topBar: {
      source: "উৎস: লাইভ ক্যামেরা · মক ফলব্যাক",
      hash: "HASH:",
    },
    reticle: "অপটিক্যাল রেটিকল ক্রমাঙ্কিত এবং ধারা 63 BSA সিলমোহরযুক্ত",
    canvas: {
      sampleBrand: "নমুনা ব্র্যান্ড",
      sampleProduct: "ভোক্তা প্যাক পণ্য",
      passBadge: "পাস: নিট পরিমাণ {qty}",
      netWeight: "নিট ওজন: {value} {unit}",
      reviewBadge: "রিভিউ: তারিখ {pct}",
      mfgGlare: "উৎপাদন: {date} (গ্লিয়ার ধরা পড়েছে)",
      failBadge: "ফেইল: Rule 6(11) USP অনুপস্থিত",
      missingUsp: "বাধ্যতামূলক ইউনিট বিক্রয় মূল্য অনুপস্থিত",
      mrp: "MRP: {mrp}",
    },
    alt: {
      main: "প্যাকেজিং প্যানেল {n}",
      thumb: "প্যানেল {n}",
    },
    panelCounter: "প্যানেল {n}/{total}",
    metaBar: {
      lens: "লেন্স: 1x {mode}",
      panelOf: " · প্যানেল {n} / {total}",
      timestamp: "টাইমস্ট্যাম্প: ",
    },
    fields: {
      declaredMrp: "ঘোষিত MRP",
      mrpValue: "MRP ₹ {value}",
      notDetected: "ঘোষণা সনাক্ত করা যায়নি",
      netQuantity: "নিট পরিমাণ",
      netQtyValue: "{value} {unit}",
      unitSalePrice: "ইউনিট বিক্রয় মূল্য",
      notAvailable: "উপলব্ধ নয়",
      countryOfOrigin: "উৎপত্তির দেশ",
    },
    scoreOutOf: "/ 100",
    status: {
      pass: "আইনানুগভাবে সামঞ্জস্যপূর্ণ",
      review: "মানুষের হস্তক্ষেপ প্রয়োজন",
      fail: "অ-সামঞ্জস্যপূর্ণ / জব্দ",
    },
    statusBox: {
      pass: "রিভিউ স্থিতি: অফিসার শারীরিক লেবেলে যাচাই করেছেন",
      review: "রিভিউ স্থিতি: ঘোষণা স্পষ্টভাবে শনাক্ত হয়নি",
      fail: "লঙ্ঘন স্থিতি: আইনগত লঙ্ঘন নথিভুক্ত",
    },
    statusBody: {
      pass: "অফিসার শারীরিক লেবেলে মুদ্রিত মান দৃশ্যত নিশ্চিত করেছেন। ফর্ম-V মেমো যাচাই এবং ডিজিটালভাবে সিল করা হয়েছে।",
      review:
        "অপটিক্যাল ইঞ্জিন নীচের ঘোষণা(গুলি) স্পষ্টভাবে পড়তে পারেনি — সেগুলি অস্পষ্ট, বিবর্ণ বা ক্যাপচার থেকে প্রকৃতপক্ষে অনুপস্থিত হতে পারে। ফর্ম-V সিল করার আগে প্রতিটি মান সরাসরি শারীরিক লেবেলে যাচাই করুন।",
      fail: "ধারা 36(1) LM আইনের অধীনে বাধ্যতামূলক ঘোষণা অনুপস্থিত। ফর্ম-V জব্দ পরোয়ানা কার্যকর করার জন্য প্রস্তুত।",
    },
    fieldLabels: {
      expiry: "সেরা-আগে / মেয়াদ শেষ হওয়ার তারিখ",
      mfg: "উৎপাদন তারিখ",
      notRead: "পড়া হয়নি",
    },
    gate: {
      question: "শারীরিক লেবেলে মুদ্রিত মান কি নিষ্কাশনের সাথে মেলে?",
      recording: "রেকর্ড হচ্ছে...",
      yes: "হ্যাঁ — লেবেলের সাথে মেলে",
      no: "না — অনুপস্থিত / মেলে না",
      note: "যে বাধ্যতামূলক ঘোষণা দৃশ্যত যাচাই করা যায় না, তা অনুপস্থিত বলে গণ্য হয় — Rule 6(1) লঙ্ঘন, Legal Metrology Act, 2009-এর ধারা 36(1) অনুযায়ী অপরাধ (₹2,00,000 পর্যন্ত দ্বিতীয়/চলমান অপরাধ)।",
    },
    gateNote: {
      confirmed: "অফিসার শারীরিক লেবেলে মুদ্রিত মান দৃশ্যত যাচাই করেছেন; মার্কার OCR নিষ্কাশনের সাথে মেলে।",
      rejected: "অফিসার শারীরিক লেবেল পর্যালোচনা করেছেন; OCR নিষ্কাশন মুদ্রিত মানের সাথে মেলে না।",
    },
    gateViolation: {
      ruleNumber: "Rule 6(1) / অফিসার ওভাররাইড (HITL)",
      title: "বাধ্যতামূলক ঘোষণা শারীরিক লেবেলে যাচাইযোগ্য নয়",
      description:
        "অফিসার শারীরিক লেবেলে OCR-নিষ্কাশিত ঘোষণা দৃশ্যত নিশ্চিত করতে পারেননি — এটি Rule 6(1) অনুযায়ী অনুপস্থিত বলে গণ্য করা হয়েছে। ফর্ম-V ডসিয়ারের জন্য OFFICER_REJECTED অডিট ইভেন্ট নথিভুক্ত করা হয়েছে।",
      penaltyClause: "Section 36(1) LM Act",
      severity: "CRITICAL",
      recommendation:
        "জব্দ কার্যক্রমের আগে প্রভাবিত ঘোষণা এলাকার একটি নতুন উচ্চ-রেজোলিউশন ছবি নিন এবং নিষ্কাশন পুনরায় চালান।",
    },
    waterfall: {
      title: "ব্যাখ্যামূলক কাটছাঁট ওয়াটারফল",
      pts: "-{pts} পয়েন্ট",
      zero: "শূন্য কর্তন — 24টি সংহিতাবদ্ধ নিয়মের সাথে 100% সামঞ্জস্যপূর্ণ।",
    },
    violations: {
      deduction: "-{deduction}",
      title: "{rule}: {title}",
    },
    waterfallReview: {
      a: {
        deduction: "-10",
        rule: "Rule 6(1)(d)",
        detail: "সেরা-আগে তারিখ অস্পষ্ট (OCR < 70%)",
      },
      b: {
        deduction: "-5",
        rule: "Rule 5",
        detail: "মানক ওজনের অসামঞ্জস্য (তালিকা অনুযায়ী 250g-এর বদলে 240g)",
      },
    },
    accordion: {
      title: "সংহিতাবদ্ধ PCR 2011 নিয়ম সম্পাদন",
      rule5: {
        title: "Rule 5: দ্বিতীয় তফসিল",
        detail: "বাধ্যতামূলক মানক প্যাকেজিং ওজন এবং মানক আকার প্রয়োগ।",
      },
      rule6: {
        title: "Rule 6: বাধ্যতামূলক ঘোষণা",
        detail: "MRP পাওয়া গেছে। নিট পরিমাণ পাওয়া গেছে। উৎপাদন তারিখ পাওয়া গেছে। গ্লিয়ারের কারণে সেরা-আগে ম্যানুয়াল রিভিউ প্রয়োজন।",
      },
      rule7: {
        title: "Rule 7 Table-I: ফন্ট সীমা",
        detail: "ঘোষিত প্রধান প্রদর্শন প্যানেলের (PDP) জন্য ন্যূনতম সংখ্যা ও অক্ষরের উচ্চতা।",
      },
      rule611: {
        title: "Rule 6(11): ইউনিট বিক্রয় মূল্য",
        detail: "GSR 226(E) অনুযায়ী ইউনিট বিক্রয় মূল্যের (₹ প্রতি গ্রাম / কেজি / মি.লি.) বাধ্যতামূলক গণনা।",
      },
    },
    actions: {
      formV: "ফর্ম-V জব্দ মেমো (PDF)",
      ack: "e-District স্লিপ তৈরি করুন",
    },
    modal: {
      ministry: "ভারত সরকার · DOCA",
      title: "e-District স্বীকৃতি স্লিপ",
      subtitle: "অফিসিয়াল অভিযোগ ট্র্যাকিং টোকেন এবং ডিজিটাল আইনগত রসিদ",
      refId: "আইনগত রেফারেন্স আইডি",
      hearingDue: "শুনানির নির্ধারিত তারিখ:",
      jurisdiction: "এখতিয়ার:",
      delhi: "দিল্লি (NCT)",
      statutoryMandate: "আইনগত দায়িত্ব:",
      mandateValue: "Section 15 / Rule 6 PCR 2011",
      shareWhatsapp: "WhatsApp-এ শেয়ার করুন",
      track: "e-District-এ ট্র্যাক করুন",
    },
    whatsappText: "🏛️ PackParakh আইনগত মেট্রোলজি অভিযোগ\nরেফ: {ref}\nপণ্য: {product}\nস্কোর: {score}/100",
  },
  ta: {
    loading: "சட்டப்பூர்வ தீர்ப்பு ஏற்றப்படுகிறது...",
    suspenseLoading: "சட்டப்பூர்வ தீர்ப்பு ஏற்றப்படுகிறது...",
    back: "முந்தைய பக்கத்திற்குச் செல்",
    topBar: {
      source: "மூலம்: நேரடி கேமரா · மாக் ஃபால்பேக்",
      hash: "HASH:",
    },
    reticle: "ஆப்டிகல் ரெட்டிக்கிள்கள் அளவீடு & Section 63 BSA முத்திரை",
    canvas: {
      sampleBrand: "மாதிரி பிராண்ட்",
      sampleProduct: "நுகர்வோர் பேக் பொருள்",
      passBadge: "பாஸ்: நிகர அளவு {qty}",
      netWeight: "நிகர எடை: {value} {unit}",
      reviewBadge: "மதிப்பாய்வு: தேதி {pct}",
      mfgGlare: "தயாரிப்பு: {date} (வெண்மை கண்டறியப்பட்டது)",
      failBadge: "தோல்வி: Rule 6(11) USP இல்லை",
      missingUsp: "கட்டாய அலகு விற்பனை விலை இல்லை",
      mrp: "MRP: {mrp}",
    },
    alt: {
      main: "பேக்கேஜிங் பேனல் {n}",
      thumb: "பேனல் {n}",
    },
    panelCounter: "பேனல் {n}/{total}",
    metaBar: {
      lens: "லென்ஸ்: 1x {mode}",
      panelOf: " · பேனல் {n} / {total}",
      timestamp: "நேரமுத்திரை: ",
    },
    fields: {
      declaredMrp: "அறிவிக்கப்பட்ட MRP",
      mrpValue: "MRP ₹ {value}",
      notDetected: "அறிவிப்பு கண்டறியப்படவில்லை",
      netQuantity: "நிகர அளவு",
      netQtyValue: "{value} {unit}",
      unitSalePrice: "அலகு விற்பனை விலை",
      notAvailable: "கிடைக்கவில்லை",
      countryOfOrigin: "தோற்றம் நாடு",
    },
    scoreOutOf: "/ 100",
    status: {
      pass: "சட்டப்பூர்வமாக இணக்கம்",
      review: "மனித தலையீடு தேவை",
      fail: "இணக்கமற்றது / கைப்பற்றல்",
    },
    statusBox: {
      pass: "மதிப்பாய்வு நிலை: அதிகாரி இயற்பியல் லேபிளில் சரிபார்த்தார்",
      review: "மதிப்பாய்வு நிலை: அறிவிப்பு தெளிவாக கண்டறியப்படவில்லை",
      fail: "மீறல் நிலை: சட்டப்பூர்வ மீறல் பதிவு செய்யப்பட்டது",
    },
    statusBody: {
      pass: "அதிகாரி இயற்பியல் லேபிளில் அச்சிடப்பட்ட மதிப்பைக் காட்சிபூர்வமாக உறுதிப்படுத்தினார். Form-V மெமோ சரிபார்க்கப்பட்டு டிஜிட்டல் முத்திரையிடப்பட்டது.",
      review:
        "ஆப்டிகல் இன்ஜின் கீழே உள்ள அறிவிப்பு(களை) தெளிவாக படிக்க முடியவில்லை — அவை மறைக்கப்பட்டிருக்கலாம், மங்கலாக இருக்கலாம் அல்லது காட்சியிலிருந்து உண்மையில் இல்லாமல் போயிருக்கலாம். Form-V முத்திரையிடுவதற்கு முன் ஒவ்வொரு மதிப்பையும் நேரடியாக இயற்பியல் லேபிளில் சரிபார்க்கவும்.",
      fail: "Section 36(1) LM சட்டத்தின் கீழ் கட்டாய அறிவிப்புகள் இல்லை. Form-V கைப்பற்றல் உத்தரவு நிறைவேற்றத்திற்குத் தயாராக உள்ளது.",
    },
    fieldLabels: {
      expiry: "சிறந்த-முன் / காலாவதி தேதி",
      mfg: "தயாரிப்பு தேதி",
      notRead: "படிக்கவில்லை",
    },
    gate: {
      question: "இயற்பியல் லேபிளில் அச்சிடப்பட்ட மதிப்பு பிரித்தெடுப்புடன் பொருந்துகிறதா?",
      recording: "பதிவு செய்யப்படுகிறது...",
      yes: "ஆம் — லேபிளுடன் பொருந்துகிறது",
      no: "இல்லை — இல்லை / பொருந்தவில்லை",
      note: "காட்சிபூர்வமாக சரிபார்க்க முடியாத கட்டாய அறிவிப்பு இல்லாததாகக் கருதப்படுகிறது — Rule 6(1) மீறல், Legal Metrology Act, 2009-இன் Section 36(1) கீழ் குற்றம் (₹2,00,000 வரை இரண்டாவது/தொடர்ச்சியான குற்றம்)।",
    },
    gateNote: {
      confirmed: "அதிகாரி இயற்பியல் லேபிளில் அச்சிடப்பட்ட மதிப்பைக் காட்சிபூர்வமாக சரிபார்த்தார்; மார்க்கர் OCR பிரித்தெடுப்புடன் பொருந்துகிறது.",
      rejected: "அதிகாரி இயற்பியல் லேபிளை மதிப்பாய்வு செய்தார்; OCR பிரித்தெடுப்பு அச்சிடப்பட்ட மதிப்புடன் பொருந்தவில்லை.",
    },
    gateViolation: {
      ruleNumber: "Rule 6(1) / அதிகாரி மேலோட்ட (HITL)",
      title: "கட்டாய அறிவிப்பு இயற்பியல் லேபிளில் சரிபார்க்க முடியாது",
      description:
        "அதிகாரி இயற்பியல் லேபிளில் OCR-பிரித்தெடுக்கப்பட்ட அறிவிப்பைக் காட்சிபூர்வமாக உறுதிப்படுத்த முடியவில்லை — Rule 6(1) இன் கீழ் இல்லாததாகக் கருதப்பட்டது. Form-V ஆவணத்திற்கு OFFICER_REJECTED தணிக்கை நிகழ்வு பதிவு செய்யப்பட்டது.",
      penaltyClause: "Section 36(1) LM Act",
      severity: "CRITICAL",
      recommendation:
        "கைப்பற்றல் நடவடிக்கைக்கு முன் பாதிக்கப்பட்ட அறிவிப்புப் பகுதியின் புதிய உயர்-தெளிவு படத்தைப் பெற்று பிரித்தெடுப்பை மீண்டும் இயக்கவும்.",
    },
    waterfall: {
      title: "விளக்கக் கழிப்பு நீர்வீழ்ச்சி",
      pts: "-{pts} புள்ளிகள்",
      zero: "பூஜ்ஜிய கழிப்புகள் — 24 குறியீட்டு விதிகளுடன் 100% இணக்கம்.",
    },
    violations: {
      deduction: "-{deduction}",
      title: "{rule}: {title}",
    },
    waterfallReview: {
      a: {
        deduction: "-10",
        rule: "Rule 6(1)(d)",
        detail: "சிறந்த-முன் தேதி தெளிவற்றது (OCR < 70%)",
      },
      b: {
        deduction: "-5",
        rule: "Rule 5",
        detail: "நிலையான எடை பொருந்தவில்லை (அட்டவணையில் 250g என்பதற்குப் பதிலாக 240g)",
      },
    },
    accordion: {
      title: "குறியீட்டு PCR 2011 விதி நிறைவேற்றம்",
      rule5: {
        title: "Rule 5: இரண்டாம் அட்டவணை",
        detail: "கட்டாய நிலையான பேக்கேஜிங் எடைகள் மற்றும் நிலையான அளவை அமலாக்குதல்.",
      },
      rule6: {
        title: "Rule 6: கட்டாய அறிவிப்புகள்",
        detail: "MRP கண்டறியப்பட்டது. நிகர அளவு கண்டறியப்பட்டது. தயாரிப்பு தேதி கண்டறியப்பட்டது. வெண்மை காரணமாக சிறந்த-முன் கைமுறை மதிப்பாய்வு தேவை.",
      },
      rule7: {
        title: "Rule 7 Table-I: எழுத்துரு வரம்பு",
        detail: "அறிவிக்கப்பட்ட முதன்மை காட்சி பேனலுக்கான (PDP) குறைந்தபட்ச எண் மற்றும் எழுத்து உயரம்.",
      },
      rule611: {
        title: "Rule 6(11): அலகு விற்பனை விலை",
        detail: "GSR 226(E) இன் கீழ் அலகு விற்பனை விலையின் (₹ ஒரு கிராம் / கிலோ / மி.லி.) கட்டாய கணக்கீடு.",
      },
    },
    actions: {
      formV: "Form-V கைப்பற்றல் மெமோ (PDF)",
      ack: "e-District ஸ்லிப்பை உருவாக்கு",
    },
    modal: {
      ministry: "இந்திய அரசு · DOCA",
      title: "e-District ஒப்புதல் ஸ்லிப்",
      subtitle: "அதிகாரப்பூர்வ புகார் கண்காணிப்பு டோக்கன் & டிஜிட்டல் சட்டப்பூர்வ ரசீது",
      refId: "சட்டப்பூர்வ குறிப்பு ஐடி",
      hearingDue: "விசாரணை தேதி:",
      jurisdiction: "அதிகார வரம்பு:",
      delhi: "டெல்லி (NCT)",
      statutoryMandate: "சட்டப்பூர்வ கட்டளை:",
      mandateValue: "Section 15 / Rule 6 PCR 2011",
      shareWhatsapp: "WhatsApp இல் பகிரவும்",
      track: "e-District இல் கண்காணிக்கவும்",
    },
    whatsappText: "🏛️ PackParakh சட்டப்பூர்வ மெட்ராலஜி புகார்\nகுறிப்பு: {ref}\nதயாரிப்பு: {product}\nமதிப்பெண்: {score}/100",
  },
  te: {
    loading: "చట్టబద్ధమైన తీర్పు లోడ్ అవుతోంది...",
    suspenseLoading: "చట్టబద్ధమైన తీర్పు లోడ్ అవుతోంది...",
    back: "మునుపటికి వెళ్ళండి",
    topBar: {
      source: "మూలం: లైవ్ కెమెరా · మాక్ ఫాల్బ్యాక్",
      hash: "HASH:",
    },
    reticle: "ఆప్టికల్ రెటికల్లు క్రమాంకనం చేయబడ్డాయి & Section 63 BSA ముద్రించబడింది",
    canvas: {
      sampleBrand: "నమూనా బ్రాండ్",
      sampleProduct: "వినియోగదారు ప్యాక్ వస్తువు",
      passBadge: "పాస్: నికర పరిమాణం {qty}",
      netWeight: "నికర బరువు: {value} {unit}",
      reviewBadge: "సమీక్ష: తేదీ {pct}",
      mfgGlare: "తయారీ: {date} (మెరుపు గుర్తించబడింది)",
      failBadge: "విఫలం: Rule 6(11) USP లేదు",
      missingUsp: "తప్పనిసరి యూనిట్ అమ్మకపు ధర లేదు",
      mrp: "MRP: {mrp}",
    },
    alt: {
      main: "ప్యాకేజింగ్ ప్యానెల్ {n}",
      thumb: "ప్యానెల్ {n}",
    },
    panelCounter: "ప్యానెల్ {n}/{total}",
    metaBar: {
      lens: "లెన్స్: 1x {mode}",
      panelOf: " · ప్యానెల్ {n} / {total}",
      timestamp: "టైమ్స్టాంప్: ",
    },
    fields: {
      declaredMrp: "ప్రకటించిన MRP",
      mrpValue: "MRP ₹ {value}",
      notDetected: "ప్రకటన గుర్తించబడలేదు",
      netQuantity: "నికర పరిమాణం",
      netQtyValue: "{value} {unit}",
      unitSalePrice: "యూనిట్ అమ్మకపు ధర",
      notAvailable: "అందుబాటులో లేదు",
      countryOfOrigin: "మూల దేశం",
    },
    scoreOutOf: "/ 100",
    status: {
      pass: "చట్టబద్ధంగా సమ్మతి",
      review: "మానవ జోక్యం అవసరం",
      fail: "సమ్మతి లేదు / జప్తు",
    },
    statusBox: {
      pass: "సమీక్ష స్థితి: అధికారి భౌతిక లేబుల్పై ధృవీకరించారు",
      review: "సమీక్ష స్థితి: ప్రకటన స్పష్టంగా గుర్తించబడలేదు",
      fail: "ఉల్లంఘన స్థితి: చట్టబద్ధ ఉల్లంఘన నమోదు చేయబడింది",
    },
    statusBody: {
      pass: "అధికారి భౌతిక లేబుల్పై ముద్రించిన విలువను దృశ్యపరంగా నిర్ధారించారు. Form-V మెమో ధృవీకరించబడి డిజిటల్గా ముద్రించబడింది.",
      review:
        "ఆప్టికల్ ఇంజిన్ క్రింది ప్రకటన(ల)ను స్పష్టంగా చదవలేకపోయింది — అవి అస్పష్టంగా, ఫీడ్‌గా ఉండవచ్చు లేదా క్యాప్చర్‌లో నిజంగా లేకపోవచ్చు. Form-V ముద్ర వేసే ముందు ప్రతి విలువను ఉత్పత్తి యొక్క భౌతిక లేబుల్‌పై నేరుగా ధృవీకరించండి.",
      fail: "Section 36(1) LM చట్టం క్రింద తప్పనిసరి ప్రకటనలు లేవు. Form-V జప్తు వారెంట్ అమలుకు సిద్ధంగా ఉంది.",
    },
    fieldLabels: {
      expiry: "బెస్ట్ బిఫోర్ / గడువు తేదీ",
      mfg: "తయారీ తేదీ",
      notRead: "చదవలేదు",
    },
    gate: {
      question: "భౌతిక లేబుల్పై ముద్రించిన విలువ సంగ్రహణతో సరిపోలుతుందా?",
      recording: "రికార్డ్ అవుతోంది...",
      yes: "అవును — లేబుల్‌తో సరిపోలుతుంది",
      no: "లేదు — లేదు / సరిపోలడం లేదు",
      note: "దృశ్యపరంగా ధృవీకరించలేని తప్పనిసరి ప్రకటన లేనట్లుగా పరిగణించబడుతుంది — Rule 6(1) ఉల్లంఘన, Legal Metrology Act, 2009లోని Section 36(1) ప్రకారం నేరం (₹2,00,000 వరకు రెండవ/నిరంతర నేరం).",
    },
    gateNote: {
      confirmed: "అధికారి భౌతిక లేబుల్‌పై ముద్రించిన విలువను దృశ్యపరంగా ధృవీకరించారు; మార్కర్ OCR సంగ్రహణతో సరిపోలుతుంది.",
      rejected: "అధికారి భౌతిక లేబుల్‌ను సమీక్షించారు; OCR సంగ్రహణ ముద్రించిన విలువతో సరిపోలడం లేదు.",
    },
    gateViolation: {
      ruleNumber: "Rule 6(1) / అధికారి ఓవర్‌రైడ్ (HITL)",
      title: "తప్పనిసరి ప్రకటన భౌతిక లేబుల్‌పై ధృవీకరించడం సాధ్యం కాదు",
      description:
        "అధికారి భౌతిక లేబుల్‌పై OCR-సంగ్రహించిన ప్రకటనను దృశ్యపరంగా నిర్ధారించలేకపోయారు — Rule 6(1) క్రింద లేనట్లుగా పరిగణించబడింది. Form-V డాసియర్ కోసం OFFICER_REJECTED ఆడిట్ ఈవెంట్ నమోదు చేయబడింది.",
      penaltyClause: "Section 36(1) LM Act",
      severity: "CRITICAL",
      recommendation:
        "జప్తు చర్యలకు ముందు ప్రభావిత ప్రకటన జోన్ యొక్క కొత్త అధిక-రిజల్యూషన్ క్యాప్చర్ పొందండి మరియు సంగ్రహణను మళ్లీ అమలు చేయండి.",
    },
    waterfall: {
      title: "వివరణాత్మక మినహాయింపు వాటర్‌ఫాల్",
      pts: "-{pts} పాయింట్లు",
      zero: "సున్నా మినహాయింపులు — 24 క్రోడీకృత నిబంధనలతో 100% సమ్మతి.",
    },
    violations: {
      deduction: "-{deduction}",
      title: "{rule}: {title}",
    },
    waterfallReview: {
      a: {
        deduction: "-10",
        rule: "Rule 6(1)(d)",
        detail: "బెస్ట్ బిఫోర్ తేదీ అస్పష్టం (OCR < 70%)",
      },
      b: {
        deduction: "-5",
        rule: "Rule 5",
        detail: "ప్రామాణిక బరువు సరిపోలడం లేదు (షెడ్యూల్‌లో 250gకి బదులుగా 240g)",
      },
    },
    accordion: {
      title: "క్రోడీకృత PCR 2011 నియమ నిర్వహణ",
      rule5: {
        title: "Rule 5: రెండవ షెడ్యూల్",
        detail: "తప్పనిసరి ప్రామాణిక ప్యాకేజింగ్ బరువులు మరియు ప్రామాణిక పరిమాణ అమలు.",
      },
      rule6: {
        title: "Rule 6: తప్పనిసరి ప్రకటనలు",
        detail: "MRP కనుగొనబడింది. నికర పరిమాణం కనుగొనబడింది. తయారీ తేదీ కనుగొనబడింది. మెరుపు కారణంగా బెస్ట్ బిఫోర్‌కి మాన్యువల్ సమీక్ష అవసరం.",
      },
      rule7: {
        title: "Rule 7 Table-I: ఫాంట్ పరిమితి",
        detail: "ప్రకటించిన ప్రధాన ప్రదర్శన ప్యానెల్ (PDP) కోసం కనీస సంఖ్య మరియు అక్షర ఎత్తు.",
      },
      rule611: {
        title: "Rule 6(11): యూనిట్ అమ్మకపు ధర",
        detail: "GSR 226(E) క్రింద యూనిట్ అమ్మకపు ధర (₹ గ్రాముకు / కిలోకు / మి.లీకి) యొక్క తప్పనిసరి గణన.",
      },
    },
    actions: {
      formV: "Form-V జప్తు మెమో (PDF)",
      ack: "e-District స్లిప్‌ను రూపొందించండి",
    },
    modal: {
      ministry: "భారత ప్రభుత్వం · DOCA",
      title: "e-District అంగీకార స్లిప్",
      subtitle: "అధికారిక ఫిర్యాదు ట్రాకింగ్ టోకెన్ & డిజిటల్ చట్టబద్ధ రసీదు",
      refId: "చట్టబద్ధ రిఫరెన్స్ ఐడి",
      hearingDue: "విచారణ నిర్ణీత తేదీ:",
      jurisdiction: "అధికార పరిధి:",
      delhi: "ఢిల్లీ (NCT)",
      statutoryMandate: "చట్టబద్ధ అధికారం:",
      mandateValue: "Section 15 / Rule 6 PCR 2011",
      shareWhatsapp: "WhatsApp‌లో భాగస్వామ్యం చేయండి",
      track: "e-District‌లో ట్రాక్ చేయండి",
    },
    whatsappText: "🏛️ PackParakh చట్టపరమైన మెట్రాలజీ ఫిర్యాదు\nరిఫ్: {ref}\nఉత్పత్తి: {product}\nస్కోర్: {score}/100",
  },
};