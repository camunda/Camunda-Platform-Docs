---
id: tasklist-api-graphql-to-rest-migration
title: GraphQL to REST API migration
slug: /apis-tools/tasklist-api/tasklist-api-graphql-to-rest-migration
sidebar_position: 3
description: "This article provides a guide for developers to migrate from GraphQL to REST API seamlessly."
---

We want to provide you with the information you need to successfully migrate from our GraphQL API
to our new REST API version. In this document, we'll explain the differences between the two APIs
and provide guidance on how to make the switch.

GraphQL has been a popular and valuable tool for many of our customers, but we recognize that there are
certain advantages to using a RESTful architecture. Our new REST API version provides a more structured
and predictable way of accessing our data, which can improve performance and greater reliability.

It's worth noting that all of our other APIs use REST, so moving to a RESTful architecture will align this API
with the rest of our ecosystem. This will make it easier to maintain and enhance our APIs over time,
as well as providing a more consistent experience for API customers.

## GraphQL operation to REST API endpoint mapping

### Queries

#### Task

Instead of [task](/apis-tools/tasklist-api/queries/task.mdx) GraphQL query:

```graphql
# Get one task by id. Returns task or error when task does not exist.
task(id: String!): Task!
```

Use the following [get task](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#get-task) endpoint:

```bash
curl -X 'GET' \
  'http://{host}/v1/tasks/{taskId}' \
  -H 'accept: application/json'
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```

:::note

The following fields in REST API response were renamed compared to the equivalent GraphQL response:

- [`Task.creationTime`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbcreationtimebcodestring--) ⇒ [`TaskResponse.creationDate`](/apis-tools/tasklist-api-rest/schemas/responses/task-response.mdx#code-style-fontweight-normal-taskresponsebcreationdatebcodestring-)
- [`Task.completionTime`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbcompletiontimebcodestring-) ⇒ [`TaskResponse.completionDate`](/apis-tools/tasklist-api-rest/schemas/responses/task-response.mdx#code-style-fontweight-normal-taskresponsebcompletiondatebcodestring)
- [`Task.processDefinitionId`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbprocessdefinitionidbcodestring-) ⇒ [`TaskResponse.processDefinitionKey`](/apis-tools/tasklist-api-rest/schemas/responses/task-response.mdx#code-style-fontweight-normal-taskresponsebprocessdefinitionkeybcodestring)
- [`Task.processInstanceId`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbprocessinstanceidbcodestring-) ⇒ [`TaskResponse.processInstanceKey`](/apis-tools/tasklist-api-rest/schemas/responses/task-response.mdx#code-style-fontweight-normal-taskresponsebprocessinstancekeybcodestring)

:::

#### Tasks

Instead of [tasks](/apis-tools/tasklist-api/queries/tasks.mdx) GraphQL query:

```graphql
# Get list of tasks based on `TaskQuery`.
tasks(query: TaskQuery!): [Task!]!
```

Use the following [search tasks](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#search-tasks) endpoint:

```bash
curl -X 'POST' \
  'http://{host}/v1/tasks/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}' \
  -d '{
  "state": "CREATED",
  "assigned": true
}'
```

:::note

Please note that several field names in request body and response were changed in REST API comparing to the equivalent GraphQL input/response models, in order to improve the consistency and clarity of our API:

- in request body:

  - [`TaskQuery.processDefinitionId`](/apis-tools/tasklist-api/inputs/task-query.mdx#code-style-fontweight-normal-taskquerybprocessdefinitionidbcodestring-) ⇒ [`TaskSearchRequest.processDefinitionKey`](/apis-tools/tasklist-api-rest/schemas/requests/task-search-request.mdx#code-style-fontweight-normal-tasksearchrequestbprocessdefinitionkeybcodestring)
  - [`TaskQuery.processInstanceId`](/apis-tools/tasklist-api/inputs/task-query.mdx#code-style-fontweight-normal-taskquerybprocessinstanceidbcodestring-) ⇒ [`TaskSearchRequest.processInstanceKey`](/apis-tools/tasklist-api-rest/schemas/requests/task-search-request.mdx#code-style-fontweight-normal-tasksearchrequestbprocessinstancekeybcodestring)

- in response:
  - [`Task.creationTime`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbcreationtimebcodestring--) ⇒ [`TaskSearchResponse.creationDate`](/apis-tools/tasklist-api-rest/schemas/responses/task-search-response.mdx#code-style-fontweight-normal-tasksearchresponsebcreationdatebcodestring-)
  - [`Task.completionTime`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbcompletiontimebcodestring-) ⇒ [`TaskSearchResponse.completionDate`](/apis-tools/tasklist-api-rest/schemas/responses/task-search-response.mdx#code-style-fontweight-normal-tasksearchresponsebcompletiondatebcodestring)
  - [`Task.processDefinitionId`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbprocessdefinitionidbcodestring-) ⇒ [`TaskSearchResponse.processDefinitionKey`](/apis-tools/tasklist-api-rest/schemas/responses/task-search-response.mdx#code-style-fontweight-normal-tasksearchresponsebprocessdefinitionkeybcodestring)
  - [`Task.processInstanceId`](/apis-tools/tasklist-api/objects/task.mdx#code-style-fontweight-normal-taskbprocessinstanceidbcodestring-) ⇒ [`TaskSearchResponse.processInstanceKey`](/apis-tools/tasklist-api-rest/schemas/responses/task-search-response.mdx#code-style-fontweight-normal-tasksearchresponsebprocessinstancekeybcodestring)

:::

#### Variable

Instead of [variable](/apis-tools/tasklist-api/queries/variable.mdx) GraphQL query:

```graphql
# Get the variables by variable id
variable(id: String!): Variable!
```

Use the following [get variable](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-variables-controller.md#get-variable) endpoint:

```bash
curl -X 'GET' \
  'http://{host}/v1/variables/{variableId}' \
  -H 'accept: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```

#### Variables

Instead of [variables](/apis-tools/tasklist-api/queries/variables.mdx) GraphQL query:

```graphql
# Get a collection of Variables by name
variables(taskId: String!, variableNames: [String!]!): [Variable!]!
```

Use the following [search task variables](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#search-task-variables) endpoint:

```bash
curl -X 'POST' \
  'http://{host}/v1/tasks/{taskId}/variables/search' \
  -H 'accept: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}' \
  -d '{
    "variableNames": [
      "varA", "varB"
    ]
  }'
```

#### Form

Instead of [form](/apis-tools/tasklist-api/queries/form.mdx) GraphQL query:

```graphql
# Get task form by formId and processDefinitionId
form(id: String!, processDefinitionId: String!): Form
```

Use the following [get form](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-form-controller.md#get-form) endpoint:

```bash
curl -X 'GET' \
  'http://{host}/v1/forms/{formId}?processDefinitionKey={processDefinitionKey}' \
  -H 'accept: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```

:::note

Note that `processDefinitionKey` query parameter in HTTP request represents the same value as [`form.processDefinitionId`](/apis-tools/tasklist-api/queries/form.mdx#code-style-fontweight-normal-formbprocessdefinitionidbcodestring--),
and in REST API response [`FormResponse.processDefinitionKey`](/apis-tools/tasklist-api-rest/schemas/responses/form-response.mdx#code-style-fontweight-normal-formresponsebprocessdefinitionkeybcodestring-) field
is the renamed equivalent of [`Form.processDefinitionId`](/apis-tools/tasklist-api/objects/form.mdx#code-style-fontweight-normal-formbprocessdefinitionidbcodestring--).

:::

### Mutations

#### Claim task

Instead of [claimTasks](/apis-tools/tasklist-api/mutations/claim-task.mdx) GraphQL mutation:

```graphql
# Claim a task with `taskId` to `assignee`. Returns the task.
claimTask(taskId: String!, assignee: String, allowOverrideAssignment: Boolean): Task!
```

Use the following [assign task](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#assign-task) endpoint:

```bash
curl -X 'PATCH' \
  'http://{host}/v1/tasks/{taskId}/assign' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```

#### Unclaim task

Instead of [unclaimTasks](/apis-tools/tasklist-api/mutations/unclaim-task.mdx) GraphQL mutation:

```graphql
# Unclaim a task with taskId. Returns the task.
unclaimTask(taskId: String!): Task!
```

Use the following [unassign task](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#unassign-task) endpoint:

```bash
curl -X 'PATCH' \
  'http://{host}/v1/tasks/{taskId}/unassign' \
  -H 'accept: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```

#### Complete task

Instead of [completeTasks](/apis-tools/tasklist-api/mutations/complete-task.mdx) GraphQL mutation:

```graphql
# Complete a task with taskId and optional variables. Returns the task.
completeTask(taskId: String!, variables: [VariableInput!]!): Task!
```

Use the following [complete task](/apis-tools/tasklist-api-rest/controllers/tasklist-api-rest-task-controller.md#complete-task) endpoint:

```bash
curl -X 'PATCH' \
  'http://{host}/v1/tasks/{taskId}/complete' \
  -H 'accept: application/json' \
  -H 'Cookie: TASKLIST-SESSION={tasklistSessionId}'
```
