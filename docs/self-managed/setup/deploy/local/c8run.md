---
id: c8run
title: "Local installation with Camunda 8 Run"
sidebar_label: "Camunda 8 Run"
keywords: ["C8Run"]
description: "Use the Camunda 8 Run single application script to set up a local development environment."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

:::note
Camunda 8 Run is not supported for production use.
:::

The Camunda 8 Run script allows you to install and start a simplified, single-application Camunda configuration in a local development environment. This page guides you through using Camunda 8 Run on a local or virtual machine.

Camunda 8 Run includes the following:

- Zeebe
- Operate
- Tasklist
- Identity
- Connectors
- Elasticsearch

## Prerequisites

- **OpenJDK 21+**: Required for running Camunda 8 as a Java application.
- **Docker 20.10.21+**: Required for running Camunda 8 via Docker Compose.
- **[Desktop Modeler](/components/modeler/desktop-modeler/install-the-modeler.md)**
- **If using Ubuntu**: Ubuntu 22.04 or newer

:::note
After installing OpenJDK, ensure `JAVA_HOME` is set by running `java -version` in a **new** terminal.

If no version of Java is found, follow your chosen installation's instructions for setting `JAVA_HOME` before continuing.
:::

## Install and start Camunda 8 Run

1. Download the [latest release of Camunda 8 Run](https://github.com/camunda/camunda/releases/tag/8.7.0-alpha4) for your operating system and architecture. Opening the .tgz file extracts the Camunda 8 Run script into a new directory.
2. Navigate to the new `c8run` directory.
3. Start Camunda 8 Run by running one of the following in your terminal:
   - `./start.sh`: start Camunda 8 Run as a Java application.
   - `./start.sh --docker`: start Camunda 8 Run via Docker Compose.

When successful, a new Operate window automatically opens.

:::note
If Camunda 8 Run fails to start, run the [shutdown script](#shut-down-camunda-8-run) to end the current processes, then run the start script again.

Mac users may encounter the warning `"c8run" Not Opened`. Follow the Apple support instructions to [grant an exception](https://support.apple.com/en-us/102445).
:::

### Configuration options

The following command line arguments are available:

| Argument                   | Description                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--config <path>`          | Applies the specified Zeebe [`application.yaml`](/self-managed/zeebe-deployment/configuration/configuration.md).                                                                                         |
| `--detached`               | Starts Camunda 8 Run as a detached process.                                                                                                                                                              |
| `--username <arg>`         | Configure the first user’s username to `<arg>`.                                                                                                                                                          |
| `--password <arg>`         | Configure the first user’s password to `<arg>`.                                                                                                                                                          |
| `--keystore <arg>`         | Configure the TLS certificate for HTTPS. If not specified, use HTTP. For more information, see [enabling TLS](#enable-tls).                                                                              |
| `--keystorePassword <arg>` | Provide the password to use with a JKS keystore file.                                                                                                                                                    |
| `--port <arg>`             | Configure the Camunda core port to the value provided (default: 8080).                                                                                                                                   |
| `--log-level <arg>`        | Set a different log level for the Camunda core.                                                                                                                                                          |
| `--docker`                 | Download and run the Camunda Docker Compose distribution. Any additional options are not supported at this time, and will be ignored.                                                                    |
| `--disable-elasticsearch`  | Do not start the built-in Elasticsearch. Ensure another Elasticsearch instance is provided via `--config`. See the [external Elasticsearch](#start-external-elasticsearch) options for more information. |

## Work with Camunda 8 Run

### Access Camunda components

All Camunda 8 Run components can be accessed using the username/password combination `demo`/`demo`.

Tasklist, Operate, and Identity are available at:

- Tasklist: http://localhost:8080/tasklist
- Operate: http://localhost:8080/operate
- Identity: http://localhost:8080/identity

The following components do not have a web interface, but the URLs may be required for additional configuration:

- Zeebe Gateway: http://localhost:26500
- Connectors: http://localhost:8085

:::note
The Connectors URL displays a login page, but cannot be logged into.
:::

### Deploy diagrams from Desktop Modeler

Make sure you have installed [Desktop Modeler](/components/modeler/desktop-modeler/install-the-modeler.md) before continuing.

To [deploy diagrams](/self-managed/modeler/desktop-modeler/deploy-to-self-managed.md) from Desktop Modeler, the following configuration is required:

- **Target:** Self-Managed
- **Cluster endpoint:** `http://localhost:26500`, the location of your Zeebe Gateway
- **Authentication:** None

A success notification displays when complete. [Start a new process instance](/components/modeler/desktop-modeler/start-instance.md) to view your running process in Operate.

### Use built-in and custom Connectors

Desktop Modeler [automatically fetches](/components/modeler/desktop-modeler/use-connectors.md#automatic-connector-template-fetching) templates for pre-built Connectors. [Custom Connectors](/components/connectors/custom-built-connectors/connector-sdk.md) can also be added to your Camunda 8 Run distribution.

To add a custom Connector:

1. Place the Connector's .jar file in the `/custom_connectors` folder contained in the `/c8run` directory.
2. Place the element template in the appropriate folder for your installation. See [Search Paths](/components/modeler/desktop-modeler/search-paths/search-paths.md) for more information.

Once configured correctly, your Connectors are available for use in Modeler.

### Use Camunda APIs

All served Camunda APIs are by default **unprotected** in Camunda 8 Run, and can be accessed without any authentication credentials or token provided.

The available APIs are [Tasklist V1](/apis-tools/tasklist-api-rest/tasklist-api-rest-overview.md), [Operate V1](/apis-tools/operate-api/overview.md), [Zeebe gRPC](/apis-tools/zeebe-api/grpc.md) and the unified [Camunda 8 REST API](/apis-tools/camunda-api-rest/camunda-api-rest-overview.md)

### Enable authentication and authorization

To work with authorizations, API authentication and authorization enforcement must be enabled. The following minimal `application.yaml` shows the required configuration for the APIs and authorizations:

```yaml
camunda.security:
  authentication.unprotected-api: false
  authorizations.enabled: true
```

Place the above `application.yaml` into your root `/c8run` folder, provide it to Camunda 8 Run at startup using the `--config` [flag](#configuration-options):

```
./start.sh --config application.yaml
```

You are then required to provide basic authentication credentials on API requests, as in the following:

```shell
curl --request POST 'http://localhost:8080/v1/process-definitions/search'  \
  -u demo:demo \
  --header 'Content-Type: application/json' \
  --data-raw '{}'
```

## Shut down Camunda 8 Run

To shut down Camunda 8 Run and end all running processes, run `./shutdown.sh` (or `.\c8run.exe stop` on Windows) from the C8Run directory.

## Advanced options

### Enable TLS

TLS can be enabled by providing a local file keystore using the `--keystore` argument at startup. Camunda 8 Run accepts .JKS certificate files.

### Access metrics

Metrics are enabled in Camunda 8 Run by default, and can be accessed at [/actuator/prometheus](http://localhost:9600/actuator/prometheus). For more information, see the Zeebe [Prometheus metrics](/self-managed/zeebe-deployment/operations/metrics.md) documentation.

### Start external Elasticsearch

To start Elasticsearch outside of Camunda 8 Run, set the `--disable-elasticsearch` flag at startup. This prevents Camunda 8 Run from starting its own Elasticsearch instance.

The following command starts an external Elasticsearch instance via `docker run`:

```bash
docker run \
    -m 1GB \
    -d \
    --name elasticsearch \
    -p 9200:9200 \
    -p 9300:9300 \
    -e "discovery.type=single-node" \
    -e "xpack.security.enabled=false" \
    elasticsearch:8.15.2
```

### Environment variables

The following advanced configuration options can be provided via environment variables:

| Variable       | Description                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES_JAVA_OPTS` | Allows you to override Java command line parameters for Elasticsearch. This can allow you to increase memory limits. **Default:** `-Xms1g -Xmx1g` |
| `JAVA_OPTS`    | Allows you to override Java command line parameters for Camunda.                                                                                  |
