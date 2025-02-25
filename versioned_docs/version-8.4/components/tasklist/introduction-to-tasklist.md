---
id: introduction-to-tasklist
title: Introduction
description: "Tasklist is a tool to work with user tasks in Zeebe."
---

Tasklist is a ready-to-use application to rapidly implement business processes alongside [user tasks](/components/modeler/bpmn/user-tasks/user-tasks.md) in [Zeebe](/components/zeebe/zeebe-overview.md).

With Tasklist, orchestrate human workflows critical to your business and reduce time-to-value for your process orchestration projects with an interface for manual work.

As you model a business process using BPMN and deploy it to the workflow engine, users are notified in Tasklist when they're assigned a task.

Tasklist provides two APIs: a [GraphQL API](/apis-tools/tasklist-api/tasklist-api-overview.md)
and a [REST API](/apis-tools/tasklist-api-rest/tasklist-api-rest-overview.md). Both APIs provide equal capabilities,
allowing you to build your own applications or use the general [UI](/components/tasklist/userguide/using-tasklist.md) that we have prepared for you.

:::note
The GraphQL and REST APIs are currently available, but the GraphQL API will be deprecated in future releases, although it will still receive updates for a limited period. If you are building new applications,
we recommend using the REST API to ensure long-term compatibility.
:::

Tasklist is also available for production use (with support) in the Camunda 8 offering. To try out Tasklist in Camunda 8, sign up [here](https://signup.camunda.com/accounts?utm_source=docs.camunda.io&utm_medium=referral).
