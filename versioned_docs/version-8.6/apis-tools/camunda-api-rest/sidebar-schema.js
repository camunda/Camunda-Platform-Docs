/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = {
  "Camunda 8 API (REST)": [
    "apis-tools/camunda-api-rest/camunda-api-rest-overview",
    "apis-tools/camunda-api-rest/camunda-api-rest-authentication",
    "apis-tools/camunda-api-rest/camunda-8-api-tutorial",
    {
      Specifications: require("./specifications/sidebar.js"),
    },
  ],
};
