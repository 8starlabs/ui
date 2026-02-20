import Image from "next/image";

import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";
import { Index } from "@/registry/__index__";

export function ComponentPreview({
  name,
  styleName = "8starlabs-ui",
  type,
  className,
  align = "center",
  hideCode = false,
  noPaddingOnComponentSource = false,
  chromeLessOnMobile = false,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  styleName?: any;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
  noPaddingOnComponentSource?: boolean;
  type?: "block" | "component" | "example";
  chromeLessOnMobile?: boolean;
}) {
  const Component = Index[styleName]?.[name]?.component;

  if (!Component) {
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        Component{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  return (
    <ComponentPreviewTabs
      className={className}
      align={align}
      hideCode={hideCode}
      noPaddingOnComponentSource={noPaddingOnComponentSource}
      component={<Component />}
      source={
        <ComponentSource
          name={name}
          collapsible={false}
          styleName={styleName}
        />
      }
      chromeLessOnMobile={chromeLessOnMobile}
      {...props}
    />
  );
}
