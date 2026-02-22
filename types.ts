
export type Language = 'en' | 'he';

export enum PrototypeType {
  LANDING_PAGE = 'Landing Page',
  PORTFOLIO = 'Portfolio',
  ECOMMERCE = 'E-commerce',
  SAAS_DASHBOARD = 'SaaS Dashboard',
  BLOG = 'Blog',
  MEMORIAL = 'Memorial Site'
}

export interface SiteConfig {
  name: string;
  projectName?: string;
  email?: string;
  prototype: PrototypeType;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  concept?: string;
  description: string;
  features: string[];
  mongodbUri?: string;
  backblazeKey?: string;
  contactEmail: string;
  language: Language;
  prototypeType?: string;
  // Memorial Specific Fields
  deceasedName?: string;
  dateOfPassing?: string;
  hebrewDate?: string;
  relationship?: string;
  spiritualText?: string; // e.g., Psalms or Ashkava
  appName?: string;
  yearsLife?: string;
  hebrewYears?: string;
  motto?: string;
  milestones?: Milestone[];
  memorialImage?: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerationResult {
  files: GeneratedFile[];
  instructions: string;
}
