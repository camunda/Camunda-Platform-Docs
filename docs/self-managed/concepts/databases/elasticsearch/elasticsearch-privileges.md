---
id: elasticsearch-privileges
title: "Elasticsearch privileges"
---

If you implement Camunda 8 with Elasticsearch as a service provider, you must configure Elasticsearch with the following [privileges](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-privileges.html) in mind:

## Cluster privileges

- `monitor` - necessary for health check
- `manage_index_templates` to create and manage index schema on start up, if they don't already exist in Elasticsearch.
- _Optional_ `manage_ilm` - required only when ILM is enabled

To use the [backup feature](/self-managed/operational-guides/backup-restore/backup-and-restore.md), you must have snapshot privileges:

- `create_snapshot`
- `monitor_snapshot`

When [updating](/self-managed/operational-guides/update-guide/introduction.md) to a newer version of Camunda 8 which requires data migration, Operate requires pipelines:

- `manage_pipeline`

More information on cluster privileges in Elasticsearch can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-privileges.html#privileges-list-cluster).

## Indices privileges

- `create_index`
- `delete_index`
- `read`
- `write`
- `manage`
- _Optional_ `manage_ilm` - required only when ILM is enabled

More information on indices privileges in Elasticsearch can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-privileges.html#privileges-list-indices).
