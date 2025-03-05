const fs = require("fs").promises;
const path = require("path");
const currentDir = __dirname;

// valid values: `templates` or `indexes`
const config = {
  sourceDirectoryPath: currentDir + "/templates",
  outputFile: currentDir + "/templates.json",
};

// Combines independent JSON files in a directory into one JSON file,
//   for ease of processing.
async function combineSources() {
  // Read all files from directory
  const files = await fs.readdir(config.sourceDirectoryPath);

  // Filter for .json files and process each
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const combined = {};

  for (const file of jsonFiles) {
    const content = await fs.readFile(
      path.join(config.sourceDirectoryPath, file),
      "utf8"
    );

    // Use filename without extension as key
    const key = path.basename(file, ".json");
    combined[key] = JSON.parse(content);
  }

  // Write combined object to new file
  await fs.writeFile(config.outputFile, JSON.stringify(combined, null, 2));

  return combined;
}

combineSources();

module.exports = { combineSources };
