---
id: working-with-apis-tools
title: "Working with APIs & tools"
sidebar_label: "Working with APIs & tools"
description: "Learn more about the integration concepts involved in using the Camunda Zeebe client libraries, APIs, and SDKs to interact programmatically with Camunda 8."
---

import DocCardList from '@theme/DocCardList';

This section steps through available concepts for integration:

- **Control your Camunda 8 process automation** by [deploying processes](/components/modeler/web-modeler/run-or-publish-your-process.md#deploy-a-process), [starting process instances](/components/modeler/web-modeler/run-or-publish-your-process.md), [activating jobs](/components/concepts/job-workers.md), and more using supplemental and community-maintained **Zeebe client libraries**.
- **Interact with the Camunda 8 ecosystem** by learning about [Camunda Components](/components/components-overview.md) and their APIs to communicate with your cluster, search, get and change data, create Cloud API clients, and more.
- **Develop a custom front end for task applications** by learning the basic architecture of task applications, the APIs for interacting with Camunda 8 through your applications, and the open source form.js library for creating and embedding human task forms into these applications.

:::note
You're permitted to use these web apps and APIs for free with the Free Edition in non-production environments. To use the software in production, [purchase the Camunda Enterprise Edition](https://camunda.com/products/cloud/camunda-cloud-enterprise-contact/). Read more in our [licensing](../reference/licenses.md) documentation.
:::

## Deploy processes, start process instances, and more using Zeebe client libraries

Clients allow applications to do the following:

- Deploy processes.
- Start and cancel process instances.
- Activate jobs, work on those jobs, and subsequently complete or fail jobs.
- Publish messages.
- Update process instance variables and resolve [incidents](/components/concepts/incidents.md).

The official clients mentioned below interact with [Zeebe](/components/zeebe/zeebe-overview.md), the workflow engine integrated into Camunda 8. All clients require [setting up client credentials](/guides/setup-client-connection-credentials.md) to authenticate. Clients connect to Camunda 8 via a mix of REST and [gRPC](https://grpc.io), a high-performance, open source, and universal RPC protocol.

Camunda 8 provides several official clients based on this API. Official clients have been developed and tested by Camunda. They also add convenience functions (for example, thread handling for job workers) on top of the core API.

### Official Zeebe clients

Official clients have been developed and tested by Camunda. They also add convenience functions (e.g. thread handling for job workers) on top of the core API.

<DocCardList items={[{type:"link", href:"/docs/8.7/apis-tools/java-client/", label: "Java client", docId:"apis-tools/java-client/index"}
]}/>

:::note
Other components in Camunda 8, such as [Tasklist API (GraphQL)](../apis-tools/tasklist-api/generated.md), provide language-agnostic APIs, but no clients to interact with them. GraphQL enables you to query, claim, and complete user tasks.
:::

## Learn about Camunda Components and their APIs

Camunda 8 components have APIs to enable polyglot developers to work with in their programming language of choice. Below are links to available component APIs.

![Architecture diagram for Camunda including all the components for SaaS](./img/ComponentsAndArchitecture_SaaS.png)

### API Reference

<DocCardList items={[{type:"link", href:"/docs/8.7/apis-tools/administration-api/administration-api-reference/", label: "Administration API (REST)", docId:"apis-tools/administration-api/administration-api-reference"},
{
type:"link", href:"/docs/8.7/apis-tools/camunda-api-rest/camunda-api-rest-overview/", label: "Camunda 8 API (REST)", docId:"apis-tools/camunda-api-rest/camunda-api-rest-overview"
},
{
type:"link", href:"/optimize/3.15.0/apis-tools/optimize-api/optimize-api-authentication/", label: "Optimize API (REST)", description: "Get, delete, and export reports and dashboards, enable and disable sharing, and more."
},
{
type:"link", href:"/docs/8.7/apis-tools/web-modeler-api/overview/", label: "Web Modeler API (REST)", docId:"apis-tools/web-modeler-api/overview"
},
{
type:"link", href:"/docs/8.7/apis-tools/zeebe-api/overview/", label: "Zeebe API (gRPC)", docId:"apis-tools/zeebe-api/grpc"
}
]}/>

:::note
Additionally, visit our documentation on [Operate](../self-managed/operate-deployment/usage-metrics.md) and [Tasklist](../self-managed/tasklist-deployment/usage-metrics.md) usage metric APIs.
:::

### SDKs

<DocCardList items={[{type:"link", href:"/docs/8.7/apis-tools/spring-zeebe-sdk/getting-started/", label: "Spring Zeebe", docId:"apis-tools/spring-zeebe-sdk/getting-started"},
{
type:"link", href:"/docs/8.7/apis-tools/node-js-sdk/", label: "Node.js", docId:"apis-tools/node-js-sdk"
},
]}/>

### Postman

Camunda maintains a set of collections and APIs on Postman to help learn and use the available APIs.

Watch and fork your favorite collections and APIs in the [Camunda Team](https://www.postman.com/camundateam) Postman.

:::note
Collections and APIs are manually updated and not all API functionality may be available. For the most up-to-date API functionality, refer to the [API reference docs](/apis-tools/working-with-apis-tools.md#api-reference).
:::

### Community clients

[Community clients](/apis-tools/community-clients/index.md) supplement the official clients. These clients have not been tested by Camunda.

It is also possible to [build your own client](../apis-tools/build-your-own-client.md) You can browse other community extensions and the most up-to-date list of community clients [here](https://github.com/orgs/camunda-community-hub/repositories).

### Community SDKs

In addition to APIs and clients, the Camunda Developer Experience team is looking for feedback on popular community clients turned SDKs. While these are currently on the Camunda Community Hub, we are actively iterating and evaluating feedback to fully support them.

- [Node.js SDK](https://github.com/camunda-community-hub/camunda-8-sdk-node-js)

## Develop a custom frontend for task applications

Camunda 8 provides APIs and JavaScript libraries to allow frontend developers to build custom task applications or to integrate with third-party tools or UI builders. The extensible Camunda Forms framework allows developers to build complex forms that can be rendered anywhere, while being maintained by business developers using Camunda Modeler.

<DocCardList items={[
{
type: "link",
href: "/docs/8.7/apis-tools/frontend-development/task-applications/introduction-to-task-applications",
label: "Task applications",
docId:"apis-tools/frontend-development/task-applications/introduction-to-task-applications"
},
{
type: "link",
href: "/docs/8.7/apis-tools/frontend-development/forms/introduction-to-forms",
label: "Forms",
docId: "apis-tools/frontend-development/forms/introduction-to-forms"
}
]}/>
