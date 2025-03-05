---
id: docker
title: "Docker"
keywords: ["camunda docker"]
---

import {DockerCompose} from "@site/src/components/CamundaDistributions";

This page guides you through Camunda 8 Docker images and how to run the platform in a developer setup using Docker Compose.

## Docker images

We provide Docker images [via Dockerhub](https://hub.docker.com/u/camunda). All these images are publicly accessible (except for [Web Modeler](#web-modeler)).

:::info
The provided Docker images are supported for production usage only on Linux systems. Windows or macOS are only supported for development environments.
:::

| Component         | Docker image                                                                           | Link to configuration options                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Zeebe             | [camunda/zeebe:latest](https://hub.docker.com/r/camunda/zeebe)                         | [Environment variables](../../zeebe-deployment/configuration/environment-variables/)                                    |
| Operate           | [camunda/operate:latest](https://hub.docker.com/r/camunda/operate)                     | [Operate configuration](../../operate-deployment/operate-configuration)                                                 |
| Tasklist          | [camunda/tasklist:latest](https://hub.docker.com/r/camunda/tasklist)                   | [Tasklist configuration](../../tasklist-deployment/tasklist-configuration)                                              |
| Identity          | [camunda/identity:latest](https://hub.docker.com/r/camunda/identity)                   | [Configuration variables](../../identity/deployment/configuration-variables/)                                           |
| Optimize          | [camunda/optimize:8-latest](https://hub.docker.com/r/camunda/optimize)                 | [Environment variables]($optimize$/self-managed/optimize-deployment/install-and-start/#available-environment-variables) |
| Connectors        | [camunda/connectors:latest](https://hub.docker.com/r/camunda/connectors)               | [Connectors configuration](../../connectors-deployment/connectors-configuration)                                        |
| Connectors Bundle | [camunda/connectors-bundle:latest](https://hub.docker.com/r/camunda/connectors-bundle) | [Connectors configuration](../../connectors-deployment/connectors-configuration)                                        |

Zeebe is the only component that is often run on its own as a standalone component. In this scenario, it does not need anything else, so a simple `docker run` is sufficient:

```bash
docker run --name zeebe -p 26500-26502:26500-26502 camunda/zeebe:latest
```

This will give you a single broker node with the following ports exposed:

- `26500`: Gateway API (this is the port clients need to use)
- `26501`: Command API (internal, gateway-to-broker)
- `26502`: Internal API (internal, broker-to-broker)

### Multi-platform support

With the Camunda 8.2.0 release and onward, all Camunda 8 Docker images are provided as multi-platform images natively supporting the following platforms:

- `linux/amd64`
- `linux/arm64`

Your Docker client should automatically pull the image that suits your platform.
We currently only recommend the `linux/amd64` for production usage, as the `linux/arm64` image is provided mainly for development purposes.

:::note
For Web Modeler, we only provide multi-platform images from the following releases onward: 8.2.8, 8.3.1, 8.4.0-alpha1.
:::

### Web Modeler

:::note
Web Modeler Self-Managed is available to [enterprise customers](../../reference/licenses.md#web-modeler) only.
:::

The Docker images for Web Modeler are not publicly accessible, but available to enterprise customers only from
Camunda's private Docker registry.

| Web Modeler Component | Docker image                                                      |
| --------------------- | :---------------------------------------------------------------- |
| Backend (`restapi`)   | `registry.camunda.cloud/web-modeler-ee/modeler-restapi:latest`    |
| Frontend (`webapp`)   | `registry.camunda.cloud/web-modeler-ee/modeler-webapp:latest`     |
| WebSocket server      | `registry.camunda.cloud/web-modeler-ee/modeler-websockets:latest` |

To pull the images you first need to log in using the credentials you received from Camunda:

```bash
$ docker login registry.camunda.cloud
Username: your_username
Password: ******
Login Succeeded
```

See the [instructions below](#web-modeler-1) on how to use the Web Modeler images with Docker Compose.
You can also find more information on the supported [configuration variables](../../modeler/web-modeler/configuration).

## Docker Compose

A Docker Compose configuration to run Zeebe, Operate, Tasklist, Optimize, Identity, and Connectors Bundle is available via `docker-compose.yaml`..
Follow the instructions in the [README](https://github.com/camunda/camunda-distributions#docker-compose).

:::danger
While the Docker images themselves are supported for production usage, the Docker Compose files are designed to be used by developers to run an environment locally; they are not designed to be used in production. We recommend to use [Kubernetes](./helm-kubernetes/overview.md) in production.
:::

Download the artifact for Camunda 8 <DockerCompose/> and extract it.

This Docker Compose configuration serves two purposes:

1. It can be used to start up a development environment locally.
2. It documents how the various components need to be wired together.

:::note
We recommend to use [Helm + KIND](./helm-kubernetes/guides/local-kubernetes-cluster.md) instead of Docker Compose for local environments, as the Helm configurations are battle-tested and much closer to production systems.
:::

### Web Modeler

An additional Docker Compose configuration to run Web Modeler is also available via `docker-compose-web-modeler.yaml`. It works the same way but runs Web Modeler only.

## Configuration hints

### Zeebe

#### Volumes

The default data volume is under `/usr/local/zeebe/data`. It contains
all data which should be persisted.

#### Configuration

The Zeebe configuration is located at `/usr/local/zeebe/config/application.yaml`.
The logging configuration is located at `/usr/local/zeebe/config/log4j2.xml`.

The configuration of the Docker image can also be changed using [environment
variables](../zeebe-deployment/configuration/environment-variables.md). The configuration template file also contains information on the environment
variables to use for each configuration setting.

Available environment variables:

- `ZEEBE_LOG_LEVEL` - Sets the log level of the Zeebe Logger (default: `info`).
- `ZEEBE_BROKER_NETWORK_HOST` - Sets the host address to bind to instead of the IP of the container.
- `ZEEBE_BROKER_CLUSTER_INITIALCONTACTPOINTS` - Sets the contact points of other brokers in a cluster setup.

### Optimize

Some configuration properties are optional and have default values. See a description of these properties and their default values in the table below:

| Name                                                    | Description                                                                                                                                                                                | Default value |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| SPRING_PROFILES_ACTIVE                                  | Determines the mode Optimize is to be run in. For Self-Managed, set to `ccsm`.                                                                                                             |
| CAMUNDA_OPTIMIZE_IDENTITY_ISSUER_URL                    | The URL at which Identity can be accessed by Optimize.                                                                                                                                     |
| CAMUNDA_OPTIMIZE_IDENTITY_ISSUER_BACKEND_URL            | The URL at which the Identity auth provider can be accessed by Optimize. This should match the configured provider in Identity and is to be used for container to container communication. |
| CAMUNDA_OPTIMIZE_IDENTITY_CLIENTID                      | The Client ID used to register Optimize with Identity.                                                                                                                                     |
| CAMUNDA_OPTIMIZE_IDENTITY_CLIENTSECRET                  | The secret used when registering Optimize with Identity.                                                                                                                                   |
| CAMUNDA_OPTIMIZE_IDENTITY_AUDIENCE                      | The audience used when registering Optimize with Identity.                                                                                                                                 |
| OPTIMIZE_ELASTICSEARCH_HOST                             | The address/hostname under which the Elasticsearch node is available.                                                                                                                      | localhost     |
| OPTIMIZE_ELASTICSEARCH_HTTP_PORT                        | The port number used by Elasticsearch to accept HTTP connections.                                                                                                                          | 9200          |
| CAMUNDA_OPTIMIZE_SECURITY_AUTH_COOKIE_SAME_SITE_ENABLED | Determines if `same-site` is enabled for Optimize cookies. This must be set to `false`.                                                                                                    | true          |
| CAMUNDA_OPTIMIZE_ELASTICSEARCH_SECURITY_USERNAME        | The username for authentication in environments where a secured Elasticsearch connection is configured.                                                                                    |
| CAMUNDA_OPTIMIZE_ELASTICSEARCH_SECURITY_PASSWORD        | The password for authentication in environments where a secured Elasticsearch connection is configured.                                                                                    |
| CAMUNDA_OPTIMIZE_ENTERPRISE                             | This should only be set to `true` if an Enterprise License has been acquired.                                                                                                              | true          |
| CAMUNDA_OPTIMIZE_ZEEBE_ENABLED                          | Enables import of Zeebe data in Optimize.                                                                                                                                                  | false         |
| CAMUNDA_OPTIMIZE_ZEEBE_NAME                             | The record prefix for exported Zeebe records.                                                                                                                                              | zeebe-record  |
| CAMUNDA_OPTIMIZE_ZEEBE_PARTITION_COUNT                  | The number of partitions configured in Zeebe.                                                                                                                                              | 1             |
| CAMUNDA_OPTIMIZE_SHARING_ENABLED                        | Enable/disable the possibility to share reports and dashboards.                                                                                                                            | true          |
| SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI   | Authentication for the Public REST API using a resource server to validate the JWT token. Complete URI to get public keys for JWT validation.                                              | null          |
| OPTIMIZE_API_ACCESS_TOKEN                               | Authentication for the Public REST API using a static shared token. Will be ignored if SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI is also set.                                  | null          |
| CAMUNDA_OPTIMIZE_CONTAINER_ENABLE_SNI_CHECK             | Determines whether SNI checking should be enabled.                                                                                                                                         | true          |

Like for example this `docker-compose` configuration:

```
optimize:
    container_name: optimize
    image: camunda/optimize:8-latest
    ports:
        - 8090:8090
    environment:
        - SPRING_PROFILES_ACTIVE=ccsm
        - CAMUNDA_OPTIMIZE_IDENTITY_ISSUER_URL=http://localhost:9090
        - CAMUNDA_OPTIMIZE_IDENTITY_ISSUER_BACKEND_URL=http://keycloak:8080/auth/realms/camunda-platform
        - CAMUNDA_OPTIMIZE_IDENTITY_CLIENTID=optimize
        - CAMUNDA_OPTIMIZE_IDENTITY_CLIENTSECRET=secret
        - CAMUNDA_OPTIMIZE_IDENTITY_AUDIENCE=optimize-api
        - OPTIMIZE_ELASTICSEARCH_HOST=localhost
        - OPTIMIZE_ELASTICSEARCH_HTTP_PORT=9200
        - CAMUNDA_OPTIMIZE_SECURITY_AUTH_COOKIE_SAME_SITE_ENABLED=false
        - CAMUNDA_OPTIMIZE_ENTERPRISE=false
        - CAMUNDA_OPTIMIZE_ZEEBE_ENABLED=true
        - CAMUNDA_OPTIMIZE_ZEEBE_NAME=zeebe-record
        - CAMUNDA_OPTIMIZE_ZEEBE_PARTITION_COUNT=1
        - CAMUNDA_OPTIMIZE_SHARING_ENABLED=true
        - SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI=https://weblogin.cloud.company.com/.well-known/jwks.json
        - OPTIMIZE_API_ACCESS_TOKEN=secret
```

Self-Managed Optimize must be able to connect to Elasticsearch to write and read data. In addition, Optimize needs to connect to Identity for authentication purposes. Both of these requirements can be configured with the options described above.

Optimize must also be configured as a client in Identity, and users will only be granted access to Optimize if they have a role
that has `write:*` permission for Optimize.

For Optimize to import Zeebe data, Optimize must also be configured to be aware of the record prefix used when the records are exported to Elasticsearch. This can also be configured per the example above.

### Connectors

Use the provided [Docker Compose](#docker-compose) files to execute all [out-of-the-box Connectors](/components/connectors/out-of-the-box-connectors/available-connectors-overview.md) automatically.
This uses the [Connectors Bundle](https://hub.docker.com/r/camunda/connectors-bundle) Docker image.

Note that some out-of-the-box Connectors are licensed under the
[Camunda Self-Managed Free Edition license](https://camunda.com/legal/terms/cloud-terms-and-conditions/camunda-cloud-self-managed-free-edition-terms/).
Find an overview in the [Connectors Bundle project](https://github.com/camunda/connectors-bundle).

Refer to the [Connector installation guide](../../connectors-deployment/install-and-start) for details on how to provide the Connector templates for modeling.

#### Running single Connectors container

```shell
docker run --rm --name=MyConnectorsInstance \
  --network=camunda-platform_camunda-platform \
  -e ZEEBE_CLIENT_BROKER_GATEWAY-ADDRESS=zeebe:26500 \
  -e ZEEBE_CLIENT_SECURITY_PLAINTEXT=true \
  -e CAMUNDA_CONNECTOR_POLLING_ENABLED=false \
  -e CAMUNDA_CONNECTOR_WEBHOOK_ENABLED=false \
  -e OPERATE_CLIENT_ENABLED=false \
  -e SPRING_MAIN_WEB-APPLICATION-TYPE=none \
    camunda/connectors-bundle:latest
```

#### Custom set of Connectors

To add custom Connectors, you can build on top of our [Connectors base image](https://hub.docker.com/r/camunda/connectors/) that includes the pre-packaged runtime environment without any Connector.
To use the image, at least one Connector must be added to the `classpath`. We recommend providing JARs with all dependencies bundled.

:::caution

As all Connectors share a single `classpath`, different versions of the same dependency can be available and cause conflicts.
To prevent this, common dependencies like `jackson` can be shaded and relocated inside the Connector's JAR.

:::

You can add a Connector JAR by extending the base image with a JAR from a public URL:

```yml
FROM camunda/connectors:x.y.z

ADD https://repo1.maven.org/maven2/io/camunda/connector/connector-http-json/x.y.z/connector-http-json-0..0-with-dependencies.jar /opt/app/
```

You can also add a Connector JAR using volumes:

```bash
docker run --rm --name=connectors -d -v $PWD/connector.jar:/opt/app/ camunda/connectors:x.y.z
```
