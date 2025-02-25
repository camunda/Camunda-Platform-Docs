---
id: connectors-configuration
title: Configuration
description: "Configure the Connector runtime environment based on the Zeebe instance to connect to, the Connector functions to run, and secrets available to the Connectors."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

You can configure the Connector runtime environment in the following ways:

- The Zeebe and Operate instances to connect to.
- The Connector functions to run.
- The secrets that should be available to the Connectors.

To connect to **Zeebe**, the Connector runtime uses the [Spring Zeebe SDK](/apis-tools/spring-zeebe-sdk/getting-started.md).

To interact with the **Operate API**, the Connector runtime uses the community-maintained [Operate Java client](https://github.com/camunda-community-hub/camunda-operate-client-java).

Any configuration that can be set in the Spring Zeebe SDK or Operate Java client can also be set in the Connector runtime environment.

Below are some of the most common configuration options for the Connector runtime. Refer to the [Spring Zeebe SDK](/apis-tools/spring-zeebe-sdk/configuration.md#zeebe) and Operate Java client documentation for a full list of configuration options.

:::note
This guide provides configuration properties the form of environment variables, while the Spring Zeebe SDK documentation uses Java configuration properties. The two formats are interchangeable, and you can use the Java configuration properties in the Connector runtime environment as well.

For example, the Java configuration property`camunda.client.zeebe.grpc-address` can be set in the Connector runtime environment as an environment variable called `CAMUNDA_CLIENT_ZEEBE_GRPCADDRESS`.
:::

## Connecting to Zeebe and Operate

<Tabs groupId="configuration" defaultValue="saas" queryString values={
[
{label: 'Connecting to Camunda 8 SaaS', value: 'saas' },
{label: 'Connecting to Camunda 8 Self-Managed', value: 'sm' },
]
}>

<TabItem value='saas'>

To use Camunda 8 SaaS, specify the connection properties:

```bash
CAMUNDA_CLIENT_MODE=saas
CAMUNDA_CLIENT_CLUSTERID=xxx
CAMUNDA_CLIENT_AUTH_CLIENTID=xxx
CAMUNDA_CLIENT_AUTH_CLIENTSECRET=xxx
CAMUNDA_CLIENT_REGION=bru-2
```

To use inbound connectors, specify the Operate connection properties:

```bash
OPERATE_CLIENT_PROFILE=saas
OPERATE_CLIENT_REGION=bru-2
OPERATE_CLIENT_CLUSTERID=xxx
OPERATE_CLIENT_CLIENTID=xxx
OPERATE_CLIENT_CLIENTSECRET=xxx
```

If you don't need to use inbound connectors, you can disable them and remove the need for an Operate connection. This will lead to inability to use inbound capabilities like webhooks.

```bash
CAMUNDA_CONNECTOR_POLLING_ENABLED=false
CAMUNDA_CONNECTOR_WEBHOOK_ENABLED=false
OPERATE_CLIENT_ENABLED=false
```

If you are connecting a local Connector runtime to a SaaS cluster, you may want to review our [guide to using Connectors in hybrid mode](/guides/use-connectors-in-hybrid-mode.md).

</TabItem>

<TabItem value='sm'>

Specify the connection properties to connect to a self-managed Zeebe instance:

```bash
CAMUNDA_CLIENT_MODE=self-managed
CAMUNDA_CLIENT_ZEEBE_GRPCADDRESS=http://localhost:26500
CAMUNDA_CLIENT_ZEEBE_RESTADDRESS=http://localhost:8080
```

If using an HTTPS connection, you may need to provide a certificate to validate the gateway's certificate chain.

```bash
CAMUNDA_CLIENT_ZEEBE_CACERTIFICATEPATH=/path/to/certificate.pem
```

Depending on the authentication method used by the Zeebe instance, you may need to provide authentication properties:

```bash
CAMUNDA_CLIENT_AUTH_CLIENTID=xxx
CAMUNDA_CLIENT_AUTH_CLIENTSECRET=xxx
CAMUNDA_CLIENT_AUTH_ISSUER=http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token
CAMUNDA_CLIENT_AUTH_AUDIENCE=zeebe-api
```

See the [Spring Zeebe SDK documentation](../../../apis-tools/spring-zeebe-sdk/getting-started#self-managed) for more information on authentication properties.

Connect to Operate locally using username and password:

```bash
OPERATE_CLIENT_PROFILE=simple
OPERATE_CLIENT_BASEURL=http://localhost:8081
OPERATE_CLIENT_USERNAME=demo
OPERATE_CLIENT_PASSWORD=demo
```

Connect to Operate in a Self-Managed environment using OAuth 2.0 credentials:

```bash
OPERATE_CLIENT_PROFILE=oidc
OPERATE_CLIENT_BASEURL=http://localhost:8081
OPERATE_CLIENT_AUTHURL=http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token
OPERATE_CLIENT_AUDIENCE=operate-api
OPERATE_CLIENT_CLIENTID=xxx
OPERATE_CLIENT_CLIENTSECRET=xxx
OPERATE_CLIENT_SCOPE=xxx # optional
```

If you don't need to use inbound connectors, you can disable them and remove the need for an Operate connection. This will lead to inability to use inbound capabilities like webhooks.

```bash
CAMUNDA_CONNECTOR_POLLING_ENABLED=false
CAMUNDA_CONNECTOR_WEBHOOK_ENABLED=false
OPERATE_CLIENT_ENABLED=false
```

</TabItem>
</Tabs>

## Manual discovery of Connectors

By default, the Connector runtime picks up outbound Connectors available on the classpath automatically.
To disable this behavior, use the following environment variables to configure Connectors explicitly:

| Environment variable                          | Purpose                                                       |
| :-------------------------------------------- | :------------------------------------------------------------ |
| `CONNECTOR_{NAME}_FUNCTION` (required)        | Function to be registered as job worker with the given `NAME` |
| `CONNECTOR_{NAME}_TYPE` (optional)            | Job type to register for worker with `NAME`                   |
| `CONNECTOR_{NAME}_INPUT_VARIABLES` (optional) | Variables to fetch for worker with `NAME`                     |
| `CONNECTOR_{NAME}_TIMEOUT` (optional)         | Timeout in milliseconds for worker with `NAME`                |

Through this configuration, you define all job workers to run.

Specifying optional values allows you to override `@OutboundConnector`-provided Connector configuration.

```bash
CONNECTOR_HTTPJSON_FUNCTION=io.camunda.connector.http.rest.HttpJsonFunction
CONNECTOR_HTTPJSON_TYPE=non-default-httpjson-task-type
```

## Secrets

Providing secrets to the runtime environment can be achieved in different ways, depending on your setup.

<Tabs groupId="connectorTemplateInbound" defaultValue="default" queryString values={
[
{label: 'Default secret provider', value: 'default' },
{label: 'Secrets in Docker images', value: 'docker' },
{label: 'Secrets in manual installations', value: 'manual' },
{label: 'Custom secret provider', value: 'custom' },
]
}>

<TabItem value='default'>

:::caution
By default, all environment variables can be used as Connector secrets.
:::

To limit the environment that can be accessed by the default secret provider, configure a prefix. For example:

```bash
export CAMUNDA_CONNECTOR_SECRETPROVIDER_ENVIRONMENT_PREFIX='SUPER_SECRETS_'
export SUPER_SECRETS_MY_SECRET='foo' # This will be resolved by using {{ secrets.MY_SECRET }}
```

The following environment variables can be used to configure the default secret provider:

| Name                                                   | Description                                                              | Default value |
| ------------------------------------------------------ | ------------------------------------------------------------------------ | ------------- |
| `CAMUNDA_CONNECTOR_SECRETPROVIDER_ENVIRONMENT_ENABLED` | Whether the default secret provider is enabled.                          | `true`        |
| `CAMUNDA_CONNECTOR_SECRETPROVIDER_ENVIRONMENT_PREFIX`  | The prefix applied to the secret name before looking up the environment. | `""`          |

</TabItem>

<TabItem value='docker'>

To inject secrets into the [Docker images of the runtime](/self-managed/setup/deploy/other/docker.md#connectors), they must be available in the environment of the Docker container.

For example, you can inject secrets when running a container:

```bash
docker run --rm --name=connectors -d \
  -v $PWD/connector.jar:/opt/app/ \  # Add a connector jar to the classpath
  -e MY_SECRET=secret \              # Set a secret with value
  -e SECRET_FROM_SHELL \             # Set a secret from the environment
  --env-file secrets.txt \           # Set secrets from a file
  camunda/connectors-bundle:latest
```

The secret `MY_SECRET` value is specified directly in the `docker run` call,
whereas the `SECRET_FROM_SHELL` is injected based on the value in the
current shell environment when `docker run` is executed. The `--env-file`
option allows using a single file with the format `NAME=VALUE` per line
to inject multiple secrets at once.

</TabItem>

<TabItem value='manual'>

In the [manual setup](/self-managed/setup/deploy/local/manual.md#run-connectors), inject secrets during Connector execution by providing
them as environment variables before starting the runtime environment. You can, for example, export them beforehand as follows:

```bash
export MY_SECRET='foo'
```

Reference the secret in the Connector's input in the prefixed style `{{secrets.MY_SECRET}}`.

</TabItem>

<TabItem value='custom'>

Create your own implementation of the `io.camunda.connector.api.secret.SecretProvider` interface that
[comes with the SDK](https://github.com/camunda/connectors/blob/main/connector-sdk/core/src/main/java/io/camunda/connector/api/secret/SecretProvider.java).

Package this class and all its dependencies as a JAR, for example `my-secret-provider-with-dependencies.jar`. This needs to include a file
`META-INF/services/io.camunda.connector.api.secret.SecretProvider` that contains the fully qualified class name of your secret
provider implementation. Add this JAR to the runtime environment, depending on your deployment setup.
Your secret provider will serve secrets as implemented.

To use this JAR with [Camunda Helm charts](https://artifacthub.io/packages/helm/camunda/camunda-platform), build an [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) to create a volume with your secret provider, and mount it into the Connectors pod.

For example, use the following file as input for your `helm install` command:

```bash
connectors:
  extraVolumes:
    - name: workdir
      emptyDir: {}
  extraVolumeMounts:
    # Mount the secret provider
    # The Connectors pod will pick up the secret provider from /opt/app during startup
    - name: workdir
      mountPath: /opt/app/file-secret-provider-2.1.2.jar
      subPath: file-secret-provider-2.1.2.jar
  initContainers:
    - name: install
      image: busybox:1.36.1
      command: ["sh", "-c"]
      args:
        # Download a the custom secret provider into the volume
        - |
          wget -O /work-dir/file-secret-provider-2.1.2.jar https://artifacts.camunda.com/artifactory/camunda-consulting/com/camunda/consulting/connector/file-secret-provider/2.1.2/file-secret-provider-2.1.2.jar
      volumeMounts:
        - name: workdir
          mountPath: "/work-dir"
      securityContext:
        runAsUser: 1000
        # redundant as 1000 is not root but good to have
        # as the runtime will do verification that no process will
        # run as root within the container
        runAsNonRoot: true
```

For Docker images, you can add the JAR by using volumes, for example:

```bash
docker run --rm --name=connectors -d \
  -v $PWD/my-secret-provider-with-dependencies.jar:/opt/app/my-secret-provider-with-dependencies.jar \  # Specify secret provider
  -e ZEEBE_CLIENT_BROKER_GATEWAY-ADDRESS=ip.address.of.zeebe:26500 \                                    # Specify Zeebe address
  -e ZEEBE_CLIENT_SECURITY_PLAINTEXT=true \                                                             # Optional: provide security configs to connect to Zeebe
  camunda/connectors:latest
```

In manual installations, add the JAR to the `-cp` argument of the Java call:

```bash
java -cp 'connector-runtime-application-VERSION-with-dependencies.jar:...:my-secret-provider-with-dependencies.jar' \
    io.camunda.connector.runtime.ConnectorRuntimeApplication
```

</TabItem>
</Tabs>

## Multi-tenancy

The Connector Runtime supports multiple tenants for inbound and outbound Connectors. These are configurable in [Identity](/self-managed/identity/user-guide/tenants/managing-tenants.md).

A single Connector Runtime can serve a single tenant or can be configured to serve
multiple tenants. By default, the runtime uses the tenant ID `<default>` for all
Zeebe-related operations like handling jobs and publishing messages.

:::info
Support for **outbound Connectors** with multiple tenants requires a dedicated
tenant job worker config (described below). **Inbound Connectors** automatically work for all tenants the configured Connector Runtime client has access to. This can be configured in Identity via the application assignment.
:::

### Environment variables

The Connector Runtime uses the following environment variables to configure multi-tenancy:

| Name                                       | Description                                                                                                                                                                              | Default value |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| ZEEBE_CLIENT_DEFAULT-TENANT-ID             | The default tenant ID used to communicate with Zeebe. Changing this value will set a new default tenant ID used for fetching jobs and publishing messages.                               | `<default>`   |
| ZEEBE_CLIENT_DEFAULT-JOB-WORKER-TENANT-IDS | The default tenant IDs (comma separated) used to activate jobs. To run the Connector Runtime in a setup where a single runtime serves multiple tenants, add each tenant ID to this list. | `<default>`   |

If you are using an embedded version of the Connector Runtime, you can specify the tenant information in your Spring configuration like in this example `application.properties` file:

```bash
zeebe.client.default-tenant-id=myTenant
zeebe.client.default-job-worker-tenant-ids=myTenant
```

### Outbound Connector config

The Connector Runtime uses the default tenant for outbound Connector-related features.
If support for a different tenant or multiple tenants should be enabled, the tenants need
to be configured individually using the following environment variables.

If you want to use outbound Connectors for a single tenant that is different
from the default tenant, you can specify a different default tenant ID using:

```bash
ZEEBE_CLIENT_DEFAULT-TENANT-ID=myTenant
```

This will change the default tenant ID used for fetching jobs and publishing messages
to the tenant ID `myTenant`.

:::note
Inbound Connectors will still be enabled for
all tenants the Connector Runtime client has access to.
:::

To run the Connector Runtime in a setup where a single runtime
serves multiple tenants, add each tenant ID to the list of the default job workers:

```bash
ZEEBE_CLIENT_DEFAULT-JOB-WORKER-TENANT-IDS=`myTenant, otherTenant`
```

In this case, the `ZEEBE_CLIENT_DEFAULT-TENANT-ID` will **not** be used for the
configuration of job workers.

### Inbound Connector configuration

The Connector Runtime fetches and executes all inbound Connectors it receives from
Operate independently of the outbound Connector configuration without any additional
configuration required from the user.

To restrict the Connector Runtime inbound Connector feature to a single tenant or multiple tenants, use Identity and assign the tenants the Connector application should have access to.

### Troubleshooting

To ensure seamless integration and functionality, the multi-tenancy feature must also be enabled across **all** associated components [if not configured in Helm](/self-managed/concepts/multi-tenancy.md) so users can view any data from tenants for which they have authorizations configured in Identity.

Find more information (including links to individual component configuration) on the [multi-tenancy concepts page](/self-managed/concepts/multi-tenancy.md).

## Logging

### Google Stackdriver (JSON) logging

To enable Google Stackdriver compatible JSON logging, set the environment variable `CONNECTORS_LOG_APPENDER=stackdriver` on the Connector Runtime.
