---
id: delete-report
title: "Delete reports"
description: "The REST API to delete reports from Optimize."
---

<span class="badge badge--platform">Camunda Platform 7 only</span>

## Purpose

The report deletion API allows you to delete reports by ID from Optimize.

:::note Heads up!
During deletion a report will get removed from any dashboard or combined report it is referenced by. In case a report is referenced by an alert, the corresponding alert will get deleted too.
:::

## Method & HTTP target resource

DELETE `/api/public/report/{report-ID}`

Where `report-ID` is the ID of the report you wish to delete.

## Request headers

The following request headers have to be provided with every delete request:

|Header|Constraints|Value|
|--- |--- |--- |
|Authorization|REQUIRED*|See [Authorization](../../authorization)|

* Only required if not set as a query parameter

## Query parameters

The following query parameters have to be provided with every delete request:

|Parameter|Constraints|Value|
|--- |--- |--- |
|access_token|REQUIRED*|See [Authorization](../../authorization)|

* Only required if not set as a request header

## Request body

No request body is required.

## Result

No response body.

## Response codes

Possible HTTP response status codes:

|Code|Description|
|--- |--- |
|204|Request successful.|
|401|Secret incorrect or missing in HTTP Header. See [Authorization](../../authorization) on how to authenticate.|
|404|The requested report was not found, please check the provided report-ID.|
|500|Some error occurred while processing the request, best check the Optimize log.|

## Example

### Delete a report

Let's assume you want to delete a report with the ID `e6c5abb1-6a18-44e7-8480-d562d511ba62`, this is what it would look like:

DELETE `/api/public/report/e6c5aaa1-6a18-44e7-8480-d562d511ba62?access_token=mySecret`

##### Response

Status 204.
