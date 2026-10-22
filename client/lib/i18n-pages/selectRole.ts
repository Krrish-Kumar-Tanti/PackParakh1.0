export const selectRoleDict: Record<
  "en" | "hi" | "bn" | "ta" | "te",
  Record<string, unknown>
> = {
  en: {
    auth: {
      googleAuthenticated: "Google Authenticated:",
      switchAccount: "Switch Account",
    },
    heading: {
      title: "Select Your Operational Profile",
      subtitle:
        "Choose one of the 3 statutory operational clearances to open the official authorization gateway.",
    },
    cards: {
      lmo: {
        option: "Option 01",
        title: "Legal Metrology Officer (LMO)",
        role: "State Enforcement & Market Raid Wing",
        description:
          "Conduct surprise market inspections, compute Rule 7 font compliance using 3-tier coin calibration, and issue court-admissible Form-V Seizure Notices.",
        features: [
          "State Controller Badge Authorization",
          "Sec 36 Compounding Penalty Matrix",
          "Court-Admissible BSA Sec 63 Signatures",
        ],
        button: "Continue as LMO Officer",
      },
      msme: {
        option: "Option 02",
        title: "MSME Brand Manufacturer",
        role: "FMCG Packagers, Importers & Designers",
        description:
          "Pre-flight packaging vector PDFs prior to commercial cylinder engraving with 0% camera distortion, saving lakhs in printing recalls.",
        features: [
          "Valid 15-digit GSTIN Validation",
          "Pre-Engraving Vector Font Check",
          "Rule 12 Standard Metric Unit Verification",
        ],
        button: "Continue as MSME Brand",
      },
      citizen: {
        option: "Option 03",
        title: "Consumer Citizen Audit",
        role: "Public Retail & Quick-Commerce Shoppers",
        description:
          "Inspect any retail packaged good or e-commerce listing URL to audit Unit Sale Price math and obtain court-admissible grievance tokens.",
        features: [
          "Instant Camera & URL Scanner Access",
          "Rule 6(11) Unit Sale Price Validation",
          "Tamper-Proof e-District Grievance Token",
        ],
        button: "Continue as Citizen",
      },
    },
  },
  hi: {
    auth: {
      googleAuthenticated: "गूगल द्वारा प्रमाणित:",
      switchAccount: "खाता बदलें",
    },
    heading: {
      title: "परिचालन भूमिका का चयन करें",
      subtitle:
        "कृपया आगे बढ़ने के लिए अपने वैधानिक अधिकार क्षेत्र एवं भूमिका का चयन करें। इसके पश्चात संबंधित क्रेडेंशियल दर्ज करें।",
    },
    cards: {
      lmo: {
        option: "विकल्प 01",
        title: "विधिक मापविज्ञान अधिकारी (LMO)",
        role: "राज्य प्रवर्तन शाखा एवं निरीक्षण दल",
        description:
          "भौतिक बाजारों, मंडियों और कारखानों में औचक निरीक्षण करने, 3-स्तरीय सिक्का कैलिब्रेशन द्वारा फॉन्ट जांचने, और फॉर्म-वी जब्ती मेमो जारी करने हेतु।",
        features: [
          "राज्य नियंत्रक बैज प्राधिकरण",
          "Sec 36 समझौता जुर्माना मैट्रिक्स",
          "न्यायालय-मान्य BSA Sec 63 हस्ताक्षर",
        ],
        button: "एलएमओ अधिकारी के रूप में जारी रखें",
      },
      msme: {
        option: "विकल्प 02",
        title: "एमएसएमई ब्रांड एवं निर्माता",
        role: "एफएमसीजी पैकेजिंग डिजाइनर एवं आयातक",
        description:
          "व्यावसायिक प्रिंटिंग सिलेंडरों को उकेरने से पहले अपनी पैकेजिंग के पीडीएफ लेआउट का प्री-फ्लाइट निरीक्षण करें और रिकॉल तथा भारी जुर्माने से बचें।",
        features: [
          "मान्य 15-अंकीय GSTIN सत्यापन",
          "उत्कीर्णन-पूर्व वेक्टर फॉन्ट जांच",
          "Rule 12 मानक मीट्रिक इकाई सत्यापन",
        ],
        button: "एमएसएमई ब्रांड के रूप में जारी रखें",
      },
      citizen: {
        option: "विकल्प 03",
        title: "उपभोक्ता एवं नागरिक",
        role: "त्वरित-वाणिज्य व खुदरा खरीदार",
        description:
          "खरीदे गए सामान पर एमआरपी और यूनिट सेल प्राइस (यूएसपी) गणित की तुरंत जांच करें। किसी भी पैकेजिंग विसंगति पर साक्ष्य टोकन प्राप्त करें।",
        features: [
          "तत्काल कैमरा एवं URL स्कैनर पहुँच",
          "Rule 6(11) यूनिट सेल प्राइस सत्यापन",
          "छेड़छाड़-रोधी e-District शिकायत टोकन",
        ],
        button: "नागरिक के रूप में जारी रखें",
      },
    },
  },
  bn: {
    auth: {
      googleAuthenticated: "গুগল দ্বারা প্রমাণিত:",
      switchAccount: "অ্যাকাউন্ট পরিবর্তন করুন",
    },
    heading: {
      title: "আপনার অপারেশনাল প্রোফাইল নির্বাচন করুন",
      subtitle:
        "সরকারি অনুমোদন গেটওয়ে খুলতে ৩টি বিধিবদ্ধ অপারেশনাল ক্লিয়ারেন্সের একটি বেছে নিন।",
    },
    cards: {
      lmo: {
        option: "বিকল্প ০১",
        title: "লিগ্যাল মেট্রোলজি অফিসার (LMO)",
        role: "রাজ্য প্রয়োগ শাখা ও বাজার অভিযান দল",
        description:
          "বাজারে আকস্মিক পরিদর্শন করুন, ৩-স্তরের কয়েন ক্যালিব্রেশনের মাধ্যমে Rule 7 ফন্ট সম্মতি গণনা করুন এবং আদালত-গ্রহণযোগ্য Form-V জব্দি নোটিশ জারি করুন।",
        features: [
          "রাজ্য কন্ট্রোলার ব্যাজ অনুমোদন",
          "Sec 36 কমপাউন্ডিং জরিমানা ম্যাট্রিক্স",
          "আদালত-গ্রহণযোগ্য BSA Sec 63 স্বাক্ষর",
        ],
        button: "LMO অফিসার হিসাবে চালিয়ে যান",
      },
      msme: {
        option: "বিকল্প ০২",
        title: "MSME ব্র্যান্ড নির্মাতা",
        role: "FMCG প্যাকেজার, আমদানিকারক ও ডিজাইনার",
        description:
          "বাণিজ্যিক সিলিন্ডার খোদাইয়ের আগে প্যাকেজিং ভেক্টর PDF-এর প্রি-ফ্লাইট পরিদর্শন করুন এবং মুদ্রণ রিকলের লক্ষ লক্ষ টাকা ক্ষতি এড়ান।",
        features: [
          "বৈধ 15-অঙ্কের GSTIN যাচাইকরণ",
          "খোদাই-পূর্ব ভেক্টর ফন্ট পরীক্ষা",
          "Rule 12 স্ট্যান্ডার্ড মেট্রিক একক যাচাইকরণ",
        ],
        button: "MSME ব্র্যান্ড হিসাবে চালিয়ে যান",
      },
      citizen: {
        option: "বিকল্প ০৩",
        title: "ভোক্তা নাগরিক নিরীক্ষা",
        role: "পাবলিক রিটেইল ও কুইক-কমার্স ক্রেতা",
        description:
          "যেকোনো রিটেইল প্যাকেজড পণ্য বা ই-কমার্স লিস্টিং URL পরীক্ষা করে ইউনিট বিক্রয় মূল্য গণনা যাচাই করুন এবং আদালত-গ্রহণযোগ্য অভিযোগ টোকেন নিন।",
        features: [
          "তাৎক্ষণিক ক্যামেরা ও URL স্ক্যানার অ্যাক্সেস",
          "Rule 6(11) ইউনিট বিক্রয় মূল্য যাচাইকরণ",
          "টেম্পার-প্রুফ e-District অভিযোগ টোকেন",
        ],
        button: "নাগরিক হিসাবে চালিয়ে যান",
      },
    },
  },
  ta: {
    auth: {
      googleAuthenticated: "Google மூலம் சரிபார்க்கப்பட்டது:",
      switchAccount: "கணக்கை மாற்றவும்",
    },
    heading: {
      title: "உங்கள் செயல்பாட்டு சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
      subtitle:
        "அதிகாரப்பூர்வ அங்கீகார நுழைவாயிலைத் திறக்க 3 சட்டப்பூர்வ செயல்பாட்டு அனுமதிகளில் ஒன்றைத் தேர்வுசெய்யவும்.",
    },
    cards: {
      lmo: {
        option: "விருப்பம் 01",
        title: "சட்ட அளவியல் அலுவலர் (LMO)",
        role: "மாநில அமலாக்கம் & சந்தை சோதனைப் பிரிவு",
        description:
          "சந்தைகளில் எதிர்பாராத ஆய்வுகளை நடத்துங்கள், 3-அடுக்கு நாணய அளவீடு மூலம் Rule 7 எழுத்துரு இணக்கத்தைக் கணக்கிடுங்கள், மற்றும் நீதிமன்றத்தில் ஏற்கத்தக்க Form-V பறிமுதல் அறிவிப்புகளை வழங்குங்கள்.",
        features: [
          "மாநில கட்டுப்படுத்தி பேட்ஜ் அங்கீகாரம்",
          "Sec 36 கூட்டுத் தண்டனை அணி",
          "நீதிமன்ற ஏற்பு BSA Sec 63 கையொப்பங்கள்",
        ],
        button: "LMO அலுவலராக தொடரவும்",
      },
      msme: {
        option: "விருப்பம் 02",
        title: "MSME பிராண்ட் உற்பத்தியாளர்",
        role: "FMCG பேக்கேஜர்கள், இறக்குமதியாளர்கள் & வடிவமைப்பாளர்கள்",
        description:
          "வணிக சிலிண்டர் பொறிப்பதற்கு முன் பேக்கேஜிங் வெக்டர் PDF-களை முன் பறப்பு ஆய்வு செய்து, அச்சு ரீகால் லட்சக்கணக்கான இழப்பைத் தவிருங்கள்.",
        features: [
          "செல்லுபடியாகும் 15-இலக்க GSTIN சரிபார்ப்பு",
          "பொறிப்புக்கு முந்தைய வெக்டர் எழுத்துரு சரிபார்ப்பு",
          "Rule 12 நிலையான மெட்ரிக் அலகு சரிபார்ப்பு",
        ],
        button: "MSME பிராண்டாக தொடரவும்",
      },
      citizen: {
        option: "விருப்பம் 03",
        title: "நுகர்வோர் குடிமகன் தணிக்கை",
        role: "பொது சில்லறை & விரைவு-வர்த்தக வாங்குபவர்கள்",
        description:
          "எந்த சில்லறை பேக்கேஜ் பொருள் அல்லது இ-காமர்ஸ் பட்டியல் URL-ஐயும் ஆய்வு செய்து யூனிட் விற்பனை விலை கணக்கீட்டை மதிப்பீடு செய்து, நீதிமன்ற ஏற்பு புகார் டோக்கன்களைப் பெறுங்கள்.",
        features: [
          "உடனடி கேமரா & URL ஸ்கேனர் அணுகல்",
          "Rule 6(11) யூனிட் விற்பனை விலை சரிபார்ப்பு",
          "சரிசெய்ய இயலா e-District புகார் டோக்கன்",
        ],
        button: "குடிமகனாக தொடரவும்",
      },
    },
  },
  te: {
    auth: {
      googleAuthenticated: "Google ద్వారా ధృవీకరించబడింది:",
      switchAccount: "ఖాతాను మార్చండి",
    },
    heading: {
      title: "మీ కార్యాచరణ ప్రొఫైల్‌ను ఎంచుకోండి",
      subtitle:
        "అధికారిక ఆమోద ద్వారం తెరవడానికి 3 చట్టబద్ధ కార్యాచరణ అనుమతులలో ఒకదాన్ని ఎంచుకోండి.",
    },
    cards: {
      lmo: {
        option: "ఎంపిక 01",
        title: "లీగల్ మెట్రాలజీ అధికారి (LMO)",
        role: "రాష్ట్ర అమలు & మార్కెట్ దాడి విభాగం",
        description:
          "మార్కెట్లలో ఆకస్మిక తనిఖీలు నిర్వహించండి, 3-స్థాయి నాణెం క్రమాంకనం ద్వారా Rule 7 ఫాంట్ సమ్మతిని లెక్కించండి, మరియు న్యాయస్థానంలో ఆమోదయోగ్యమైన Form-V స్వాధీన నోటీసులను జారీ చేయండి.",
        features: [
          "రాష్ట్ర కంట్రోలర్ బ్యాడ్జ్ అధికారం",
          "Sec 36 సమ్మేళన జరిమానా మాతృక",
          "న్యాయస్థాన ఆమోదయోగ్య BSA Sec 63 సంతకాలు",
        ],
        button: "LMO అధికారిగా కొనసాగండి",
      },
      msme: {
        option: "ఎంపిక 02",
        title: "MSME బ్రాండ్ తయారీదారు",
        role: "FMCG ప్యాకేజర్లు, దిగుమతిదారులు & డిజైనర్లు",
        description:
          "వాణిజ్య సిలిండర్ చెక్కడానికి ముందు ప్యాకేజింగ్ వెక్టర్ PDFలను ప్రీ-ఫ్లైట్ తనిఖీ చేయండి, ముద్రణ రీకాల్లలో లక్షలు ఆదా చేయండి.",
        features: [
          "చెల్లుబాటైన 15-అంకెల GSTIN ధృవీకరణ",
          "చెక్కడానికి ముందు వెక్టర్ ఫాంట్ తనిఖీ",
          "Rule 12 ప్రామాణిక మెట్రిక్ యూనిట్ ధృవీకరణ",
        ],
        button: "MSME బ్రాండ్‌గా కొనసాగండి",
      },
      citizen: {
        option: "ఎంపిక 03",
        title: "వినియోగదారు పౌరుడు ఆడిట్",
        role: "పబ్లిక్ రిటైల్ & క్విక్-కామర్స్ కొనుగోలుదారులు",
        description:
          "ఏదైనా రిటైల్ ప్యాకేజ్డ్ వస్తువు లేదా ఇ-కామర్స్ లిస్టింగ్ URLను పరిశీలించి యూనిట్ సేల్ ప్రైస్ గణితాన్ని ఆడిట్ చేయండి మరియు న్యాయస్థాన ఆమోదయోగ్య ఫిర్యాదు టోకెన్లను పొందండి.",
        features: [
          "తక్షణ కెమెరా & URL స్కానర్ యాక్సెస్",
          "Rule 6(11) యూనిట్ సేల్ ప్రైస్ ధృవీకరణ",
          "టాంపర్-ప్రూఫ్ e-District ఫిర్యాదు టోకెన్",
        ],
        button: "పౌరుడిగా కొనసాగండి",
      },
    },
  },
};