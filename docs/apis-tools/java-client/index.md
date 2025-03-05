---
id: index
title: "Java client"
sidebar_label: "Quick reference"
description: "Provide a job worker that handles polling for available jobs, use SLF4J for logging useful notes, and more."
---

:::info
Starting with 8.8, the Zeebe Java client will become the new Camunda Java client. This transition brings a new Java client structure designed to enhance the user experience and introduce new features while maintaining compatibility with existing codebases.
For more information, visit [announcements](../../reference/announcements.md#zeebe-java-client).
:::

## Dependencies

To use the Java client library, declare the following Maven dependency in your project:

```xml
<dependency>
  <groupId>io.camunda</groupId>
  <artifactId>camunda-client-java</artifactId>
  <version>${camunda.version}</version>
</dependency>
```

If you are using Gradle, declare the following:

```groovy
implementation 'io.camunda:camunda-client-java:${camunda.version}'
```

Use the latest released version from [Maven Central](https://search.maven.org/artifact/io.camunda/camunda-client-java).

## Bootstrapping

In Java code, instantiate the client as follows:

```java
  private static final String zeebeGrpc = "[Gateway gRPC Address e.g. grpcs://f887f1a6-7c2b-48ce-809a-e11e5a6ba31a.dsm-1.zeebe.camunda.io:443]";
  private static final String zeebeRest = "[Gateway REST Address e.g. https://dsm-1.zeebe.camunda.io/f887f1a6-7c2b-48ce-809a-e11e5a6ba31a]";

  public static void main(String[] args) {
    CredentialsProvider credentialsProvider = new NoopCredentialsProvider();

    try (CamundaClient client = CamundaClient.newClientBuilder()
            .grpcAddress(URI.create(zeebeGrpc))
            .restAddress(URI.create(zeebeRest))
            .credentialsProvider(credentialsProvider)
            .build()) {
      client.newTopologyRequest().send().join();
    }
  }
```

Let's go over this code snippet line by line:

1. Declare a few variables to define the connection properties. These values can be taken from the connection information on the **Client Credentials** page. Note that `clientSecret` is only visible when you create the client credentials.
2. Create the credentials provider. This is needed to authenticate your client. For different authentication methods, refer to the [authentication](authentication.md) section.
3. Create the client by passing in the address of the cluster we want to connect to and the credentials provider from the step above. Note that a client should be closed after usage, which is easily achieved by the try-with-resources statement.
4. Send a test request to verify the connection was established.

Refer to [io.camunda.client.CamundaClientBuilder](https://javadoc.io/doc/io.camunda/camunda-client-java/latest/io/camunda/client/CamundaClientBuilder.html) for a description of all available configuration properties.

Another (more compact) option is to pass in the connection settings via environment variables:

```bash
export CAMUNDA_GRPC_ADDRESS='[Gateway gRPC Address]'
export CAMUNDA_REST_ADDRESS='[Gateway REST Address]'
```

When you create client credentials in Camunda 8, you have the option to download a file with the lines above filled out for you.

Given these environment variables, you can instantiate the client as follows:

```java
CamundaClient client =
    CamundaClient.newClientBuilder()
        .grpcAddress(System.getenv("CAMUNDA_GRPC_ADDRESS"))
        .restAddress(System.getenv("CAMUNDA_REST_ADDRESS"))
        .build();
```

:::note
Ensure you provide `grpcAddress` and `restAddress` in absolute URI format: `scheme://host(:port)`.
:::

## Javadoc

The official Java client library API documentation can be found [here](https://javadoc.io/doc/io.camunda/camunda-client-java). These are standard Javadocs, so your favorite JVM IDE will be able to install them locally as well.

## Next steps

- [Getting Started Guide](https://github.com/camunda/camunda-platform-get-started): A comprehensive tutorial that covers Camunda Modeler, Operate, and the Java client.
- [Job worker](job-worker.md): An introduction to the Java client's job worker.
- [Logging](logging.md): An introduction to configuring logging for a Camunda client.
- [Writing tests](zeebe-process-test.md): An introduction to unit testing processes.
- [Examples](apis-tools/java-client-examples/index.md): A collection of specific examples for different use cases.
