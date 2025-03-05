---
id: announcements
title: "Announcements"
description: "Important announcements including deprecation & removal notices"
---

## Camunda 8.4

Release date: 9th of January 2024

End of maintenance: 9th of July 2025

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

### Form linking

:::caution
The [form linking](/components/modeler/web-modeler/advanced-modeling/form-linking.md#using-the-link-button) feature is impacted by an [issue](https://github.com/camunda/camunda/issues/16311) where the wrong forms can get linked with new user task instances, effectively corrupting the user task instance. If you make use of this feature and run either `8.4.0`, `8.4.1` or `8.4.2`, we urge you to update to the newest `8.4.3` patch that includes the required fix.

Follow the instructions in the [form linking](/components/modeler/web-modeler/advanced-modeling/form-linking.md#known-issues-with-linked-forms) documentation to resolve this issue.
:::

### Versioning changes in Helm chart

As of the 8.4 release, the Camunda 8 **Helm chart** version is decoupled from the version of the application. The Helm chart release still follows the applications release cycle, but it has an independent version. (e.g., in the application release cycle 8.4, the chart version is 9.0.0).

For more details about the applications version included in the Helm chart, review the [full version matrix](https://helm.camunda.io/camunda-platform/version-matrix/).

### Dockerfile numeric ID

The Dockerfile now uses a numeric user ID instead of a non-numeric user.
This will allow the Helm users to use `runAsNonRoot=true` without the need to explicitly set the ID in the Helm `values.yaml` file.

### Deprecated in 8.4

The [Zeebe configuration properties for Camunda Identity](../self-managed/zeebe-deployment/configuration/gateway.md#zeebegatewayclustersecurityauthenticationidentity)
were deprecated in `8.4`. Please use the dedicated Camunda Identity properties or the [corresponding environment variables](../self-managed/identity/deployment/configuration-variables.md#core-configuration).

### Versioning changes in Elasticsearch

As of the 8.4 release, Camunda is compatible with Elasticsearch 8.9+ and no longer supports older Elasticsearch versions. See [supported environments](/docs/reference/supported-environments.md).

### Support for Amazon OpenSearch

As of the 8.4 release, Zeebe, Operate, and Tasklist are now compatible with [Amazon OpenSearch](https://aws.amazon.com/de/opensearch-service/) 2.5.x. Note that using Amazon OpenSearch requires [setting up a new Camunda installation](/self-managed/platform-deployment/overview.md). A migration from previous versions or Elasticsearch environments is currently not supported.

:::info
The Helm charts are not yet prepared with the OpenSearch configurations as templates/pre-filled. The Helm charts can still be used to install for OpenSearch, but some adjustments are needed beforehand. Refer to the [Helm deployment documentation](/self-managed/platform-deployment/helm-kubernetes/deploy.md) for further details.
:::

### Known limitations

This release contains the following limitations:

- In **Operate `8.4.0`**
  - **Bug**
    - **Description:** Instance migration always points to the latest process version
    - **Reference:** https://github.com/camunda/issues/issues/567
    - **Mitigation:** Bug is planned to be fixed with upcoming `8.4.1` release
  - **Bug**
    - **Description:** Backwards migration over multiple versions does not work
    - **Reference:** https://github.com/camunda/issues/issues/568
    - **Mitigation:** Bug is planned to be fixed with upcoming `8.4.1` release
- In **Camunda HELM `9.0.x`**
  - **Limitation**
    - **Description:** The existing Helm charts use the Elasticsearch configurations by default and are not yet prepared with the OpenSearch configurations as templates/pre-filled. The Helm charts can still be used to install for OpenSearch, but some adjustments are needed beforehand.
    - **Reference:** n/a
    - **Mitigation:**
      1. Refer to our [docs for the installation](../self-managed/platform-deployment/helm-kubernetes/deploy.md#components-installed-by-the-helm-charts), the docs include guidance about necessary adjustments of the Helm chart configuration.
      2. The OpenSearch configuration in Helm charts will be provided in one of our future Helm releases.
- In **Connectors `8.4.x`**
  - **Missing feature**
    - **Description:** Custom OIDC provider support for Connectors is missing
    - **Reference:** https://github.com/camunda/issues/issues/569
    - **Mitigation:**
      1. Feature is planned to be delivered with an upcoming patch release. Please see [issue](https://github.com/camunda/issues/issues/569) for latest progress.
      2. [Disable Connectors component](../self-managed/platform-deployment/helm-kubernetes/guides/connect-to-an-oidc-provider.md#configuration) when configuring a custom OIDC provider.

## Camunda 8.3

Release date: 10th of October 2023

End of maintenance: 9th of April 2025

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

### Versioning changes in Elasticsearch

As of the 8.3 release, Camunda is compatible with Elasticsearch 8.8+ and no longer supports Elasticsearch 7.x. See [supported environments](/docs/reference/supported-environments.md).

### Versioning changes in Helm chart

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

The [DeployProcess RPC](/apis-tools/zeebe-api/gateway-service.md#deployprocess-rpc) was deprecated in 8.0.
It is replaced by the [DeployResource RPC](/apis-tools/zeebe-api/gateway-service.md#deployresource-rpc).

## Camunda Cloud 1.3

Release date: 11th of January 2022

Camunda Cloud is out of maintenance.

### Deprecated in 1.3

The `zeebe-test` module was deprecated in 1.3.0. We are currently planning to remove `zeebe-test` for the 1.4.0 release.
