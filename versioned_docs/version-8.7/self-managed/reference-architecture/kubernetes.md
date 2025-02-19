---
id: kubernetes
title: "Kubernetes deployment overview"
sidebar_label: "Kubernetes"
description: "Camunda 8 Kubernetes deployment Reference architecture home"
---

This reference architecture provides guidance on deploying Camunda 8 Self-Managed within a Kubernetes cluster. This deployment method is ideal for users who are looking to leverage the benefits of containerization and self-healing capabilities. It's well suited to quickly scale and easily provide resilience by utilizing multi zone deployments.

## Key features

- **Scalability & High Availability**: Camunda 8 can easily be scaled up and down depending on your demand, as well as provide a highly available setup.
- **Fault Tolerance & Resilience**: With the previous key feature, also better resilience comes along as you can scale Camunda 8 across zones or across regions to provide greater fault tolerance and uptime for your workflows.

Although Kubernetes has a **steeper learning curve**, once properly configured, it provides significant advantages, including **self-healing capabilities** that ensure application resilience by automatically restarting failed containers and rescheduling workloads.

Additionally, Kubernetes benefits from a vast ecosystem of **[Cloud Native Computing Foundation (CNCF) projects](https://www.cncf.io/)**, offering seamless integration with monitoring, observability, logging, and security solutions. Tools like **Prometheus and Grafana** allow for comprehensive monitoring, while service meshes such as **Istio** enhance traffic management and security.

By leveraging this **rich ecosystem**, organizations can **extend Kubernetes functionality** to meet their specific operational needs, enabling greater automation, scalability, and visibility across their infrastructure.

## Reference implementations

This section includes deployment reference architectures for manual setups:

- [Amazon EKS single-region](/self-managed/setup/deploy/amazon/amazon-eks/terraform-setup.md) - a standard production setup.
- [Amazon EKS dual-region](/self-managed/setup/deploy/amazon/amazon-eks/dual-region.md) - advanced use case by utilizing two regions.

For general deployment pitfalls, visit the [deployment troubleshooting guide](/self-managed/operational-guides/troubleshooting/troubleshooting.md).

## Considerations

- Most reference implementations primarily focus on the orchestration cluster.
- When scaling Web Apps (Operate, Tasklist, Optimize), ensure that the importer/archiver run only once within the whole cluster. See [the note under High Availability](#high-availability-ha) for details.

## Architecture

_Infrastructure diagram for a single region setup (click on the image to open the PDF version)_
[![Architecture Overview](./img/k8s-single.jpg)](./img/k8s-single.pdf)

This Kubernetes architecture diagram illustrates a high-availability setup spanning multiple availability zones (A, B, and C) with key networking components to ensure scalability, security, and reliability. Whenever possible, we recommend leveraging multiple availability zones to enhance fault tolerance and eliminate single points of failure.

For controlled access, we suggest deploying Camunda 8 within a private subnet while managing incoming traffic through an ingress and load balancer.

The database is not depicted in the diagram, as we recommend handling it externally from the Kubernetes cluster. The implementation depends on organizational requirements, often residing within the same private network or even the same private subnets. Many companies maintain dedicated database setups, granting access only as needed.

![Orchestration Cluster](./img/k8s-cluster-view-orchestration.jpg)

This provides a simplified view of a deployment using the [Camunda 8 Helm chart](/self-managed/setup/install.md). To keep the diagram clear, we have omitted ConfigMaps, Secrets, RBAC, and ReplicaSets.

By default, the Helm chart suggests using a single ingress for Camunda resources, enabling a unified domain with each application accessible via a different path.

Most applications are stateless and deployed as **Deployments**. However, Zeebe Brokers are an exception, requiring a **StatefulSet** to ensure that volumes are consistently mounted, as pod order and identifiers are crucial.

Zeebe Brokers also have a service but are not directly exposed externally; all requests must pass through the Zeebe Gateway, which is typically used for internal communication as well.

![Web Modeler and Console](./img/k8s-cluster-view-managing.jpg)

Web Modeler and Console are deployed as **Deployments** since they are stateless, with data stored externally in a SQL database. This allows them to be easily scaled as needed.

---

This does not provide detailed information on application communication. For a general overview, refer to the [overview page](/self-managed/reference-architecture/reference-architecture.md#architecture).

### High Availability (HA)

:::caution Non-HA importer / archiver
The following concerns, **Operate**, **Tasklist**, and **Optimize**.
When scaling from a single pod to multiple, ensure that the `importer / archiver` is enabled on only one pod and disabled on others. Enabling it on multiple pods will cause data inconsistencies. This limitation is known and will be addressed in future updates.

An [example configuration options](/self-managed/operate-deployment/importer-and-archiver.md#configuration) based on Operate, similar entries can be found for the other two components.
:::

For high availability, a minimum of four Kubernetes nodes are recommended to ensure fault tolerance and support master election in case of failures. To learn more about the Raft protocol and clustering concepts, refer to the [clustering documentation](/components/zeebe/technical-concepts/clustering.md).

In Kubernetes, Deployments and StatefulSets can be scaled independently of physical machines. However, the recommendation of at least fours Kubernetes nodes is based on the default setup of a three-broker Zeebe deployments and all the other WebApps (Operate, Tasklist, Optimize, ...). The idea of four nodes allows enough resources to schedule all Camunda 8 components. This is based on a default setup, your setup may differ and requires you to either scale more horizontally or vertically to ensure enough capacity depending on your Camunda 8 usage.

Additionally, the default node affinity settings prevent Zeebe brokers from being scheduled on the same node, necessitating a minimum three-node setup. For more details on Kubernetes affinity rules, see the [official documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/).

To further enhance fault tolerance, it is recommended to distribute Zeebe brokers and other scaled applications across multiple availability zones using additional affinity rules, ensuring resilience in case of a zone failure.

### Components

We typically distinguish as mentioned in the [Reference Architecture Overview](/self-managed/reference-architecture/reference-architecture.md#architecture) between the **Orchestration cluster** and the **Web Modeler and Console**. Those should be separated by utilizing [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/). While they could also run within a single namespace, the idea is that **Web Modeler and Console** are not limited to a single **Orchestration cluster**, therefore allowing duplicating the **Orchestration cluster** based on different use cases and requirements, while the other two are independent of it and don't need to be scaled out in the same way and could house a multitude of teams and use cases.

The **Orchestration cluster** namespace consists as outlined in the [architecture diagram](#architecture) of the following components:

- [Zeebe Brokers](/components/zeebe/technical-concepts/architecture.md#brokers)
- [Zeebe Gateway](/self-managed/zeebe-deployment/zeebe-gateway/zeebe-gateway-overview.md)
- [Operate](/components/operate/operate-introduction.md)
- [Tasklist](/components/tasklist/introduction-to-tasklist.md)
- [Optimize]($optimize$/components/what-is-optimize)
- [Identity](/self-managed/identity/what-is-identity.md)
- Keycloak, a dependency of Identity
- [Connectors](/components/connectors/introduction.md)

The **Web Modeler and Console** namespace consists as outlined in the [architecture diagram](#architecture) of the following components:

- Web Modeler
- [Console](/self-managed/console-deployment/overview.md)

Ideally Web Modeler and Console are connected to either the same Identity as the **Orchestration cluster** or their own Identity instance but everyone utilizing the same OIDC connection.

## Requirements

This guide focuses on a single-region application but can be easily adapted for a multi-region setup once you understand the basics of a single region.

For more details on multi-region configurations, especially dual-region setups, refer to the [dedicated page on the topic](/self-managed/concepts/multi-region/dual-region.md).

### Infrastructure

We recommend using an officially [certified Kubernetes](https://www.cncf.io/training/certification/software-conformance/#benefits) distribution.

Camunda 8 is not tied to a specific Kubernetes version. To simplify deployment, we provide a [Helm Chart](/self-managed/setup/install.md) for easy installation on Kubernetes. The latest Helm Chart is typically compatible with Kubernetes' [official support cycle](https://kubernetes.io/releases/).

#### Minimum cluster requirements

The following are suggested minimum requirements, but sizing depends heavily on your specific use cases and workload. We recommend reviewing the documentation on [sizing your environment](/components/best-practices/architecture/sizing-your-environment.md) and [Zeebe resource planning](/self-managed/zeebe-deployment/operations/resource-planning.md), as well as conducting benchmarking to determine your exact requirements.

- `4` Kubernetes Nodes
  - Modern CPU: `4 Cores`
  - Memory: `16 GiB`
- Persistent Volumes
  - `1,000 IOPS`
  - `32 GiB` size
  - _avoid burstable disk types_

#### Networking

While networking is largely managed through services and load balancers, understanding port usage can be useful - especially if explicit whitelisting is required within a private network.

- Stable, high-speed network connection
- Configured firewall rules to allow necessary traffic:
  - **80**: Web UI (Console, Identity, Keycloak, Operate, Optimize, Tasklist, Web Modeler)
  - **82**: Metrics endpoint (Identity)
  - **8080**: REST endpoint (Connectors, Keycloak, Zeebe Gateway)
  - **8071 / 8091**: Management endpoint (Web Modeler)
  - **8092**: Management endpoint (Optimize)
  - **9100**: Management endpoint (Console)
  - **9600**: Management endpoint (Operate, Tasklist, Zeebe Brokers, Zeebe Gateway)
  - **26500**: gRPC endpoint.
  - **26501**: Gateway-to-broker communication.
  - **26502**: Inter-broker communication.
- Load balancer for distributing traffic and exposing Camunda 8 to users (if required)

The exposed Kubernetes service port does not always match the target port of the components. You can find the correct target ports in the rendered Helm Chart or the configuration pages of each component.

:::note Databases

Databases were not considered as those should be maintained outside and ports may differ from the upstream defaults.

The defaults for the databases are:

- **5432**: PostgreSQL
- **9200 / 9300**: Elasticsearch / OpenSearch

:::

##### Load Balancer

The Zeebe Gateway requires `gRPC` to work, which in itself requires `HTTP/2` to be used. Additionally, it's recommended to secure the endpoint with a TLS certificate.

The Camunda 8 Helm chart by default is compatible with the [ingress-nginx controller](https://github.com/kubernetes/ingress-nginx), which supports `gRPC` and `HTTP/2`. This is a general applicable solution independent of the cloud provider.

`Ingress-nginx` deploys a Network Load Balancer (layer 4).

Important annotations that are added by the Helm chart are the following to enable `gRPC`:

```yaml
annotations:
  nginx.ingress.kubernetes.io/backend-protocol: "GRPC"
```

### Application

The Helm chart required for deploying on Kubernetes is [publicly available](https://helm.camunda.io/).

Camunda is maintaining the required Docker images which are consumed by the Helm chart, those can be found publicly on [DockerHub](https://hub.docker.com/u/camunda).

If you are interested in the `Dockerfile` and what defaults are configured, you can find it as part of the [Camunda repository](https://github.com/camunda/camunda/blob/stable/8.7/Dockerfile).

### Database

Outlined in the [reference architecture overview](/self-managed/reference-architecture/reference-architecture.md#architecture) following databases are required:

- Elasticsearch / OpenSearch
  - required by Operate, Optimize, Tasklist, and Zeebe
- PostgreSQL
  - required by Identity, Keycloak, and Web Modeler

We currently don't have a recommendation on the sizing as it's highly use case dependent.

It is crucial to conduct thorough load testing and benchmark tests to determine the appropriate size specific to your environment and use case.

The [Grafana dashboard](/self-managed/zeebe-deployment/operations/metrics.md#grafana) in combination with [Prometheus](https://prometheus.io/) can be useful to determine bottlenecks when it comes to Zeebe exporting data to Elasticsearch / OpenSearch.

## Cloud specifics

### Amazon EKS

#### Minimum cluster requirements

- Instance type: `m6i.xlarge` (4 vCPUs, 16 GiB Memory)
- Number of Kubernetes nodes: `4`
- Volume type: `SSD gp3`
  - `3,000 IOPS` baseline
  - Requires [Amazon EBS CSI driver](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) to be installed and a `gp3 StorageClass` [to be configured](https://docs.aws.amazon.com/eks/latest/userguide/create-storage-class.html).
- Volume alternative: `gp2`
  - Only if `gp3` isn't available
  - IOPS performance [varies based on volume size](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/general-purpose.html#gp2-performance)
  - Minimum `34 GiB` for > `1,000 IOPS`

#### Load balancer

AWS offers different types of load balancers. Those namely being:

- Classic Load Balancer (CLB) - previous generation, unsupported by Camunda 8
- Network Load Balancer (NLB)
- Application Load Balancer (ALB)

##### Application Load Balancer (ALB)

AWS offers an [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) (ALB), which would require TLS termination in the load balancer and supports the AWS Certificate Manager (ACM).

- Deploy the [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/).
- A [certificate set up](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) in the AWS Certificate Manager (ACM).
- Follow the [example by AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/examples/grpc_server.md) to configure the Ingress for Camunda. To summarize, add the following annotations to the Camunda ingress:

```yaml
alb.ingress.kubernetes.io/ssl-redirect: "443"
alb.ingress.kubernetes.io/backend-protocol-version: GRPC
alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS":443}]'
alb.ingress.kubernetes.io/scheme: internet-facing
alb.ingress.kubernetes.io/target-type: ip
```

- This does not require the configuration of the [TLS on the ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls)
- If the AWS Load Balancer Controller is correctly set up, it automatically pulls the correct certificate from ACM based on the host name.

##### Network Load Balancer (NLB)

As mentioned in the [load balancer](#load-balancer) section, you can use [ingress-nginx](https://github.com/kubernetes/ingress-nginx). In this setup, TLS must be terminated within the ingress.

AWS Certificate Manager (ACM) is not compatible with NLB in this scenario, as ACM does not allow exporting the private key required for TLS termination within the ingress.

### Microsoft AKS

#### Minimum cluster requirements

- Instance type: `Standard_D4as_v4` (4 vCPUs, 16 GiB Memory)
- Number of Kubernetes nodes: `4`
- Volume type: `Premium SSD v2`
  - `3,000 IOPS` baseline
  - several [known limitations](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssd-v2-limitations)
    - e.g. lack of [Azure Backup support](https://learn.microsoft.com/en-us/azure/backup/disk-backup-support-matrix#limitations)
- Volume alternative: `Premium SSD`
  - IOPS performance [varies based on volume size](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssds)
  - Minimum `256 GiB` (P15) for > `1,000 IOPS`

#### Load balancer

Azure offers alternative load-balancing solutions, including the **Application Gateway for Containers**, which replaces the older **Application Gateway Ingress Controller (AGIC)**. This gateway supports **gRPC** and **HTTP/2** via the `GRPCRoute` resource in the [Kubernetes Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/). Configuration details can be found in [official Azure documentation](https://learn.microsoft.com/en-us/azure/application-gateway/for-containers/grpc).

### Google GKE

#### Minimum cluster requirements

- Instance type: `n(1|2)-standard-4` (4 vCPUs, 15 / 16 GB Memory)
- Number of Kubernetes nodes: `4`
- Volume type: `Performance (SSD) persistent disks`
  - IOPS performance [varies based on volume size](https://cloud.google.com/compute/docs/disks/performance#performance_factors)
  - Minimum `34 GiB` for > `1,000 IOPS`

#### Load balancer

If you are using the [GKE Ingress](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress) (ingress-gce), you might need to do extra steps. Namely, using `cloud.google.com/app-protocols` annotations in the **Zeebe Gateway** service. For more details, visit the GKE guide [using HTTP/2 for load balancing with Ingress](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-http2).
