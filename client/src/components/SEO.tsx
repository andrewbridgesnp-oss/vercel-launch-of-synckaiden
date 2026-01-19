import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEO({
  title = "Kaiden - AI Business Consultant & Automation Platform",
  description = "Approval-gated business automation that restores your time and keeps you in control. AI-powered workflows, CRM, analytics, and more.",
  image = "https://kayden-ai.manus.space/og-image.png",
  url = "https://kayden-ai.manus.space",
  type = "website",
}: SEOProps) {
  const fullTitle = title.includes("Kaiden") ? title : `${title} | Kaiden`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
