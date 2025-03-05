---
id: announcements
title: "Announcements"
description: "Important announcements including deprecation & removal notices"
---

## Camunda 8.6

Release date: 8th of Oct 2024

End of maintenance: 14th of April 2026

## Zeebe, Operate, and Tasklist must run on exact same minor and patch levels

From version `8.6.0` forward, the core components Zeebe, Operate, and Tasklist must run the exact same `minor` and `patch` level to ensure compatibility. See the [component version matrix](./supported-environments.md#component-version-matrix) for an overview of components.

### License key changes

With the 8.6 release, Camunda 8 Self-Managed requires a license key for production usage. For additional details, review the [blog post on licensing updates for Camunda 8 Self-Managed](https://camunda.com/blog/2024/04/licensing-update-camunda-8-self-managed/).

Review the following documentation for your components for more information on how to provide the license key to each component as an environment variable:

- [Console](/self-managed/console-deployment/configuration.md#environment-variables)
- [Zeebe](/self-managed/zeebe-deployment/configuration/configuration.md#licensing)
- [Operate](/self-managed/operate-deployment/operate-configuration.md#licensing)
- [Tasklist](/self-managed/tasklist-deployment/tasklist-configuration.md#licensing)
- [Optimize]($optimize$/self-managed/optimize-deployment/configuration/system-configuration-platform-8#licensing)
- [Identity](/self-managed/identity/deployment/configuration-variables.md#license-configuration)
- [Modeler](/self-managed/modeler/web-modeler/configuration/configuration.md#licensing)

To configure with Helm, visit the [Self Managed installation documentation](/self-managed/setup/install.md).

:::note
Camunda 8 components without a valid license may display **Non-Production License** in the navigation bar and issue warnings in the logs. These warnings have no impact on startup or functionality, with the exception that Web Modeler has a limitation of five users. To obtain a license, visit the [Camunda Enterprise page](https://camunda.com/platform/camunda-platform-enterprise-contact/).
:::

### Zeebe Java client

Starting with 8.7, the Zeebe Java client will become the new Camunda Java client. This transition brings a new Java client structure designed to enhance the user experience and introduce new features while maintaining compatibility with existing codebases.

The primary goal of those changes is to enable users to interact with Camunda clusters with one consolidated client rather than multiple. The `CamundaClient` will replace the `ZeebeClient`, offering the same functionality and adding new capabilities. If you need to continue using the old `ZeebeClient`, you can use the version 8.6 artifact without any issues with newer cluster versions as the client is forward-compatible.

:::note
The Zeebe Java client will not be developed further and will only receive bug fixes for as long as version 8.6 is officially supported.
:::

#### Key changes

- **New package structure**:
  - Package `io.camunda.client`: This package contains the new `CamundaClient` and all the features slated for release in version 8.7.
- **Properties and environment variables refactoring**:
  - All old Java client property names will be refactored to more general ones. For instance, `zeebe.client.tenantId` will become `camunda.client.tenantId`.
  - Similarly, environment variables will be renamed following the same concept: `ZEEBE_REST_ADDRESS` will become `CAMUNDA_REST_ADDRESS`.
- **Artifact ID change**:
  - The `artifactId` will change from `zeebe-client-java` to `camunda-client-java`.

### Deprecation: Zeebe Go client & CLI client (zbctl)

The Zeebe Go Client and CLI client (zbctl) will be [officially deprecated](https://camunda.com/blog/2024/09/deprecating-zbctl-and-go-clients/) with the 8.6 release as part of our efforts to streamline the Camunda 8 API experience. This client and CLI utility will not be released starting with Camunda 8.6, will no longer receive new features, and will be transitioned to a community-maintained status.

The documentation of the Zeebe Go Client and CLI client (zbctl) moved to the [community clients section](/apis-tools/community-clients/index.md).

### Zeebe Spring SDK test support in 8.6.7

[Testing support for the Zeebe Spring SDK](../apis-tools/spring-zeebe-sdk/getting-started.md#writing-test-cases) is available in the 8.6.7 release.

:::note
This closes the feature gap where the Zeebe Spring SDK released with Camunda 8.5.0 did not offer the testing support previously available in the [Spring Zeebe Community Project](https://github.com/camunda-community-hub/spring-zeebe/blob/main/README.md#writing-test-cases).
:::

### Camunda 8 SaaS - Required cluster update

:::caution
By **August 30th, 2024** all automation clusters in Camunda 8 SaaS must be [updated](/components/console/manage-clusters/manage-cluster.md#update-a-cluster) to the following versions at a **minimum**:

- **8.2+gen27**
- **8.3+gen11**
- **8.4+gen7**
- **8.5+gen2**

:::

auth0 announced an End-Of-Life for one of the functionalities that is being utilized by previous automation clusters. The new versions are not using this functionality anymore. This update ensures your cluster will work seamlessly after auth0 deactivates the feature in production.

You minimally need to take the following [update](/components/console/manage-clusters/manage-cluster.md#update-a-cluster) path:

- 8.0.x -> 8.2+gen27
- 8.1.x -> 8.2+gen27
- 8.2.x -> 8.2+gen27
- 8.3.x -> 8.3+gen11
- 8.4.x -> 8.4+gen7
- 8.5.x -> 8.5+gen2

If you do not update the cluster by August 30th 2024, we will update the cluster for you. **Without an update, you would lose access to your cluster.**

Camunda 8 Self-Managed clusters are not affected by this.

### Support for Amazon OpenSearch for Optimize

This release extends the OpenSearch features supported by Optimize. Full support is committed for the 8.8 release.

### Supported environment changes (OpenJDK, ElasticSearch, Amazon OpenSearch)

Version changes are made to supported environments:

- OpenJDK minimum version raised to 21+ in Operate
- ElasticSearch minimum version raised to 8.13+
- Amazon OpenSearch minimum version raised to 2.9+

To learn more about supported environments, see [supported environments](/reference/supported-environments.md).

### Connectors

#### Deprecation: None start event element templates for Kafka, RabbitMQ, Amazon SQS, and Amazon SNS inbound Connectors

The [none start event](/components/modeler/bpmn/none-events/none-events.md#none-start-events) element templates for the out-of-the-box Kafka, RabbitMQ, Amazon SQS, and Amazon SNS inbound Connectors have been deprecated in Camunda Modeler.

Users can no longer select these templates when creating a new none start event element in Camunda Modeler. Existing none start event elements with these templates will continue to work as expected, but users are encouraged to migrate to the [message start event](/components/modeler/bpmn/message-events/message-events.md#message-start-events) element templates for these Connectors.

Message start event element templates are better suited for the message-based communication these Connectors provide, and offer more flexibility and features compared to the none start event element templates, such as the ability to define a message ID and a correlation key for idempotency. Read more in the [inbound Connectors documentation](/components/connectors/use-connectors/inbound.md) and the [messaging concepts documentation](/components/concepts/messages.md#message-uniqueness).

#### Breaking changes in the Connector SDK

The `void correlate(Object variables)` method in the `InboundConnectorContext` interface has been removed, following the deprecation in 8.4.0. Use the `CorrelationResult correlateWithResult(Object variables)` method instead.

The `CorrelationResult` record has been changed compared to the previous versions:

- `CorrelationResult.Success` now contains a `ProcessElementContext` that represents the element that was correlated. Compared to the previous version, where the correlated element was returned directly, this change allows accessing element properties after correlation for user-controlled post-correlation actions.
- `CorrelationResult.Failure` now provides the `CorrelationFailureHandlingStrategy` that defines how the failure should be handled.

An example of how to use the new `CorrelationResult` can be found in the [Connector SDK documentation](/components/connectors/custom-built-connectors/connector-sdk.md#inbound-connector-runtime-logic).

### Flow control enabled by default in SaaS

Flow control is now enabled by default in Camunda 8.6 SaaS. This change ensures the cluster is protected from excessive load and can maintain a stable state.

These new configuration defaults are tailored to the cluster size and optimized for a stable performance. However, the cluster might reject requests if the load is too high with this change. The error message for this is `Failed to write client request to partition X, because the write limit is exhausted`. If the error persists, this may be a sign of underlining issues, or a need to adjust the cluster size.

For more information on how to configure flow control for a Self-Managed cluster, visit the [flow control documentation](/self-managed/operational-guides/configure-flow-control/configure-flow-control.md).

### Camunda 8 Self-Managed

#### Helm chart - Separated Ingress deprecation

The separated Ingress Helm configuration for Camunda 8 Self-Managed has been deprecated in 8.6, and will be removed from the Helm chart in 8.8. Only the combined Ingress configuration is officially supported. See the [Ingress guide](/self-managed/setup/guides/ingress-setup.md) for more information on configuring a combined Ingress setup.

#### Helm chart - `global.multiregion.installationType` deprecation

The `global.multiregion.installationType` option is used in failover and failback scenarios. This option in the Helm chart has been deprecated in 8.6, and will be removed from the Helm chart in 8.8. `global.multiregion.installationType` was replaced with a set of API endpoints called while following the ([dual-region operational procedure](/self-managed/operational-guides/multi-region/dual-region-ops.md))

#### Helm chart - Elasticsearch nodes number

The default value of Elasticsearch deployment pods has changed from 2 to 3, and an affinity setting has been added to avoid scheduling Elasticsearch pods on the same Kubernetes worker.

### Camunda Optimize artifact and Docker tag separation

Starting with Camunda 8.6, the Camunda Optimize artifact has been split into two distinct versions, and versioning between Camunda 7 and Camunda 8 is no longer interchangeable:

- **Before Camunda 8.6**: Versions like `8.x` and `3.x` (used for Camunda 7) could sometimes be used interchangeably.
- **From Camunda 8.6 onwards**: `8.6 != 3.14`. Each version corresponds strictly to its platform:
  - **Camunda 7**: Uses the `3.x` versioning scheme and the `latest` Docker tag.
  - **Camunda 8**: Uses the `8.x` versioning scheme and the `8-latest` Docker tag.

#### Action required:

- **Camunda 7 Users**: Continue using `3.x` versions and the `latest` Docker tag.
- **Camunda 8 Users**: If you haven't already done so, update your configurations to use `8.x` versions and the `8-latest` Docker tag.

Make sure to update your Docker configurations accordingly to ensure compatibility.

### New base path for Operate and Tasklist web applications

We are introducing a new base path for both the Operate and Tasklist **web applications**. This change applies to both Self-Managed and SaaS environments.

#### For Self-Managed

- The new base path for Operate is `/operate`, and for Tasklist, it is `/tasklist`.
- For a [Separated Ingress](/self-managed/setup/guides/ingress-setup.md?ingress=separated) configuration:
  - for Operate, the full URL will be `{operate-host}/operate`. Any calls to `{operate-host}` will automatically be redirected to `{operate-host}/operate`
  - for Tasklist, the full URL will be `{tasklist-host}/tasklist`. Any calls to `{tasklist-host}` will automatically be redirected to `{tasklist-host}/tasklist`.
- For a [Combined Ingress](/self-managed/setup/guides/ingress-setup.md?ingress=combined) configuration:
  - for Operate, the full URL will be `{common-host}/{operate-contextPath}/operate`. Any calls to `{common-host}/{operate-contextPath}` will be automatically redirected to `{common-host}/{operate-contextPath}/operate`.
  - for Tasklist, the full URL will be `{common-host}/{tasklist-contextPath}/tasklist`. Any calls to `{common-host}/{tasklist-contextPath}` will be automatically redirected to `{common-host}/{tasklist-contextPath}/tasklist`.

#### For SaaS

- The full URL for Operate is now structured as `https://{region}.operate.camunda.io/{clusterId}/operate`.
- The full URL for Tasklist is now structured as `https://{region}.tasklist.camunda.io/{clusterId}/tasklist`.
- Any calls to `https://{region}.operate.camunda.io/{clusterId}` will be redirected to `https://{region}.operate.camunda.io/{clusterId}/operate`.
- Any calls to `https://{region}.tasklist.camunda.io/{clusterId}` will be redirected to `https://{region}.tasklist.camunda.io/{clusterId}/tasklist`.

:::note
**API URLs** for both Operate and Tasklist remain **unchanged**.
:::

### New default port for `/actuator` endpoints

The `/actuator` endpoints (including `/backups`) now default to port 9600. Ensure your `management.server.port` configuration parameter is correctly set before working with the [management API](/self-managed/zeebe-deployment/operations/management-api.md).

## Camunda 8.5

Release date: 9th of April 2024

End of maintenance: 14th of October 2025

### Updated SaaS URLs

We will simplify the URL for Camunda 8 SaaS from cloud.camunda.io ([console.cloud.camunda.io](https://console.cloud.camunda.io/)) to camunda.io ([console.camunda.io](http://console.camunda.io/)).

On or around July 9th, users will be directed to the new URLs. Both URLs will continue to be active for at least 18 months so navigation from supported versions of components like Operate is still possible.

Internal allowlisting or active rules for [cloud.camunda.io](http://cloud.camunda.io/) must be transitioned to the new [camunda.io](http://camunda.io/) URL. This change primarily affects Console and Modeler. During sign up, users will be briefly redirected through [accounts.cloud.camunda.io](http://accounts.camunda.io/), which will also be updated.

### Syntax changes in Helm chart

A Camunda Helm chart upgrade is not possible from v9.x.x to v10.0.0 or v10.0.1. Instead, upgrade directly to v10.0.2+.

The Camunda Helm chart v10.0.0 has major changes in the values file structure. Some keys in the values file have been changed. For compatibility, the keys are deprecated in the Camunda release cycle 8.5 and will be removed in the Camunda 8.6 release (October 2024).

Follow the [upgrade instructions](/self-managed/setup/upgrade.md#helm-chart-1002+) to upgrade from Camunda Helm chart v9.x.x to Camunda Helm chart v10.x.x.

### Support for Amazon OpenSearch

With the 8.5 release, Optimize is now also compatible with [Amazon OpenSearch](https://aws.amazon.com/de/opensearch-service/) 2.5+. Note that using Amazon OpenSearch requires [setting up a new Camunda installation](/self-managed/setup/overview.md). A migration from previous versions or Elasticsearch environments is not supported.

### Known limitations

This release contains the following limitations:

- In **Optimize `8.5.0`**
  - **Limitation**
    - **Description:** OpenSearch support in Optimize is limited to data import and the raw data report.
    - **Reference:** n/a
    - **Mitigation:** Optimize can be installed and used in production with limited reporting functionality. Optimize imports all process data generated by Zeebe. All reporting functionality as described in the docs will be delivered with upcoming patches.
- In **Console `8.5.x`**
  - **Limitation**
    - **Description:** Custom OIDC provider support for Console is not supported
    - **Reference:** https://github.com/camunda/issues/issues/784

### Changes in supported environments

- Raised minimum Go version to 1.21 for the Zeebe Go client

### Camunda SaaS: New generation naming scheme

With the April release, the generation naming scheme in Camunda 8 changed and no longer includes the patch version.

The new naming scheme used for all Camunda SaaS generations created after April 2024 is `Camunda <Major>.<Minor>+gen<N>`, where `N` is incremented with every atomic change to the component version set. Existing generations will not be renamed.

For patch releases to existing generations, `N` is set to the latest patch level plus 1. For example, when `Camunda 8.4.5` is the current generation name, the following patch will be released as `Camunda 8.4+gen6`.

This was done to decouple the generation name from the particular patch level of the components it contains, as some component versions like Connectors are decoupled from other components.

You will learn about the particular component patch version changes in the update dialogue to the latest generation available. The following screenshot shows a sample update from `Camunda 8.5+gen1` to `Camunda 8.5+gen2`, where only the Connectors patch version changed.

![New Generating naming sample showing an update dialogue from 8.5+gen1 to 8.5+gen2](img/generation-naming-scheme-sample.png)

Note that the actual values shown in this screenshot don't correspond to any actual generations and only serve as an example.

### Removal of Web Modeler's beta API

The Web Modeler beta API has been removed. The API was deprecated in 8.3 and is no longer available in 8.5. Use the [Web Modeler v1 API](/apis-tools/web-modeler-api/index.md) instead.
For a migration guide, see the [Web Modeler API documentation](/apis-tools/web-modeler-api/index.md#migrating-from-beta-to-v1).

### Zeebe 8.5.0 breaks serialization of timestamp values in management API (Self-Managed only)

Zeebe 8.5.0 was released with [a new bug](https://github.com/camunda/camunda/issues/17347) that breaks serialization of timestamp values in management APIs, such as [backup](/self-managed/operational-guides/backup-restore/backup-and-restore.md) and [cluster scaling](/self-managed/zeebe-deployment/operations/cluster-scaling.md).
Timestamps which were previously serialized as `ISO8061` strings are now serialized as integer values.

Until a fix is delivered in 8.5.1, workarounds include not deserializing timestamp values from affected APIs, or deserializing them as integers.

## Camunda 8.4

Release date: 9th of January 2024

End of maintenance: 9th of July 2025

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

As of the 8.4 release, Camunda is compatible with Elasticsearch 8.9+ and no longer supports older Elasticsearch versions. See [supported environments](/reference/supported-environments.md).

### Support for Amazon OpenSearch

As of the 8.4 release, Zeebe, Operate, and Tasklist are now compatible with [Amazon OpenSearch](https://aws.amazon.com/de/opensearch-service/) 2.5.x. Note that using Amazon OpenSearch requires [setting up a new Camunda installation](/self-managed/setup/overview.md). A migration from previous versions or Elasticsearch environments is currently not supported.

:::info
The Helm charts are not yet prepared with the OpenSearch configurations as templates/pre-filled. The Helm charts can still be used to install for OpenSearch, but some adjustments are needed beforehand. Refer to the [Helm deployment documentation](/self-managed/setup/install.md) for further details.
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
      1. Refer to our [docs for the installation](/self-managed/setup/install.md#components-installed-by-the-helm-charts), the docs include guidance about necessary adjustments of the Helm chart configuration.
      2. The OpenSearch configuration in Helm charts will be provided in one of our future Helm releases.
- In **Connectors `8.4.x`**
  - **Missing feature**
    - **Description:** Custom OIDC provider support for Connectors is missing
    - **Reference:** https://github.com/camunda/issues/issues/569
    - **Mitigation:**
      1. Feature is planned to be delivered with an upcoming patch release. Please see [issue](https://github.com/camunda/issues/issues/569) for latest progress.
      2. [Disable Connectors component](/self-managed/setup/guides/connect-to-an-oidc-provider.md#configuration) when configuring a custom OIDC provider.

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

As of the 8.3 release, Camunda is compatible with Elasticsearch 8.8+ and no longer supports Elasticsearch 7.x. See [supported environments](/reference/supported-environments.md).

### Versioning changes in Helm chart

[Helm charts versioning](/self-managed/setup/overview.md) changed in July 2023.

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
