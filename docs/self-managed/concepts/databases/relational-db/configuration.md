---
id: database-configuration
title: "Configuration"
---

## Installation

To enable Camunda to use a relational database, two main configuration steps are required:

1. Add the RDBMS [Exporter](./../../exporters.md) to the Zeebe broker configuration.
2. Enable the RDBMS as primary database
   for [Camunda REST API](./../../../../apis-tools/camunda-api-rest/camunda-api-rest-overview)
3. Configure the database connection. This is done by configuring the Spring datasource.

```yaml
# enable the exporter
zeebe:
  broker:
    exporters:
      rdbms:
        className: RdbmsExporter
        args:
        # see Configuration section for configuration options

# set the RDBMS as primary database for Camunda REST API
camunda:
  database:
    type: rdbms
    url: jdbc:postgresql:camunda # example for a local PostgreSQL database with schema "camunda"
    username: camunda
    password: camunda
```

The RDBMS [Exporter](./../../exporters.md) configuration can be enabled in addition to
other [Exporter](./../../exporters.md) as well. Note, that adding more exporters, can slow down the cluster.

#### DB Schema management

By default, Camunda will automatically create and update the database schema on startup. For this it uses the
tool [Liquibase](https://www.liquibase.com/). In addition to the Camunda core tables, Liquibase will create the two
tables `DATABASECHANGELOG` and `DATABASECHANGELOGLOCK`. These tables must not be changed or updated.

If the target database schema is not empty, it sometimes can be useful to define a prefix for the Camunda tables. This
can be done by setting the following property in the configuration:

```yaml
camunda.database.index-prefix: c8_
```

To disable the automatic schema management, set the following property in the configuration:

```yaml
camunda.database.auto-ddl: false
```

Native SQL scripts for all supported databases can be found in the Camunda distribution (TODO:LINK). These scripts can
be used to create the schema manually.

### Database privileges

To use Camunda with the RDBMS, the configured database user must have the following privileges on the all Camunda
tables (the actual privilege names might depend on the database vendor):

- SELECT
- INSERT
- UPDATE
- DELETE

Optionally, to enable the automatic schema management by Camunda and [Liquibase](https://www.liquibase.com/), the
additional privileges must have been granted before the first start of any Camunda instance:

- CREATE
- ALTER
- DROP

Optionally, to enable the PURGE (TODO: Link) feature of the RDBMS Exporter, the following privilege must be granted to
the camunda database user on all Camunda tables:

- TRUNCATE

## History cleanup

The RDBMS Exporter supports automatic history cleanup. This is implemented in two parts:

When a process instance is finished (completed or terminated), all related data is marked for deletion after a
configurable time-to-live (rdbms exporter configuration `defaultHistoryTTL`).

In addition to that, a periodic cleanup job is executed to delete all marked data. But to not overload the database, not
all marked data is deleted in one run. Instead, the cleanup job deletes a configurable amount of data (rdbms exporter
configuration `historyCleanupBatchSize`) in each run.
The interval between two cleanup runs can be configured with the `minHistoryCleanupInterval`
and `maxHistoryCleanupInterval` properties (both ISO-8601
duration). The cleanup scheduler will dynamically determine the duration until the next cleanup run depending on the
amount of deleted
data.

- When no data is deleted at all, the scheduler will double the duration until the next cleanup run up to the
  configured `maxHistoryCleanupInterval`.
- When the amount of deleted data at the configured `historyCleanupBatchSize` limit, the scheduler will half the
  duration until the next cleanup run to the configured `minHistoryCleanupInterval`.
- Otherwise, the duration until the next cleanup run will stay the same.

## Configuration

### Database configuration

Camunda RDBMS database configuration reference:

| Property name                       | Description                                                                                                                                                                    | Default setting |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| camunda.database.url                | The JDBC connection url of the database                                                                                                                                        | _empty_         |
| camunda.database.user               | The username for the database connection                                                                                                                                       | _empty_         |
| camunda.database.password           | The password for the database connection                                                                                                                                       | _empty_         |
| camunda.database.auto-ddl           | If the Liquibase schemamanagement should be used or not. If not, the DBA has to install the schema from available [scripts](#db-schema-management)                             | true            |
| camunda.database.index-prefix       | A custom prefix for all camunda related database objects.                                                                                                                      | '' (empty)      |
| camunda.database.database-vendor-id | Camunda uses vendor auto-detection vendor specific functions. With this property this auto-detection can be overridden. Possible values: _h2_, _mariadb_, _oracle_, _postgres_ | _empty_         |

### Exporter Configuration

The RDBMS Exporter can be configured in the `args` section of the exporter configuration:

```yaml
# enable the exporter
zeebe.broker.exporters:
  rdbms:
    args:
      propertyName: propertyValue
```

The following configuration options are available:

| Property name             | Description                                                                                                           | Default setting |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------- |
| flushInterval             | The maximum time an exported record waits in the flush queue before being flushed and committed to the database       | 500 (ms)        |
| maxQueueSize              | The maximum number of records that can be added to the flush queue before being flushed and committed to the database | 1000            |
|                           | **History cleanup configuration**                                                                                     |                 |
| defaultHistoryTTL         | The duration a finished processInstance and its related data is kept in the database (ISO-8601 duration)              | P30D            |
| historyCleanupBatchSize   | Maximum amount of deleted entries per cleanup run                                                                     | 1000            |
| minHistoryCleanupInterval | The minimal duration between two history cleanup runs (ISO-8601 duration)                                             | PT1M            |
| maxHistoryCleanupInterval | The maximal duration between two history cleanup runs (ISO-8601 duration)                                             | PT60M           |
