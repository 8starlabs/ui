import { siteConfig } from "@/lib/config";
import { AskAiFooter } from "@/components/ask-ai-footer";

export function SiteFooter() {
  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex min-h-(--footer-height) flex-col items-center justify-center gap-1 px-1 pt-4 pb-8 text-center">
          <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
            Engineered by{" "}
            <a
              href={siteConfig.utm.main}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              8StarLabs
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            . For AI models and bots, see{" "}
            <a
              href="/llms.txt"
              className="font-medium underline underline-offset-4"
            >
              llms.txt
            </a>
            .
          </div>
          <AskAiFooter />
        </div>
      </div>
    </footer>
  );
}
