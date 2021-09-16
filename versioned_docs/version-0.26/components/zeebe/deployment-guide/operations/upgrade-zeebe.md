---
id: upgrade-zeebe
title: "Upgrade Zeebe"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

This section describes how to upgrade Zeebe to a new version.

:::caution
Currently, we are facing an [issue](https://github.com/zeebe-io/zeebe/issues/5581) that can corrupt the data when upgrading to a new version. The issue affects the reprocessing (i.e. rehydrating the data from the records on the log stream) and can be omitted by restoring the data from a snapshot. Please follow the recommended procedure to minimize the risk of losing data. **This issue affects only users upgrading from a version lower than 0.24.4 to 0.24.4 or newer.**
:::

## Rolling upgrade

Zeebe is designed to allow a rolling upgrade of a cluster. The brokers can be upgrade one after the other. The other brokers in the cluster continue processing until the whole upgrade is done.

1. Upgrade the first broker and wait until it is ready again
1. Continue with the next broker until all brokers are upgraded
1. Upgrade the standalone gateways

:::tip Helm Charts
If you are using the Helm charts, simply update your values file and change the image tag to the new version you wish to upgrade to, then follow the [Helm upgrade guide](https://helm.sh/docs/helm/helm_upgrade/).
:::

:::caution
If you are upgrading from a Zeebe version lower than 0.24.4, it is not recommended to perform a rolling upgrade. Please follow the recommended upgrade procedure instead.
:::

## Upgrade procedure for Zeebe < 0.24.4

The following procedure describes how to upgrade a Zeebe broker pre 0.24.4. If the cluster contains multiple brokers then these steps can be done for all brokers in parallel. Standalone gateways should be upgraded after all brokers in the cluster are upgraded to avoid mismatches in the protocol version.

:::caution
This procedure results in a downtime of the whole cluster.
:::

### Experimental: Detect reprocessing inconsistency

With Zeebe 0.24.5 and 0.25.1 a new exterimental feature was introduced which detects inconsistency of the logstream on upgrade to mitigate the following issue.

We recommend to enable it after upgrading Zeebe from a version lower than 0.24.4 to a version greater than or equal to 0.24.4 on the first run after the upgrade, as described in the update proceedure. You can enable it using the following environment variable:

`ZEEBE_BROKER_EXPERIMENTAL_DETECTREPROCESSINGINCONSISTENCY="true"`

After you verified that the upgrade was successful, we recommend to disable it again by removing the environment variable and restarting your brokers.

### Preparing the upgrade

1. Stop the workflow processing
    * Close all job workers
    * Interrupt the incoming connections to avoid user commands
1. Wait until a snapshot is created for all partitions
    * By default, a snapshot is created every 15 minutes
    * Verify that a snapshot is created by looking at the [Metric](metrics.md) `zeebe_snapshot_count` on the leader and the followers
    * Note that no snapshot is created if no processing happened since the last snapshot
1. Make a backup of the `data` folder

### Performing the upgrade

<Tabs groupId="in-zeebe-version" defaultValue="inconsistency-detection-enabled" values={[ 
{ label: 'With inconsistency detection', value: 'inconsistency-detection-enabled', }, 
{ label: 'Without inconsistency detection', value: 'inconsistency-detection-disabled', }, 
] }>

<TabItem value="inconsistency-detection-enabled">

1. Shut down the broker
1. Replace the `/bin` and `/lib` folders with the versions of the new distribution
1. Start up the broker with the experimental inconsistency detection enabled
1. [Verify the upgrade](#verifying-the-upgrade)
1. Restart the broker with experimental inconsistency detection disabled

</TabItem>

<TabItem value="inconsistency-detection-disabled">

1. Shut down the broker
1. Replace the `/bin` and `/lib` folders with the versions of the new distribution
1. Start up the broker
1. [Verify the upgrade](#verifying-the-upgrade)

</TabItem>
</Tabs>

### Verifying the upgrade

The upgrade is successful if the following conditions are met:

* the broker is ready (see [Ready Check](health.md#ready-check))
* the broker is healthy (see [Health Check](health.md#health-check))
* all partitions are healthy (see the [Metric](metrics.md#metrics-related-to-health) `zeebe_health`)
* the stream processors of the partition leaders are in the phase `PROCESSING` (see [Partitions Admin Endpoint](#partitions-admin-endpoint))

If the upgrade failed because of a known issue then a partition change its status to unhealthy, and the log output may contain the following error message:

<details>
  <summary>Sample Upgrade Error Message</summary>
  <p>

```
Unexpected error on recovery happens.
io.zeebe.engine.processor.InconsistentReprocessingException: Reprocessing issue detected!
  Restore the data from a backup and follow the recommended upgrade procedure. [cause:
  "The key of the record on the log stream doesn't match to the record from reprocessing.",
  log-stream-record: {"partitionId":1,"value":{"version":1,"bpmnProcessId":"parallel-tasks",
  "workflowKey":2251799813685249,"parentElementInstanceKey":-1,"parentWorkflowInstanceKey":-1,
  "bpmnElementType":"PARALLEL_GATEWAY","flowScopeKey":2251799813685251,
  "elementId":"ExclusiveGateway_0tkgnd5","workflowInstanceKey":2251799813685251},
  "key":2251799813685256,"sourceRecordPosition":4294997784,"valueType":"WORKFLOW_INSTANCE",
  "timestamp":1601025180728,"recordType":"EVENT","intent":"ELEMENT_ACTIVATING",
  "rejectionType":"NULL_VAL","rejectionReason":"","position":4294998112},
  reprocessing-record: {key=2251799813685255, sourceRecordPosition=4294997784,
  intent=WorkflowInstanceIntent:ELEMENT_ACTIVATING, recordType=EVENT}]
```

  </p>
</details>

In this case, the broker should be rolled back to the previous version and the backup should be restored. Ensure that the upgrade was prepared correctly. If it is still unclear why it was not successful then please contact the Zeebe team and ask for guidance.

## Partitions admin endpoint

This endpoint allows querying the status of the partitions and performing operations to prepare an upgrade.

<Tabs groupId="in-zeebe-version" defaultValue="since-0.24" values={[ 
{ label: 'In version 0.23', value: '0.23', }, 
{ label: 'In version >= 0.24', value: 'since-0.24', }, 
] }>

<TabItem value="0.23">

The endpoint is available under `http://{zeebe-broker}:{zeebe.broker.network.monitoringApi.port}/partitions` (default port: `9600`). 

It is enabled by default and cannot be disabled.

</TabItem>

<TabItem value="since-0.24">

The endpoint is available under `http://{zeebe-broker}:{zeebe.broker.network.monitoringApi.port}/actuator/partitions` (default port: `9600`).

It is enabled by default. It can be disabled in the configuration by setting:

```
management.endpoint.partitions.enabled=false
```

</TabItem>
</Tabs>

### Query the partition status

The status of the partitions can be queried by a `GET` request:
```
/actuator/partitions
```

The response contains all partitions of the broker mapped to the partition-id.

<details>
  <summary>Full Response</summary>
  <p>

```
{
    "1":{
        "role":"LEADER",
        "snapshotId":"399-1-1601275126554-490-490",
        "processedPosition":490,
        "processedPositionInSnapshot":490,
        "streamProcessorPhase":"PROCESSING"
    }
}
```

  </p>
</details>
