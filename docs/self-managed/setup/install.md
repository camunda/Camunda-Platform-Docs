---
id: install
title: "Camunda 8 Helm installation"
sidebar_label: "Install"
description: "Camunda provides continuously improved Helm charts, of which are not cloud provider-specific so you can choose your Kubernetes provider."
---

:::note
The 13.0.0-alpha2 Helm chart released with Camunda 8.8.0-alpha2 establishes a new default setup to support 8.8 [Identity management updates](/docs/reference/announcements/880.md#identity-management-updates-saasself-managed). Currently, this setup is limited to the following components:

- The Orchestration core (Zeebe, Operate, Tasklist, and Orchestration Identity)
- Connectors

This temporary limitation will be resolved in subsequent alpha releases.
:::

We recommend using Kubernetes and Helm to deploy and run Camunda 8 Self-Managed in production.

There are many ways you can provision and configure a Kubernetes cluster, and there are a number of architectural choices you need to make. Will your workers run in the Kubernetes cluster or external to it? You will need to configure your Kubernetes cluster and modify this to suit the architecture you are building.

Camunda provides continuously improved Helm charts, of which are not cloud provider-specific so you can choose your Kubernetes provider. The charts are available in the [Camunda Helm repository](https://artifacthub.io/packages/helm/camunda/camunda-platform) and we encourage you to [report issues](https://github.com/camunda/camunda-platform-helm/issues).

## What is Helm?

[Helm](https://helm.sh/) is a package manager for Kubernetes resources. Helm allows us to install a set of components by simply referencing a package name and allowing us to override configurations to accommodate these packages to different scenarios.

Helm also provides dependency management between charts, meaning that charts can depend on other charts. This allows us to aggregate a set of components installed with a single command.

For more details, check the full list of [Helm values](https://artifacthub.io/packages/helm/camunda/camunda-platform#parameters).

## Components

The following charts will be installed as part of Camunda 8 Self-Managed:

- **Zeebe**: Deploys a Zeebe Cluster with three brokers using the `camunda/zeebe` Docker image.
- **Zeebe Gateway**: Deploys the standalone Zeebe Gateway with two replicas.
- **Operate**: Deploys Operate, which connects to an existing Elasticsearch.
- **Tasklist**: Deploys the Tasklist component to work with user tasks.
- **Optimize**: Deploys the Optimize component to analyze the historic process executions.
- **Identity**: Deploys the Identity component responsible for authentication and authorization.
- **Connectors**: Deploys the Connectors component responsible for inbound and outbound integration with external systems.
- **Elasticsearch**: Deploys an Elasticsearch cluster with two nodes.
- **Web Modeler**: Deploys the Web Modeler component that allows you to model BPMN processes in a collaborative way.
  - _Note_: The chart is disabled by default and needs to be [enabled explicitly](#install-web-modeler).
- **Console**: Deploys Camunda Console Self-Managed.
  - _Note_: The chart is disabled by default and needs to be [enabled explicitly](#install-console).

:::note Amazon OpenSearch Helm support
The existing Helm charts use the Elasticsearch configurations by default. The Helm charts can still be used to connect to Amazon OpenSearch Service. Refer to [using Amazon OpenSearch Service](/self-managed/setup/guides/using-existing-opensearch.md).

**Zeebe**: Configure the [OpenSearch exporter](/self-managed/zeebe-deployment/exporters/opensearch-exporter.md).

**Operate**, **Tasklist**, and **Optimize**: These components use the same parameters for both Elasticsearch and OpenSearch. Replace the `elasticsearch` part of the relevant configuration key with `opensearch`, together with its appropriate value.

For example, `CAMUNDA_OPERATE_ELASTICSEARCH_URL` becomes `CAMUNDA_OPERATE_OPENSEARCH_URL`. In the case of Optimize, please make sure all variables have the proper `CAMUNDA_OPTIMIZE` prefix, i.e. `OPTIMIZE_ELASTICSEARCH_HTTP_PORT` becomes `CAMUNDA_OPTIMIZE_OPENSEARCH_HTTP_PORT`.

Refer to the [Operate](/self-managed/operate-deployment/operate-configuration.md#settings-for-opensearch), [Tasklist](/self-managed/tasklist-deployment/tasklist-configuration.md#elasticsearch-or-opensearch) and [Optimize]($optimize$/self-managed/optimize-deployment/configuration/system-configuration/#opensearch) configuration documentation for additional component configuration parameters to update.
:::

![Camunda 8 Self-Managed Architecture Diagram](../assets/camunda-platform-8-self-managed-architecture-diagram-combined-ingress.png)

When installing the [camunda-platform](https://artifacthub.io/packages/helm/camunda/camunda-platform) Helm chart, all components shown on the architectural diagram above are installed.

## Versioning

Starting from the Camunda v8.4 (January 2024), the Camunda 8 **Helm chart** version is decoupled from the version of the application (e.g., the chart version is 9.0.0 and the application version is 8.4.x).

For more details about the applications version included in the Helm chart, review the [full version matrix](https://helm.camunda.io/camunda-platform/version-matrix/).

## Installation

At [helm.camunda.io](https://helm.camunda.io/), you'll find a Helm chart to configure a 3-broker cluster with:

- Two Elasticsearch instances
- Operate
- Two Zeebe Gateways
- Tasklist

This size is comparable with the Production-S cluster plan in [Camunda 8 SaaS](https://camunda.com/get-started/). It should be sufficient for 80% of use cases.

### Prerequisites

Before deploying Camunda using Helm, you need the following:

- Kubernetes cluster: either local, cloud platform, or on-premises.
- [Helm](https://helm.sh/docs/intro/install/).
- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) CLI.

### Helm repository

You have to add the Camunda Helm chart repository to use the charts. Once this is done, Helm can fetch and install charts hosted at [https://helm.camunda.io](https://helm.camunda.io):

```shell
helm repo add camunda https://helm.camunda.io
helm repo update
```

### Create Identity secrets

In a default configuration, Helm charts will auto-generate all required Camunda Identity secrets for Camunda 8 component to Identity communications. However, future `helm upgrade` commands will regenerate Helm charts due to an issue with a [Bitnami library](https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/#credential-errors-while-upgrading-chart-releases).

While upgrading is still possible by following our [upgrade guide](./upgrade.md#upgrading-where-identity-enabled), we recommend pre-creating these secrets to ease your future upgrade experience. This is also a recommended option when using CI/CD tools like ArgoCD, FluxCD, Jenkins, etc.

See an example of the secret below:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: identity-secret-for-components
type: Opaque
data:
  operate-secret: VmVyeUxvbmdTdHJpbmc=
  tasklist-secret: VmVyeUxvbmdTdHJpbmc=
  optimize-secret: VmVyeUxvbmdTdHJpbmc=
  connectors-secret: VmVyeUxvbmdTdHJpbmc=
  console-secret: VmVyeUxvbmdTdHJpbmc=
  keycloak-secret: VmVyeUxvbmdTdHJpbmc=
  zeebe-secret: VmVyeUxvbmdTdHJpbmc=
```

Add the following configuration parameters to your `values.yaml` file

```yaml
global:
  identity:
    auth:
      operate:
        existingSecret:
          name: identity-secret-for-components
      tasklist:
        existingSecret:
          name: identity-secret-for-components
      optimize:
        existingSecret:
          name: identity-secret-for-components
      webModeler:
        existingSecret:
          name: identity-secret-for-components
      connectors:
        existingSecret:
          name: identity-secret-for-components
      console:
        existingSecret:
          name: identity-secret-for-components
      zeebe:
        existingSecret:
          name: identity-secret-for-components
```

Once this is completed, you are ready to install the Helm chart hosted in the official Camunda Helm chart repo.

### Install Camunda Helm chart

To install the available Camunda 8 components inside a Kubernetes cluster, you can simply run:

```shell
helm install camunda camunda/camunda-platform
```

You can also add the `-n` flag to specify in which Kubernetes namespace the components should be installed.

The command does not install Web Modeler or Console by default. To enable Web Modeler, refer to the [installation instructions](#install-web-modeler) below. To enable Console, refer to the [installation instructions](#install-console).

Installing all the components in a cluster requires all Docker images to be downloaded to the Kubernetes cluster. Depending on which cloud provider you are using, the time it will take to fetch all the images will vary.

For air-gapped environments, refer to [installing in an air-gapped environment](/self-managed/setup/guides/air-gapped-installation.md).

Review the progress of your deployment by checking if the Kubernetes pods are up and running with the following:

```shell
kubectl get pods
```

This will return something similar to the following:

```
NAME                                           READY   STATUS              RESTARTS   AGE
camunda-keycloak-0                       0/1     Pending             0          4s
camunda-identity-6bb5d864cc-kk6dv        0/1     ContainerCreating   0          4s
camunda-operate-cb597fd76-6vr2x          0/1     ContainerCreating   0          4s
camunda-optimize-676955b547-vxts7        0/1     ContainerCreating   0          4s
camunda-connectors-1bba590ff-a63dc       0/1     ContainerCreating   0          4s
camunda-postgresql-0                     0/1     Pending             0          4s
camunda-tasklist-5bf5c56f7b-sdwg7        0/1     ContainerCreating   0          4s
camunda-zeebe-0                          0/1     Pending             0          4s
camunda-zeebe-1                          0/1     ContainerCreating   0          4s
camunda-zeebe-2                          0/1     Pending             0          4s
camunda-zeebe-gateway-657b774f95-bbcx5   0/1     ContainerCreating   0          4s
camunda-zeebe-gateway-657b774f95-gmlbm   0/1     Running             0          4s
elasticsearch-master-0                   0/1     Pending             0          4s
elasticsearch-master-1                   0/1     Init:0/1            0          4s
```

Wait for all Kubernetes pods to reach the `Ready` state. For example:

```
NAME                                           READY    STATUS    RESTARTS   AGE
elasticsearch-master-0                          1/1     Running   0          4m6s
camunda-operate-XXX                             1/1     Running   0          4m6s
camunda-connectors-XXX                          1/1     Running   0          4m6s
camunda-zeebe-0                                 1/1     Running   0          4m6s
camunda-tasklist-XXX                            1/1     Running   0          4m6s
camunda-zeebe-gateway                           1/1     Running   0          4m6s
```

### Install the latest Camunda 8 version

When you use the Camunda 8 Helm chart, it automatically selects the latest version of [Camunda 8 applications](/reference/supported-environments.md). However, there might be slight discrepancies between the versions of the chart and its applications/dependencies, as they are released separately.

To ensure you're installing the most current version of both the chart and its applications/dependencies, use the following command:

```shell
# This will install the latest Camunda Helm chart with the latest applications/dependencies.
helm install camunda camunda/camunda-platform \
    --values https://helm.camunda.io/camunda-platform/values/values-latest.yaml
```

If you want to install a previous version of the Camunda componenets, follow this command structure:

```shell
# This will install Camunda Helm chart v8.1.x with the latest applications/dependencies of v8.1.x.
helm install camunda camunda/camunda-platform --version 8.1 \
    --values https://helm.camunda.io/camunda-platform/values/values-v8.1.yaml
```

### Accessing Camunda services

By default, Camunda services deployed in a cluster are not accessible from outside the cluster. However, you can choose from several methods to connect to these services:

- **Port forwarding:** This method allows you to direct traffic from your local machine to the cluster, making it possible to access Camunda services directly. For detailed instructions, refer to [accessing components without Ingress](/self-managed/setup/guides/accessing-components-without-ingress.md).
- **Ingress configuration:** You can set up the NGINX Ingress controller to manage external service access. For detailed instructions, refer to the [Ingress setup guide](/self-managed/setup/guides/ingress-setup.md).
- **EKS cluster installation:** For those deploying Camunda 8 on an Amazon EKS cluster, refer to [installing Camunda 8 on an EKS cluster](/self-managed/setup/deploy/amazon/amazon-eks/eks-helm.md).

## Configure license key

Camunda 8 components are able to consume Enterprise licensing information with the following Helm configuration:

```yaml
global:
  license:
    ## @param global.license.key if set, it will be exposed as "CAMUNDA_LICENSE_KEY" in all components, consumable as ENV_VAR.
    key:
    ## @param global.license.existingSecret you can provide an existing secret name for Camunda license secret.
    existingSecret:
    ## @param global.license.existingSecretKey you can provide the key within the existing secret object for Camunda license key.
    existingSecretKey:
```

If your installation of Camunda 8 requires a license key, update your `values.yaml` to include one of two options.

**Option One:** Enter your license key directly in `global.license.key`.

```yaml
global:
  license:
    key: >-
      --------------- BEGIN CAMUNDA LICENSE KEY ---------------
      [...]
      ---------------  END CAMUNDA LICENSE KEY  ---------------
```

**Option Two:** Provide a secret name and key in `global.license.existingSecret` and `global.license.existingSecretKey`.

Create a Kubernetes Secret object as follows:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: camunda-license
stringData:
  key: >-
    --------------- BEGIN CAMUNDA LICENSE KEY ---------------
    [...]
    ---------------  END CAMUNDA LICENSE KEY  ---------------
```

Then use the created Kubernetes Secret object as follows:

```yaml
global:
  license:
    existingSecret: "camunda-license"
    existingSecretKey: "key"
```

:::note
Camunda 8 components without a valid license may display **Non-Production License** in the navigation bar and issue warnings in the logs. These warnings have no impact on startup or functionality, with the exception that Web Modeler has a limitation of five users.
:::

## Configuring Web Modeler, Console, and Connectors

### Install Connectors

The **Connector runtime** comes enabled by default. To start using Connectors, install Connector element templates. Learn more in our documentation for [Web Modeler](/components/connectors/manage-connector-templates.md) or [Desktop Modeler](/components/modeler/desktop-modeler/element-templates/configuring-templates.md).

Find all available configurable options at the official Camunda Helm [values docs](https://artifacthub.io/packages/helm/camunda/camunda-platform#connectors-parameters).

#### Disable Connectors

To disable Connectors, pass the `connectors.enabled: false` value when deploying Camunda Helm Chart.

#### Polling authentication mode

Connectors use the [Operate API](/apis-tools/operate-api/overview.md) to fetch process definitions containing inbound Connectors. Depending on your Camunda architecture, you may want to choose one of the following values for the `inbound.mode`:

- `disabled` - Polling from Operate is disabled. Connector runtime will support only outbound interactions, such as HTTP REST calls.
- `credentials` - Connector runtime will attempt to authenticate to the Operate API with password-based basic HTTP authentication.
- `oauth` - _(Recommended and enabled by default)_ the Connector runtime will attempt to authenticate to the Operate API with an OAuth 2.0 provider. Camunda offers Keycloak as a default OAuth provider.

For more details, check [Connectors Helm values](https://artifacthub.io/packages/helm/camunda/camunda-platform#connectors-parameters).

### Install Web Modeler

Follow the steps below to install the Camunda Helm chart with Web Modeler enabled:

#### Configure Web Modeler

To set up Web Modeler, you need to provide the following required configuration values (all available configuration options are described in more detail in the Helm chart's [values docs](https://artifacthub.io/packages/helm/camunda/camunda-platform#webmodeler-parameters)):

- Enable Web Modeler with `webModeler.enabled: true` (it is disabled by default).
- Configure your SMTP server by providing the values under `webModeler.restapi.mail`.
  - Web Modeler requires an SMTP server to send notification emails to users.
- Configure the database connection
  - Web Modeler requires a PostgreSQL database as persistent data storage (other database systems are currently not supported).
  - _Option 1_: Set `postgresql.enabled: true`. This will install a new PostgreSQL instance as part of the Helm release (using the [PostgreSQL Helm chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) by Bitnami as a dependency).
  - _Option 2_: Set `postgresql.enabled: false` and configure a connection to an external database (see the second example below).

We recommend specifying these values in a YAML file that you pass to the `helm install` command. A minimum configuration file would look as follows:

```yaml
webModeler:
  enabled: true
  restapi:
    mail:
      smtpHost: smtp.example.com
      smtpPort: 587
      smtpUser: user
      smtpPassword: secret
      # Email address to be displayed as sender of emails from Web Modeler
      fromAddress: no-reply@example.com
postgresql:
  enabled: true
```

If you don't want to install a new PostgreSQL instance with Helm, but connect Web Modeler to an existing external database, set `postgresql.enabled: false` and provide the values under `webModeler.restapi.externalDatabase`:

```yaml
webModeler:
  restapi:
    externalDatabase:
      url: jdbc:postgresql://postgres.example.com:5432/modeler-db
      user: modeler-user
      password: secret
postgresql:
  # disables the PostgreSQL chart dependency
  enabled: false
```

For more details, check [Web Modeler Helm values](https://artifacthub.io/packages/helm/camunda/camunda-platform#webmodeler-parameters).

### Install Console

Console Self-Managed is disabled by default in the Camunda 8 Helm chart.

To install Console, enable Console in the Helm chart with `console.enabled: true`. We recommend specifying these values in a YAML file that you pass to the `helm install` command:

```yaml
console:
  enabled: true
```

For more details, check [Console Helm values](https://artifacthub.io/packages/helm/camunda/camunda-platform#console-parameters).

:::note
Console Self-Managed requires the Identity component to authenticate. Camunda Helm Chart installs Identity by default. When logging in to Console when using port-forward, port-forward the Keycloak service `kubectl port-forward svc/<RELEASE-NAME>-keycloak 18080:80` or configure Identity with Ingress as described in the [Ingress setup guide](/self-managed/setup/guides/ingress-setup.md).

:::

## Installation troubleshooting

Check that each pod is running and ready. If one or more of your pods are still pending, it means it cannot be scheduled onto a node. Usually, this happens because there are insufficient resources that prevent it. Use the `kubectl describe ...` command to check on messages from the scheduler:

```shell
kubectl describe pods <POD_NAME>
```

If the output of the `describe` command was not helpful, tail the logs of these pods by running the following:

```shell
kubectl logs -f <POD_NAME>
```

## Upgrading

For upgrading the Camunda Helm chart from one release to another, perform a [Helm upgrade](/self-managed/setup/upgrade.md).

## General notes

- **Zeebe Gateway** is deployed as a stateless service. We support [Kubernetes startup and liveness probes](/self-managed/zeebe-deployment/configuration/gateway-health-probes.md) for Zeebe.
- **Zeebe broker nodes** need to be deployed as a [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) to preserve the identity of cluster nodes. StatefulSets require persistent storage, which must be allocated in advance. Depending on your cloud provider, the persistent storage differs as it is provider-specific.
- **Docker pull limits** apply when downloading Camunda 8 images from Docker Hub. To avoid potential disruptions, authenticate with Docker Hub, use a mirror registry, or follow our guide on [installing in an air-gapped environment](/self-managed/setup/guides/air-gapped-installation.md).
