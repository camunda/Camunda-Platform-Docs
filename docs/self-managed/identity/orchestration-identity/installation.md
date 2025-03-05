---
id: installation
title: Installation
description: "Learn how Identity is bundled with your default Orchestration cluster."
---

Identity is included by default with the deployment of any [Orchestration cluster](/self-managed/reference-architecture/reference-architecture.md#orchestration-cluster). Within an Orchestration cluster, Identity provides unified, cluster-level identity management and authorizations.

Identity for Orchestration clusters is available via [Helm install](/self-managed/setup/install.md), and for local development via [Camunda 8 Run](/self-managed/setup/deploy/local/c8run.md).

## Initial configuration

Following the default installation will result in a cluster with the following:

1. Basic authentication enabled
2. API authentication disabled
3. Authorizations disabled
4. An initial user with the username/password `demo`/`demo`
5. An `admin` role with read, create, update, and delete permissions for other roles

### Configure basic authentication

To make changes to the initial configuration, add the desired values via your `application.yaml` or environment variables according to the available [configuration properties](./configuration.md).

For example, to enable basic authentication and create an initial user, the following is required:

```yaml
camunda.security:
  authentication.unprotected-api: false
  initialization.users[0].username: <Your chosen username>
  initialization.users[0].password: <Your chosen password>
  initialization.users[0].name: <The name of the first user>
  initialization.users[0].email: <The email address of the first user>
```

### Enable authorizations

To work with authorizations, API authentication and authorization enforcement must be enabled. The following minimal `application.yaml` shows the required configuration for the APIs and authorizations:

```yaml
camunda.security:
  authentication.unprotected-api: false
  authorizations.enabled: true
```

Basic authentication credentials are then required when making API requests, as in the following:

```shell
curl --request POST 'http://localhost:8080/v1/process-definitions/search'  \
  -u demo:demo \
  --header 'Content-Type: application/json' \
  --data-raw '{}'
```
