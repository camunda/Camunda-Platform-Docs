---
id: manual
title: "Manual JAR deployment overview"
sidebar_label: Manual JAR
description: "Camunda 8 Manual (Java) deployment Reference architecture home "
---

<!-- Moving target, may be renamed, etc. -->

This reference architecture provides guidance on deploying Camunda 8 Self-Managed as a standalone Java application. This deployment method is ideal for users who prefer manual deployment on bare metal servers or virtual machines (VMs), offering full control over the environment and configuration. It is particularly suited for scenarios with specific infrastructure requirements or highly customized setups.

:::note
This method of deployment requires a solid understanding of infrastructure, networking, and application management. Consider evaluating your [deployment platform options](../reference-architecture.md) based on your familiarity and need. If you prefer a simpler and managed solution, [Camunda 8 SaaS](https://camunda.com/platform/) can significantly reduce maintenance efforts, allowing you to focus on your core business needs.
:::

## Key features

- **Single application JAR**: Starting from Camunda 8.8, all core components (Zeebe, Tasklist, Operate, Optimize, and Identity) are bundled into a single JAR file. This simplifies deployment by reducing the number of artifacts to manage.
- **Full control**: Users are responsible for all aspects of deployment, including installation, configuration, scaling, and maintenance. This offers maximum flexibility for custom environments.

Other deployment options, such as containerized deployments or managed services, might offer more convenience and automation. However, VM based deployment gives you the flexibility to tailor the deployment to your exact needs, which can be beneficial for regulated or highly customized environments.

For documentation on the orchestration cluster, Web Modeler and Console separation, refer to the [reference architecture overview](/self-managed/reference-architecture/reference-architecture.md#orchestration-cluster-vs-web-modeler-and-console).

## Reference implementations

This section includes deployment reference architectures for manual setups:

- [Amazon EC2 deployment](/self-managed/setup/deploy/amazon/aws-ec2.md) - a standard production setup with support for high availability.

## Considerations

- This overview page focuses on deploying the [orchestration cluster](/self-managed/reference-architecture/reference-architecture.md#orchestration-cluster), the single JAR compromised of Identity, Operate, Optimize, Tasklist, and Zeebe, as well as the Connectors runtime. Web Modeler and Console deployments are not included.
- General guidance and examples focuses on **unix** users, but can be adapted by Windows users with options like [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or included `batch` files.
- The Optimize importer is not highly available and must only run once within the whole setup.

## Architecture

![Single JAR](./img/manual-single.jpg)

This above diagram illustrates a single-machine deployment using the single JAR package. While simple and effective for lightweight setups, scaling to multiple machines requires careful planning.

Compared to the generalized architecture depicted in the [reference architecture](/self-managed/reference-architecture/reference-architecture.md#architecture), the `Optimize importer` can be enabled as part of the single JAR.

### High Availability (HA)

:::caution Non-HA Optimize importer
When scaling from a single machine to multiple machines, ensure that the `Optimize importer` is enabled on only one machine and disabled on the others. Enabling it on multiple machines will cause data inconsistencies. This limitation is known and will be addressed in future updates.
:::

![HA JAR](./img/manual-ha.jpg)

For high availability, a minimum of three machines is recommended to ensure fault tolerance and enable master election in case of failures. Refer to the [clustering documentation](/components/zeebe/technical-concepts/clustering.md) to learn more about the raft protocol and clustering concepts.

### Components

The orchestration core is packaged as a single JAR file and includes the following components:

- **Zeebe**
- **Operate**
- **Tasklist**
- **Optimize**
- **Identity**

The core facilitates:

1. **gRPC communication**: For client workers.
2. **HTTP endpoints**: Used by the REST API and Web UI.

Both types of endpoints can be routed through a load balancer to maintain availability, ensuring that the system remains accessible even if a machine becomes unavailable. While using a load balancer is optional, it is recommended for enhanced availability and security. Alternatively, you can expose static machines, ports, and IPs directly. However, direct exposure is generally discouraged due to security concerns.

Connectors expose additional HTTP(s) endpoints for handling incoming webhooks, which can also be routed through the same http load balancer.

The orchestration components rely on **Elasticsearch** or **OpenSearch** as their data store.

Components within the orchestration core communicate seamlessly, particularly:

- **Zeebe brokers** exchange data over gRPC endpoints for efficient inter-broker communication.

## Requirements

Before implementing a reference architecture, review the requirements and guidance outlined below. We are differentiating between `Infrastructure` and `Application` requirements.

### Infrastructure

Any of the following are just suggestions for the minimum viable setup, the sizing heavily depends on your use cases and usage. It is recommended to understand the documentation on [sizing your environment](/components/best-practices/architecture/sizing-your-environment.md) and run benchmarking to confirm your required needs.

#### Minimum Requirements Per Host

- Modern CPU: 4 cores
- Memory: 8 GB RAM
- Storage: 32 GB SSD (**1,000** IOPS recommended; avoid burstable disk types)

Suggested instance types from cloud providers:

- AWS: [m7i](https://aws.amazon.com/ec2/instance-types/m7i/) series
- GCP: [n1](https://cloud.google.com/compute/docs/general-purpose-machines#n1_machines) series

#### Networking

- Stable and high-speed network connection
- Configured firewall rules to allow necessary traffic:
  - **8080**: Web UI / REST endpoint.
  - **9090**: Connector port.
  - **9600**: Metrics endpoint.
  - **26500**: gRPC endpoint.
  - **26501**: Gateway-to-broker communication.
  - **26502**: Inter-broker communication.
- Load balancer for distributing traffic (if required)

:::info Customizing ports
Some ports can be overwritten and are not definitive, you may conduct the documentation of each component to see how it can be done, in case you want to use a different port. Or in our example `Connectors` and `Web UIs` overlap on 8080 due to which we moved connectors to a different port.
:::

### Application

- Java Virtual Machine, see [supported environments](/reference/supported-environments.md) for version details.

### Database

- Elasticsearch / OpenSearch, see [supported environments](/reference/supported-environments.md) for version details.

Our recommendation is to use an external managed offer as we will not go into detail on how to manage and maintain your database.
