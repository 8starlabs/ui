/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

interface Organization {
  name: string;
  logo: string;
  alt: string;
  url: string;
  utm: Record<string, any>;
  className?: string;
}

interface TrustedByProps {
  className?: string;
}

const organizations: Organization[] = [
  {
    name: "Formo",
    logo: "/svgs/formo_logo.svg",
    alt: "Formo Logo",
    url: "https://formo.so",
    utm: {
      utm_source: "ui.8starlabs.com",
      utm_medium: "referral",
      utm_campaign: "8sl_ui_trusted_by"
    },
    className: "scale-75"
  },
  {
    name: "Kurtosis Labs",
    logo: "/images/kurtosis-labs_logo.png",
    alt: "Kurtosis Labs Logo",
    url: "https://kurtosis-labs.com",
    utm: {
      utm_source: "ui.8starlabs.com",
      utm_medium: "referral",
      utm_campaign: "8sl_ui_trusted_by"
    },
    className: "scale-75"
  },
  {
    name: "The Collective",
    logo: "/images/the-collective_logo.png",
    alt: "The Collective Logo",
    url: "https://www.thecollectivefounders.com/",
    utm: {
      utm_source: "ui.8starlabs.com",
      utm_medium: "referral",
      utm_campaign: "8sl_ui_trusted_by"
    },
    className: "scale-140"
  },
  {
    name: "Resumify",
    logo: "/images/resumify_logo.png",
    alt: "Resumify Logo",
    url: "https://resumify.org",
    utm: {
      utm_source: "ui.8starlabs.com",
      utm_medium: "referral",
      utm_campaign: "8sl_ui_trusted_by"
    }
  }
  // Add more Organization here later
];

const TrustedBy = ({ className }: TrustedByProps) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className || ""}`}>
      <h2 className="text-lg font-bold text-muted-foreground">Trusted By</h2>
      <div className="flex items-center justify-center flex-wrap gap-4">
        {organizations.map((organization) => (
          <Link
            prefetch={false}
            key={organization.name}
            href={`${organization.url}?${new URLSearchParams(organization.utm).toString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-8 py-2 bg-background/50 hover:bg-background/80 transition-colors rounded-lg group cursor-pointer"
          >
            <img
              src={organization.logo}
              alt={organization.alt}
              width={180}
              height={50}
              className={`grayscale brightness-0 dark:invert opacity-80 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 dark:group-hover:invert-0 transition-all duration-300 ${organization.className || ""}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;
