
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

export const COLORS = [
  { name: 'Slate', value: '#334155' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Stone', value: '#78716c' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#f59e0b' },
];

export const UI_STRINGS = {
  en: {
    heroTitle: 'Build Your Site in Seconds',
    heroSub: 'Choose a prototype, configure your brand, and get a production-ready React site.',
    configureBtn: 'Continue to Config',
    customizeTitle: 'Site Configuration',
    customizeSub: 'Define your content schema and backend integrations.',
    back: 'Back',
    projectName: 'Site Internal Name',
    projectNamePlaceholder: 'My Awesome Project',
    brandColors: 'Primary Brand Color',
    description: 'Site Description & Goals',
    descriptionPlaceholder: 'Describe your site purpose...',
    features: 'Select Features',
    integrations: 'Backend & Storage',
    buildBtn: 'Start Deployment',
    generating: 'Building & Deploying...',
    success: 'Site Live! 🚀',
    successSub: 'Your code is compiled and ready for deployment.',
    another: 'New Project',
    step: 'Stage',
    of: 'of',
    projectFiles: 'Source Code',
    deployGuide: 'Deployment Guide',
    copy: 'Copy',
    copied: 'Copied!',
    nextSteps: 'Production Roadmap',
    nextStepsList: ['1. Clone Generated Repository', '2. Connect Vercel Account', '3. Setup Render Web Service', '4. Map Custom Domain'],
    // Memorial Specific
    deceasedName: 'Full Name of the Deceased',
    dateOfPassing: 'Date of Passing',
    hebrewDate: 'Hebrew Date (e.g., כ"א בתשרי)',
    relationship: 'Your Relationship',
    spiritualText: 'Spiritual Text / Prayer'
  },
  he: {
    heroTitle: 'בנה את האתר שלך בשניות',
    heroSub: 'בחר אב טיפוס, הגדר את המותג שלך, וקבל אתר React מוכן לייצור.',
    configureBtn: 'המשך להגדרות',
    customizeTitle: 'הגדרות אתר',
    customizeSub: 'הגדר את סכימת התוכן וחיבורי ה-Backend.',
    back: 'חזור',
    projectName: 'שם הפרויקט (פנימי)',
    projectNamePlaceholder: 'הפרויקט המדהים שלי',
    brandColors: 'צבע מותג ראשי',
    description: 'תיאור האתר ומטרות',
    descriptionPlaceholder: 'תאר את מטרת האתר...',
    features: 'בחר פיצ׳רים',
    integrations: 'שרת ואחסון',
    buildBtn: 'התחל פריסה (Deploy)',
    generating: 'בונה ומפיץ אתר...',
    success: 'האתר באוויר! 🚀',
    successSub: 'הקוד שלך עבר קומפילציה ומוכן לשימוש.',
    another: 'פרויקט חדש',
    step: 'שלב',
    of: 'מתוך',
    projectFiles: 'קוד מקור',
    deployGuide: 'מדריך פריסה',
    copy: 'העתק',
    copied: 'הועתק!',
    nextSteps: 'מפת דרכים לייצור',
    nextStepsList: ['1. שכפל את המאגר שנוצר', '2. חבר חשבון Vercel', '3. הגדר שירות ב-Render', '4. חבר דומיין מותאם אישית'],
    // Memorial Specific
    deceasedName: 'שם המנוח/ה',
    dateOfPassing: 'תאריך פטירה (לועזי)',
    hebrewDate: 'תאריך עברי (לדוגמה: כ"א בתשרי)',
    relationship: 'קרבה משפחתית',
    spiritualText: 'טקסט רוחני / תפילה'
  }
};
