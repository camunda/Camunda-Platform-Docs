---
id: clusters
title: "Clusters"
description: "Learn more about the clusters available in your Camunda 8 plan."
---

A [cluster](../../guides/create-cluster.md) is a provided group of production-ready nodes that run Camunda 8.

When [creating a cluster](/components/console/manage-clusters/create-cluster.md), you can customize the cluster **type** and **size** to meet your organization's availability and scalability needs, and to provide control over cluster performance, uptime, and disaster recovery guarantees.

:::note

Prior to 8.6, clusters were configured by hardware size (S, M, L).

- To learn more about clusters prior to 8.6, see previous documentation versions.
- To learn more about migrating your existing clusters to the newer model, contact your Customer Success Manager.

:::

## Cluster type

The cluster type defines the level of availability and uptime for the cluster.

For example:

- Use a **Basic** cluster for experimentation, early development, and basic use cases not requiring a guaranteed high uptime.
- Use an **Advanced** cluster for production, with minimal disruption and high uptime.

You can choose from three different cluster types:

| Type                                                                                                                                                                                                           | Basic                                                | Standard                      | Advanced                                            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- | :---------------------------- | :-------------------------------------------------- |
| Usage                                                                                                                                                                                                          | Experimentation, early development, basic use cases. | Production-ready use cases.   | Production with minimal disruption and high uptime. |
| Uptime Percentage<br/> (Core Automation Cluster<strong>\*</strong>)                                                                                                                                            | 99%                                                  | 99.5%                         | 99.9                                                |
| Uptime Percentage<br/>(Management Components<strong>\*\*</strong>) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                    | 99%                                                  | 99%                           | 99%                                                 |
| RTO/RPO<strong>\*\*\*</strong><br/>(Core Automation Cluster<strong>\*</strong>) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | RTO: 8 hours<br/>RPO: 24 hours                       | RTO: 2 hours<br/>RPO: 4 hours | RTO: < 1 hour<br/>RPO: < 1 hour                     |

<p><strong>* Core Automation Cluster</strong> means the components critical for automating processes and decisions, such as Zeebe, Operate, Tasklist, Optimize and Connectors.</p>
<p><strong>** Management Components</strong> means the components responsible for designing and making processes and decisions executable, such as Web Modeler and Console.</p>
<p><strong>***  RTO (Recovery Time Objective)</strong> means the maximum allowable time that a system or application can be down after a failure or disaster before it must be restored. It defines the target time to get the system back up and running. <strong>RPO (Recovery Point Objective)</strong> means the maximum acceptable amount of data loss measured in time. It indicates the point in time to which data must be restored to resume normal operations after a failure. It defines how much data you can afford to lose. The RTO/RPO figures shown in the table are provided on a best-effort basis and are not guaranteed.</p>

:::info
See [Camunda Enterprise General Terms](https://legal.camunda.com/licensing-and-other-legal-terms#camunda-enterprise-general-terms) for term definitions for **Monthly Uptime Percentage** and **Downtime**.
:::

## Cluster size

The cluster size defines the cluster performance and capacity.

- You can choose from three sizes of cluster (1x, 2x, 3x).
- Each increase in size boosts cluster performance and adds capacity. Larger cluster sizes allow you to serve more workload.
- Increased usage such as higher throughput or longer data retention requires a larger cluster size. See [sizing your environment](/components/best-practices/architecture/sizing-your-environment.md).
- Each size increase uses one of your available cluster reservations.

### Cluster size hardware packages

Cluster sizes determine the hosting hardware package used for the cluster, as follows:

| Size  | 1x  | 2x  | 3x  |
| :---- | :-- | :-- | :-- |
| Spec? |     |     |     |

### Limitations

- Currently, there are limits on the number of packages you can select.
- Cluster sizes can only be increased for an existing cluster by contacting your Customer Success Manager.

## Free Trial clusters

Free Trial clusters have the same functionality as a production cluster, but are of a Basic type and 1x size, and only available during your trial period. You cannot convert a Free Trial cluster to a different kind of cluster.

Once you sign up for a Free Trial, you are able to create one production cluster for the duration of your trial.

When your Free Trial plan expires, you are automatically transferred to the Free Plan. This plan allows you to model BPMN and DMN collaboratively, but does not support execution of your models. Any cluster created during your trial is deleted, and you cannot create new clusters.

### Auto-pause

Free Trial `dev` (or untagged) clusters are automatically paused eight hours after a cluster is created or resumed from a paused state. Auto-pause occurs regardless of cluster usage.

You can resume a paused cluster at any time, which typically takes five to ten minutes to complete. See [resume your cluster](/components/console/manage-clusters/manage-cluster.md#resume-a-cluster).

- Clusters tagged as `test`, `stage`, or `prod` do not auto-pause.
- Paused clusters are automatically deleted after 30 consecutive paused days. You can change the tag to avoid cluster deletion.
- No data is lost while a cluster is paused. All execution and configuration is saved, but cluster components such as Zeebe and Operate are temporarily disabled until you resume the cluster.

:::tip

To prevent auto-pause, you can:

- Tag the cluster as `test`, `stage`, or `prod` instead of `dev`.
- [Upgrade your Free Trial plan](https://camunda.com/pricing/) to a Starter, Professional, or Enterprise plan.

:::
