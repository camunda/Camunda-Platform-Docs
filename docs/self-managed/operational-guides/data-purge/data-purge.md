---
id: data-purge
title: "Data purge"
description: "Purge data from your cluster"
---

The data purge feature allows you to delete all runtime and historical data from your cluster. This operation resets the cluster to an empty state while maintaining the original topology.

The purge operation performs two main actions:
1. **Runtime Data Deletion**: Removes all live data from brokers, for example process definitions, instances, and jobs.
2. **Historical Data Purge**: Clears exported data from configured exporters

The data purge feature can be used to:
- Delete data between test runs and therefore enabling reuse of the same cluster for multiple tests.
- Resetting development or staging environments to a clean state.


## Purge data

You will need access to the Cluster API as described in the [Cluster scaling guide](self-managed/zeebe-deployment/operations/cluster-scaling.md) to perform the purge.

:::danger
The purge operation is irreversible. It will delete the runtime data in the cluster and the historical data in the exporters! Make sure to back up your data before proceeding.
:::

### 1. Send the purge request to the Zeebe Gateway

To purge data from your cluster, send a `POST` request to the `/actuator/cluster/purge` endpoint:

```
curl -X POST 'http://localhost:9600/actuator/cluster'
```

The response is a JSON object. See detailed specs [here](https://github.com/camunda/camunda/blob/main/dist/src/main/resources/api/cluster/cluster-api.yaml):

```
{
  changeId: <changeId>
  currentTopology: [...]
  plannedChanges: [...]
  expectedTopology: [...]
}
```

- `changeId`: The ID of the changes initiated to scale the cluster. This can be used to monitor the progress of the scaling operation. The ID typically increases so new requests get a higher ID than the previous one.
- `currentTopology`: A list of current brokers and the partition distribution.
- `plannedChanges`: A sequence of operations that has to be executed to achieve scaling.
- `expectedToplogy`: The expected list of brokers and the partition distribution once the scaling is completed. For the purge feature the expected topology will be the same as the current topology.

<details>
  <summary>Example response</summary>

```
{
  "changeId": 2,
  "currentTopology": [
    {
      "id": 0,
      "state": "ACTIVE",
      "version": 0,
      "lastUpdatedAt": "0000-01-01T00:00:00Z",
      "partitions": [
        {
          "id": 1,
          "state": "ACTIVE",
          "priority": 1,
          "config": {
            "exporting": {
              "exporters": []
            }
          }
        }
      ]
    }
  ],
  "plannedChanges": [
    {
      "operation": "PARTITION_LEAVE",
      "brokerId": 0,
      "partitionId": 1,
      "brokers": []
    },
    {
      "operation": "DELETE_HISTORY",
      "brokers": []
    },
    {
      "operation": "PARTITION_BOOTSTRAP",
      "brokerId": 0,
      "partitionId": 1,
      "priority": 1,
      "brokers": []
    }
  ],
  "expectedTopology": [
    {
      "id": 0,
      "state": "ACTIVE",
      "version": 4,
      "lastUpdatedAt": "2025-03-04T09:50:14.979435Z",
      "partitions": [
        {
          "id": 1,
          "state": "ACTIVE",
          "priority": 1,
          "config": {
            "exporting": {
              "exporters": []
            }
          }
        }
      ]
    }
  ]
}
```
</details>

The purging is done asynchronously. 

### 2. Monitor the progress of the purge operation

The purge operation can take some time to complete, depending on the amount of data and the type of exporter. 

You can monitor the progress of the operation by sending a `GET` request to the `/actuator/cluster` endpoint:

```
curl --request GET 'http://localhost:9600/actuator/cluster'
```

When the scaling has completed, the `changeId` from the previous response will be marked as completed:

```
{
  "version": 3,
  "brokers": [
    {
      "id": 0,
      "state": "ACTIVE",
      "version": 4,
      "lastUpdatedAt": "2025-03-04T09:50:15.534347Z",
      "partitions": [
        {
          "id": 1,
          "state": "ACTIVE",
          "priority": 1,
          "config": {
            "exporting": {
              "exporters": []
            }
          }
        }
      ]
    }
  ],
  "lastChange": {
    "id": 2,
    "status": "COMPLETED",
    "startedAt": "2025-03-04T09:50:14.980254Z",
    "completedAt": "2025-03-04T09:50:15.534398Z"
  }
}
```

## Considerations

### 1. Use the `--dry-run` flag

You can use the `--dry-run` flag to simulate the purge operation without deleting any data. This can be useful to understand the impact of the operation before proceeding.

```
curl -X POST 'http://localhost:9600/actuator/cluster/purge?dry-run=true'
```

### 2. Don't perform the purge operation during other cluster operations 

You cannot perform the purge operation if another cluster operation is already in progress (for example scaling).

Similarly, you cannot perform other cluster operations while the purge operation is in progress.

## Troubleshooting

The data purge operation is idempotent, meaning you can retry the operation if it fails. 

### 409 - ConcurrentChangeError

The `409 - ConcurrentChangeError` response means another cluster operation is already in progress. Wait for the current operation to complete before retrying the purge operation.
