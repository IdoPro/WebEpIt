
import { PrototypeType, Language } from './types';

export interface Prototype {
  id: PrototypeType;
  title: { en: string; he: string };
  description: { en: string; he: string };
  icon: string;
  features: { en: string[]; he: string[] };
}

export const PROTOTYPES: Prototype[] = [
  {
    id: PrototypeType.MEMORIAL,
    title: { en: 'Memorial Site', he: 'אתר הנצחה וזיכרון' },
    description: { en: 'A dignified space to honor a loved one and share memories.', he: 'מרחב מכובד להנצחת אדם יקר, שיתוף זיכרונות ופרטי אזכרה.' },
    icon: '🕯️',
    features: {
      en: ['Life Story', 'Digital Candle', 'Location (Waze)', 'Guestbook', 'Psalms Section', 'Yahrzeit Reminder'],
      he: ['סיפור חיים', 'הדלקת נר וירטואלי', 'מיקום אזכרה (Waze)', 'ספר תנחומים', 'פרקי תהילים', 'תזכורת יארצייט']
    }
  },
  {
    id: PrototypeType.LANDING_PAGE,
    title: { en: 'SaaS Landing Page', he: 'דף נחיתה SaaS' },
    description: { en: 'Optimized for conversions with high-quality components.', he: 'מותאם להמרות עם רכיבים באיכות גבוהה.' },
    icon: '⚡',
    features: {
      en: ['Hero Section', 'Feature Grid', 'Pricing', 'Testimonials', 'Contact'],
      he: ['אזור Hero', 'רשת פיצ׳רים', 'מחירון', 'המלצות', 'צור קשר']
    }
  },
  {
    id: PrototypeType.ECOMMERCE,
    title: { en: 'Direct Storefront', he: 'חנות ישירה (Direct)' },
    description: { en: 'Complete commerce solution with cart and checkout logic.', he: 'פתרון מסחר מלא עם לוגיקת עגלה ותשלום.' },
    icon: '🛍️',
    features: {
      en: ['Catalog', 'Cart System', 'Checkout', 'User Profile', 'Stripe Ready'],
      he: ['קטלוג מוצרים', 'מערכת עגלה', 'תהליך תשלום', 'פרופיל משתמש', 'מוכן ל-Stripe']
    }
  },
  {
    id: PrototypeType.PORTFOLIO,
    title: { en: 'Studio Portfolio', he: 'תיק עבודות סטודיו' },
    description: { en: 'Showcase your creative projects in a minimalist layout.', he: 'הצג פרויקטים יצירתיים בפריסה מינימליסטית.' },
    icon: '✨',
    features: {
      en: ['Masonry Gallery', 'Project Pages', 'About', 'Contact', 'Blog'],
      he: ['גלריית מסונרי', 'דפי פרויקט', 'אודות', 'יצירת קשר', 'בלוג']
    }
  },
  {
    id: PrototypeType.SAAS_DASHBOARD,
    title: { en: 'Enterprise Admin', he: 'מערכת ניהול ארגונית' },
    description: { en: 'Powerful dashboard with complex data visualization.', he: 'לוח בקרה עוצמתי עם ויזואליזציה של נתונים מורכבים.' },
    icon: '🛡️',
    features: {
      en: ['Analytics', 'CRM Tables', 'Settings', 'Auth Flow', 'Sidebar UI'],
      he: ['אנליטיקה', 'טבלאות CRM', 'הגדרות', 'תהליך התחברות', 'ממשק תפריט צד']
    }
  }
];

// Premium, dignified color palette for memorial websites
export const COLORS = [
  { name: 'Charcoal', value: '#2c3e50' },
  { name: 'Slate Blue', value: '#475569' },
  { name: 'Stone', value: '#78716c' },
  { name: 'Sage', value: '#6b7280' },
  { name: 'Rose Gold', value: '#8b6f47' },
  { name: 'Violet', value: '#6b5b95' },
];

export const UI_STRINGS = {
  en: {
    // Landing Page (Step 1)
    heroTitle: 'A Living Memorial for Those We Cherish',
    heroSub: 'Create a beautiful, meaningful space to honor your loved one, preserve their legacy, and unite your family in remembrance.',
    heroCtaPrimary: 'Begin Memorial',
    heroCtaSecondary: 'View Example',
    
    // Value Propositions
    valueSimple: 'Remarkably Simple',
    valueSimpleDesc: 'No technical skills needed. Build a complete memorial website in under an hour with our intuitive interface.',
    valuePowerful: 'Profoundly Meaningful',
    valuePowerfulDesc: 'Share life stories, memories, spiritual texts, and create a sacred space for your family to gather and remember.',
    valueLasting: 'Permanent Legacy',
    valueLastingDesc: 'Your memorial lives forever. A lasting digital tribute that future generations can discover and cherish.',
    
    // Testimonials
    testimonialTitle: 'Families have created beautiful legacies',
    testimonialSubtitle: "Hear from families who've honored their loved ones",
    
    // Step 2
    configureBtn: 'Create My Memorial',
    customizeTitle: 'Design Your Memorial',
    customizeSub: 'Personalize every detail to reflect the life and legacy of your loved one.',
    back: 'Back',
    projectName: 'Deceased\'s Full Name',
    projectNamePlaceholder: 'e.g., Sarah Cohen',
    brandColors: 'Primary Color Theme',
    description: 'Life Summary & Legacy',
    descriptionPlaceholder: 'Share the essence of their life, their values, and what made them special...',
    features: 'Memorial Features',
    integrations: 'Backend & Storage',
    buildBtn: 'Create & Deploy Memorial',
    generating: 'Creating your memorial...',
    success: 'Memorial Created! 🕯️',
    successSub: 'Your memorial is now live and ready to share with family and loved ones.',
    another: 'Create Another Memorial',
    step: 'Step',
    of: 'of',
    projectFiles: 'Source Code',
    deployGuide: 'Setup Guide',
    copy: 'Copy',
    copied: 'Copied!',
    nextSteps: 'Next Steps',
    nextStepsList: [
      '1. Share the memorial link with family and friends',
      '2. Customize with photos and memories',
      '3. Enable guest contributions in settings',
      '4. Set up Yahrzeit reminders'
    ],
    // Memorial Specific
    deceasedName: 'Full Name of the Deceased',
    dateOfPassing: 'Date of Passing',
    hebrewDate: 'Hebrew Date (e.g., כ"א בתשרי)',
    relationship: 'Your Relationship',
    spiritualText: 'Spiritual Text / Prayer'
  },
  he: {
    // דף הנחיתה (שלב 1)
    heroTitle: 'מרחב חי להנצחת אהוביינו',
    heroSub: 'בנו מרחב יפה ומשמעותי לכבוד אדם יקר, שימור מורשת המשפחה, ושיתוף טלטל הזיכרונות.',
    heroCtaPrimary: 'התחל אתר הנצחה',
    heroCtaSecondary: 'צפה בדוגמה',
    
    // הצעות ערך
    valueSimple: 'פשוט להפליא',
    valueSimpleDesc: 'לא צריך ידע טכני. בנו אתר הנצחה מלא תוך שעה באמצעות הממשק האינטואיטיבי שלנו.',
    valuePowerful: 'משמעותי עמוקות',
    valuePowerfulDesc: 'שתפו סיפורי חיים, זיכרונות, טקסטים רוחניים, ובנו מרחב קדוש למשפחה להתכנס וללזכור.',
    valueLasting: 'מורשת נצחית',
    valueLastingDesc: 'ההנצחה שלכם חיה לעד. זיכרון דיגיטלי קבוע שדורות עתידיים יוכלו לגלות ולהעריך.',
    
    // ממליצים
    testimonialTitle: 'משפחות יצרו מורשות יפות',
    testimonialSubtitle: "שמעו ממשפחות שהנציחו את אהוביהן",
    
    // שלב 2
    configureBtn: 'בנו את ההנצחה שלי',
    customizeTitle: 'עיצוב ההנצחה שלך',
    customizeSub: 'התאם כל פרט כדי לשקף את חיי המנוח/ה והמורשת שלהם.',
    back: 'חזור',
    projectName: 'שם מלא של המנוח/ה',
    projectNamePlaceholder: 'לדוגמה, שרה כהן',
    brandColors: 'צבע נושא',
    description: 'סיכום חיים ומורשה',
    descriptionPlaceholder: 'שתפו את מהות חייהם, הערכים שלהם, ומה שהופך אותם למיוחדים...',
    features: 'פיצ׳רים בהנצחה',
    integrations: 'שרת ואחסון',
    buildBtn: 'בנו ופרסמו את ההנצחה',
    generating: 'בונה את ההנצחה שלך...',
    success: 'ההנצחה נוצרה! 🕯️',
    successSub: 'ההנצחה שלך עכשיו חיה והיא מוכנה להשתתפות עם משפחה ויקיריםם.',
    another: 'בנו הנצחה נוספת',
    step: 'שלב',
    of: 'מתוך',
    projectFiles: 'קוד מקור',
    deployGuide: 'מדריך הגדרה',
    copy: 'העתק',
    copied: 'הועתק!',
    nextSteps: 'שלבים הבאים',
    nextStepsList: [
      '1. שתפו את קישור ההנצחה עם משפחה וחברים',
      '2. התאימו עם תמונות וזיכרונות',
      '3. אפשרו תרומות של אורחים בהגדרות',
      '4. הגדרו תזכורות לימי יארצייט'
    ],
    // Memorial Specific
    deceasedName: 'שם מלא של המנוח/ה',
    dateOfPassing: 'תאריך פטירה (לועזי)',
    hebrewDate: 'תאריך עברי (לדוגמה: כ"א בתשרי)',
    relationship: 'קרבה משפחתית',
    spiritualText: 'טקסט רוחני / תפילה'
  }
};

// Testimonials for the landing page
export const TESTIMONIALS = [
  {
    name: { en: 'Rachel M.', he: 'רחל מ.' },
    relationship: { en: 'Daughter', he: 'בת' },
    quote: { 
      en: "Creating this memorial for my mother brought our whole family together. It's been almost a year, and people still visit to share memories and light a candle.", 
      he: "יצירת ההנצחה עבור אמא שלי איחדה את כל המשפחה. כמעט שנה עברה, ועדיין אנשים מבקרים כדי לשתף זיכרונות ולהדליק נר."
    }
  },
  {
    name: { en: 'David & Miriam K.', he: 'דוד ומרים כ.' },
    relationship: { en: 'Daughter & Son-in-law', he: 'בת וחתן' },
    quote: { 
      en: "The process was so simple. Within an hour, we had a beautiful, permanent home for dad's stories and legacy. It feels like a spiritual act.", 
      he: "התהליך היה כל כך פשוט. תוך שעה, היה לנו בית יפה וקבוע לסיפורי אבא והמורשת שלו. זה מרגיש כמו מעשה רוחני."
    }
  },
  {
    name: { en: 'Yeshua F.', he: 'ישועה ף.' },
    relationship: { en: 'Sons', he: 'בנים' },
    quote: { 
      en: "Every family member, even those overseas, can gather here and feel connected. It's a blessing that will be passed down to our children.", 
      he: "כל חברי משפחה, אפילו אלה בחו״ל, יכולים להתכנס כאן ולהרגיש קשורים. זה ברכה שתיעבור לילדינו."
    }
  }
];
