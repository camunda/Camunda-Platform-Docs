---
id: overview
title: "Overview"
description: "An overview about possible databases"
---

To service applications like Operate, Tasklist and the Camunda REST API with data, Camunda 8 requires a database. This database stores data for all processes, processInstances, decisions, tasks, users etc.

Camunda 8 supports the following databases:

## Document based databases

TODO: Add more text about behavior and limitations?

Document based databases like ElasticSearch and OpenSearch

## Relational databases

TODO: Decide which minimal version is supported

Currently, the following relational databases are officially supported:

- PostgreSQL (17+)
- Oracle (23+)
- MariaDB (11.6+)
- H2 (2.3)

To use and configure an RDBMS as storage backend, follow the instructions in the [Configuration](./relational-db/configuration.md) section.

### Limitations

When using a relational database as storage backend, the following limitations apply:

- **ID size limit:** The length of various string properties is limited to 255 characters. Trying to store a value with more than 400 characters will result in an error. Note, that the Zeebe broker itself does not have this limitation and will not reject entities with longer IDs. This size limit applies to:
  - `id` properties like processDefinitionId, decisionDefinitionId...)
  - `name` properties like username, processDefinitionName
- **Comparing / sorting variables:**
  - When using the Camunda REST API to fetch and filter for variables, the comparison operations are only applied on the first 8191 characters of a String or JSON variable value (4000 when using OracleDB). The LIKE operator is not affected by this limitation.
  - **OracleDB:** When using the Camunda REST API to fetch variables, by default longer variables will be truncated to 4000 characters instead of 8191 with other database vendors or when using document databases.

#### Variables

[The Camunda REST API](./../../../../apis-tools/camunda-api-rest/camunda-api-rest-overview) allows to fetch and filter for [Variables](./../../../../apis-tools/camunda-api-rest/specifications/get-variable).
To keep the API performant, the following comparison operations are only applied on the first 4000 characters of a String or JSON variable value:

- equals
- notEquals
- in
- notIn

The LIKE operator is not affected by this limitation.
