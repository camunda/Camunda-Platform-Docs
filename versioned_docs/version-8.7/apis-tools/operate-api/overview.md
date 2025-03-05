---
id: operate-api-overview
title: Overview
slug: /apis-tools/operate-api/overview
description: "Operate API is a REST API and provides searching, getting, and changing Operate data. Requests and responses are in JSON."
---

Operate API is a REST API and provides searching, getting, and changing Operate data.
Requests and responses are in JSON notation. Some objects have additional endpoints.
For example, `process-definitions` has an endpoint to get the process-definition as XML representation.
In case of errors, Operate API returns an error object.

:::note
Work with this API in our [Postman collection](https://www.postman.com/camundateam/workspace/camunda-8-postman/collection/20317927-9d9314a2-4cff-40ab-90ea-98e28ca1f81c?action=share&creator=11465105), and check it out in [GitHub](https://github.com/camunda-community-hub/camunda-8-api-postman-collection).
:::

## Context paths

For SaaS: `https://${REGION}.operate.camunda.io:443/${CLUSTER_ID}/v1/`, and for Self-Managed installations: `http://localhost:8080/v1/`.

:::note
Find your **region Id** and **cluster Id** under **Connection information** in your client credentials (revealed when you click on your client under the **API** tab within your cluster).

For Self-Managed, the host and port depend on your configuration. The context path mentioned here is the default for the Operate component.
:::

## API Explorer

See [the interactive Operate API Explorer][operate-api-explorer] for specifications, example requests and responses, and code samples of interacting with the Operate API.

### Swagger UI

A Swagger UI is also available within a running instance of Operate, at `https://${base-url}/swagger-ui/index.html`.

For SaaS: `https://${REGION}.operate.camunda.io/${CLUSTER_ID}/swagger-ui.html`, and for Self-Managed installations: `http://localhost:8080/swagger-ui.html`.

:::note
Find your **region Id** and **cluster Id** under **Connection information** in your client credentials (revealed when you click on your client under the **API** tab within your cluster).
:::

## Multi-tenancy

:::note
The [multi-tenancy feature](../../self-managed/operate-deployment/operate-configuration.md#multi-tenancy) is available in Self-Managed setups only.
:::

All Operate endpoints for which tenant assignment is relevant will:

- Return `tenantId` field in response
- Provide `tenantId` search parameter

Review [the Operate API Explorer][operate-api-explorer] for the exact request and response structure.

## Search

Every object has a search `/v1/<object>/search` endpoint which can be requested by `POST` and a given query request.

### Query

The query request consists of components for **filter**, **size**, **sort**, and **pagination**.

```
{
   "filter": { object fields to match },
   "size": <number of items to return>,
   "sort": [ {"field":"<name of field to sort on>", "order": "<ASC|DESC>" ],
   "searchAfter": [ <identifier of item from which next search should start> ]
}
```

#### Filter

Specifies which fields should match. Only items that match the given fields will be returned.
Review [the Operate API Explorer][operate-api-explorer] for the available fields on each object.

##### Filter strings, numbers, and booleans

Fields of type string, number, and boolean need the exact value to match.

:::note
When filtering process instances, `parentProcessInstanceKey` can be used instead of `parentKey` in the request JSON. The response JSON for a process instance will contain the field `parentKey`, even when `parentProcessInstanceKey` is used during input filtering.
:::

###### Examples

Return all items with field `processInstanceKey` equals `235`:

```json
{ "filter": { "processInstanceKey": 235 } }
```

Return all items with field `parentKey` equals `123`. Note: `parentProcessInstanceKey` can also be used as an alias for `parentKey` and filters identically:

```json
{ "filter": { "parentKey": 123 } }
```

```json
{ "filter": { "parentProcessInstanceKey": 123 } }
```

A filter that could be used to search for all flow node instances with field `processInstanceKey` equals `235`, `state` equals `ACTIVE` and `incident` equals `true`:

```json
{
  "filter": { "processInstanceKey": 235, "state": "ACTIVE", "incident": true }
}
```

##### Filter dates

Date fields need to be specified in format: `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`; for example, `2022-03-17T11:50:25.729+0000`.

You can use modifier to match date ranges:

| Modifier | Description     |
| -------- | --------------- |
| \|\|/y   | Within a year   |
| \|\|/M   | Within a month  |
| \|\|/w   | Within a week   |
| \|\|/d   | Within a day    |
| \|\|/h   | Within an hour  |
| \|\|/m   | Within a minute |
| \|\|/s   | Within a second |

###### Example

Return all items with field `startDate` within a minute (`||/m`) for `2022-03-17 11:50:25`.

```json
{
  "filter": {
    "startDate": "2022-03-17T11:50:25.729+0000||/m"
  }
}
```

#### Size

Maximum items should be returned and must be a number.

##### Example

Return maximum `23` items:

```json
{ "size": 23 }
```

#### Sort

Specify which field of the object should be sorted and whether ascending (`ASC`) or descending (`DESC`).

##### Example

Sort by `name` **desc**ending:

```json
{ "sort": [{ "field": "name", "order": "DESC" }] }
```

#### Pagination

Specify the item where the next search should start. For this, you need the values from previous results.
Copy the values from `sortValues` field from the previous results into the `searchAfter` value of query.
Refer also to [results](#results).

##### Example

Get next 10 results for previous query by copying the value of `sortValues` of the previous results object.
Assuming the `sortValues` value was `["the-name",12345]`, put it as value for `searchAfter` in the next query.

```json
{
  "sort": [{ "field": "name", "order": "DESC" }],
  "searchAfter": ["the-name", 12345]
}
```

#### Query components combined

The query components `filter`, `size`, `sort`, and `searchAfter` can be combined.

Default values are:

| Component   | Default value                     | Description                  |
| ----------- | --------------------------------- | ---------------------------- |
| filter      | null                              | Empty (all fields match)     |
| size        | 10                                |                              |
| sort        | `[{"field":"key","order":"ASC"}]` | Sorted ascending by key      |
| searchAfter | null                              | First items will be returned |

##### Example

Get max `50` process instances with `processVersion` equals `2` sorted `asc`ending by `bpmnProcessId`:

`POST /v1/process-instances/search`

```json
{
  "filter": {
    "processVersion": 2
  },
  "size": 50,
  "sort": [
    {
      "field": "bpmnProcessId",
      "order": "ASC"
    }
  ]
}
```

Results are:

```json
  ...
  {
      "key": 2251799813699162,
      "processVersion": 2,
      "bpmnProcessId": "called-process",
      "startDate": "2022-03-17T11:53:41.581+0000",
      "state": "ACTIVE",
      "processDefinitionKey": 2251799813695996
    }
  ],
  "sortValues": [
    "called-process",
    2251799813699162
  ],
  "total": 654
}
```

Take the value of `sortValues` and copy it to `searchAfter` for the next `50` items:

```json
{
  "filter": {
    "processVersion": 2
  },
  "size": 50,
  "sort": [
    {
      "field": "bpmnProcessId",
      "order": "ASC"
    }
  ],
  "searchAfter": ["called-process", 2251799813699162]
}
```

### Results

The API responds with a `Results` object. It contains an `items` array, `total` amount of found items,
and `sortValues` for pagination.

```
{
  "items": [ { item 1 } , { item 2 } ... ],
  "total": <number of found items>,
  "sortValues": [<array of values to retrieve next page of results>]
}
```

#### Items

An array of objects that matches the query.

#### Total

The total amount of found objects. This is an exact value until 10,000. If more than this, try to make your query more specific.

Refer also to [Elasticsearch max results](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/index-modules.html#index-max-result-window).

#### sortValues (Pagination)

Use the value (an array) of this field to get the next page of results in your next query.
Copy the value to `searchAfter` in your next query to get the next page.

Refer also to [Elasticsearch search after](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/paginate-search-results.html#search-after).

##### Example

Results for `process-instances`:

```json
{
  "items": [
    {
      "key": 2251799813699213,
      "processVersion": 2,
      "bpmnProcessId": "called-process",
      "startDate": "2022-03-17T11:53:41.758+0000",
      "state": "ACTIVE",
      "processDefinitionKey": 2251799813695996,
      "parentKey": 4503599627370497,
      "parentFlowNodeInstanceKey": 4503599627370535
    },
    {
      "key": 2251799813699262,
      "processVersion": 2,
      "bpmnProcessId": "called-process",
      "startDate": "2022-03-17T11:53:41.853+0000",
      "state": "ACTIVE",
      "processDefinitionKey": 2251799813695996,
      "parentKey": 4503599627370497,
      "parentFlowNodeInstanceKey": 4503599627370535
    }
  ],
  "sortValues": ["called-process", 2251799813699262],
  "total": 654
}
```

## Get object by key

Every object has a `GET /v1/<object>/{key}` endpoint where `{key}` is the identifier of the object.
Every object has a `key` field. One special case is for decision instances, where the identifier is the `id` field, because the `key` field is not unique.

### Example

Get the data for process instance with key `2251799813699213`:

`GET /v1/process-instances/2251799813699213`

#### Result:

```json
{
  "key": 2251799813699213,
  "processVersion": 2,
  "bpmnProcessId": "called-process",
  "startDate": "2022-03-17T11:53:41.758+0000",
  "state": "ACTIVE",
  "processDefinitionKey": 2251799813695996,
  "parentKey": 4503599627370497,
  "parentFlowNodeInstanceKey": 4503599627370535
}
```

## Change objects

Some objects can be changed (for example, deleted).
The endpoint is the same as getting the object, but with HTTP `DELETE` instead of HTTP `GET`.
The response is a `ChangeStatus` object which describes what happened and how many objects were changed.

### Example

Delete the data for process instance (and all dependant data) with key `2251799813699213`:

`DELETE /v1/process-instances/2251799813699213`

#### Result

```json
{
  "message": "1 process instance and dependant data was deleted",
  "deleted": 1
}
```

[operate-api-explorer]: ./specifications/operate-public-api.info.mdx
