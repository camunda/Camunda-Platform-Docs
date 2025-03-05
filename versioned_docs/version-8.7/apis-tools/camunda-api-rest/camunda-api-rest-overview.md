---
id: camunda-api-rest-overview
title: "Overview"
description: "Interact with Camunda 8 clusters. Activate jobs and run user task state operations for Camunda user tasks."
---

The Camunda 8 REST API is a REST API designed to interact with a Camunda 8 cluster.

:::note
Ensure you [authenticate](./camunda-api-rest-authentication.md) before accessing the Camunda 8 REST API.
:::

## Context paths

### SaaS

Find your **region Id** and **cluster Id** under **Connection information** in your client credentials (revealed when you click on your client under the **API** tab within your cluster).

Example path: `https://${REGION_ID}.zeebe.camunda.io:443/${CLUSTER_ID}/v2/`

### Self-Managed

The context path should match the host and path defined in your Zeebe Gateway [configuration](/self-managed/setup/guides/ingress-setup.md). The path used here is the default.

Example path: `http://localhost:8080/v2/`

## API Explorer

See [the interactive Camunda 8 REST API Explorer][camunda-api-explorer] for specifications, example requests and responses, and code samples of interacting with the Camunda 8 REST API.

### Deployment API

You can change the `maxMessageSize` default value of 4MB in the [Gateway](../../self-managed/zeebe-deployment/configuration/gateway.md#zeebegatewaynetwork) and [Broker](../../self-managed/zeebe-deployment/configuration/broker.md#zeebebrokernetwork) configuration.

If you do change this value, it is recommended that you also configure the [Deploy resources](./specifications/deploy-resources.api.mdx) REST endpoint appropriately. By default, this endpoint allows single file upload and overall data up to 4MB.

You can adjust this configuration via the following properties:

```properties
spring.servlet.multipart.max-file-size=4MB
spring.servlet.multipart.max-request-size=4MB
```

For example, if you increase the `maxMessageSize` to 10MB, increase these property values to 10MB as well.

### Query API

:::danger
Query API endpoints do not currently support [resource authorizations][], and can be used to expand user access to restricted resources. If you use resource permissions, allowing public access to those endpoints is not recommended.
:::

All Query API endpoints contain an `(alpha)` declaration. Those endpoints are not accessible by default in Camunda 8 clusters.

You can enable the [alpha feature][] search endpoints by setting either the configuration property `camunda.rest.query.enabled` to `true`,
or the environment variable `CAMUNDA_REST_QUERY_ENABLED` to `true`.

## API Key Attributes

OpenAPI key attributes have a `key` suffix, and they serve as the technical unique identifier for entities, such as
`processDefinitionKey` and `tenantKey`, with `correlationKey` being the only exception. Those attributes are of type
`string` by default. In previous versions, key attributes were defined as `integer (int64)` by default.

To support a gradual change and provide users with enough time, we have introduced new content types in our API
specification. With these content types, users can specifically tell our API to accept and return `integer (int64)` or
`string` key attributes.

:::info Deprecation
Objects with key attributes as `integer (int64)`, and the content types associated with them, are deprecated and **will be removed
in the next minor release**.
:::

### Content Type Headers

We support the following 3 content types in C8 API:

- `application/json`:
  - Endpoints accept and return objects with key attributes as default `string`.
- `application/vnd.camunda.api.keys.number+json`:
  - Endpoints accept and return objects with key attributes as `integer (int64)`.
  - **This content type will be removed with the next minor release.**
- `application/vnd.camunda.api.keys.string+json`:
  - Endpoints accept and return objects with key attributes as `string`.
  - Same as `application/json`.
  - **This content type will be removed with the next minor release.**

Combining multiple headers is not supported.

### Object Naming

The naming of the new objects containing key attributes as `string` is defined according to the following pattern:

- Response objects are always called with a `*Result` postfix. For instance:
  - `UserTaskSearchQueryResponse` with `integer (int64)` keys.
  - `UserTaskSearchQueryResult` with `string` keys.
- Request object name postfixes change depending on their function:
  - Search queries: `*SearchQuery`. For instance:
    - `ProcessInstanceSearchQueryRequest` with `integer (int64)` keys.
    - `ProcessInstanceSearchQuery` with `string` keys.
  - Filters: `*Filter`. For instance:
    - `FlowNodeInstanceFilterRequest` with `integer (int64)` keys.
    - `FlowNodeInstanceFilter` with `string` keys.
  - Other payloads: `*Instruction`. For instance:
    - `EvaluateDecisionRequest` with `integer (int64)` keys.
    - `DecisionEvaluationInstruction` with `string` keys.

See [the interactive Camunda 8 REST API Explorer][camunda-api-explorer] for more details.

[camunda-api-explorer]: ./specifications/camunda-8-rest-api.info.mdx
[resource authorizations]: /self-managed/concepts/access-control/resource-authorizations.md
[alpha feature]: /components/early-access/alpha/alpha-features.md
