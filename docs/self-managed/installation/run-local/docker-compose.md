---
id: docker-compose
title: "Docker Compose"
keywords: ["camunda docker"]
---

A Docker Compose configuration to run Zeebe, Operate, Tasklist, Optimize, Identity, and Connectors Bundle is available in the [camunda-platform](https://github.com/camunda/camunda-platform/blob/main/docker-compose.yaml) repository.
Follow the instructions in the [README](https://github.com/camunda/camunda-platform#using-docker-compose).

:::warning
While the Docker images themselves are supported for production usage, the Docker Compose files are designed to be used by developers to run an environment locally; they are not designed to be used in production. We recommend to use [Kubernetes](/self-managed/installation/deploy/deploy.md) in production.
:::

This Docker Compose configuration serves two purposes:

1. It can be used to start up a development environment locally.
2. It documents how the various components need to be wired together.

:::note
We recommend to use [Helm + KIND](/self-managed/installation/run-local/local-kubernetes-cluster.md) instead of Docker Compose for local environments, as the Helm configurations are battle-tested and much closer to production systems.
:::
