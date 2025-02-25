---
id: configuration
title: Configuration
---

This page uses YAML examples to show configuration properties. Alternate methods to [externalize or override your configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) are provided by Spring Boot, and can be applied without rebuilding your application (properties files, Java System properties, or environment variables).

:::note
Configuration properties can be defined as environment variables using [Spring Boot conventions](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables). To define an environment variable, convert the configuration property to uppercase, remove any dashes `-`, and replace any delimiters `.` with underscore `_`.

For example, the property `camunda.client.zeebe.defaults.max-jobs-active` is represented by the environment variable `CAMUNDA_CLIENT_ZEEBE_DEFAULTS_MAXJOBSACTIVE`.
:::

## Job worker configuration options

### Job type

You can configure the job type via the `JobWorker` annotation:

```java
@JobWorker(type = "foo")
public void handleJobFoo() {
  // handles jobs of type 'foo'
}
```

If you don't specify the `type` attribute, the **method name** is used by default if you enabled the [`-parameters` compiler flag](/apis-tools/spring-zeebe-sdk/getting-started.md#enable-the-java-compiler--parameters-flag) in the [getting started section](/apis-tools/spring-zeebe-sdk/getting-started.md):

```java
@JobWorker
public void foo() {
    // handles jobs of type 'foo'
}
```

As a third possibility, you can set a default job type:

```yaml
camunda:
  client:
    worker:
      defaults:
        type: foo
```

This is used for all workers that do **not** set a task type via the annotation.

### Define variables to fetch

You can specify that you only want to fetch some variables (instead of all) when executing a job, which can decrease load and improve performance:

```java
@JobWorker(type = "foo", fetchVariables={"variable1", "variable2"})
public void handleJobFoo(final JobClient client, final ActivatedJob job) {
  String variable1 = (String)job.getVariablesAsMap().get("variable1");
  System.out.println(variable1);
  // ...
}
```

### Using `@Variable`

By using the `@Variable` annotation, there is a shortcut to make variable retrieval simpler and only fetch certain variables, making them available as parameters:

```java
@JobWorker(type = "foo")
public void handleJobFoo(final JobClient client, final ActivatedJob job, @Variable(name = "variable1") String variable1) {
  System.out.println(variable1);
  // ...
}
```

If you don't specify the `name` attribute on the annotation, the **method parameter name** is used as the variable name if you enabled the [`-parameters` compiler flag](/apis-tools/spring-zeebe-sdk/getting-started.md#enable-the-java-compiler--parameters-flag) in the [getting started section](/apis-tools/spring-zeebe-sdk/getting-started.md):

```java
@JobWorker(type = "foo")
public void handleJobFoo(final JobClient client, final ActivatedJob job, @Variable String variable1) {
  System.out.println(variable1);
  // ...
}
```

With `@Variable` or `fetchVariables` you limit which variables are loaded from the workflow engine. You can also override this and force that all variables are loaded anyway:

```java
@JobWorker(type = "foo", fetchAllVariables = true)
public void handleJobFoo(final JobClient client, final ActivatedJob job, @Variable String variable1) {
}
```

### Using `@VariablesAsType`

You can also use your own class into which the process variables are mapped to (comparable to `getVariablesAsType()` in the [Java client API](/apis-tools/java-client/index.md)). Therefore, use the `@VariablesAsType` annotation. In the example below, `MyProcessVariables` refers to your own class:

```java
@JobWorker(type = "foo")
public ProcessVariables handleFoo(@VariablesAsType MyProcessVariables variables){
  // do whatever you need to do
  variables.getMyAttributeX();
  variables.setMyAttributeY(42);

  // return variables object if something has changed, so the changes are submitted to Zeebe
  return variables;
}
```

### Fetch variables via Job

You can access variables of a process via the ActivatedJob object, which is passed into the method if it is a parameter:

```java
@JobWorker(type = "foo")
public void handleJobFoo(final ActivatedJob job) {
  String variable1 = (String)job.getVariablesAsMap().get("variable1");
  System.out.println(variable1);
  // ...
}
```

### Auto-completing jobs

By default, the `autoComplete` attribute is set to `true` for any job worker.

In this case, the Spring integration will handle job completion for you:

```java
@JobWorker(type = "foo")
public void handleJobFoo(final ActivatedJob job) {
  // do whatever you need to do
  // no need to call client.newCompleteCommand()...
}
```

This is the same as:

```java
@JobWorker(type = "foo", autoComplete = true)
public void handleJobFoo(final ActivatedJob job) {
  // ...
}
```

:::note
The code within the handler method needs to be synchronously executed, as the completion will be triggered right after the method has finished.
:::

When using `autoComplete` you can:

- Return a `Map`, `String`, `InputStream`, or `Object`, which will then be added to the process variables.
- Throw a `CamundaBpmnError`, which results in a BPMN error being sent to Zeebe.
- Throw any other `Exception` that leads in a failure handed over to Zeebe.

```java
@JobWorker(type = "foo")
public Map<String, Object> handleJobFoo(final ActivatedJob job) {
  // some work
  if (successful) {
    // some data is returned to be stored as process variable
    return variablesMap;
  } else {
   // problem shall be indicated to the process:
   throw new CamundaBpmnError("DOESNT_WORK", "This does not work because...");
  }
}
```

### Programmatically completing jobs

Your job worker code can also complete the job itself. This gives you more control over when exactly you want to complete the job (for example, allowing the completion to be moved to reactive callbacks):

```java
@JobWorker(type = "foo", autoComplete = false)
public void handleJobFoo(final JobClient client, final ActivatedJob job) {
  // do whatever you need to do
  client.newCompleteCommand(job.getKey())
     .send()
     .exceptionally( throwable -> { throw new RuntimeException("Could not complete job " + job, throwable); });
}
```

You can also control auto-completion in your configuration.

**Globally:**

```yaml
camunda:
  client:
    worker:
      defaults:
        auto-complete: false
```

**Per worker:**

```yaml
camunda:
  client:
    worker:
      override:
        foo:
          auto-complete: false
```

Ideally, you **don't** use blocking behavior like `send().join()`, as this is a blocking call to wait for the issued command to be executed on the workflow engine. While this is very straightforward to use and produces easy-to-read code, blocking code is limited in terms of scalability.

This is why the worker above showed a different pattern (using `exceptionally`). Often, you might also want to use the `whenComplete` callback:

```java
send().whenComplete((result, exception) -> {})
```

This registers a callback to be executed if the command on the workflow engine was executed or resulted in an exception. This allows for parallelism. This is discussed in more detail in [this blog post about writing good workers for Camunda 8](https://blog.bernd-ruecker.com/writing-good-workers-for-camunda-cloud-61d322cad862).

:::note
When completing jobs programmatically, you must specify `autoComplete = false`. Otherwise, there is a race condition between your programmatic job completion and the Spring integration job completion, and this can lead to unpredictable results.
:::

### `@CustomHeaders`

You can use the `@CustomHeaders` annotation for a parameter to retrieve [custom headers](/components/concepts/job-workers.md) for a job:

```java
@JobWorker(type = "foo")
public void handleFoo(@CustomHeaders Map<String, String> headers){
  // do whatever you need to do
}
```

You can combine annotations. For example, `@VariablesAsType` and `@CustomHeaders`.

```java
@JobWorker
public ProcessVariables foo(@VariablesAsType ProcessVariables variables, @CustomHeaders Map<String, String> headers){
  // do whatever you need to do
  return variables;
}
```

### Throwing `CamundaBpmnError`s

Whenever your code hits a problem that should lead to a [BPMN error](/components/modeler/bpmn/error-events/error-events.md) being raised, you can throw a `CamundaBpmnError` to provide the error code used in BPMN:

```java
@JobWorker(type = "foo")
public void handleJobFoo() {
  // some work
  if (!successful) {
   // problem shall be indicated to the process:
   throw new CamundaBpmnError("DOESNT_WORK", "This does not work because...");
  }
}
```

## Additional configuration options

For a full set of configuration options, see [CamundaClientProperties.java](https://github.com/camunda/camunda/blob/main/clients/spring-boot-starter-camunda-sdk/src/main/java/io/camunda/spring/client/properties/CamundaClientProperties.java).

### Auth

Authenticate with the cluster using the following alternative methods:

#### Username & Password

You can authenticate with the cluster using username and password authentication.

```yaml
camunda:
  client:
    mode: self-managed
    auth:
      username: <your username>
      password: <your password>
```

#### Keystore & Truststore

You can authenticate with the cluster using Java's Keystore and Truststore.

```yaml
camunda:
  client:
    mode: self-managed
    auth:
      keystore-path: <your keystore path>
      keystore-password: <your keystore password>
      keystore-key-password: <your keystore key password>
      truststore-path: <your truststore path>
      truststore-password: <your truststore password>
```

### Zeebe

You can use the following Zeebe-specific additional configuration options:

#### Execution threads

The number of threads for invocation of job workers. Setting this value to 0 effectively disables subscriptions and workers (default 1):

```yaml
camunda:
  client:
    execution-threads: 2
```

#### Message time to live

The time-to-live which is used when none is provided for a message (default 1H):

```yaml
camunda:
  client:
    message-time-to-live: PT2H
```

#### Max message size

A custom `maxMessageSize` allows the client to receive larger or smaller responses from Zeebe. Technically, it specifies the `maxInboundMessageSize` of the gRPC channel (default 4MB):

```yaml
camunda:
  client:
    max-message-size: 4194304
```

#### Max metadata size

A custom `maxMetadataSize` allows the client to receive larger or smaller response headers from Camunda:

```yaml
camunda:
  client:
    max-metadata-size: 4194304
```

#### Request timeout

The request timeout used if not overridden by the command (default is 10s):

```yaml
camunda:
  client:
    request-timeout: PT20S
```

#### CA certificate

Path to a root CA certificate to be used instead of the certificate in the default store:

```yaml
camunda:
  client:
    ca-certificate-path: path/to/certificate
```

#### Keep alive

Time interval between keep alive messages sent to the gateway (default is 45s):

```yaml
camunda:
  client:
    keep-alive: PT60S
```

#### Override authority

The alternative authority to use, commonly in the form `host` or `host:port`:

```yaml
camunda:
  client:
    override-authority: host:port
```

#### REST over gRPC

If true, the client will use REST instead of gRPC whenever possible:

```yaml
camunda:
  client:
    prefer-rest-over-grpc: true
```

#### gRPC address

Define client gRPC address:

```yaml
camunda:
  client:
    grpc-address: http://localhost:26500
```

#### REST address

Define client REST address:

```yaml
camunda:
  client:
    rest-address: http://localhost:8080
```

#### Defaults and Overrides

You can define defaults and overrides for all supported configuration options for a worker.

##### Default Task type

If you build a worker that only serves one thing, it might also be handy to define the worker job type globally and not in the annotation:

```yaml
camunda:
  client:
    worker:
      defaults:
        type: foo
```

##### Configure jobs in flight and thread pool

Number of jobs that are polled from the broker to be worked on in this client and thread pool size to handle the jobs:

```yaml
camunda:
  client:
    worker:
      defaults:
        max-jobs-active: 32
    execution-threads: 1
```

:::note
We generally do not advise using a thread pool for workers, but rather implement asynchronous code, see [writing good workers](/components/best-practices/development/writing-good-workers.md) for additional details.
:::

##### Disable worker

You can disable workers via the `enabled` parameter of the `@JobWorker` annotation:

```java
class SomeClass {
  @JobWorker(type = "foo", enabled = false)
  public void handleJobFoo() {
    // worker's code - now disabled
  }
}
```

You can also override this setting via your `application.yaml` file:

```yaml
camunda:
  client:
    override:
      foo:
        enabled: false
```

This is especially useful if you have a bigger code base including many workers, but want to start only some of them. Typical use cases are:

- Testing: You only want one specific worker to run at a time.
- Load balancing: You want to control which workers run on which instance of cluster nodes.
- Migration: There are two applications, and you want to migrate a worker from one to another. With this switch, you can disable workers via configuration in the old application once they are available within the new.

To disable all workers, but still have the Camunda client available, you can use:

```yaml
camunda:
  client:
    worker:
      defaults:
        enabled: false
```

##### Overriding `JobWorker` values via configuration file

You can override the `JobWorker` annotation's values, as you can see in the example above where the `enabled` property is overridden:

```yaml
camunda:
  client:
    override:
      foo:
        enabled: false
```

In this case, `foo` is the type of the worker that we want to customize.

You can override all supported configuration options for a worker, for example:

```yaml
camunda:
  client:
    override:
      foo:
        timeout: PT10S
```

You could also provide a custom class that can customize the `JobWorker` configuration values by implementing the `io.camunda.spring.client.annotation.customizer.JobWorkerValueCustomizer` interface.

##### Enable job streaming

Read more about this feature in the [job streaming documentation](/apis-tools/java-client/job-worker.md#job-streaming).

Job streaming is disabled by default for job workers. To enable job streaming on the Camunda client, configure it as follows:

```yaml
camunda:
  client:
    worker:
      defaults:
        stream-enabled: true
```

This also works for every worker individually:

```yaml
camunda:
  client:
    override:
      foo:
        stream-enabled: true
```

##### Control tenant usage

When using multi-tenancy, the Camunda client will connect to the `<default>` tenant. To control this, you can configure:

```yaml
camunda:
  client:
    tenant-ids:
      - <default>
      - foo
```

Additionally, you can set tenant ids on job worker level by using the annotation:

```java
@JobWorker(tenantIds="myOtherTenant")
```

You can override this property as well:

```yaml
camunda:
  client:
    worker:
      override:
        foo:
          tenants-ids:
            - <default>
            - foo
```

### Custom identity provider security context

If you require configuring SSL context exclusively for your identity provider:

```yaml
camunda:
  client:
    auth:
      keystore-path: /path/to/keystore.p12
      keystore-password: password
      keystore-key-password: password
      truststore-path: /path/to/truststore.jks
      truststore-password: password
```

- **keystore-path**: Path to client's KeyStore; can be both in JKS or PKCS12 formats
- **keystore-password**: KeyStore password
- **keystore-key-password**: Key material password
- **truststore-path**: Path to client's TrustStore
- **truststore-password**: TrustStore password

When the properties are not specified, the default SSL context is applied. For example, if you configure an application with
`javax.net.ssl.*` or `spring.ssl.*`, the latter is applied. If both `camunda.client.auth.*` and either `javax.net.ssl.*`
or `spring.ssl.*` properties are defined, the `camunda.client.auth.*` takes precedence.

## Observing metrics

The Spring Camunda SDK provides some out-of-the-box metrics that can be leveraged via [Spring Actuator](https://docs.spring.io/spring-boot/docs/current/actuator-api/htmlsingle/). Whenever actuator is on the classpath, you can access the following metrics:

- `camunda.job.invocations`: Number of invocations of job workers (tagging the job type)

For all of those metrics, the following actions are recorded:

- `activated`: The job was activated and started to process an item.
- `completed`: The processing was completed successfully.
- `failed`: The processing failed with some exception.
- `bpmn-error`: The processing completed by throwing a BPMN error (which means there was no technical problem).

In a default setup, you can enable metrics to be served via http:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: metrics
```

Access them via [http://localhost:8080/actuator/metrics/](http://localhost:8080/actuator/metrics/).

## Using identity provider X.509 authorizers

Several identity providers, such as Keycloak, support client X.509 authorizers as an alternative to client credentials flow.

As a prerequisite, ensure you have proper KeyStore and TrustStore configured, so that:

- Both the Spring Camunda application and identity provider share the same CA trust certificates.
- Both the Spring Camunda and identity provider own certificates signed by trusted CA.
- Your Spring Camunda application own certificate has proper `Distinguished Name` (DN), e.g.
  `CN=My Camunda Client, OU=Camunda Users, O=Best Company, C=DE`.
- Your application DN registered in the identity provider client authorization details.

Once prerequisites are satisfied, your Spring Camunda application must be configured either via global SSL context, or
with [identity provider exclusive context](#custom-identity-provider-security-context).

Refer to your identity provider documentation on how to configure X.509 authentication. For example, [Keycloak](https://www.keycloak.org/server/mutual-tls).
