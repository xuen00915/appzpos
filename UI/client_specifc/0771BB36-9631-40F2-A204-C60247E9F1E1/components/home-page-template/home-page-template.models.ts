export type HomeLanguage = 'en' | 'zh';

export type HomeCtaConfig =
  | {
      readonly kind: 'action';
      readonly action: 'request-demo';
      readonly label: string;
      readonly trackingClass?: string;
    }
  | {
      readonly kind: 'link';
      readonly href: string;
      readonly label: string;
      readonly target?: '_blank' | '_self';
      readonly rel?: string;
      readonly trackingClass?: string;
    };

export interface HomeHeroIndustry {
  readonly id: string;
  readonly label: string;
  readonly eyebrow?: string;
  readonly workspaceTitle?: string;
  readonly screenImage: string;
  readonly modules: readonly string[];
}

export type HomeHeroVisual =
  | {
      readonly kind: 'product-showcase';
      readonly hardwareImage: string;
      readonly hardwareAlt: string;
      readonly hardwareWidth: number;
      readonly hardwareHeight: number;
      readonly brandImage?: string;
      readonly industries: readonly HomeHeroIndustry[];
    }
  | {
      readonly kind: 'responsive-image';
      readonly desktopSrc: string;
      readonly mobileSrc: string;
      readonly alt: string;
      readonly width: number;
      readonly height: number;
    };

export interface HomeHeroConfig {
  readonly headingId: string;
  readonly title: string;
  readonly titleAccent?: string;
  readonly description: string;
  readonly visual: HomeHeroVisual;
  readonly ctas: readonly HomeCtaConfig[];
  readonly industryTabLabel?: string;
  readonly industryStatusPrefix?: string;
}

export interface HomeSolutionFeature {
  readonly label: string;
  readonly description: string;
}

export interface HomeSolutionItem {
  readonly id: string;
  readonly title: string;
  readonly moduleTitle: string;
  readonly summary: string;
  readonly route: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly ariaLabel: string;
  readonly features: readonly HomeSolutionFeature[];
  readonly depth?: number;
  readonly legacyImages?: readonly string[];
}

export interface HomeSolutionsConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly items: readonly HomeSolutionItem[];
  readonly initialItemId: string;
  readonly learnMoreLabel: string;
  readonly productOrder?: readonly string[];
}

export interface HomeStoryBullet {
  readonly label?: string;
  readonly text: string;
}

export interface HomeStorySectionConfig {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly HomeStoryBullet[];
  readonly image: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly imagePosition?: 'left' | 'right';
  readonly cta?: HomeCtaConfig;
}

export interface HomeGrantConfig {
  readonly title: string;
  readonly secondaryTitle?: string;
  readonly paragraphs: readonly string[];
  readonly image: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly cta: Extract<HomeCtaConfig, { kind: 'link' }>;
  readonly secondaryImage?: string;
  readonly secondaryImageAlt?: string;
  readonly secondaryImageWidth?: number;
  readonly secondaryImageHeight?: number;
}

export interface HomeHardwareConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly image: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly cta?: Extract<HomeCtaConfig, { kind: 'link' }>;
}

export interface HomeFeatureItem {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly iconAlt: string;
  readonly points: readonly string[];
}

export interface HomeFeatureSectionConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly items: readonly HomeFeatureItem[];
}

export interface HomeGrowthItem {
  readonly label: string;
  readonly text: string;
  readonly iconClass: string;
}

export interface HomeGrowthSectionConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly items: readonly HomeGrowthItem[];
}

export interface HomeIndustryModule {
  readonly id: string;
  readonly title: string;
}

export interface HomeIndustryStory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
  readonly href: string;
  readonly modules: readonly string[];
}

export interface HomeIndustrySectionConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly moreInfoLabel: string;
  readonly stories: readonly HomeIndustryStory[];
  readonly modules: readonly HomeIndustryModule[];
}

export interface HomeCustomerLogo {
  readonly image: string;
  readonly alt: string;
}

export interface HomeTestimonial {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly role?: string;
  readonly logo?: string;
  readonly logoAlt?: string;
}

export interface HomeProofConfig {
  readonly customersTitle?: string;
  readonly showAllLabel?: string;
  readonly customers: readonly HomeCustomerLogo[];
  readonly testimonialTitle?: string;
  readonly testimonialDescription?: string;
  readonly testimonials?: readonly HomeTestimonial[];
  readonly showMoreLabel?: string;
  readonly showLessLabel?: string;
  readonly reviewCta?: Extract<HomeCtaConfig, { kind: 'link' }>;
  readonly closeDialogLabel?: string;
}

export interface HomeConversionConfig {
  readonly locale: HomeLanguage;
  readonly sectionId: string;
}

export interface HomeFloatingContact {
  readonly href: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly target?: '_blank' | '_self';
  readonly rel?: string;
}

export interface HomePageTemplateConfig {
  readonly language: HomeLanguage;
  readonly layout?: 'default' | 'english-landing';
  readonly hero: HomeHeroConfig;
  readonly solutions?: HomeSolutionsConfig;
  readonly storySections?: readonly HomeStorySectionConfig[];
  readonly hardware?: HomeHardwareConfig;
  readonly growth?: HomeGrowthSectionConfig;
  readonly grant?: HomeGrantConfig;
  readonly features?: HomeFeatureSectionConfig;
  readonly industries?: HomeIndustrySectionConfig;
  readonly proof?: HomeProofConfig;
  readonly conversion?: HomeConversionConfig;
  readonly floatingContacts?: readonly HomeFloatingContact[];
}
