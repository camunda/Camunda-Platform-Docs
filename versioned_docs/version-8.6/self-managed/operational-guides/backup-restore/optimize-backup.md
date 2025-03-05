---
id: optimize-backup
title: Backup and restore Optimize data
description: "How to perform a backup of Optimize data and restore the backup."
keywords: ["backup", "backups"]
---

Optimize stores its data over multiple indices in Elasticsearch. To ensure data integrity across indices, a backup of Optimize data consists of two Elasticsearch snapshots, each containing a different set of Optimize indices. Each backup is identified by a positive integer backup ID. For example, a backup with ID `123456` consists of the following Elasticsearch snapshots:

```
camunda_optimize_123456_3.9.0_part_1_of_2
camunda_optimize_123456_3.9.0_part_2_of_2
```

Optimize provides an API to trigger a backup and retrieve information about a given backup's state. During backup creation Optimize can continue running. The backed up data can later be restored using the standard Elasticsearch snapshot restore API.

## Prerequisites

The following prerequisites must be set up before using the backup API:

1. A snapshot repository of your choice must be registered with Elasticsearch.
2. The repository name must be specified using the `CAMUNDA_OPTIMIZE_BACKUP_REPOSITORY_NAME` environment variable, or by adding it to your Optimize [`environment-config.yaml`]($optimize$/self-managed/optimize-deployment/configuration/system-configuration/):

```yaml
backup:
  repositoryName: <repository name>
```

## Create backup API

Note that the backup API can be reached via the `/actuator` management port, which by default is `8092`.
The configured context path does not apply to the management port.

The following endpoint can be used to trigger the backup process:

```
POST actuator/backups
{
  "backupId": <backupId>
}
```

### Response

| Code             | Description                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 202 Accepted     | Backup process was successfully initiated. To determine whether backup process was completed refer to the GET API.                          |
| 400 Bad Request  | Indicates issues with the request, for example when the `backupId` contains invalid characters.                                             |
| 409 Conflict     | Indicates that a backup with the same `backupId` already exists.                                                                            |
| 500 Server Error | All other errors, e.g. issues communicating with Elasticsearch for snapshot creation. Refer to the returned error message for more details. |
| 502 Bad Gateway  | Optimize has encountered issues while trying to connect to Elasticsearch.                                                                   |

### Example request

```shell
curl --request POST 'http://localhost:8092/actuator/backups' \
-H 'Content-Type: application/json' \
-d '{ "backupId": 123456 }'
```

### Example response

```json
{
  "message": "Backup creation for ID 123456 has been scheduled. Use the GET API to monitor completion of backup process"
}
```

## Get backup info API

Note that the backup API can be reached via the `/actuator` management port, which by default is `8092`.
The configured context path does not apply to the management port.

Information about a specific backup can be retrieved using the following request:

```
GET actuator/backups/{backupId}
```

Information about all existing Optimize backups can be retrieved by omitting the optional `backupId` parameter:

```
GET actuator/backup
```

### Response

| Code             | Description                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200 OK           | Backup state could be determined and is returned in the response body (see example below).                                                                               |
| 400 Bad Request  | There is an issue with the request, for example the repository name specified in the Optimize configuration does not exist. Refer to returned error message for details. |
| 404 Not Found    | If a backup ID was specified, no backup with that ID exists.                                                                                                             |
| 500 Server Error | All other errors, e.g. issues communicating with Elasticsearch for snapshot state retrieval. Refer to the returned error message for more details.                       |
| 502 Bad Gateway  | Optimize has encountered issues while trying to connect to Elasticsearch.                                                                                                |

### Example request

```shell
curl --request GET 'http://localhost:8092/actuator/backups/123456'
```

### Example response

```json
  {
    "backupId": 123456,
    "failureReason": null,
    "state": "COMPLETE",
    “details”: [
      {
          "snapshotName": "camunda_optimize_123456_3.10.0_part_1_of_2",
          "state": "SUCCESS",
          "startTime": "2022-11-09T10:11:36.978+0100",
          "failures": []
      },
      {
          "snapshotName": "camunda_optimize_123456_3.10.0_part_2_of_2",
          "state": "SUCCESS",
          "startTime": "2022-11-09T10:11:37.178+0100",
          "failures": []
      }
    ]
  }
```

Note that the endpoint will return a single item when called with a `backupId` and a list of items when called without specifying a `backupId`.

Possible states of the backup:

- `COMPLETE`: The backup can be used for restoring data.
- `IN_PROGRESS`: The backup process for this backup ID is still in progress.
- `FAILED`: Something went wrong when creating this backup. To find out the exact problem, use the [Elasticsearch get snapshot status API](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/get-snapshot-status-api.html) for each of the snapshots included in the given backup.
- `INCOMPATIBLE`: The backup is incompatible with the current Elasticsearch version.
- `INCOMPLETE`: The backup is incomplete (this could occur when the backup process was interrupted or individual snapshots were deleted).

## Delete backup API

Note that the backup API can be reached via the `/actuator` management port, which by default is `8092`.
The configured context path does not apply to the management port.

An existing backup can be deleted using the below API which deletes all Optimize snapshots associated with the supplied backupID.

```
DELETE actuator/backups/{backupId}
```

### Response

| Code             | Description                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 204 No Content   | The delete request for the associated snapshots was submitted to Elasticsearch successfully.                                                                             |
| 400 Bad Request  | There is an issue with the request, for example the repository name specified in the Optimize configuration does not exist. Refer to returned error message for details. |
| 500 Server Error | An error occurred, for example the snapshot repository does not exist. Refer to the returned error message for details.                                                  |
| 502 Bad Gateway  | Optimize has encountered issues while trying to connect to Elasticsearch.                                                                                                |

### Example request

```shell
curl --request DELETE 'http://localhost:8092/actuator/backups/123456'
```

## Restore backup

There is no Optimize API to perform the backup restore. Instead, the standard [Elasticsearch restore snapshot API](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/restore-snapshot-api.html) can be used. Note that the Optimize versions of your backup snapshots must match the currently running version of Optimize. You can identify the version at which the backup was taken by the version tag included in respective snapshot names; for example, a snapshot with the name`camunda_optimize_123456_3.9.0_part_1_of_2` was taken of Optimize version `3.9.0`.

:::note
Optimize must NOT be running while a backup is being restored.
:::

To restore an existing backup, all the snapshots this backup contains (as listed in the response of the [create backup API request](#example-response)) must be restored using the Elasticsearch API.

To restore a given backup, the following steps must be performed:

1. Stop Optimize.
2. Ensure no Optimize indices are present in Elasticsearch (or the restore process will fail).
3. Iterate over all Elasticsearch snapshots included in the desired backup and restore them using the Elasticsearch restore snapshot API.
4. Start Optimize.

Example Elasticsearch request:

```shell
curl --request POST `http://localhost:9200/_snapshot/repository_name/camunda_optimize_123456_3.9.0_part_1_of_2/_restore?wait_for_completion=true`
```
