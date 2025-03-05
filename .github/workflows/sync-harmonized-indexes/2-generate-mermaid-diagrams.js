function generateMermaidDiagrams(schema) {
  const batches = batchItems(Object.entries(schema), 3);

  return batches
    .map((batch) => generateMermaidDiagram(generateEntities(batch).join("\n")))
    .join("\n");
}

function batchItems(items, batchSize) {
  return Array.from(
    { length: Math.ceil(items.length / batchSize) },
    (_, index) => items.slice(index * batchSize, index * batchSize + batchSize)
  );
}

function generateMermaidDiagram(content) {
  return `\`\`\`mermaid
erDiagram
${content}
\`\`\`
`;
}

function generateEntities(items) {
  return items
    .map((x) => {
      const [schemaName, definition] = x;
      return generateEntity(schemaName, definition.mappings.properties);
    })
    .flat();
}

function generateEntity(entityName, properties) {
  const mappedProperties = Object.entries(properties).reduce(
    (acc, currentProperty) => {
      const { currentEntityProps, extraEntities } = acc;

      const [propName, propDefinition] = currentProperty;
      const { type } = propDefinition;

      if (type === "object" && propDefinition.properties !== undefined) {
        extraEntities.push(generateEntity(propName, propDefinition.properties));
        extraEntities.push(generateRelationship(propName, entityName));
      } else {
        currentEntityProps.push(`        ${type} ${propName}`);
      }

      return { currentEntityProps, extraEntities };
    },
    { currentEntityProps: [], extraEntities: [] }
  );

  const { currentEntityProps, extraEntities } = mappedProperties;
  const currentEntity = `
    ${entityName} {
${currentEntityProps.join("\n")}
    }`;

  return [currentEntity, ...extraEntities];
}

function generateRelationship(childEntity, parentEntity) {
  return `    ${parentEntity} ||--o{ ${childEntity} : has`;
}

module.exports = {
  generateMermaidDiagrams,
};
