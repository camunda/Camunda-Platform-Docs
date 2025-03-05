---
id: backup-and-restore
title: "Backup and restore"
sidebar_label: "Backup and restore"
keywords: ["backup", "backups"]
---

:::note
The Camunda 8.8 release introduces breaking changes for [Operate, Tasklist and Optimize](./webapps-backup.md).
:::

You can use the backup feature of Camunda 8 Self-Managed to regularly back up the state of all of its components (Zeebe, Operate, Tasklist, and Optimize) without any downtime (except Web Modeler, see [the Web Modeler backup and restore documentation](./modeler-backup-and-restore.md)).
In case of failures that lead to data loss, you can recover the cluster from a backup.

A backup of a Camunda 8 cluster consists of a backup of Zeebe, Operate, Tasklist, Optimize, and exported Zeebe records in Elasticsearch. Since the data of these applications are dependent on each other, it is important that the backup is consistent across all components. The backups of individual components taken independently may not form a consistent recovery point. Therefore, you must take the backup of a Camunda 8 cluster as a whole. To ensure a consistent backup, follow the process described below.

### Configure backup store

To take backups, you must first configure backup storage.

Operate, Tasklist, and Optimize use Elasticsearch as backend storage and use the snapshot feature of Elasticsearch for backing up their state. Therefore, you must configure a [snapshot repository](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshots-register-repository.html) in Elasticsearch.

Zeebe stores its backup to an external storage and must be configured before the cluster is started. Refer to [Zeebe backup configuration](/self-managed/operational-guides/backup-restore/zeebe-backup-and-restore.md#configuration) for additional information.

### Backup process

The backup of each component and the backup of a Camunda 8 cluster is identified by an ID. This means a backup `x` of Camunda 8 consists of backup `x` of Zeebe, and backup `x` of the web applications (Optimize, Operate, and Tasklist). The backup ID must be an integer and greater than the previous backups.

:::note
We recommend using the timestamp as the backup id.
:::

To back up a Camunda 8 cluster, execute the following sequential steps:

1. Soft pause exporting in Zeebe. See [Zeebe management API](/self-managed/zeebe-deployment/operations/management-api.md).
2. Trigger a backup `x` of the web applications. See [how to take a web application backup](/self-managed/operational-guides/backup-restore/webapps-backup.md).
3. Wait until the backup `x` of web applications is complete. See [how to monitor a web application backup](/self-managed/operational-guides/backup-restore/webapps-backup.md).
4. Take a backup `x` of the exported Zeebe records in Elasticsearch using the Elasticsearch Snapshots API.

```

PUT /_snapshot/my_repository/camunda_zeebe_records_backup_x
{
   "indices": "zeebe-record*",
   "feature_states": ["none"]
}

```

By default, the indices are prefixed with `zeebe-record`. If you have configured a different prefix when configuring Elasticsearch exporter in Zeebe, use this instead.

5. Wait until the backup `x` of the exported Zeebe records is complete before proceeding.
6. Take a backup `x` of Zeebe. See [how to take a Zeebe backup](/self-managed/operational-guides/backup-restore/zeebe-backup-and-restore.md).
7. Wait until the backup `x` of Zeebe is completed before proceeding. See [how to monitor a Zeebe backup](/self-managed/operational-guides/backup-restore/zeebe-backup-and-restore.md).
8. Resume exporting in Zeebe. See [Zeebe management API](/self-managed/zeebe-deployment/operations/management-api.md).

:::note
If any of the steps above fail, you may have to restart with a new backup id. Ensure exporting is resumed if the backup process force quits in the middle of the process.
:::

### Restore

To restore a Camunda 8 cluster from a backup, all components must be restored from their backup corresponding to the same backup id:

1. Start Zeebe, Operate, Tasklist, and Optimize. (To ensure templates/aliases etc. are created)
2. Confirm proper configuration (such as shards, replicas count, etc.)
3. Stop Operate, Tasklist, and Optimize.
4. Delete all indices.
5. Restore the state of the [web applications](/self-managed/operational-guides/backup-restore/webapps-backup.md).
6. Restore `zeebe-records*` indices from Elasticsearch snapshot.
7. Restore [Zeebe](/self-managed/operational-guides/backup-restore/zeebe-backup-and-restore.md).
8. Start Zeebe, Operate, Tasklist, and Optimize.
