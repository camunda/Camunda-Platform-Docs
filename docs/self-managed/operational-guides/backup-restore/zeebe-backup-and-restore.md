---
id: zeebe-backup-and-restore
title: "Backup and restore Zeebe data"
description: "Create a backup of a running Zeebe cluster comprised of a consistent snapshot of all partitions."
keywords: ["backup", "backups"]
---

A backup of a Zeebe cluster is comprised of a consistent snapshot of all partitions. The backup is taken asynchronously in the background while Zeebe is processing. Thus, the backups can be taken with minimal impact on typical processing. The backups can be used to restore a cluster in case of failures that lead to full data loss or data corruption.

Zeebe provides a REST API to create backups, query, and manage existing backups.
The backup management API is a custom endpoint `backups`, available via [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/2.7.x/reference/htmlsingle/#actuator.endpoints). This is accessible via the management port of the gateway. The API documentation is also available as [OpenApi specification](https://github.com/camunda/camunda/blob/main/dist/src/main/resources/api/backup-management-api.yaml).

## Configuration

To use the backup feature in Zeebe, you must choose which external storage system you will use.
Make sure to set the same configuration on all brokers in your cluster.

Zeebe supports [S3](#s3-backup-store), [Google Cloud Storage (GCS)](#gcs-backup-store), [Azure](#azure-backup-store) and [local filesystem](#filesystem-store) for external storage.

:::caution
Backups created with one store are not available or restorable from another store.

This is especially relevant if you were using GCS through the S3 compatibility mode and want to switch to the new built-in support for GCS now.
Even when the underlying storage bucket is the same, backups from one are not compatible with the other.
:::

### S3 backup store

To store your backups in any S3 compatible storage system such as [AWS S3] or [MinIO], set the backup store to `S3` and tell Zeebe how to connect to your bucket. This configuration can be set in your Zeebe [`config/application.yaml`](/docs/self-managed/zeebe-deployment/configuration/configuration.md):

```yaml
zeebe:
  broker:
    data:
      backup:
        store: S3
        s3:
          bucketName:
          basePath:
          region:
          endpoint:
          accessKey:
          secretKey:
```

Alternatively, you can configure backup store using environment variables:

- `ZEEBE_BROKER_DATA_BACKUP_STORE` - Set this to `S3` to store backups in S3 buckets.
- `ZEEBE_BROKER_DATA_BACKUP_S3_BUCKETNAME` - The backup is stored in this bucket. **The bucket must already exist**.
- `ZEEBE_BROKER_DATA_BACKUP_S3_BASEPATH` - If the bucket is shared with other Zeebe clusters, a unique basePath must be configured.
- `ZEEBE_BROKER_DATA_BACKUP_S3_ENDPOINT` - If no endpoint is provided, it is determined based on the configured region.
- `ZEEBE_BROKER_DATA_BACKUP_S3_REGION` - If no region is provided, it is determined [from the environment](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html#automatically-determine-the-aws-region-from-the-environment).
- `ZEEBE_BROKER_DATA_BACKUP_S3_ACCESSKEY` - If either `accessKey` or `secretKey` is not provided, the credentials are determined [from the environment](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html#credentials-chain).
- `ZEEBE_BROKER_DATA_BACKUP_S3_SECRETKEY` - Specify the secret key.

[AWS S3]: https://aws.amazon.com/s3/
[MinIO]: https://min.io/

#### Backup Encryption

Zeebe does not support backup encryption natively, but it _can_ use encrypted S3 buckets. For AWS S3, this means [enabling default bucket encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html).

Using default bucket encryption gives you control over the encryption keys and algorithms while being completely transparent with Zeebe.

Combined with TLS between Zeebe and the S3 API, backups are fully encrypted in transit and at rest. Other S3 compatible services might have similar features that should work as well.

#### Backup compression

Backups can be large depending on your usage of Zeebe. To reduce S3 storage costs and upload times, you can enable backup compression.

Zeebe compresses backup data immediately before uploading to S3 and buffers the compressed files in a temporary directory. Compression and buffering of compressed files can have a negative effect if Zeebe is heavily resource constrained.

You can enable compression by specifying a compression algorithm to use. We recommend using [zstd] as it provides a good trade off between compression ratio and resource usage.

More compression algorithms are available; check [commons-compress] for a full list.

```yaml
zeebe.broker.data.backup.s3.compression: zstd # or use environment variable ZEEBE_BROKER_DATA_BACKUP_S3_COMPRESSION
```

[zstd]: https://github.com/facebook/zstd
[commons-compress]: https://commons.apache.org/proper/commons-compress/

### GCS backup store

:::note
The GCS backup strategy utilizes the [Google Cloud Storage REST API](https://cloud.google.com/storage/docs/request-endpoints).
:::

To store your backups in Google Cloud Storage (GCS), choose the `GCS` backup store and tell Zeebe which bucket to use. This configuration can be set in your Zeebe [`config/application.yaml`](/self-managed/zeebe-deployment/configuration/configuration.md):

```yaml
zeebe:
  broker:
    data:
      backup:
        store: GCS
        gcs:
          bucketName: # or use environment variable ZEEBE_BROKER_DATA_BACKUP_GCS_BUCKETNAME
          basePath: # or use environment variable ZEEBE_BROKER_DATA_BACKUP_GCS_BASEPATH
```

The bucket specified with `bucketName` **must already exist**, Zeebe will not try to create one for you.
To prevent misconfiguration, Zeebe will check at startup that the specified bucket exists and can be accessed, and log at WARN level if the bucket does not exist.

Setting a `basePath` is not required but useful if you want to use the same bucket for multiple Zeebe clusters.
When `basePath` is set, Zeebe will only create and access objects under this path.
This can be any string that is a valid [object name](https://cloud.google.com/storage/docs/objects#naming), for example the name of your cluster.

Authentication is handled by [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials).
In many cases, these credentials are automatically provided by the runtime environment.
If you need more control, you can customize authentication by [setting environment variable](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) `GOOGLE_APPLICATION_CREDENTIALS`.

#### Backup encryption

There are multiple [data encryption options](https://cloud.google.com/storage/docs/encryption), some of which are supported by Zeebe:

- [Default server-side encryption](https://cloud.google.com/storage/docs/encryption/default-keys) is fully supported.
  This is enabled by default for all GCS buckets.
- [Customer-managed encryption keys](https://cloud.google.com/storage/docs/encryption/customer-managed-keys) are supported if they are [set as
  the default key](https://cloud.google.com/storage/docs/encryption/using-customer-managed-keys#set-default-key) for your bucket.
- [Customer-supplied encryption keys](https://cloud.google.com/storage/docs/encryption/customer-supplied-keys) are not supported.
- [Client-side encryption keys](https://cloud.google.com/storage/docs/encryption/client-side-keys) are not supported.

### Azure backup store

To store your backups in Azure Storage, choose the `AZURE` backup store and specify how to connect with the Azure container. This configuration can be set in your Zeebe [`config/application.yaml`](/self-managed/zeebe-deployment/configuration/configuration.md):

```yaml
zeebe:
  broker:
    data:
      backup:
        store: AZURE
        azure:
          endpoint:
          accountName:
          accountKey:
          connectionString:
          basePath:
```

Alternatively, you can configure backup store using environment variables:

- `ZEEBE_BROKER_DATA_BACKUP_STORE` - Set this to `AZURE` to store backups in Azure buckets.
- `ZEEBE_BROKER_DATA_BACKUP_AZURE_ENDPOINT` - Name of the endpoint where the backup will be stored.
- `ZEEBE_BROKER_DATA_BACKUP_AZURE_ACCOUNTNAME` - The account name that is used to connect to the service.
- `ZEEBE_BROKER_DATA_BACKUP_AZURE_ACCOUNTKEY` - The account key that is used to connect to the service.
- `ZEEBE_BROKER_DATA_BACKUP_AZURE_CONNECTIONSTRING` - The [connection string](https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) to connect to the service. If this is defined, it will override the account name, account key, and endpoint.
- `ZEEBE_BROKER_DATA_BACKUP_AZURE_BASEPATH` - The base path is used to define the container name where the blobs will be saved. This value must not be empty. When `basePath` is set, Zeebe will only create and access objects under this path.
  This can be any string that is a valid [container name](https://learn.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names), for example the name of your cluster.

#### Backup encryption

- [Default server-side encryption](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#about-azure-storage-service-side-encryption) is fully supported, is enabled by default, and can't be switched off.
- [Customer-managed encryption keys](https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) are supported if they are configured in the Azure store.
- [Customer-provided encryption keys](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-customer-provided-keys) are not supported.
- [Client-side encryption keys](https://learn.microsoft.com/en-us/azure/storage/blobs/client-side-encryption?tabs=dotnet) are not supported.

### Filesystem store

To store your backups in the local filesystem, choose the `FILESYSTEM` backup store and specify where to store the backups locally. This configuration can be set in your Zeebe [`config/application.yaml`](/self-managed/zeebe-deployment/configuration/configuration.md):

```yaml
zeebe:
  broker:
    data:
      backup:
        store: FILESYSTEM
        filesystem:
          basePath:
```

Alternatively, you can configure backup store using environment variables:

- `ZEEBE_BROKER_DATA_BACKUP_STORE` - Set this to `FILESYSTEM` to store backups in the local filesystem.
- `ZEEBE_BROKER_DATA_BACKUP_FILESYSTEM_BASEPATH` - The base path is used to define the parent directory of all create backups and backup-manifest files. This directory must exist and be writable by the Zeebe broker.

#### Backup encryption

Zeebe does not support backup encryption natively, but it _can_ use filesystem based encryption. This then is a feature of the filesystem and not Zeebe itself.

## Create backup API

The following request can be used to start a backup.

### Request

```
POST actuator/backups
{
  "backupId": <backupId>
}
```

A `backupId` is an integer and must be greater than the ID of previous backups that are completed, failed, or deleted.
Zeebe does not take two backups with the same ids. If a backup fails, a new `backupId` must be provided to trigger a new backup.
The `backupId` cannot be reused, even if the backup corresponding to the backup ID is deleted.

<details>
  <summary>Example request</summary>

```shell
curl --request POST 'http://localhost:9600/actuator/backups' \
-H 'Content-Type: application/json' \
-d '{ "backupId": "100" }'
```

</details>

### Response

| Code             | Description                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 202 Accepted     | A Backup has been successfully scheduled. To determine if the backup process was completed, refer to the GET API.        |
| 400 Bad Request  | Indicates issues with the request, for example when the `backupId` is not valid or backup is not enabled on the cluster. |
| 409 Conflict     | Indicates a backup with the same `backupId` or a higher ID already exists.                                               |
| 500 Server Error | All other errors. Refer to the returned error message for more details.                                                  |
| 502 Bad Gateway  | Zeebe has encountered issues while communicating to different brokers.                                                   |
| 504 Timeout      | Zeebe failed to process the request within a pre-determined timeout.                                                     |

<details>
  <summary>Example response body with 202 Accepted</summary>

```json
{
  "message": "A backup with id 100 has been scheduled. Use GET actuator/backups/100 to monitor the status."
}
```

</details>

## Get backup info API

Information about a specific backup can be retrieved using the following request:

### Request

```
GET actuator/backups/{backupId}
```

<details>
  <summary>Example request</summary>

```shell
curl --request GET 'http://localhost:9600/actuator/backups/100'
```

</details>

### Response

| Code             | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| 200 OK           | Backup state could be determined and is returned in the response body (see example below). |
| 400 Bad Request  | There is an issue with the request. Refer to the returned error message for details.       |
| 404 Not Found    | A backup with that ID does not exist.                                                      |
| 500 Server Error | All other errors. Refer to the returned error message for more details.                    |
| 502 Bad Gateway  | Zeebe has encountered issues while communicating to different brokers.                     |
| 504 Timeout      | Zeebe failed to process the request within a pre-determined timeout.                       |

When the response is 200 OK, the response body consists of a JSON object describing the state of the backup.

- `backupId`: ID in the request.
- `state`: Gives the overall status of the backup. The state can be one of the following:
  - `COMPLETED` if all partitions have completed the backup.
  - `FAILED` if at least one partition has failed. In this case, `failureReason` contains a string describing the reason for failure.
  - `INCOMPLETE` if at least one partition's backup does not exist.
  - `IN_PROGRESS` if at least one partition's backup is in progress.
- `details`: Gives the state of each partition's backup.
- `failureReason`: The reason for failure if the state is `FAILED`.

<details>
  <summary>Example response body with 200 OK</summary>

```json
{
  "backupId": 100,
  "details": [
    {
      "brokerVersion": "8.2.0-SNAPSHOT",
      "checkpointPosition": 5,
      "createdAt": "2022-12-08T13:00:55.344276672Z",
      "lastUpdatedAt": "2022-12-08T13:00:55.805351556Z",
      "partitionId": 1,
      "snapshotId": "2-1-3-2",
      "state": "COMPLETED"
    },
    {
      "brokerVersion": "8.2.0-SNAPSHOT",
      "checkpointPosition": 7,
      "createdAt": "2022-12-08T13:00:55.370965069Z",
      "lastUpdatedAt": "2022-12-08T13:00:55.84756566Z",
      "partitionId": 2,
      "snapshotId": "3-1-5-3",
      "state": "COMPLETED"
    }
  ],
  "state": "COMPLETED"
}
```

</details>

## List backups API

Information about all backups can be retrieved using the following request:

### Request

```
GET actuator/backups
```

<details>
  <summary>Example request</summary>

```shell
curl --request GET 'http://localhost:9600/actuator/backups'
```

</details>

### Response

| Code             | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| 200 OK           | Backup state could be determined and is returned in the response body (see example below). |
| 400 Bad Request  | There is an issue with the request. Refer to returned error message for details.           |
| 500 Server Error | All other errors. Refer to the returned error message for more details.                    |
| 502 Bad Gateway  | Zeebe has encountered issues while communicating to different brokers.                     |
| 504 Timeout      | Zeebe failed to process the request with in a pre-determined timeout.                      |

When the response is 200 OK, the response body consists of a JSON object with a list of backup info.
See [get backup info API response](#response-1) for the description of each field.

<details>
  <summary>Example response body with 200 OK</summary>

```json
[
  {
    "backupId": 100,
    "details": [
      {
        "brokerVersion": "8.2.0-SNAPSHOT",
        "createdAt": "2022-12-08T13:00:55.344276672Z",
        "partitionId": 1,
        "state": "COMPLETED"
      },
      {
        "brokerVersion": "8.2.0-SNAPSHOT",
        "createdAt": "2022-12-08T13:00:55.370965069Z",
        "partitionId": 2,
        "state": "COMPLETED"
      }
    ],
    "state": "COMPLETED"
  },
  {
    "backupId": 200,
    "details": [
      {
        "brokerVersion": "8.2.0-SNAPSHOT",
        "createdAt": "2022-12-08T13:01:15.27750375Z",
        "partitionId": 1,
        "state": "COMPLETED"
      },
      {
        "brokerVersion": "8.2.0-SNAPSHOT",
        "createdAt": "2022-12-08T13:01:15.279995106Z",
        "partitionId": 2,
        "state": "COMPLETED"
      }
    ],
    "state": "COMPLETED"
  }
]
```

</details>

## Delete backup API

A backup can be deleted using the following request:

### Request

```
DELETE actuator/backups/{backupId}
```

<details>
  <summary>Example request</summary>

```shell
curl --request DELETE 'http://localhost:9600/actuator/backups/100'
```

</details>

### Response

| Code             | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| 204 No Content   | The backup has been deleted.                                                     |
| 400 Bad Request  | There is an issue with the request. Refer to returned error message for details. |
| 500 Server Error | All other errors. Refer to the returned error message for more details.          |
| 502 Bad Gateway  | Zeebe has encountered issues while communicating to different brokers.           |
| 504 Timeout      | Zeebe failed to process the request with in a pre-determined timeout.            |

## Restore

A new Zeebe cluster can be created from a specific backup. Camunda provides a standalone app which must be run on each node where a Zeebe broker will be running. This is a Spring Boot application similar to the broker and can run using the binary provided as part of the distribution. The app can be configured the same way a broker is configured - via environment variables or using the configuration file located in `config/application.yaml`.

To restore a Zeebe cluster, run the following in each node where the broker will be running:

```
tar -xzf zeebe-distribution-X.Y.Z.tar.gz -C zeebe/
./bin/restore --backupId=<backupId>
```

If restore was successful, the app exits with a log message of `Successfully restored broker from backup`.

Restore fails if:

- There is no valid backup with the given backupId.
- Backup store is not configured correctly.
- The configured data directory is not empty.
- Any other unexpected errors.

If the restore fails, you can re-run the application after fixing the root cause.

:::note
When restoring, provide the same configuration (node id, data directory, cluster size, and replication count) as the broker that will be running in this node. The partition count must be same as in the backup.
:::
