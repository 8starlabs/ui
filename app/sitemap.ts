import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ui.8starlabs.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: "https://ui.8starlabs.com/docs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: "https://ui.8starlabs.com/docs/components",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://ui.8starlabs.com/docs/setup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://ui.8starlabs.com/docs/usage",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://ui.8starlabs.com/docs/troubleshooting",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://ui.8starlabs.com/docs/components/scroll-fade",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/status-indicator",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/system-banner",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/timeline",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/transport-badge",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/partition-bar",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/flip-clock",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://ui.8starlabs.com/docs/components/heatmap",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];
}
