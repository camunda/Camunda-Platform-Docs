---
id: index
title: "Kubernetes deployment"
sidebar_label: "Overview"
---

We recommend that you use Kubernetes when deploying Zeebe to production.

## Deployment options

| Option                                                      | Comment                                                                                                                                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Helm](helm/index.md)                                       | Helm allows you to choose exactly what chart (set of components) do you want to install and how these components needs to be configured.                                                    |
| [Zeebe Operator (experimental)](operator/zeebe-operator.md) | The objective of the Zeebe k8s Operator is to simplify and natively integrate Zeebe with k8s, to solve operational burden and facilitate the creation and maintenance of a set of clusters. |

## General information

### Broker

Zeebe broker nodes need to be deployed as a [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), in order to preserve the identity of cluster nodes. StatefulSets require persistent storage, which needs to be allocated in advance. Depending on your cloud provider, the persistent storage will differ, as it is provider-specific.

In the [zeebe-kubernetes](https://github.com/zeebe-io/zeebe-kubernetes) repository you will find example Kubernetes manifests to configure a three broker cluster with the Elastic Search exporter and the Operate preview. Examples are provided for provisioning storage on Google Cloud Platform, and Microsoft Azure.

There are many ways that you can provision and configure a Kubernetes cluster. And there are a number of architectural choices you need to make: will your workers run in the Kubernetes cluster or external to it?

You will need to configure your Kubernetes cluster and modify this to suit the architecture you are building.

### Gateway

Zeebe gateway is deployed as a stateless service.

We support [Kubernetes startup and liveness probes](../operations/health.md#gateway) for Zeebe gateway.
