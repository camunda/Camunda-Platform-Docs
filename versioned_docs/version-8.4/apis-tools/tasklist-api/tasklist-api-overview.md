---
id: tasklist-api-overview
title: Overview
slug: /apis-tools/tasklist-api/tasklist-api-overview
sidebar_position: 1
description: "Build apps powered by BPMN that require human interaction, and make requests."
---

In this document, we'll go over the basics on how to consume the Tasklist GraphQL API. Read more about how to build a real world application [here](../tasklist-api-tutorial). Be sure to [authenticate to use the Tasklist API](./tasklist-api-authentication.md).

:::note
Review the new [Tasklist REST API](../tasklist-api-rest/tasklist-api-rest-overview.md). This API offers the same functionality as the current GraphQL API, but with a more streamlined and efficient way of interacting with our service.

The GraphQL API will be deprecated in the near future. To ensure a smooth transition, we'll continue to support our GraphQL API for a period of time, giving you an opportunity to migrate to the new REST API version at your own pace. We will provide further details on the timeline and process for this migration soon.
:::

## Endpoint

Tasklist provides a GraphQL API at endpoint `/graphql`.

From Camunda 8 the endpoint is `${base-url}/graphql`.

For SaaS: `https://${REGION}.tasklist.camunda.io:443/${CLUSTER_ID}/graphql`, and for Self-Managed installations: `http://localhost:8080/graphql`.

## Obtaining the Tasklist schema

To obtain the Tasklist GraphQL schema, visit the API collection in [GitHub](https://github.com/camunda-community-hub/camunda-8-api-postman-collection), which is fully functioning in [Postman](https://www.postman.com/camundateam/workspace/camunda-8-postman/collection/20317927-6394943f-b57c-4c04-acf9-391a8614103b?action=share&creator=11465105).

Alternatively, send a request to the endpoint with a GraphQL introspection query as described [here](https://graphql.org/learn/introspection/), or use the [generated API documentation](/apis-tools/tasklist-api/generated.md).

There are also several [tools to explore GraphQL APIs](https://altair.sirmuel.design).

For example, you want to know about provided types:

```graphql
query {
  __schema {
    queryType {
      fields {
        name
        type {
          kind
          ofType {
            kind
            name
          }
        }
      }
    }
  }
}
```

## Example requests and responses

### Get all task names

_Request:_

```graphql
{
  tasks(query: {}) {
    name
  }
}
```

_Response:_

```json
{
  "data": {
    "tasks": [
      {
        "name": "Check payment"
      },
      {
        "name": "Register the passenger"
      }
    ]
  }
}
```

### Get all tasks completed with id, name, and state

_Request:_

```graphql
{
  tasks(query: { state: COMPLETED }) {
    id
    name
    taskState
  }
}
```

_Response:_

```json
{
  "data": {
    "tasks": [
      {
        "id": "2251799813685728",
        "name": "Check payment",
        "taskState": "COMPLETED"
      }
    ]
  }
}
```
