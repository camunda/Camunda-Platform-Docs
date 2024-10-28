const removeDuplicateVersionBadge = require("../remove-duplicate-version-badge");
const replace = require("replace-in-file");
const outputDir = "docs/apis-tools/camunda-api-rest/specifications";
const specFile = "api/camunda/camunda-openapi.yaml";
const fs = require("fs");

function preGenerateDocs() {
  const originalSpec = fs.readFileSync(specFile, "utf8");

  console.log("adjusting C8 spec file...");

  const specUpdates = [
    addDisclaimer(),
    ...redefineCreateProcessInstanceRequest(originalSpec),
    ...redefineEvaluateDecisionRequest(originalSpec),
  ];

  replace.sync({
    files: specFile,
    from: specUpdates.map((x) => x.from),
    to: specUpdates.map((x) => x.to),
  });
}

function postGenerateDocs() {
  removeDuplicateVersionBadge(`${outputDir}/camunda-8-rest-api.info.mdx`);
}

function addDisclaimer() {
  // Adds a disclaimer to the very beginning of the file, so that people know this isn't the true spec.
  return {
    from: /^/,
    to: `# Disclaimer: This is a modified version of the Camunda REST API specification, optimized for the documentation.

`,
  };
}

function redefineCreateProcessInstanceRequest(originalSpec) {
  // Redefines the CreateProcessInstanceRequest schema to describe a union of two possible request bodies.
  //   This union type does not work upstream, but we can rewrite it here to more clearly describe the schema.

  if (originalSpec.includes("CreateProcessInstanceRequestBase")) {
    // Make this a repeatable task by checking if it's run already.
    console.log("skipping redefineCreateProcessInstanceRequest...");
    return [];
  }

  // Diff created by these changes:
  //   CreateProcessInstanceRequest:
  //     type: object
  //+    oneOf:
  //+      - $ref: "#/components/schemas/CreateProcessInstanceRequestByKey"
  //+      - $ref: "#/components/schemas/CreateProcessInstanceRequestById"
  //+   CreateProcessInstanceRequestByKey:
  //+    type: object
  //+    allOf:
  //+      - $ref: "#/components/schemas/CreateProcessInstanceRequestBase"
  //     properties:
  //       processDefinitionKey:
  //         ...
  //+  CreateProcessInstanceRequestById:
  //+    type: object
  //+    allOf:
  //+      - $ref: "#/components/schemas/CreateProcessInstanceRequestBase"
  //+    properties:
  //       processDefinitionId:
  //         ...
  //       processDefinitionVersion:
  //         ...
  //+  CreateProcessInstanceRequestBase:
  //+    type: object
  //+    properties:
  //       variables:
  //         ...
  //       tenantId:
  //         ...
  //       ...

  return [
    // 1. Convert the main request to a oneOf union and define the first possible type.
    {
      // match the start of the CreateProcessInstanceRequest object
      from: /    CreateProcessInstanceRequest:\n      type: object/m,

      // append the `oneOf` declaration to define the union type.
      //   Then a definition for the first possible type, so that it includes the `processDefinitionKey` property.
      to: `    CreateProcessInstanceRequest:
      type: object
      oneOf:
        - $ref: "#/components/schemas/CreateProcessInstanceRequestByKey"
        - $ref: "#/components/schemas/CreateProcessInstanceRequestById"
    CreateProcessInstanceRequestByKey:
      type: object
      allOf:
        - $ref: "#/components/schemas/CreateProcessInstanceRequestBase"`,
    },

    // 2. Define the second possible type, to include the `processDefinitionId` property.
    {
      // match the start of the CreateProcessInstanceRequestByKey object, up until the `processDefinitionId` property (non-inclusive).
      from: /    CreateProcessInstanceRequestByKey:[\s\S]*?(?=\s*processDefinitionId:)/m,

      // append the second possible type definition, so that it includes the `processDefinitionId`.
      to: `$&
    CreateProcessInstanceRequestById:
      type: object
      allOf:
        - $ref: "#/components/schemas/CreateProcessInstanceRequestBase"
      properties:`,
    },

    // 3. Define a base type to contain the common properties, starting before the `variables` property.
    {
      // match the start of the CreateProcessInstanceRequestById object, up until the `variables` property (non-inclusive).
      from: /    CreateProcessInstanceRequestById:[\s\S]*?(?=\s*variables:)/m,
      // append the base type definition, so that it includes all remaining properties.
      to: `$&
    CreateProcessInstanceRequestBase:
      type: object
      properties:`,
    },
  ];
}

function redefineEvaluateDecisionRequest(originalSpec) {
  // Redefines the EvaluateDecisionRequest schema to describe a union of two possible request bodies.
  //   This union type does not work upstream, but we can rewrite it here to more clearly describe the schema.

  if (originalSpec.includes("EvaluateDecisionRequestBase")) {
    // Make this a repeatable task by checking if it's run already.
    console.log("skipping redefineEvaluateDecisionRequest...");
    return [];
  }

  // Diff created by these changes:
  //   EvaluateDecisionRequest:
  //     type: object
  //+    oneOf:
  //+      - $ref: "#/components/schemas/EvaluateDecisionRequestByKey"
  //+      - $ref: "#/components/schemas/EvaluateDecisionRequestById"
  //+  EvaluateDecisionRequestByKey:
  //+    type: object
  //+    allOf:
  //+      - $ref: "#/components/schemas/EvaluateDecisionRequestBase"
  //     properties:
  //       decisionDefinitionKey:
  //         ...
  //+  EvaluateDecisionRequestById:
  //+    type: object
  //+    allOf:
  //+      - $ref: "#/components/schemas/EvaluateDecisionRequestBase"
  //+    properties:
  //       decisionDefinitionId:
  //         ...
  //+  EvaluateDecisionRequestBase:
  //+    type: object
  //+    properties:
  //       variables:
  //         ...
  //       tenantId:
  //         ...
  //       ...

  return [
    // 1. Convert the main request to a oneOf union and define the first possible type.
    {
      // match the start of the EvaluateDecisionRequest object
      from: /    EvaluateDecisionRequest:\n      type: object/m,

      // append the `oneOf` declaration to define the union type.
      //   Then a definition for the first possible type, so that it includes the `decisionDefinitionKey` property.
      to: `    EvaluateDecisionRequest:
      type: object
      oneOf:
        - $ref: "#/components/schemas/EvaluateDecisionRequestByKey"
        - $ref: "#/components/schemas/EvaluateDecisionRequestById"
    EvaluateDecisionRequestByKey:
      type: object
      allOf:
        - $ref: "#/components/schemas/EvaluateDecisionRequestBase"`,
    },

    // 2. Define the second possible type, to include the `decisionDefinitionId` property.
    {
      // match the start of the EvaluateDecisionRequestByKey object, up until the `decisionDefinitionId` property (non-inclusive).
      from: /    EvaluateDecisionRequestByKey:[\s\S]*?(?=\s*decisionDefinitionId:)/m,

      // append the second possible type definition, so that it includes the `decisionDefinitionId`.
      to: `$&
    EvaluateDecisionRequestById:
      type: object
      allOf:
        - $ref: "#/components/schemas/EvaluateDecisionRequestBase"
      properties:`,
    },

    // 3. Define a base type to contain the common properties, starting before the `variables` property.
    {
      // match the start of the CreateProcessInstanceRequestById object, up until the `variables` property (non-inclusive).
      from: /    EvaluateDecisionRequestById:[\s\S]*?(?=\s*variables:)/m,
      // append the base type definition, so that it includes all remaining properties.
      to: `$&
    EvaluateDecisionRequestBase:
      type: object
      properties:`,
    },
  ];
}

module.exports = {
  outputDir,
  preGenerateDocs,
  postGenerateDocs,
};
