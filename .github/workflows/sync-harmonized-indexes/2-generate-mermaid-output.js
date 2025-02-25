const fs = require("fs").promises;
const path = require("path");
const { generateMermaidDiagrams } = require("./2-generate-mermaid-diagrams");
const currentDir = __dirname;

// valid values: `templates` or `indexes`
const config = {
  sourceFile: currentDir + "/templates.json",
  outputFile: currentDir + "/templates.md",
};
async function generateMermaidOutput() {
  const { sourceFile, outputFile } = config;

  // Read all files from directory
  const schema = await fs.readFile(sourceFile, "utf8");

  // Filter for .json files and process each
  const output = generateMermaidDiagrams(JSON.parse(schema));

  await fs.writeFile(outputFile, output);
}

generateMermaidOutput();
