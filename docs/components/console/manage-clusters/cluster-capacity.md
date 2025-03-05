---
id: cluster-capacity
title: Cluster capacity
description: "Cluster capacity provides you with a high-level overview of how well a cluster is coping with and handling its current workload."
---

import CapacityImg from './img/cluster-capacity.png';
import CapacityPercentImg from './img/cluster-capacity-percent.png';

View and manage your cluster capacity and health.

## About cluster capacity

Cluster capacity provides a high-level overview of how well a cluster is coping with its current workload.

- Use this information to check and monitor if a cluster is appropriately sized for its workload.
- Cluster capacity can also be used as an indicator of cluster health. For example, a cluster running at maximum capacity can be an indicator of poor cluster responsiveness.

A general guideline to follow when using cluster capacity as a metric is:

- **High capacity**: The higher the capacity, the more likely it is that things will slow down, time out, requests will fail, and so on.
- **Low capacity**: The lower the capacity, the more you could increase the cluster workload as the cluster is probably underused.

:::info
To understand how cluster capacity is calculated, see [how cluster capacity is calculated](#capacity-calculation).
:::

## View cluster capacity

The cluster capacity percentage is shown in the **Capacity** column on the Console **Clusters** tab.

<img src={CapacityPercentImg} alt="Example cluster capacity percentage" />

Select a cluster to view detailed cluster capacity information on the cluster **Overview** tab.

<img src={CapacityImg} alt="Example cluster capacity" style={{width: '550px'}}/>

- The current cluster capacity is shown as a percentage bar at the top of the section.
- The chart shows detailed capacity data for the last 24 hours, 7 days, or 30 days.
  - Select the time period you want to view data for.
  - Hover over individual nodes in the chart to view data for a specific time or day.
- Click the **Refresh** icon to refresh and update the cluster capacity data.

## Manage cluster capacity

Cluster capacity will fluctuate based on incoming user requests, and internal processing load.

- User requests are those sent directly by an external client.
- Internal load refers to all other processing that is **not** directly triggered by a client. For example, timer events, a job being made available after back off, and so on.

This means that cluster capacity could fluctuate throughout the day. For example:

- Capacity might be higher during business hours, but lower overnight when the cluster is unused.
- Certain processes can cause a "fan-out" effect, where even though creating a process instance is only a single user request, it could require computation on a very large multi-instance collection, resulting in a high capacity spike.
- You could have a spike in capacity if a large number of timers are triggered at the same time.

### High capacity

A high capacity does not necessarily mean that a cluster needs to be resized, but it could indicate that your cluster is overloaded.

> A high capacity benchmark is relative, but generally **anything above 60%** is considered high capacity.

If the capacity is high, but your operations are completing within an acceptable timeframe, requests are successful, and so on, then you do not need to take any action.

If you find yourself experiencing any of the following, then you might need to investigate and take action:

- REST clients are receiving a high number of `429` errors.
- gRPC clients are receiving a high number of `RESOURCE_EXHAUSTED` errors.
- More and more commands or queries are timing out in your clients.
- Web components are slowing down, or showing data that is severely out of date (for example, 1 hour).

In this scenario, you should look at reducing the overall load on the cluster to try and lower the cluster capacity value.

### Reduce cluster capacity

If your cluster capacity is too high, you can help reduce cluster capacity by:

- Scaling down the load. For example, by stopping certain clients. Start with your least critical load, and continue from there.
- Check your running process instances for known issues that cause high processing, such as:
  - Straight-through processing loops, where there are no wait states. For example, a sub process with an error boundary event which loops back to an activity leading into the sub-process. If you have an activity which consistently throws an error, this will result in a subtle infinite loop where the engine is stuck and cannot process anything else. You would have to cancel this instance, or contact support to force cancel it for you.

:::important
If your cluster capacity continues to remain high even after attempts to reduce it, you might need to increase your cluster size and scale. See [cluster size](/components/concepts/clusters.md#cluster-size) and [sizing your environment](/components/best-practices/architecture/sizing-your-environment.md).
:::

## How cluster capacity is calculated {#capacity-calculation}

Cluster capacity is based on the cluster's [flow control configuration](/self-managed/operational-guides/configure-flow-control/configure-flow-control.md).

Essentially, if flow control is configured, every partition is assigned a [write rate](/self-managed/operational-guides/configure-flow-control/configure-flow-control.md#exporting-and-write-rate) and a [write rate limit](/self-managed/operational-guides/configure-flow-control/configure-flow-control.md#write-rate-limit).

This means a partition's cluster capacity is defined as:

`(writeRate / writeRateLimit)`

This gives a value between 0 and 1, which is multiplied by 100 to give the partition capacity as a percentage.

The cluster capacity is then the average of the capacity of all partitions in the cluster.

:::note
The partition capacity is _only_ calculated and reported on the current partition leader.
:::
