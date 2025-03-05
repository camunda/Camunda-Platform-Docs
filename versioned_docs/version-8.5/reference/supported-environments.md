---
id: supported-environments
title: "Supported environments"
description: "Find out where to run Camunda 8 components for SaaS and Self-Managed, including Optimize for both Camunda 8 and Camunda 7."
---

The supported environments page lists browsers, operating systems, clients, deployment options, and component requirements, which are tested and supported for compatibility with Camunda 8.

**If the particular technology is not listed, we cannot resolve issues caused by the usage of that unlisted technology.**

You may [raise a feature request](/reference/contact.md) that will be evaluated by our product teams to provide official support from Camunda, or you can make a [help request](/reference/contact.md) to work with Consulting services.

Recommendations are denoted with [recommended], however, other listed options are supported as well.

:::note Minimum versions
The versions listed on this page are the minimum version required if appended with a `+`.

Pay attention to where the `+` falls, as most of our dependencies follow [semantic versioning](https://semver.org/) (semver), where `x.y.z` correspond to MAJOR.MINOR.PATCH. Higher or more recent versions will be compatible with Camunda, with respect to semver.

For example, 1.2+ means support for the minor version 2, and any higher minors (1.3, 1.4, etc.) and patches (1.2.1, 1.2.2, etc.), but not majors, like 2.x.

:::

## Web Browser

- Google Chrome latest [recommended]
- Mozilla Firefox latest
- Microsoft Edge latest

## Desktop Modeler

- Windows 10 / 11
- Mac OS 12 / 13 / 14 / 15
- Ubuntu LTS (latest)

## Clients

- **Zeebe Java Client**: OpenJDK 8+
- **Spring Zeebe SDK**: OpenJDK 17+
- **Zeebe Go Client**: Go 1.13+
- **zbctl**: Windows, macOS, and Linux (latest)
- **Connector SDK**: OpenJDK 17+
- **Spring SDK**: Spring Boot 3.2.x (for the exact version, check the [version matrix](/apis-tools/spring-zeebe-sdk/getting-started.md#version-compatibility).)
- **Helm CLI**: 3.14.x (for the exact version, check the [version matrix](https://helm.camunda.io/camunda-platform/version-matrix/))

## Camunda 8 Self-Managed

We recommend running Camunda 8 Self-Managed in a Kubernetes environment. We provide officially supported [Helm Charts](/self-managed/setup/overview.md) for this. Please follow the [Installation Guide](/self-managed/setup/overview.md) to learn more about installation possibilities.

### Deployment options

With the right configuration, Camunda 8 Self-Managed can be deployed on any [Certified Kubernetes](https://www.cncf.io/training/certification/software-conformance/#benefits) distribution (cloud or on-premises). However, we officially test and support a specific list of platforms.

The following are tested and supported deployment options for Kubernetes, Docker, and manual installation:

- [Stock Kubernetes](/self-managed/setup/install.md)
- [Cloud service providers](/self-managed/setup/install.md) [recommended]
  - [Amazon EKS](/self-managed/setup/deploy/amazon/amazon-eks/amazon-eks.md)
  - [Microsoft AKS](/self-managed/setup/deploy/azure/microsoft-aks.md)
  - [Google GKE](/self-managed/setup/deploy/gcp/google-gke.md)
- [Red Hat OpenShift](/self-managed/setup/deploy/openshift/redhat-openshift.md)
- [Docker](/self-managed/setup/deploy/other/docker.md) (`linux/amd64`)
- [Manual](/self-managed/setup/deploy/local/manual.md)

:::note Helm chart compatibility
Ensure the Camunda component versions are compatible with the Helm chart version as defined in the [matrix](https://helm.camunda.io/camunda-platform/version-matrix/).
:::

### Sizing

The [sizing of a Camunda 8 installation](/components/best-practices/architecture/sizing-your-environment.md) depends on various influencing factors. Ensure to [determine these factors](../components/best-practices/architecture/sizing-your-environment.md#understanding-influencing-factors), and conduct [benchmarking](../components/best-practices/architecture/sizing-your-environment.md#running-experiments-and-benchmarks) to validate an appropriate environment size for your test, integration, or production environments.

#### Volume performance

As a minimum requirement, the persistent volumes for Zeebe should use volumes with an absolute minimum of 1,000 IOPS. **NFS or other types of network storage volumes are not supported.**

To ensure an appropriate sizing, [determine your influencing factors](../components/best-practices/architecture/sizing-your-environment.md#understanding-influencing-factors) (e.g., throughput), and conduct [benchmarking to validate an appropriate environment sizing](../components/best-practices/architecture/sizing-your-environment.md#running-experiments-and-benchmarks).

For details on typical volume type usage, refer to the following examples specific to cloud service providers:

- [Amazon EKS](/self-managed/setup/deploy/amazon/amazon-eks/amazon-eks.md#volume-performance)
- [Microsoft AKS](/self-managed/setup/deploy/azure/microsoft-aks.md#volume-performance)
- [Google GKE](/self-managed/setup/deploy/gcp/google-gke.md#volume-performance)

## Component requirements

Requirements for the components can be seen below:

| Component   | Java version | Other requirements                                                                                                                                                                                                |
| ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zeebe       | OpenJDK 21+  | Elasticsearch 8.9+<br/>Amazon OpenSearch 2.5.x (requires use of [OpenSearch exporter](../self-managed/zeebe-deployment/exporters/opensearch-exporter.md))                                                         |
| Operate     | OpenJDK 17+  | Elasticsearch 8.9+<br/>Amazon OpenSearch 2.5.x                                                                                                                                                                    |
| Tasklist    | OpenJDK 17+  | Elasticsearch 8.9+<br/>Amazon OpenSearch 2.5.x                                                                                                                                                                    |
| Identity    | OpenJDK 17+  | Keycloak 22.x, 23.x<br/>PostgreSQL 14.x, 15.x or Amazon Aurora PostgreSQL 13.x, 14.x, 15.x (required for [certain features](/self-managed/identity/deployment/configuration-variables.md#database-configuration)) |
| Optimize    | OpenJDK 17+  | Elasticsearch 8.9+<br/>Amazon OpenSearch 2.5.x                                                                                                                                                                    |
| Connectors  | OpenJDK 21+  |                                                                                                                                                                                                                   |
| Web Modeler | -            | PostgreSQL 13.x, 14.x, 15.x, 16.x or Amazon Aurora PostgreSQL 13.x, 14.x, 15.x, 16.x                                                                                                                              |

When running Elasticsearch, you must have the [appropriate Elasticsearch privileges](/self-managed/concepts/elasticsearch-privileges.md).

:::note Elasticsearch support
Camunda 8 works with the [default distribution](https://www.elastic.co/downloads/elasticsearch) of Elasticsearch, which is available under the [Free or Gold+ Elastic license](https://www.elastic.co/pricing/faq/licensing#summary).
:::

### Component version matrix

This matrix shows which component versions work together:

| Design                | Automate    |                                                                            | Improve         |
| --------------------- | ----------- | -------------------------------------------------------------------------- | --------------- |
| Desktop Modeler 4.12+ | Zeebe 1.3.x | Operate 1.3.x Tasklist 1.3.x IAM 1.3.x                                     | Optimize 3.7.x  |
| Desktop Modeler 5.0+  | Zeebe 8.0.x | Operate 8.0.x Tasklist 8.0.x Identity 8.0.x                                | Optimize 3.8.x  |
| Desktop Modeler 5.4+  | Zeebe 8.1.x | Operate 8.1.x Tasklist 8.1.x Identity 8.1.x Connectors 0.23.0              | Optimize 3.9.x  |
| Desktop Modeler 5.10+ | Zeebe 8.2.x | Operate 8.2.x Tasklist 8.2.x Identity 8.2.x Connectors 0.23.2              | Optimize 3.10.x |
| Desktop Modeler 5.16+ | Zeebe 8.3.x | Operate 8.3.x Tasklist 8.3.x Identity 8.3.x Connectors 8.3.x               | Optimize 8.3.x  |
| Desktop Modeler 5.19+ | Zeebe 8.4.x | Operate 8.4.x Tasklist 8.4.x Identity 8.4.x Connectors 8.4.x               | Optimize 8.4.x  |
| Desktop Modeler 5.22+ | Zeebe 8.5.x | Operate 8.5.x Tasklist 8.5.x Identity 8.5.x Connectors 8.5.x Console 8.5.x | Optimize 8.5.x  |
| Web Modeler 8.2.x     | Zeebe 8.2.x | Operate 8.2.x Tasklist 8.2.x Identity 8.2.x Connectors 0.23.2              | Optimize 3.10.x |
| Web Modeler 8.3.x     | Zeebe 8.3.x | Operate 8.3.x Tasklist 8.3.x Identity 8.3.x Connectors 8.3.x               | Optimize 8.3.x  |
| Web Modeler 8.4.x     | Zeebe 8.4.x | Operate 8.4.x Tasklist 8.4.x Identity 8.4.x Connectors 8.4.x               | Optimize 8.4.x  |
| Web Modeler 8.5.x     | Zeebe 8.5.x | Operate 8.5.x Tasklist 8.5.x Identity 8.5.x Connectors 8.5.x Console 8.5.x | Optimize 8.5.x  |

:::note
You can also use newer versions of Desktop and Web Modeler with older Zeebe versions.
:::

## Camunda 7 & Optimize version matrix

See https://docs.camunda.org/enterprise/download/#camunda-optimize.
