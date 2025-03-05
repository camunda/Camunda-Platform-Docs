---
id: overview
title: "Camunda 8 installation overview"
sidebar_label: "Overview"
description: "This chapter contains information for users who want to deploy and run Camunda 8 Self-Managed in their self-controlled cloud or own hardware."
keywords: ["camunda download"]
---

import Components from '../react-components/components.md'

This guide contains information for users who want to install, deploy, and upgrade Camunda 8 Self-Managed, typically in their self-controlled cloud (public or private) or on their own hardware.

## Components

<Components/>

## Supported environments

For details on supported environments (e.g. Java or Elasticsearch versions), see [supported environments](/reference/supported-environments.md).

## Deployment options

- [**Helm/Kubernetes**](./helm-kubernetes/deploy.md): We recommend using Kubernetes and Helm to deploy and run Camunda 8 Self-Managed in production. With the right configuration, Camunda 8 Self-Managed can be deployed on any Certified Kubernetes distribution (cloud or on-premises). We also officially support a variety of providers like [Red Hat OpenShift](./helm-kubernetes/platforms/redhat-openshift.md) and [Amazon EKS](./helm-kubernetes/platforms/amazon-eks/amazon-eks.md).
- [**Docker**](../platform-deployment/docker.md): Component [Docker images](https://hub.docker.com/u/camunda) are available for use in production on Linux systems. Windows or macOS are only supported for development environments.
- [**Manual**](../platform-deployment/manual.md): The Java applications can run on a local or virtual machine if it provides a supported Java Virtual Machine (JVM). This allows you to run Camunda on virtual machines or bare metal and offers a significant amount of flexibility. However, you will need to configure the details for the components to interact correctly yourself. We consider this a last resort. Note that Windows/Mac is **not** supported for production usage of Zeebe.

A **Docker Compose** configuration file is also provided for local development, and is **not** optimized for production usage. You can find setup instructions in the [Camunda Distributions repository](https://github.com/camunda/camunda-distributions#docker-compose).

For more details on deployment, see [sizing your environment](../../components/best-practices/architecture/sizing-your-environment.md#camunda-8-self-managed).
