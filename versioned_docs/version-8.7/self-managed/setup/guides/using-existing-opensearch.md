---
id: using-existing-opensearch
title: "Using Amazon OpenSearch Service"
description: "Learn how to use an Amazon OpenSearch Service instance in Camunda 8 Self-Managed deployment."
---

Camunda 8 Self-Managed has two different types of components: Camunda components (Operate, Optimize, Tasklist, etc.) and non-Camunda dependency components (such as Keycloak and Elasticsearch). For more details, review the [architecture](../../about-self-managed.md#architecture) documentation for more information on the different types of applications.

This guide steps through using an existing Amazon OpenSearch Service instance. By default, [Helm chart deployment](/self-managed/setup/overview.md) creates a new Elasticsearch instance, but it's possible to use Amazon OpenSearch Service instead.

## Preparation

### Authentication

There are two layers of permissions with OpenSearch: AWS IAM and OpenSearch internal. If you would like to connect to OpenSearch using AWS IAM roles for service accounts (IRSA) then please also refer to the [IAM roles for service accounts documentation](/self-managed/setup/deploy/amazon/amazon-eks/terraform-setup.md#opensearch-module-setup).

Otherwise, if it is intended to connect to Amazon OpenSearch Service with basic auth, then the example below can be followed:

## Values file

:::note
Not all Optimize features are supported when using OpenSearch as a database, including backups. For a full list of the features that are currently supported, please refer to the [Camunda 8](https://github.com/camunda/issues/issues/635) OpenSearch features.
:::

The following values can be configured in the Camunda 8 Self-Managed Helm chart in order to use Amazon OpenSearch Service:

### Connecting to Amazon OpenSearch Service with basic auth

```yaml
global:
  elasticsearch:
    enabled: false
  opensearch:
    enabled: true
    auth:
      username: user
      password: pass
    url:
      protocol: https
      host: opensearch.example.com
      port: 443

elasticsearch:
  enabled: false
```

From the above configuration, the internal Elasticsearch component and the Elasticsearch configuration for all components are disabled. This is required to use Amazon OpenSearch Service.

If you do not wish to specify the username and password in plaintext within the `values.yaml` file, then the following configuration can be used:

```yaml
global:
  opensearch:
    auth:
      existingSecret: secretName
      existingSecretKey: secretKey
```

## Next steps

Use the custom values file to [deploy Camunda 8](/self-managed/setup/overview.md) as usual:

```sh
helm install camunda camunda/camunda-platform -f existing-elasticsearch-values.yaml
```
