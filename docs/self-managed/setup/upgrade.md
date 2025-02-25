---
id: upgrade
title: "Camunda 8 Helm upgrade"
sidebar_label: "Upgrade"
description: "Upgrade to a more recent version of the Camunda Helm charts, and view configuration changes between versions."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

:::note
When upgrading to a new version of the Camunda 8 Helm charts, we recommend updating to the **latest patch** release of the next **major** version of the chart.

For example, if the current Helm chart version is 10.x.x, and the latest next major version is 11.0.1, the recommended upgrade is to 11.0.1 (not 11.0.0).
:::

Upgrading between minor versions of the Camunda Helm chart may require [configuration changes](#update-your-configuration). To upgrade between patch versions or when no configuration changes are required, see the [`helm upgrade`](#identity-disabled) instructions.

## Upgrade requirements

For a smooth upgrade experience, we recommend determining both your **Helm chart** and **Helm CLI** versions prior to starting your upgrade.

### Helm chart version

As of the Camunda 8.4 release, the Camunda 8 **Helm chart** version is independent from the application version (for example, the Camunda 8.4 release uses the Helm chart version 9.0.0). The Helm chart is updated with each application release.

Review the Camunda 8 Helm chart [version matrix](https://helm.camunda.io/camunda-platform/version-matrix/) to determine the application and Helm chart versions of your installation.

You can also view all chart versions and application versions via the Helm CLI:

```shell
helm repo update
helm search repo camunda/camunda-platform --versions
```

### Helm CLI version

Use the recommended Helm CLI version for your Helm chart when upgrading. The Helm CLI version for each chart can be found on the [chart version matrix](https://helm.camunda.io/camunda-platform/version-matrix/).

## Update your configuration

Configuration adjustments may be required when upgrading to a new version of the Helm chart. Before beginning your upgrade, ensure you have implemented any changes required by your new version.

<Tabs groupId="upgrades" defaultValue="8.6" queryString values={
[
{label: 'From Camunda 8.5 to 8.6', value: '8.6', },
{label: 'From Camunda 8.4 to 8.5', value: '8.5', },
{label: 'From Camunda 8.3 to 8.4', value: '8.4', },
{label: 'From Camunda 8.2 to 8.3', value: '8.3', },
]
}>

<TabItem value='8.6'>

### Helm chart 11.0.0+

#### Deprecation notes

The following keys were deprecated in 8.5, and their removal has been delayed until the release of Camunda 8.7 (January 2025). We highly recommend updating the keys in your values file rather than waiting until the 8.7 release.

| Component     | Old Key                            | New Key                             |
| ------------- | ---------------------------------- | ----------------------------------- |
| Identity      |
|               | `identity.keycloak`                | `identityKeycloak`                  |
|               | `identity.postgresql`              | `identityPostgresql`                |
| Zeebe Gateway |
|               | `global.zeebePort`                 | `zeebeGateway.service.grpcPort`     |
|               | `zeebe-gateway`                    | `zeebeGateway`                      |
|               | `zeebeGateway.service.gatewayName` | `zeebeGateway.service.grpcName`     |
|               | `zeebeGateway.service.gatewayPort` | `zeebeGateway.service.grpcPort`     |
|               | `zeebeGateway.ingress`             | `zeebeGateway.ingress.grpc`         |
|               | -                                  | `zeebeGateway.ingress.rest`         |
| Elasticsearch |
|               | `global.elasticsearch.url`         | Change from a string to a map       |
|               | `global.elasticsearch.protocol`    | `global.elasticsearch.url.protocol` |
|               | `global.elasticsearch.host`        | `global.elasticsearch.url.host`     |
|               | `global.elasticsearch.port`        | `global.elasticsearch.url.port`     |

| Component   | Old Key      | New Key                |
| ----------- | ------------ | ---------------------- |
| Web Modeler |
|             | `postgresql` | `webModelerPostgresql` |

#### Separated Ingress deprecation warning

The separated Ingress Helm configuration has been deprecated in 8.6, and will be removed from the Helm chart in 8.7. If using a separated Ingress, switch to a [combined Ingress](/self-managed/setup/guides/ingress-setup.md) to ensure a smooth upgrade experience.

#### OpenShift Changes

We added the `global.compatibility.openshift.adaptSecurityContext` variable in the values.yaml that can be used to set the following possible values:

- `force`: The `runAsUser` and `fsGroup` values will be null in all components.
- `disabled`: The `runAsUser` and `fsGroup` values will not be modified (default).

With this change, there is no need to do extra steps with the post-renderer. You can install the chart as normal. Please refer to the [Red Hat OpenShift document](/self-managed/setup/deploy/openshift/redhat-openshift.md) for more information.

#### New base path for Operate and Tasklist web applications

We have introduced a new base path for both the Operate and Tasklist web applications. The new base path for Operate is `/operate`, and for Tasklist, it is `/tasklist`. For more information, see the 8.6 [announcements](/reference/announcements-release-notes/860/860-announcements.md#new-base-path-for-operate-and-tasklist-web-applications).

</TabItem>

<TabItem value='8.5'>

<h3>Helm chart 10.2.0+</h3>

As of this Helm chart version, the image tags for all components are independent, and do not reference the global image tag. The value of the key `global.image.tag` is `null`, and each component now sets its own version.

With this change, Camunda applications no longer require a unified patch version. For example, a given installation may use Zeebe version 8.5.1, and Operate version 8.5.2. Note that only the patch version can differ between components.

<h3>Helm chart 10.0.2+</h3>

The upgrade path for Camunda Helm Chart v9.x.x is to the latest patch version of v10.

- You can use any minor or patch version after (and including) 10.0.2.
- You cannot upgrade from v9.x.x to v10.0.0 or v10.0.1.

The Camunda Helm chart v10.0.2 has major changes in the values file structure. Follow the upgrade steps for each component before starting the chart upgrade.

#### Helm CLI version

Ensure to use Helm CLI with version `3.14.3` or more. The upgrade could fail to work with the 10.0.2+ Camunda Helm chart version due to some bugs in the older Helm CLI itself.

#### Deprecation notes

The following keys were deprecated in 8.5, and their removal has been delayed until the release of Camunda 8.7 (January 2025). We highly recommend updating the keys in your values file rather than waiting until the 8.7 release.

| Component     | Old Key                            | New Key                             |
| ------------- | ---------------------------------- | ----------------------------------- |
| Identity      |
|               | `identity.keycloak`                | `identityKeycloak`                  |
|               | `identity.postgresql`              | `identityPostgresql`                |
| Zeebe Gateway |
|               | `global.zeebePort`                 | `zeebeGateway.service.grpcPort`     |
|               | `zeebe-gateway`                    | `zeebeGateway`                      |
|               | `zeebeGateway.service.gatewayName` | `zeebeGateway.service.grpcName`     |
|               | `zeebeGateway.service.gatewayPort` | `zeebeGateway.service.grpcPort`     |
|               | `zeebeGateway.ingress`             | `zeebeGateway.ingress.grpc`         |
|               | -                                  | `zeebeGateway.ingress.rest`         |
| Elasticsearch |
|               | `global.elasticsearch.url`         | Change from a string to a map       |
|               | `global.elasticsearch.protocol`    | `global.elasticsearch.url.protocol` |
|               | `global.elasticsearch.host`        | `global.elasticsearch.url.host`     |
|               | `global.elasticsearch.port`        | `global.elasticsearch.url.port`     |

| Component   | Old Key      | New Key                |
| ----------- | ------------ | ---------------------- |
| Web Modeler |
|             | `postgresql` | `webModelerPostgresql` |

#### Identity

The Camunda Identity component was formerly a sub-chart of the Camunda Helm chart. Now, it is part of the parent Camunda Helm chart.

There are no changes in the Identity keys, but since the `LabelSelector` and `MatchLabels` of a Kubernetes resource are immutable, its deployment should be deleted as the label `app.kubernetes.io/name` has been changed from `identity` to `camunda-platform`.

:::caution Downtime

- This step will lead to temporary downtime in Camunda 8 till the actual upgrade happens.
- This step doesn't affect any stored data and the deployment will be placed again in the upgrade.

:::

```shell
kubectl -n camunda delete -l app.kubernetes.io/name=identity deployment
```

#### Identity - Keycloak

In Camunda Helm chart v10.0.0, the Identity Keycloak Helm chart has been upgraded from [v17.3.6](https://artifacthub.io/packages/helm/bitnami/keycloak/17.3.6) to [v19.4.1](https://artifacthub.io/packages/helm/bitnami/keycloak/19.4.1). Which has different defaults.

If, **and only if**, you make a full copy of the Camunda Helm chart values file instead of just overwriting the default value, you need to update your values files and use the new default values.

Namely, the following volumes should be removed from the values since they are now part of the upstream chart:

```yaml
# Note: Since v10.0.0 the Keycloak "identity.keycloak" has been renamed to "identityKeycloak".
# Check the keys deprecation notes above.
identity:
  keycloak:
    extraVolumes:
      - name: config
        emptyDir: {}
      - name: quarkus
        emptyDir: {}
      - name: tmp
        emptyDir: {}
    volumeMounts:
      - mountPath: /opt/bitnami/keycloak/conf/
        name: config
      - mountPath: /opt/bitnami/keycloak/lib/quarkus
        name: quarkus
      - mountPath: /tmp
        name: tmp
```

#### Elasticsearch

In Camunda Helm chart v10.0.0, the Elasticsearch Helm chart has been upgraded from [v19.19.4](https://artifacthub.io/packages/helm/bitnami/elasticsearch/19.19.4) to [v20.0.0](https://artifacthub.io/packages/helm/bitnami/elasticsearch/20.0.0). Which has different defaults.

If, **and only if**, you make a full copy of the Camunda Helm chart values file instead of just overwriting the default value, you need to update your values files and use the new default values.

Namely, the following volumes should be removed from the values since they are now part of the upstream chart:

```yaml
elasticsearch:
  extraVolumes:
    - name: tmp
      emptyDir: {}
    - name: logs
      emptyDir: {}
    - name: config-dir
      emptyDir: {}
  extraVolumeMounts:
    - mountPath: /tmp
      name: tmp
    - mountPath: /usr/share/elasticsearch/logs
      name: logs
    - mountPath: /usr/share/elasticsearch/config
      name: config-dir
```

#### Enabling external Elasticsearch

In v10.0.0, it is possible to use external Elasticsearch. For more information on how to set up external Elasticsearch, refer to [using existing Elasticsearch](./guides/using-existing-elasticsearch.md).

#### Enabling external OpenSearch

In v10.0.0, it is possible to use external OpenSearch. For more information on how to set up external OpenSearch, refer to [using external OpenSearch](./guides/using-existing-opensearch.md).

</TabItem>

<TabItem value="8.4">

<h3>Helm Chart 9.3.0</h3>

#### Enabling Console

When enabling Console for the first time, you may see the following error:

> Something went wrong
> We're sorry! The following errors were thrown in the backend. 401 jwt audience invalid. expected: console-api

The default user does not automatically get access to the Console role.

To add the Console role:

1. Log in to Identity.
2. Click on the **Users** tab.
3. Select your user.
4. Click **Assigned roles**.
5. Select **Console** to grant full access to Console.
6. Click **Add**.

You should now be able to log into Console.

<h3>Helm Chart 9.0.0</h3>

For full change log, view the Camunda Helm chart [v9.0.0 release notes](https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-9.0.0).

#### Helm chart

As of the 8.4 release cycle, the Camunda 8 **Helm chart** version is decoupled from the version of the application. The Helm chart release still follows the applications release cycle, but it has an independent version. (e.g., in the application release cycle 8.4, the chart version is 9.0.0).

For more details about the applications version included in the Helm chart, review the [full version matrix](https://helm.camunda.io/camunda-platform/version-matrix/).

#### Identity

:::caution Potential breaking changes
By default this change isn't breaking change unless custom changes made outside Helm chart related to OIDC configuration.
:::

Cross-components Keycloak-specific configurations has been replaced for a more generic OIDC configuration; Hence, components can use other OIDC-compliant OAuth 2.0 identity providers.

Accordingly, some unused environment variables have been removed from Web Modeler because of the implementation of custom OIDC support. The naming has also been adjusted to use the newer scheme.

For more details, check [Connect to an OpenID Connect provider](/self-managed/setup/guides/connect-to-an-oidc-provider.md).

#### Keycloak

The embedded Keycloak Helm chart has been upgraded from 16.1.7 to 17.3.6 (only the Keycloak Helm chart has been upgrade, the actual Keycloak version still on 22.0.5).

#### Elasticsearch

Elasticsearch image has been upgraded from 8.8.2 to 8.9.2.

</TabItem>

<TabItem value="8.3">

<h3>Helm Chart 8.3.1</h3>

:::caution
The following steps are applied when upgrading from **any** previous version, including `8.3.0`.
:::

To fix a critical issue, the following components had labels change: Operate, Optimize, Tasklist, Zeebe, and Zeebe Gateway.

Therefore, before upgrading from any previous versions, delete the `Deployment/StatefulSet`. There will be a downtime between the resource deletion and the actual upgrade.

```shell
kubectl -n camunda delete deployment camunda-operate
kubectl -n camunda delete deployment camunda-tasklist
kubectl -n camunda delete deployment camunda-optimize
kubectl -n camunda delete deployment camunda-zeebe-gateway
kubectl -n camunda delete statefulset camunda-zeebe
```

Then, follow the upgrade process as usual.

#### Zeebe Gateway

This change has no effect on the usual upgrade using Helm CLI. However, it could be relevant if you are using Helm post-rendering via other tools like Kustomize.

The following resources have been renamed:

- **ConfigMap:** From `camunda-zeebe-gateway-gateway` to `camunda-zeebe-gateway`.
- **ServiceAccount:** From `camunda-zeebe-gateway-gateway` to `camunda-zeebe-gateway`.

<h3>Helm Chart 8.3.0 (minor)</h3>

:::caution
Updating Operate, Tasklist, and Optimize from 8.2.x to 8.3.0 will potentially take longer than expected, depending on the data to be migrated.
Additionally, we identified some bugs that could also prevent the migration from succeeding. These are being addressed and will be available in an upcoming 8.3.1 patch. We suggest not updating until the patch is released.
:::

For full change log, view the Camunda Helm chart [v8.3.0 release notes](https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-8.3.0).

:::caution Breaking changes

- Elasticsearch upgraded from v7.x to v8.x.
- Keycloak upgraded from v19.x to v22.x.
- Zeebe runs as a non-root user by default.

:::

#### Elasticsearch

Elasticsearch upgraded from v7.x to v8.x. Follow the Elasticsearch official [upgrade guide](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/setup-upgrade.html) to ensure you are not using any deprecated values when upgrading.

##### Elasticsearch - values file

The syntax of the chart values file has been changed due to the upgrade. There are two cases based on if you use the default values or custom values.

**Case One:** Default values.yaml

If you are using our default `values.yaml`, no change is required. Follow the upgrade steps as usual with the updated default `values.yaml`.

**Case Two:** Custom values.yaml

If you have a custom `values.yaml`, change the image repository and tag:

```yaml
image:
  repository: bitnami/elasticsearch
  tag: 8.8.2
```

Setting the persistent volume size of the master nodes can't be done using the `volumeClaimTemplate` anymore. It must be done using the master values:

```yaml
master:
  masterOnly: false
  heapSize: 1024m
  persistence:
    size: 64Gi
```

Setting a `retentionPolicy` for Elasticsearch values can't be done anymore. The `retentionPolicy` should be used in the respective components instead. For example, here is an Elasticsearch `retentionPolicy` for the Tasklist component:

```yaml
retention:
  enabled: false
  minimumAge: 30d
```

In the global section, the host to show to release-name should be changed as well:

```yaml
host: "{{ .Release.Name }}-elasticsearch"
```

##### Elasticsearch - Data retention

The Elasticsearch 8 chart is using different PVC names. Therefore, it's required to migrate the old PVCs to the new names, which could be done in two ways: automatic (requires certain K8s version and CSI driver), or manual (works with any Kubernetes setup).

:::caution

In call cases, the following steps must be executed **before** the upgrade.

:::

**Option One:** CSI volume cloning

This method will take advantage of the CSI volume cloning functionality from the CSI driver.

Prerequisites:

1. The Kubernetes cluster should be at least v1.20.
2. The CSI driver must be present on your cluster.

Clones are provisioned like any other PVC with a reference to an existing PVC in the same namespace.

Before applying this manifest, ensure to scale the Elasticsearch replicas to 0. Also, ensure the `dataSource.name` matches the PVC that you would like to clone.

Here is an example YAML file for cloning the Elasticsearch PVC:

First, stop Elasticsearch pods:

```shell
kubectl scale statefulset elasticsearch-master --replicas=0
```

Then, clone the PVC (this example is for one PVC, usually you have two PVCs):

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    app.kubernetes.io/component: master
    app.kubernetes.io/instance: integration
    app.kubernetes.io/name: elasticsearch
  name: data-integration-elasticsearch-master-0
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 64Gi
  dataSource:
    name: elasticsearch-master-elasticsearch-master-0
    kind: PersistentVolumeClaim
```

For reference, visit [Kubernetes - CSI Volume Cloning](https://kubernetes.io/docs/concepts/storage/volume-pvc-datasource/).

**Option Two**: Update PV manually

This approach works with any Kubernetes cluster.

1. Get the name of PV for both Elasticsearch master PVs.
2. Change the reclaim policy of the Elasticsearch PVs to `Retain`.

First, get the PV from PVC:

```shell
ES_PV_NAME0="$(kubectl get pvc elasticsearch-master-elasticsearch-master-0 -o jsonpath='{.spec.volumeName}')"
```

Then, change the Reclaim Policy:

```shell
kubectl patch pv "${ES_PV_NAME0}" -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

Finally, verify the Reclaim Policy has been changed:

```shell
kubectl get pv "${ES_PV_NAME0}" | grep Retain || echo '[ERROR] Reclaim Policy is not Retain!'
```

Within both Elasticsearch master PVs, edit the `claimRef` to include the name of the new PVCs that will appear after the upgrade. For example:

```yaml
claimRef:
  apiVersion: v1
  kind: PersistentVolumeClaim
  name: data-camunda-elasticsearch-master-0
  namespace: <NAMESPACE>
```

After a successful upgrade, you can now delete the old PVCs that are in a `Lost` state. Then, proceed with the upgrade.

#### Keycloak

Keycloak upgraded from v19.x to v22.x, which is the latest version at the time of writing. Even though there is no breaking change found, the upgrade should be handled carefully because of the Keycloak major version upgrade. Ensure you back up the Keycloak database before the upgrade.

:::note
The Keycloak PostgreSQL chart shows some warnings which are safe to ignore. That false positive issue has been reported, and it should be fixed in the next releases of the upstream PostgreSQL Helm chart.
:::

```
coalesce.go:289: warning: destination for keycloak.postgresql.networkPolicy.egressRules.customRules is a table. Ignoring non-table value ([])
coalesce.go:289: warning: destination for keycloak.postgresql.networkPolicy.ingressRules.readReplicasAccessOnlyFrom.customRules is a table. Ignoring non-table value ([])
coalesce.go:289: warning: destination for keycloak.postgresql.networkPolicy.ingressRules.primaryAccessOnlyFrom.customRules is a table. Ignoring non-table value ([])
false
```

#### Zeebe

Using a non-root user by default is a security principle introduced in this version. However, because there is persistent storage in Zeebe, earlier versions may run into problems with existing file permissions not matching up with the file permissions assigned to the running user. There are two ways to fix this:

**Option One:** Use Zeebe user ID (recommended)

Change `podSecurityContext.fsGroup` to point to the UID of the running user. The default user in Zeebe has the UID `1000`. That will modify the group permissions of all persistent volumes attached to that Pod.

```yaml
zeebe:
  podSecurityContext:
    fsGroup: 1000
```

If you already modify the current running user, then the `fsGroup` needs to be changed to match the UID.

```yaml
zeebe:
  containerSecurityContext:
    runAsUser: 1008
  podSecurityContext:
    fsGroup: 1008
```

Some storage classes may not support the `fsGroup` option. In this case, a possibility is to run a debug Pod to chown the mounted volumes.

**Option Two:** Use root user ID

If the recommended solution does not help, you may change the running user back to root.

```yaml
zeebe:
  containerSecurityContext:
    runAsUser: 0
```

#### Web-Modeler

The configuration format of external database has been changed in Web Modeler from `host`, `port`, `database` to `JDBC URL`.

The old format:

```yaml
webModeler:
  restapi:
    externalDatabase:
      host: web-modeler-postgres-ext
      port: 5432
      database: rest-api-db
```

The new format:

```yaml
webModeler:
  restapi:
    externalDatabase:
      url: "jdbc:postgresql://web-modeler-postgres-ext:5432/rest-api-db"
```

</TabItem>

</Tabs>

## Upgrade Camunda

If you have installed the Camunda 8 Helm charts before with default values, Identity and the related authentication mechanism are enabled. If you have disabled Identity, see how to upgrade Camunda [with Identity disabled](#identity-disabled).

### Identity enabled

#### Extract secrets

If not specified on installation, the Helm chart generates random secrets for all components (including Keycloak). To upgrade successfully, these secrets must be extracted and provided during your upgrade.

To extract the secrets, use the following code snippet, replacing `camunda` with your actual Helm release name:

```shell
# Uncomment if Console is enabled.
# export CONSOLE_SECRET=$(kubectl get secret "camunda-console-identity-secret" -o jsonpath="{.data.console-secret}" | base64 --decode)
export TASKLIST_SECRET=$(kubectl get secret "camunda-tasklist-identity-secret" -o jsonpath="{.data.tasklist-secret}" | base64 --decode)
export OPTIMIZE_SECRET=$(kubectl get secret "camunda-optimize-identity-secret" -o jsonpath="{.data.optimize-secret}" | base64 --decode)
export OPERATE_SECRET=$(kubectl get secret "camunda-operate-identity-secret" -o jsonpath="{.data.operate-secret}" | base64 --decode)
export CONNECTORS_SECRET=$(kubectl get secret "camunda-connectors-identity-secret" -o jsonpath="{.data.connectors-secret}" | base64 --decode)
export ZEEBE_SECRET=$(kubectl get secret "camunda-zeebe-identity-secret" -o jsonpath="{.data.zeebe-secret}" | base64 --decode)
export KEYCLOAK_ADMIN_SECRET=$(kubectl get secret "camunda-keycloak" -o jsonpath="{.data.admin-password}" | base64 --decode)
export KEYCLOAK_MANAGEMENT_SECRET=$(kubectl get secret "camunda-keycloak" -o jsonpath="{.data.management-password}" | base64 --decode)
export POSTGRESQL_SECRET=$(kubectl get secret "camunda-postgresql" -o jsonpath="{.data.postgres-password}" | base64 --decode)
```

#### Run `helm upgrade`

After exporting all secrets into environment variables, run the following upgrade command:

```shell
helm repo update
helm upgrade camunda camunda/camunda-platform \
  # Uncomment if Console is enabled.
  # --set global.identity.auth.console.existingSecret=$CONSOLE_SECRET \
  --set global.identity.auth.tasklist.existingSecret=$TASKLIST_SECRET \
  --set global.identity.auth.optimize.existingSecret=$OPTIMIZE_SECRET \
  --set global.identity.auth.operate.existingSecret=$OPERATE_SECRET \
  --set global.identity.auth.connectors.existingSecret=$CONNECTORS_SECRET \
  --set global.identity.auth.zeebe.existingSecret=$ZEEBE_SECRET \
  --set identityKeycloak.auth.adminPassword=$KEYCLOAK_ADMIN_SECRET \
  --set identityKeycloak.auth.managementPassword=$KEYCLOAK_MANAGEMENT_SECRET \
  --set identityKeycloak.postgresql.auth.password=$POSTGRESQL_SECRET
```

If you have set secret values on installation, you must specify them again on the upgrade either via `--set`, as demonstrated above, or by passing in a values file using the `-f` flag.

:::note
For more details on the Keycloak upgrade path, see the [Keycloak upgrade guide](https://www.keycloak.org/docs/latest/upgrading/).
:::

### Identity disabled

If you have **disabled** Camunda Identity and the related authentication mechanism, Camunda can be upgraded with the following command:

```shell
helm repo update
helm upgrade camunda
```

## Upgrade failed

The following upgrade error is related to [secrets extraction](#extract-secrets):

```shell
Error: UPGRADE FAILED: execution error at (camunda-platform/charts/identity/templates/tasklist-secret.yaml:10:22):
PASSWORDS ERROR: You must provide your current passwords when upgrading the release.
                 Note that even after reinstallation, old credentials may be needed as they may be kept in persistent volume claims.
                 Further information can be obtained at https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/#credential-errors-while-upgrading-chart-releases

    'global.identity.auth.tasklist.existingSecret' must not be empty, please add '--set global.identity.auth.tasklist.existingSecret=$TASKLIST_SECRET' to the command. To get the current value:

        export TASKLIST_SECRET=$(kubectl get secret --namespace "camunda" "camunda-platform-test-tasklist-identity-secret" -o jsonpath="{.data.tasklist-secret}" | base64 --decode)
```

When the Helm chart is removed or upgraded, persistent volume claims (PVCs) for secret storage are not removed nor recreated. To prevent Helm from recreating secrets that have already been generated, the [Bitnami](https://github.com/bitnami/charts/tree/master/bitnami/common) library chart used by Camunda blocks the upgrade path, resulting in the above error.

To complete your upgrade, [extract your secrets](#extract-secrets), then provide them as environment variables during the upgrade process.
