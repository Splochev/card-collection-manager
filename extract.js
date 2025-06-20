const fs = require("fs");
const path = require("path");

/**
 * Extracts TypeScript files and folder structure from a specified directory
 * and writes the content to a text file.
 * This script is designed to be run in a Node.js environment.
 * It can be used for both server and client directories.
 * Helps with code extraction for documentation, analysis purposes or LLM context.
 * Usage:
 * node extractCode.js <folderName>
 * Example:
 * node extractCode.js server
 * node extractCode.js client
 */

const folderArg = process.argv[2];
if (!folderArg) {
  console.error("Please provide a folder name as an argument.");
  process.exit(1);
}

const targetFolder = path.join(__dirname, folderArg);
const outputFile = path.join(__dirname, "extractedData.md");
const SUPPORTED_NON_TS_FILES = {
  client: [
    ".vscode",
    "src",
    ".editorconfig",
    ".prettierrc.json",
    "env.d.ts",
    "eslint.config.ts",
    "index.html",
    "package.json",
    "tsconfig.app.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "tsconfig.vitest.json",
    "vite.config.ts",
    "vitest.config.ts"
  ],
  server: ["tsconfig.json", "package.json"],
};
const SKIPS = ["node_modules", "dist", ".git"];

function getAllTsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!SKIPS.includes(file)) {
        results = results.concat(getAllTsFiles(filePath));
      }
    } else if (
      file.endsWith(".ts") ||
      SUPPORTED_NON_TS_FILES[folderArg].includes(file)
    ) {
      results.push(filePath);
    }
  });
  return results;
}

function logFolderStructure(dir, indent = "") {
  let structure = "";
  const list = fs.readdirSync(dir);
  list.forEach((file, index) => {
    if (SKIPS.includes(file)) {
      return;
    }

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isLast = index === list.length - 1;
    const prefix = isLast ? "-- " : "|-- ";

    if (stat.isDirectory()) {
      structure += `${indent}${prefix}${file}/\n`;
      structure += logFolderStructure(
        filePath,
        `${indent}${isLast ? "    " : "|   "}`
      );
    } else {
      structure += `${indent}${prefix}${file}\n`;
    }
  });
  return structure;
}

function extractAndWriteData() {
  const folderStructure = logFolderStructure(targetFolder);
  const tsFiles = getAllTsFiles(targetFolder);
  let outputContent = `# Folder structure:\n${folderStructure}\n\n`;

  tsFiles.forEach((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    outputContent += `# ${filePath}\n`;
    outputContent += `${fileContent}\n\n`;
  });

  fs.writeFileSync(outputFile, outputContent, "utf-8");
  console.info(`Data extracted and written to ${outputFile}`);
}

extractAndWriteData();
