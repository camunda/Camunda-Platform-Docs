---
id: working-with-apis-tools
title: "Working with APIs & tools"
sidebar_label: "Working with APIs & tools"
description: "Programmatically work with Camunda 8 through APIs & tools"
---

This section steps through a variety of offered APIs and tools for integration.

:::note
You're permitted to use these web apps and APIs for free with the Free Edition in non-production environments. To use the software in production, [purchase the Camunda Enterprise Edition](https://camunda.com/products/cloud/camunda-cloud-enterprise-contact/). Read more in our [licensing](../reference/licenses.md) documentation.
:::

## APIs and interacting with other components

The clients mentioned below interact with Zeebe, the workflow engine integrated into Camunda 8. All clients require [setting up client credentials](/guides/setup-client-connection-credentials.md) to authenticate.

Other components in Camunda 8, such as [Tasklist API (GraphQL)](/apis-tools/tasklist-api/generated.md), provide language-agnostic APIs, but no clients to interact with them. GraphQL enables you to query, claim, and complete user tasks.

### Additional APIs

- [Administration API clients (REST)](../apis-tools/administration-api-reference.md) - Enables you to programmatically create and manage clusters, and interact with Camunda 8 programmatically without using the Camunda 8 UI.
- [Zeebe API](../apis-tools/grpc.md) - Zeebe clients use gRPC to communicate with the cluster.

:::note
Additionally, visit our documentation on [Operate](../self-managed/operate-deployment/usage-metrics.md) and [Tasklist](../self-managed/tasklist-deployment/usage-metrics.md) usage metric APIs.
:::

## Clients

Clients allow applications to do the following:

- Deploy processes.
- Start and cancel process instances.
- Activate jobs, work on those jobs, and subsequently complete or fail jobs.
- Publish messages.
- Update process instance variables and resolve incidents.

Clients connect to Camunda 8 via [gRPC](https://grpc.io), a high-performance, open source, and universal RPC protocol.

Camunda 8 provides several official clients based on this API. Official clients have been developed and tested by Camunda. They also add convenience functions (e.g. thread handling for job workers) on top of the core API.

### Official clients

- [Java](../apis-tools/java-client/index.md)
- [Go](../apis-tools/go-client/go-get-started.md)
- [CLI](../apis-tools/cli-client/index.md)

### Community clients

Community clients supplement the official clients. These clients have not been tested by Camunda.

- [C#](../apis-tools/community-clients/c-sharp.md)
- [JavaScript/NodeJS](../apis-tools/community-clients/javascript.md)
- [Micronaut](../apis-tools/community-clients/micronaut.md)
- [Python](../apis-tools/community-clients/python.md)
- [Ruby](../apis-tools/community-clients/ruby.md)
- [Rust](../apis-tools/community-clients/rust.md)
- [Spring](../apis-tools/community-clients/spring.md)
- [Quarkus](../apis-tools/community-clients/quarkus.md)

You can browse other community extensions and the most up-to-date list of community clients [here](https://github.com/orgs/camunda-community-hub/repositories).

Finally, it is possible to [build your own client](../apis-tools/build-your-own-client.md) if none of the other options are suitable.
