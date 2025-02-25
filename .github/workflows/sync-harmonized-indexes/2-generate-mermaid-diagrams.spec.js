// @ts-check
const { generateMermaidDiagrams } = require("./2-generate-mermaid-diagrams.js");

// /** @type {Array<import("./identify-missing-changes").VersionConfig>} */
// let versionConfig;
// /** @type {Array<string>} */
// let changedFiles;

describe("generateMermaidDiagrams", () => {
  describe("given a simple schema", () => {
    const schema = {
      "schema-name": {
        mappings: {
          properties: {
            "some-keyword": { type: "keyword" },
            "some-long": { type: "long" },
          },
        },
      },
    };

    it("renders as an erDiagram", () => {
      const result = generateMermaidDiagrams(schema);

      expect(result).toEqual(`\`\`\`mermaid
erDiagram

    schema-name {
        keyword some-keyword
        long some-long
    }
\`\`\`
`);
    });
  });

  describe("given a schema with nested properties", () => {
    const schema = {
      "schema-name": {
        mappings: {
          properties: {
            parentKeyword: {
              type: "keyword",
            },
            nestedObject: {
              type: "object",
              properties: {
                nestedKeyword: { type: "keyword" },
              },
            },
          },
        },
      },
    };

    it("renders a relationship", () => {
      const result = generateMermaidDiagrams(schema);

      expect(result).toEqual(`\`\`\`mermaid
erDiagram

    schema-name {
        keyword parentKeyword
    }

    nestedObject {
        keyword nestedKeyword
    }
    schema-name ||--o{ nestedObject : has
\`\`\`
`);
    });
  });

  describe("given many schemas", () => {
    const oneSchema = {
      mappings: {
        properties: {
          "some-keyword": { type: "keyword" },
        },
      },
    };

    const schema = {
      "schema-1": oneSchema,
      "schema-2": oneSchema,
      "schema-3": oneSchema,
      "schema-4": oneSchema,
      "schema-5": oneSchema,
      "schema-6": oneSchema,
      "schema-7": oneSchema,
    };

    it("emits multiple diagrams in batches of 3", () => {
      const result = generateMermaidDiagrams(schema);

      const sequences = [
        "mermaid",
        "erDiagram",
        "schema-1",
        "schema-2",
        "schema-3",
        "mermaid",
        "erDiagram",
        "schema-4",
        "schema-5",
        "schema-6",
        "mermaid",
        "erDiagram",
        "schema-7",
      ];

      const sequencePattern = new RegExp(sequences.join(".*"), "s");

      expect(result).toMatch(sequencePattern);
    });
  });
});
