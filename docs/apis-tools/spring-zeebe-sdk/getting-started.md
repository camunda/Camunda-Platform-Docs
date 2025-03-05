---
id: getting-started
title: Getting started
description: "Leverage Camunda APIs (gRPC and REST) in your Spring Boot project."
---

This project allows you to leverage Camunda APIs ([gRPC](/apis-tools/zeebe-api/grpc.md) and [REST](/apis-tools/camunda-api-rest/camunda-api-rest-overview.md)) in your Spring Boot project. Later on, we’ll expand the Spring Camunda SDK to deliver a Camunda Spring SDK that provides a unified experience for interacting with all Camunda APIs in Java Spring.

## Version compatibility

| Camunda Spring SDK version | JDK  | Camunda version | Bundled Spring Boot version |
| -------------------------- | ---- | --------------- | --------------------------- |
| 8.7.x                      | ≥ 17 | 8.7.x           | 3.4.x                       |
| 8.8.x                      | ≥ 17 | 8.8.x           | 3.4.x                       |

## Add the Spring Camunda SDK to your project

Add the following Maven dependency to your Spring Boot Starter project, replacing `x` with the latest patch level available:

```xml
<dependency>
    <groupId>io.camunda</groupId>
    <artifactId>spring-boot-starter-camunda-sdk</artifactId>
    <version>8.8.x</version>
</dependency>
```

## Enable the Java Compiler `-parameters`-flag

If you don't want to specify annotation values just as the process variable name on the [variable](#using-variable) annotation, the Java compiler flag `-parameters` is required.

If you are using Maven you can enable this with the Compiler plugin:

```xml
<build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
          <compilerArgs>
            <arg>-parameters</arg>
          </compilerArgs>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

If you are using Gradle:

```xml
tasks.withType(JavaCompile) {
    options.compilerArgs << '-parameters'
}
```

If you are using IntelliJ:

```agsl
Settings > Build, Execution, Deployment > Compiler > Java Compiler
```

## Configuring the Camunda 8 connection

The default properties for setting up all connection details are hidden in modes. Each connection mode has particular defaults to ease configuration.

The mode is set on `camunda.client.mode` and can be `self-managed` or `saas`. Further usage of each mode is explained below.

:::note
Zeebe will now also be configured with a URL (`http://localhost:26500` instead of `localhost:26500` + plaintext connection flag).
:::

### Saas

Connections to Camunda SaaS can be configured by creating the following entries in `src/main/resources/application.yaml`:

```yaml
camunda:
  client:
    mode: saas
    auth:
      client-id: <your client id>
      client-secret: <your client secret>
    cloud:
      cluster-id: <your cluster id>
      region: <your cluster region id>
```

### Self-Managed

If you set up a Self-Managed cluster with Identity, Keycloak is used as the default Identity provider. As long as the port config (from Docker Compose or port-forward with Helm charts) is the default, you must configure the accompanying Spring profile and client credentials:

```yaml
camunda:
  client:
    mode: self-managed
    auth:
      client-id: <your client id>
      client-secret: <your client secret>
      token-url: http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token
```

If you have different endpoints for your applications or want to disable a client, configure the following:

```yaml
camunda:
  client:
    mode: self-managed
    tenant-ids:
      - <default>
    auth:
      client-id: <your client id>
      client-secret: <your client secret>
      token-url: http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token
      audience: zeebe-api
      scope: # optional
    grpc-address: http://localhost:26500
    rest-address: http://localhost:8080
    prefer-rest-over-grpc: false
```

## Obtain the Camunda client

You can inject the Camunda client and work with it to create new workflow instances, for example:

```java
@Autowired
private CamundaClient client;
```

## Deploy process models

Use the `@Deployment` annotation:

```java
@SpringBootApplication
@Deployment(resources = "classpath:demoProcess.bpmn")
public class MySpringBootApplication {
```

This annotation internally uses [the Spring resource loader](#resources-resourceloader) mechanism. This is powerful, and can also deploy multiple files at once, for example:

```java
@Deployment(resources = {"classpath:demoProcess.bpmn" , "classpath:demoProcess2.bpmn"})
```

Or, define wildcard patterns:

```java
@Deployment(resources = "classpath*:/bpmn/**/*.bpmn")
```

## Implement the job worker

```java
@JobWorker(type = "foo")
public void handleJobFoo(final ActivatedJob job) {
  // do whatever you need to do
}
```

See [the configuration documentation](/apis-tools/spring-zeebe-sdk/configuration.md) for a more in-depth discussion on parameters and configuration options for job workers.

## Writing test cases

To learn more about writing test cases using Zeebe Process Test, see [Spring Zeebe SDK integration](../java-client/zeebe-process-test.md#zeebe-spring-sdk-integration).
