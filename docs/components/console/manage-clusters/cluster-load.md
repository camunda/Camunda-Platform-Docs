---
id: cluster-load
title: Cluster load
description: "If your organization works within Camunda's Enterprise plan, you can create cluster backups."
---

View and manage the cluster load of your clusters in Console.

## Overview

Cluster load is a measurement showing how efficiently a cluster is performing in relation to the processing load and requirements it is placed under.

This helps you identify if a cluster is not performing efficiently, allowing you to take appropriate action such as...(increasing cluster size?).

:::info
To understand how cluster load is calculated, see [How cluster load is calculated](#how-cluster-load-is-calculated).
:::

## View cluster load

You can view a percentage summary of cluster load on the Console **Dashboard** tab and **Clusters** tab.

[screenshot]

You can view more detailed information for an individual cluster on the Console **Overview** tab.

[screenshot]

## Manage cluster load

Cluster load will typically fluctuate in response to processing requests. For example, it may be higher during certain times of day, or when running particular processes.

Your cluster load should ideally be around x%, ranges etc. If your cluster is running at 100% load, it is at its maximum capacity for processing work and performing other cluster-related tasks. This can affect the performance of your processes and Camunda 8 components.

High cluster load is typically defined as anything above x%, and can cause the following issues:

- issue x

### Reduce cluster load

If your cluster load is too high, you can help reduce cluster load by:

- action x...

:::note
If your cluster load continues to remain high even after attempts to reduce it, you might need to increase your cluster size and scale. See [cluster size](/components/concepts/clusters.md#cluster-size) and [sizing your environment](/components/best-practices/architecture/sizing-your-environment.md).
:::

## How cluster load is calculated

Cluster load is defined and calculated as...
