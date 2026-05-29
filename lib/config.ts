export const DEV_BASE_URL = "http://localhost:3000";

export const siteConfig = {
  name: "8StarLabs UI",
  description:
    "Component library designed for developers who want niche, high-utility UI elements that you won’t find in standard libraries.",
  url: "https://ui.8starlabs.com",
  navLinks: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/components", label: "Components" },
    { href: "https://8starlabs.com/blogs", label: "Blog", external: true },
    {
      href: "https://status.8starlabs.com/",
      label: "Status",
      external: true
    }
  ],
  links: {
    github: "https://github.com/8starlabs/ui",
    status: "https://status.8starlabs.com/",
    eslNewsletter: "https://8starlabs.com#newsletter"
  },
  utm: {
    main: "https://8starlabs.com?utm_source=ui_8starlabs&utm_medium=web"
  }
};

export const api = {
  github: {
    direct: "https://api.github.com/repos/8starlabs/ui"
  }
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b"
};

export const ENVIRONMENT = process.env.NODE_ENV || "development";
