export const SITE_CONFIG = {
  name: "Thuong's Portfolio",
  description:
    "Nguyen Hoai Thuong - AI Engineer Portfolio. Open to new career opportunities in Ho Chi Minh City.",
  url: "https://thuong.dev",
  locale: "en",
  author: "Nguyen Hoai Thuong",
  openGraph: {
    type: "website" as const,
    title: "Thuong's Portfolio",
    description:
      "AI Engineer specializing in deep learning, NLP, and full-stack development.",
    siteName: "Thuong's Portfolio",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Thuong's Portfolio",
    description:
      "AI Engineer specializing in deep learning, NLP, and full-stack development.",
  },
} as const;
