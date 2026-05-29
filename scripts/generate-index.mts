import fs from "node:fs";
import path from "node:path";

const REGISTRY_PATH = "./registry";
const OUTPUT_FILE = path.join(REGISTRY_PATH, "__index__.tsx");
const STYLE_NAME = "8starlabs-ui";
const COMPONENT_FOLDERS = [
  { folder: "blocks", type: "registry:block", targetFolder: "" },
  { folder: "examples", type: "registry:example", targetFolder: "examples" }
];

function getTargetPath(name: string, targetFolder: string) {
  return path.posix.join(
    "components",
    "8starlabs-ui",
    targetFolder,
    `${name}.tsx`
  );
}

function getComponentFiles(folderConfig: {
  folder: string;
  type: string;
  targetFolder: string;
}) {
  const { folder, type, targetFolder } = folderConfig;
  const dir = path.join(REGISTRY_PATH, STYLE_NAME, folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(
      (f) => f.endsWith(".tsx") && !f.startsWith("_") && !f.startsWith("__")
    )
    .map((f) => ({
      name: path.basename(f, ".tsx"),
      importPath: `@/registry/${STYLE_NAME}/${folder}/${f.replace(/\.tsx$/, "")}`,
      filePath: `registry/${STYLE_NAME}/${folder}/${f}`,
      type,
      target: getTargetPath(path.basename(f, ".tsx"), targetFolder)
    }));
}

const allComponents: {
  name: string;
  importPath: string;
  filePath: string;
  type: string;
  target: string;
}[] = [];

for (const folderConfig of COMPONENT_FOLDERS) {
  allComponents.push(...getComponentFiles(folderConfig));
}

let imports = "";
let indexEntries = "";

for (const { name, importPath, filePath, type, target } of allComponents) {
  const varName = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_component`;
  imports +=
    name === "button"
      ? `import { Button as ${varName} } from "${importPath}";\n`
      : `import ${varName} from "${importPath}";\n`;
  indexEntries += `    "${name}": {
      name: "${name}",
      type: "${type}",
      files: [{
        path: "${filePath}",
        type: "${type}",
        target: "${target}"
      }],
      component: ${varName}
    },\n`;
}

const fileContent = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
${imports}
export const Index: Record<string, any> = {
  "${STYLE_NAME}": {
${indexEntries}  }
};
`;

fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
console.log(`✅ Generated ${OUTPUT_FILE}`);
console.log(
  `📁 Processed folders: ${COMPONENT_FOLDERS.map((c) => c.folder).join(", ")}`
);
console.log(`📦 Total components: ${allComponents.length}`);
