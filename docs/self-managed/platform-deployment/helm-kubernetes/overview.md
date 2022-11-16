---
id: overview
title: "Camunda Platform 8 on Kubernetes"
sidebar_label: "Overview"
description: "An overview of Kubernetes, its environments, and officially supported platforms"
---

We strongly recommend using Kubernetes and Helm to deploy and run Camunda Platform 8 in production.

There are many ways you can provision and configure a Kubernetes cluster, and there are a number of architectural choices you need to make. Will your workers run in the Kubernetes cluster or external to it? You will need to configure your Kubernetes cluster and modify this to suit the architecture you are building.

## Kubernetes environments

You can install Camunda Platform 8 on your Kubernetes environment of choice, e.g.:

- [Stock Kubernetes](https://kubernetes.io/docs/).
- [Kubernetes KIND](https://github.com/kubernetes-sigs/kind), Minikube, K3s, and MicroK8s for local development.
- [Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift), an enterprise ready solution with a focus on security.
- Cloud service providers like Google GKE, Azure AKS, Amazon EKS, etc.

## Officially supported platforms

With the right configuration, Camunda Platform 8 could be deployed on any Kubernetes distribution (Cloud or On-premises), however, officially, we test and support a [specific list of platforms](./platforms/platforms.md).

## Use Helm to install on Kubernetes

There are several alternatives to deploy applications to a Kubernetes cluster, but we recommend to use our provided Helm charts to deploy a set of components into your cluster. Helm allows you to choose exactly what chart (set of components) you want to install and how these components need to be configured.

At [helm.camunda.io](https://helm.camunda.io/), you'll find a Helm chart to configure a three-broker cluster with two Elasticsearch instances, Operate, two Zeebe Gateways and Tasklist. This size is comparable with the Production-S cluster plan in [Camunda Platform 8 SaaS](https://camunda.com/get-started/). It should be sufficient for 80% of use cases.

Refer to the [documentation on Camunda's Helm charts](./deploy.md) for details.

To do, you must have the following tools installed in your local environment:

- `kubectl`: Kubernetes Control CLI tool, installed and connected to your cluster
- `helm`: Kubernetes Helm CLI tool

## Useful tools related to Camunda Platform

- **Camunda Modeler**: to model/modify business processes. [Install Camunda Modeler](/components/modeler/desktop-modeler/install-the-modeler.md).
- **Zeebe CTL (`zbctl`)**: command line tool to interact with a Zeebe cluster (local/remote). You can get the `zbctl` tool from the official [Zeebe release page](https://github.com/camunda-cloud/zeebe/releases).
