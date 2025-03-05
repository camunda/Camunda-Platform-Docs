---
id: announcements
title: "Announcements"
description: "Important announcements including deprecation & removal notices"
---

## Camunda 8.3

Release date: 10th of October 2023

End of maintenance: 9th of April 2025

### Camunda 8 SaaS - Required cluster update

:::caution
By **August 30th, 2024** all automation clusters in Camunda 8 SaaS must be [updated](/components/console/manage-clusters/update-cluster.md) to the following versions at a **minimum**:

- **8.2+gen27**
- **8.3+gen11**
- **8.4+gen7**
- **8.5+gen2**

:::

auth0 announced an End-Of-Life for one of the functionalities that is being utilized by previous automation clusters. The new versions are not using this functionality anymore. This update ensures your cluster will work seamlessly after auth0 deactivates the feature in production.

You minimally need to take the following [update](/components/console/manage-clusters/update-cluster.md) path:

- 8.0.x -> 8.2+gen27
- 8.1.x -> 8.2+gen27
- 8.2.x -> 8.2+gen27
- 8.3.x -> 8.3+gen11
- 8.4.x -> 8.4+gen7
- 8.5.x -> 8.5+gen2

If you do not update the cluster by August 30th 2024, we will update the cluster for you. **Without an update, you would lose access to your cluster.**

Camunda 8 Self-Managed clusters are not affected by this.

:::caution
For existing clusters we recommend updating to `8.3.1` directly and not `8.3.0` due to issues in data migration of Operate, Tasklist, and Optimize that could prolong the migration or even blocking it from finishing.
:::

:::caution Breaking change

### Zeebe Docker image now runs with unprivileged user by default

The default user in the Zeebe Docker image changed from root to an unprivileged user with the UID 1000. This was done to provide stronger compliance with the [OWASP recommendations on Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html#rule-2-set-a-user).

Please refer to the [Update 8.2 to 8.3](/self-managed/operational-guides/update-guide/820-to-830.md) guide.
:::

:::info
The update from `8.2.x` to `8.3.x` performs a migration for nearly all entities stored in Operate, Tasklist, and Optimize to support [multi-tenancy](/self-managed/concepts/multi-tenancy.md). Therefore, migration may take longer.
:::

### Deprecated in 8.3

[Web Modeler's beta API](/apis-tools/web-modeler-api/index.md) was deprecated in 8.3 and will be removed in 8.5.
Use `v1` instead, see [migration hints](/apis-tools/web-modeler-api/index.md#migrating-from-beta-to-v1).

[Zeebe's liveness responsive indicator](https://github.com/camunda/camunda/pull/13685) was removed as part of 8.3.

## Versioning changes in Elasticsearch

As of the 8.3 release, Camunda is compatible with Elasticsearch 8.8+ and no longer supports Elasticsearch 7.x. See [supported environments](/docs/reference/supported-environments.md) which you can [download here](https://www.elastic.co/downloads/past-releases/elasticsearch-8-8-0).

## Versioning changes in Helm chart

[Helm charts versioning](/self-managed/platform-deployment/helm-kubernetes/overview.md) changed in July 2023.

Starting from July 2023 (v8.2.8), the Camunda 8 **Helm chart** version follows the same unified schema
and schedule as [Camunda 8 applications](https://github.com/camunda/camunda-platform).

Before this change, the Camunda 8 **Helm chart** version only followed the minor version.

## Camunda 8.2

Release date: 11th of April 2023

End of maintenance: 8th of October 2024

[Release notes](https://github.com/camunda/camunda-platform/releases/tag/8.2.0)
[Release blog](https://camunda.com/blog/2023/04/camunda-platform-8-2-key-to-scaling-automation/)

### Update from Web Modeler 8.2 to a later minor version

Web Modeler versions 8.2.7 to 8.2.12 are affected by [camunda/issues#677](https://github.com/camunda/issues/issues/677).

If you are using one of these versions, you should first update to Web Modeler 8.2.13 (or a subsequent patch version) before upgrading to a later minor version (8.3 or higher).

If your current version of Web Modeler is 8.2.6 or earlier, you may directly upgrade to a later minor version.

### Breaking changes to the backup API

This release introduces breaking changes, including:

- The [get backup state API and response codes](/self-managed/operational-guides/backup-restore/operate-tasklist-backup.md#get-backup-state-api).
- The backup URL has changed to `/backups`. For example, `curl 'http://localhost:8080/actuator/backups'` (rather than the previously used `backup`).
- `backupId` must be of integer type now instead of string, which is in sync with Zeebe `backupId` requirements.

### Do not update to Camunda 8.2.22

:::caution
Zeebe release `8.2.22` suffers from [camunda/zeebe#16406](https://github.com/camunda/camunda/issues/16406), which results in a Zeebe broker being unable to start if at least one DMN model is deployed. We urge users to skip this release and update to `8.2.23` right away.
:::

### Do not update from Camunda 8.1.X to 8.2.6

An issue in the Operate 8.2.6 patch was discovered after it was published on June 8th.

You should not update directly from 8.1.x to 8.2.6 (it will require manual intervention as indices break), you either first update to 8.2.5 then 8.2.6 or straight from 8.1.x to 8.2.7.

To prevent this entirely we removed the Operate 8.2.6 artifacts from this release.

As Camunda 8.2.7 was already released on Tuesday Jun 13th, you can just update to 8.2.7 directly, skipping 8.2.6.

### OpenSearch 1.3.x support

- Operate version 8.2+ support OpenSearch 1.3.x. However, 8.2.x patches will only be released on the OS 1.3 branch until end of 2023 given that OS 1.3 maintenance period ends by then. We recommend customers to go to 8.4.x which supports OS 2.5+.

### Optimize and Helm chart compatibility

For Optimize 3.10.1, a new environment variable introduced redirection URL. However, the change is not compatible with Camunda Helm charts until it is fixed in 3.10.3 (and Helm chart 8.2.9). Therefore, those versions are coupled to certain Camunda Helm chart versions:

| Optimize version                  | Camunda Helm chart version |
| --------------------------------- | -------------------------- |
| Optimize 3.10.1 & Optimize 3.10.2 | 8.2.0 - 8.2.8              |
| Optimize 3.10.3+                  | 8.2.9 - 8.2.22             |
| Optimize 8.2.7+                   | 8.2.23+                    |

## Camunda 8.1

Release date: 11th of October 2022

End of maintenance: 10th of April 2024

[Release notes](https://github.com/camunda/camunda-platform/releases/tag/8.1.0)
[Release blog](https://camunda.com/blog/2022/10/camunda-platform-8-1-released-whats-new/)

### Do not update to Camunda 8.1.23

:::caution
Zeebe release `8.1.23` suffers from [camunda/zeebe#16406](https://github.com/camunda/camunda/issues/16406), which results in a Zeebe broker being unable to start if at least one DMN model is deployed. We urge users to skip this release and update to `8.1.24` right away.
:::

## Camunda 8.0

Release date: 12th of April 2022

End of maintenance: 11th of October 2023

[Release notes](https://github.com/camunda/camunda-platform/releases/tag/8.0.0)
[Release blog](https://camunda.com/blog/2022/04/camunda-platform-8-0-released-whats-new/)

### Camunda 8.0.15 release is skipped

The `Camunda 8.0.15` release pipeline lead to corrupted `Zeebe 8.0.15` artifacts getting published.
The whole [Camunda 8.0.15 release](https://github.com/camunda/camunda-platform/releases/tag/8.0.15) was thus skipped and updates from `Camunda 8.0.14` should go straight to `Camunda 8.0.16`.

### Deprecated in 8.0

The [DeployProcess RPC](/apis-tools/grpc.md#deployprocess-rpc) was deprecated in 8.0.
It is replaced by the [DeployResource RPC](/apis-tools/grpc.md#deployresource-rpc).

## Camunda Cloud 1.3

Release date: 11th of January 2022

Camunda Cloud is out of maintenance.

### Deprecated in 1.3

The `zeebe-test` module was deprecated in 1.3.0. We are currently planning to remove `zeebe-test` for the 1.4.0 release.

## Camunda Cloud 1.2

Release date: 12th of October 2021

Camunda Cloud is out of maintenance.

## Camunda Cloud 1.1

Release date: 13th of July 2021

Camunda Cloud is out of maintenance.

## Camunda Cloud 1.0

Release date: 11th of May 2021

Camunda Cloud is out of maintenance.

### Removed in 1.0

The support for YAML processes was removed as of release 1.0. The `resourceType` in Deployment record and Process grpc request are deprecated; they will always contain `BPMN` as value.

## Zeebe 0.26.0

### Deprecated in 0.26.0

#### YAML workflows descriptions

YAML workflows are an alternative way to specify simple workflows using a proprietary YAML description. This feature is deprecated and no longer advertised in the documentation. YAML workflows gained little traction with users and we do not intend to support them in the future.

We recommend all users of YAML workflows to migrate to BPMN workflows as soon as possible. The feature will eventually be removed completely, though the date when this will occur has yet to be defined.

## Zeebe 0.23.0-alpha2

### Deprecated in 0.23.0-alpha2

- TOML configuration - deprecated and removed in 0.23.0-alpha2
- Legacy environment variables - deprecated in 0.23.0-alpha2, removed in 0.25.0

New configuration:

```yaml
exporters:
  elasticsearch:
    className: io.camunda.zeebe.exporter.ElasticsearchExporter
  debughttp:
    className: io.camunda.zeebe.broker.exporter.debug.DebugHttpExporter
```

In terms of specifying values, there were two minor changes:

- Memory sizes are now specified like this: `512MB` (old way: `512M`)
- Durations (e.g. timeouts) can now also be given in ISO-8601 Durations format. However, you can still use the established method and specify a timeout of `30s`
