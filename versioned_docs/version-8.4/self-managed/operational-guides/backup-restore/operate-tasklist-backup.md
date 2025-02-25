---
id: operate-tasklist-backup
title: Backup and restore Operate and Tasklist data
description: "How to perform a backup and restore of Operate and Tasklist data."
keywords: ["backup", "backups"]
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

Operate stores its data over multiple indices in Elasticsearch. Backup of Operate data includes several
Elasticsearch snapshots containing sets of Operate indices. Each backup is identified by `backupId`. For example, a backup with an id of `123` may contain the following Elasticsearch snapshots:

```
camunda_operate_123_8.1.0_part_1_of_6
camunda_operate_123_8.1.0_part_2_of_6
camunda_operate_123_8.1.0_part_3_of_6
camunda_operate_123_8.1.0_part_4_of_6
camunda_operate_123_8.1.0_part_5_of_6
camunda_operate_123_8.1.0_part_6_of_6
```

Operate provides an API to perform a backup and manage backups (list, check state, delete). Restore a backup using the standard Elasticsearch API.

:::note
The backup API can be reached via the Actuator management port, which by default is the same as application HTTP port (and in turn defaults to 8080). The port may be reconfigured with the help of `management.server.port` configuration parameter.
:::

## Prerequisites

Before you can use the backup and restore feature:

1. The [Elasticsearch snapshot repository](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html) must be configured.
2. Operate and Tasklist must be configured with the repository name using one of the following configuration options:

<Tabs groupId="config" defaultValue="yaml" values={
[
{label: 'YAML file', value: 'yaml', },
{label: 'Environment variables', value: 'env', },
]
}>

<TabItem value='yaml'>

#### Operate

```yaml
camunda:
  operate:
    backup:
      repositoryName: <es snapshot repository name>
```

</TabItem>

<TabItem value='env'>

#### Operate

```
CAMUNDA_OPERATE_BACKUP_REPOSITORYNAME=<es snapshot repository name>
```

</TabItem>
</Tabs>

#### Tasklist

<Tabs groupId="config" className="tabs-hidden" defaultValue="yaml" values={
[
{label: 'YAML file', value: 'yaml', },
{label: 'Environment variables', value: 'env', },
]
}>

<TabItem value='yaml'>

```yaml
camunda:
  tasklist:
    backup:
      repositoryName: <es snapshot repository name>
```

</TabItem>

<TabItem value='env'>

```
CAMUNDA_TASKLIST_BACKUP_REPOSITORYNAME=<es snapshot repository name>
```

</TabItem>
</Tabs>

## Create backup API

During backup creation Operate can continue running. To create the backup, call the following endpoint:

```
POST actuator/backups
{
  "backupId": <backupId>
}
```

Response:

| Code             | Description                                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200 OK           | Backup was successfully started, snapshots will be created asynchronously. List of snapshots is returned in the response body (see example below). This list must be persisted together with the backup id to be able to restore it later. |
| 400 Bad Request  | In case something is wrong with `backupId`, e.g. the same backup id already exists.                                                                                                                                                        |
| 500 Server Error | All other errors, e.g. ES returned error response when attempting to create a snapshot.                                                                                                                                                    |
| 502 Bad Gateway  | Elasticsearch is not accessible, the request can be retried when it is back.                                                                                                                                                               |

Example request:

```
curl --request POST 'http://localhost:8080/actuator/backups' \
-H 'Content-Type: application/json' \
-d '{ "backupId": 123 }'
```

Example response:

```json
{
  "scheduledSnapshots": [
    "camunda_operate_123_8.2.0_part_1_of_6",
    "camunda_operate_123_8.2.0_part_2_of_6",
    "camunda_operate_123_8.2.0_part_3_of_6",
    "camunda_operate_123_8.2.0_part_4_of_6",
    "camunda_operate_123_8.2.0_part_5_of_6",
    "camunda_operate_123_8.2.0_part_6_of_6"
  ]
}
```

## Get backup state API

As a backup is created asynchronously, call the following endpoint to check the state of the backup:

```
GET actuator/backups/{backupId}
```

Response:

| Code             | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| 200 OK           | Backup state could be determined and is returned in the response body.                  |
| 404 Not Found    | Backup with given id does not exist.                                                    |
| 500 Server Error | All other errors, e.g. ES returned error response when attempting to execute the query. |
| 502 Bad Gateway  | Elasticsearch is not accessible, the request can be retried when it is back.            |

For example, the request could look like this:

```
curl 'http://localhost:8080/actuator/backups/123'
```

Example response:

```json
{
  "backupId": 123,
  "state": "COMPLETED",
  "failureReason": null,
  "details":  [
    //here goes the list of all Elasticsearch snapshots included in the backup
    {
      "snapshotName": "camunda_operate_123_8.2.0_part_1_of_6",
      "state": "SUCCESS",
      "startTime": "2023-01-01T10:10:10.100+0000",
      "failures": []
    },
    <..>
  ]
}
```

Possible **states** of the backup:

- `COMPLETED`: Backup can be used for restoring the data.
- `IN_PROGRESS`: Wait until the backup completes to use it for restore.
- `FAILED`: Something went wrong when creating this backup. To find out the exact problem, use the [Elasticsearch get snapshot status API](https://www.elastic.co/guide/en/elasticsearch/reference/current/get-snapshot-status-api.html) for each of the snapshots included in the given backup.
- `INCOMPATIBLE`: Backup is incompatible with the current Elasticsearch version.
- `INCOMPLETE`: Backup is incomplete (e.g. when backup process was interrupted).

**State** of the individual snapshot is a copy of [Elasticsearch state](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/get-snapshot-api.html#get-snapshot-api-response-state).

## Get backups list API

To get the list of existing backups, the following endpoint can be used:

```
GET actuator/backups
```

Response:

| Code             | Description                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 200 OK           | Backup list could be determined and is returned in the response body. Can be an empty response in case no backups were created yet. |
| 404 Not Found    | Backup repository is not configured.                                                                                                |
| 500 Server Error | All other errors, e.g. ES returned error response when attempting to execute the query.                                             |
| 502 Bad Gateway  | Elasticsearch is not accessible, the request can be retried when it is back.                                                        |

For example, the request could look like this:

```
curl 'http://localhost:8080/actuator/backups'
```

Response will contain JSON with array of objects representing state of each backup (see [get backup state API endpoint](#get-backup-state-api)).

## Delete backup API

To delete all the Elasticsearch snapshots associated with the specific backup id, the following endpoint may be used:

```
DELETE actuator/backups/123
```

Response:

| Code             | Description                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 204 No Content   | All commands to delete corresponding ELS snapshots were successfully sent to ELS. ELS will continue deletion asynchronously. |
| 404 Not Found    | Not a single snapshot corresponding to given ID exist.                                                                       |
| 500 Server Error | All other errors, e.g. ES returned error response when attempting to execute the query.                                      |
| 502 Bad Gateway  | Elasticsearch is not accessible, the request can be retried when it is back.                                                 |

## Restore backup

There is no Operate API to preform the backup restore. Instead, use the [Elasticsearch restore snapshot API](https://www.elastic.co/guide/en/elasticsearch/reference/current/restore-snapshot-api.html).

:::note
Operate must **not** be running while a backup restore is taking place.
:::

To restore the backup with a known backup id, you must restore all the snapshots this backup contains (check the response of the [create backup API](#create-backup-api)).

Example of Elasticsearch query:

```
curl --request POST `http://localhost:9200/_snapshot/test/camunda_operate_123_8.1.0-snapshot_part_1_of_6/_restore?wait_for_completion=true`
```

To summarize, the process may look as follows:

1. Stop Operate.
2. Ensure there are no Operate indices present in Elasticsearch (otherwise the restore process will fail).
3. Iterate over all Elasticsearch snapshots included in the desired backup and restore them using the Elasticsearch restore snapshot API.
4. Start Operate.

## Backup and restore of Tasklist data

Backup and restore of Tasklist may be performed in exactly the same way as [Operate data](#).
