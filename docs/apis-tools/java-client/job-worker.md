---
id: job-worker
title: "Job worker"
description: "Let's take a deeper look at job workers to handle jobs."
keywords: ["backpressure", "back-pressure", "back pressure"]
---

## Related resources

- [Job worker basics](/components/concepts/job-workers.md)

## The Java client's job worker

The Java client provides a job worker that handles polling for available jobs. This allows you to focus on writing code to handle the activated jobs.

:::caution REST API limitation
The 8.6.0 Java client cannot maintain the long-lived polling connections required for job polling via the REST API. For example, this applies when:

- Performing long-polling job activation when activating jobs larger than the maximum message size.
- Receiving additional job activation requests from the same Java client while the long-polling connection is still open.
- Receiving additional job activation requests from a Java client running on the same JVM while the long-polling connection is still open.
- Receiving additional job activation requests from a Java client running on a different JVM while the long-polling connection is still open.

If you encounter this issue, consider switching to the Zeebe gRPC protocol for job activation, or use job
activation via the REST API with long polling disabled.
:::

On `open`, the job worker waits `pollInterval` milliseconds and then polls for `maxJobsActive` jobs. It then continues with the following schedule:

1. If a poll did not activate any jobs, it waits for `pollInterval` milliseconds and then polls for more jobs.
2. If a poll activated jobs, the worker submits each job to the job handler.
3. Every time a job is handled, the worker checks whether the number of unhandled jobs have dropped below 30% (rounded up) of `maxJobsActive`. The first time that happens, it will poll for more jobs.
4. If a poll fails with an error response, a backoff strategy is applied. This strategy waits for the delay provided by the `backoffSupplier` and polls for more jobs.

For example, imagine you have 10 process instances and a single job worker configured with `maxJobsActive = 3`. The job worker will first pull three jobs and begin executing them. The threshold to poll for new jobs is 1 (30% of 3 rounded up). After two jobs have completed, the threshold is reached and the job worker will poll for up to 2 additional jobs. This process repeats until the jobs from all 10 process instances are completed.

If streaming is enabled (via `streamEnabled`), it will also open a long-living stream over which jobs will be pushed without having to be polled. In such cases, a worker will only buffer up to `maxJobsActive` jobs at the same time. You can then estimate its memory usage as `maxJobsActive` times the max message size.

## Example usage

- [Open a job worker](../java-client-examples/job-worker-open.md)

## Backoff configuration

When a poll fails with an error response, the job worker applies a backoff strategy. It waits for some time, after which it polls again for more jobs. This gives a Zeebe cluster some time to recover from a failure. In some cases, you may want to configure this backoff strategy to better fit your situation.

The retry delay (i.e. the time the job worker waits after an error before the next poll for new jobs) is provided by the [`BackoffSupplier`](https://github.com/camunda/camunda/blob/main/clients/java/src/main/java/io/camunda/client/api/worker/BackoffSupplier.java). You can replace it using the `.backoffSupplier()` method on the [`JobWorkerBuilder`](https://github.com/camunda/camunda/blob/main/clients/java/src/main/java/io/camunda/client/api/worker/JobWorkerBuilderStep1.java).

By default, the job worker uses an exponential backoff implementation, which you can configure using `BackoffSupplier.newBackoffBuilder()`.

The backoff strategy is especially useful for dealing with the `GRPC_STATUS_RESOURCE_EXHAUSTED` error response (refer to [gRPC Technical Error Handling](/apis-tools/zeebe-api/technical-error-handling.md)).

This error code indicates the Zeebe cluster is currently under too large of a load and has decided to reject this request.

By backing off, the job worker helps Zeebe by reducing the load.

:::note
Zeebe's [backpressure mechanism](../../../self-managed/zeebe-deployment/operations/backpressure) can also be configured.
:::

## Metrics

The job worker exposes metrics through a custom interface: [JobWorkerMetrics](https://github.com/camunda/camunda/blob/main/clients/java/src/main/java/io/camunda/client/api/worker/JobWorkerMetrics.java). These represent specific callbacks used by the job worker to keep track of various internals, e.g. count of jobs activated, count of jobs handled, etc.

:::note
By default, job workers will not track any metrics, and it's up to the caller to specify an implementation if they wish to make use of this feature.
:::

### Available metrics

The API currently supports two metrics: the count of jobs activated, and the count of jobs handled.

- **The count of jobs activated** is incremented every time a worker activates new jobs. This is done by calling `JobWorkerMetrics#jobActivated(int)`, with the first argument being the count of jobs newly activated. The method is called before the job is passed to the job handler.
- **The count of jobs handled** is incremented every time a worker's `JobHandler` (passed to the builder via `JobWorkerBuilderStep2#handler(JobHandler)`) returns (regardless of whether it was successful). This is done by calling `JobWorkerMetrics#jobHandled(int)`, with the first argument being the count of jobs newly handled.

For both counters, the expectation is that implementations will simply increment an underlying counter, and track the rate or increase of this counter to derive the speed at which jobs are activated/handled by a given worker.

Additionally, by subtracting both counters, you can derive the count of queued or buffered jobs - jobs which have yet to be handled by the worker. This can help you tune your workers, e.g. scaling in or out, tuning the amount of jobs activated, etc.

### Usage

To use job worker metrics, create a new instance of a `JobWorkerMetrics` implementation, and pass it along to the builder:

```java
public final JobWorker openWorker(final CamundaClient client, final JobHandler handler) {
  final JobWorkerMetrics metrics = new MyCustomJobWorkerMetrics();
  return client.newJobWorker()
    .jobType("foo")
    .handler(handler)
    .metrics(metrics)
    .open();
}
```

#### Micrometer implementation

The Java client comes with an optional, built-in [Micrometer](https://micrometer.io/) implementation of `JobWorkerMetrics`.

:::note
[Micrometer](https://micrometer.io/) is a popular metrics facade in the Java ecosystem - what SLF4J is to logging. It can be configured to export metrics to many other systems, such as OpenTelemetry, Prometheus, StatsD, Datadog, etc.
:::

If your project does not yet use Micrometer, you need to add it to your dependencies, and wire it up to your metrics backend, [as described in the Micrometer docs](https://micrometer.io/docs).

Once Micrometer is set up in your project, you can start using the implementation. For example:

```java
public final JobWorker openWorker(final CamundaClient client, final JobHandler handler) {
  final MeterRegistry meterRegistry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
  final JobWorkerMetrics metrics = JobWorkerMetrics
    .micrometer()
    .withMeterRegistry(meterRegistry)
    .withTags(Tags.of("zeebe.client.worker.jobType", "foo", "zeebe.client.worker.name", "bee"))
    .build();
  return client.newJobWorker()
    .jobType("foo")
    .handler(handler)
    .metrics(metrics)
    .name("bee")
    .open();
}
```

:::note
There are currently no built-in tags, primarily because these are likely to be high cardinality, which can become an issue with some metric registries. If you want per-worker tags, create a different `JobWorkerMetrics` instance per worker.
:::

This implementation creates two metrics:

- `zeebe.client.worker.job.activated`: A counter tracking the count of jobs activated.
- `zeebe.client.worker.job.handled`: A counter tracking the count of jobs handled.

### Workarounds for additional metrics

The decision to track a small set of metrics directly in the client is a conscious one. The idea is we should only be tracking what is not possible for users to track themselves. If you believe a specific metric should be tracked by us, do open a feature request for it. In the meantime, here is a list of workarounds to help you track additional job worker-related metrics that you can already use:

#### Job polling count

You can use a gRPC [ClientInterceptor](https://grpc.github.io/grpc-java/javadoc/io/grpc/ClientInterceptor.html) or an Apache HttpClient [AsyncExecChainHandler](https://hc.apache.org/httpcomponents-client-5.3.x/current/httpclient5/apidocs/org/apache/hc/client5/http/async/AsyncExecChainHandler.html) to track any client calls, including the `ActivateJobsCommand` call that is sent every time a worker polls for more jobs.

Here's an example using Micrometer APIs that integrate a gRPC [ClientInterceptor](https://javadoc.io/doc/io.micrometer/micrometer-core/1.7.2/io/micrometer/core/instrument/binder/grpc/MetricCollectingServerInterceptor.html) and Apache HttpClient [AsyncExecChainHandler](https://javadoc.io/doc/io.micrometer/micrometer-core/1.12.0/io/micrometer/core/instrument/binder/httpcomponents/hc5/ObservationExecChainHandler.html):

```java
import java.nio.channels.AsynchronousCloseException;

public CamundaClientBuilder configureClientMetrics(final CamundaClientBuilder builder, final MeterRegistry meterRegistry, final ObservationRegistry observationRegistry) {
    final ClientInterceptor monitoringInterceptor = new MetricCollectingClientInterceptor(meterRegistry);
    final AsyncExecChainHandler monitoringHandler = new ObservationExecChainHandler(observationRegistry);
    return builder.withInterceptors(monitoringInterceptor).withChainHandlers(monitoringHandler);
}
```

#### Executor metrics

If you wish to tune your job worker executor, you can pass a custom, instrumented executor to the client builder. For example, if we use Micrometer:

```java
public CamundaClientBuilder configureClientMetrics(
    final CamundaClientBuilder builder,
    final ScheduledExecutorService executor,
    final MeterRegistry meterRegistry) {
  final ScheduledExecutorService instrumentedExecutor = ExecutorServiceMetrics.monitor(meterRegistry, executor, "job-worker-executor");
  return builder.jobWorkerExecutor(instrumentedExecutor);
}
```

## Job streaming

Job workers are designed to regularly poll and activate jobs. It's also possible to use them in a streaming fashion, such that jobs are automatically activated and pushed downstream to workers without requiring an extra round of polling. This greatly cuts down on overall activation latency by completely removing the poll request.

### Usage

Enabling job streaming consists of toggling a single flag in the job worker builder:

```java
public JobWorkerBuilderStep3 enableStreaming(final JobWorkerBuilderStep3 builder) {
  return builder.streamEnabled(true);
}
```

This configures the job worker to open a long-living stream between itself and a gateway, through which activated jobs will be pushed. **If the stream is closed for any reason - e.g. the gateway crashed, there is a temporary network issue, etc. - it is automatically recreated.**

:::note
It's also possible to set an overall timeout - so called `streamTimeout` - which ensures the underlying long-living stream is refreshed once the timeout is reached. This is useful to trigger load balancing of your workers overtime, instead of having workers pinned to the same gateway.
:::

#### Backfilling

Even with streaming enabled, job workers still occasionally poll the cluster for jobs. Due to implementation constraints, when a job is made activate-able, it is pushed out only if there exists a stream for it; if not, it remains untouched. Even if a stream is created afterwards, it remains untouched. However, if a stream exists, then streaming is always prioritized over polling.

This ensures polling will not activate any new jobs, and the worker will back off and poll less often as long as it receives empty responses overtime.

#### Backpressure

To avoid your workers being overloaded with too many jobs, e.g. running out of memory, the Java job worker relies on the [built-in gRPC flow control mechanism](https://grpc.io/docs/guides/flow-control/). If streaming is enabled, this means the worker will never work on more jobs than the configured `maxJobsActive` parameter. For example, if `maxJobsActive = 32`, then your worker will only work on at most 32 jobs concurrently. If this is already the case, and a 33rd job comes in, the gRPC thread will block, thus signaling the gateway to stop sending more jobs.

**If streaming is enabled, back pressure applies to both pushing and polling**. You can then use `maxJobsActive` as a way to soft-bound the memory usage of your worker. For example, if your max message size is 4MB, and `maxJobsActive = 32`, then a single worker could use up to 128MB of memory in the worst case.

:::note
If the worker blocks longer than the job's deadline, the job will **not** be passed to the worker, but will be dropped. As it will time out on the broker side, it will be pushed again.
:::

#### Proxying

If you're using a reverse proxy or a load balancer between your worker and your gateway, you may need to configure additional parameters to ensure the job stream is not closed unexpectedly with an error. If you observe regular 504 timeouts, read our guide on [job streaming](../../../self-managed/zeebe-deployment/zeebe-gateway/job-streaming).

By default, the Java job workers have a stream timeout of one hour. You can overwrite this by calling the `streamTimeout` of the job worker builder:

```java
final JobWorkerBuilderStep3 builder = ...;
builder.streamTimeout(Duration.ofMinutes(30));
```

## Multi-tenancy

You can configure a job worker to pick up jobs belonging to one or more tenants. When using the builder, you can configure
the tenant(s) it works for.

Alternatively, you can configure default tenant(s) on the client. If you configure a default, all job workers you open will work on jobs for the configured default tenants.

:::note
The client must be authorized for **all** the provided tenants. If it is not, the job worker will not work on any jobs.
:::

### Job worker builder

Opening a job worker for a single tenant:

```java
client.newWorker()
    .jobType("myJobType")
    .handler(new MyJobTypeHandler())
    .tenantId("myTenant")
    .open();
```

Opening a job worker for multiple tenants:

```java
client.newWorker()
    .jobType("myJobType")
    .handler(new MyJobTypeHandler())
    .tenantIds("myTenant", "myOtherTenant")
    .open();
```

### Default tenant

You can configure the default tenant(s) using environment variables or system properties. It's configured using
`CAMUNDA_DEFAULT_JOB_WORKER_TENANT_IDS` or `camunda.client.worker.tenantIds` respectively.
