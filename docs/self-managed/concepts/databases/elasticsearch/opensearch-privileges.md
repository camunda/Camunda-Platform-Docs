---
id: opensearch-privileges
title: "OpenSearch privileges"
---

If you implement Camunda 8 with OpenSearch as a service provider, you must configure OpenSearch with the following [permissions](https://opensearch.org/docs/latest/security/access-control/permissions/) and [default action groups](https://opensearch.org/docs/latest/security/access-control/default-action-groups/) in mind:

Action groups are a set of permissions. Permissions have the `cluster|indices` prefix; all others are action groups.

## Cluster

- `cluster_monitor` - Necessary for health check.
- `cluster:admin/reindex/rethrottle` - Necessary to archive and migrate indices.
- `cluster_manage_pipelines` - Necessary to migrate indices.
- `manage_snapshots` - Necessary to take backups.
- `indices:admin/index_template/put` - Necessary to create and manage index schema on start up and migration.
- `indices:admin/index_template/get` - Necessary to create and manage index schema on start up and migration.
- `indices:admin/index_template/delete` - Necessary to create and manage index schema on start up and migration.
- `indices:data/read/scroll/clear` - Necessary to search with paging.
- `cluster_manage_templates` - Necessary to create and manage index schema on start up.
- `cluster_manage_index_templates` - Necessary to create and manage index schema on start up.

## Indices

- `data_access` - Necessary to query and read.
- `get` - Necessary to read.
- `delete` - Necessary to create, archive, and migrate data.
- `create_index` - Necessary to create index schema and archive.
- `search` - Necessary to query.
- `manage` - Necessary to create index schema, archive, and migrate.

## Index state management

Add in the cluster section of permissions for using index state management (ISM):

- `cluster:admin/opendistro/ism/managedindex/add`
- `cluster:admin/opendistro/ism/managedindex/change`
- `cluster:admin/opendistro/ism/managedindex/remove`
- `cluster:admin/opendistro/ism/policy/write`
- `cluster:admin/opendistro/ism/policy/get`
- `cluster:admin/opendistro/ism/policy/delete`
