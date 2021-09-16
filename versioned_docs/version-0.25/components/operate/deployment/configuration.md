---
id: configuration
title: Configuration
---
## Introduction

Operate is a Spring Boot application. That means all ways to [configure](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config)
a Spring Boot application can be applied. By default the configuration for Operate is stored in a YAML file `application.yml`. All Operate related settings are prefixed
with `camunda.operate`. The following parts are configurable:

 * [Elasticsearch Connection](#elasticsearch)
 * [Zeebe Broker connection](#zeebe-broker-connection)
 * [Zeebe Elasticsearch Exporter](#zeebe-elasticsearch-exporter)
 * [Operation Executor](#operation-executor)
 * [Authentication](authentication.md)
 * [Scaling Operate](importer-and-archiver.md)
 * [Monitoring possibilities](#monitoring-operate)
 * [Logging configuration](#logging)
 * [Probes](#probes)

## Configurations

### Elasticsearch

Operate stores and reads data in/from Elasticsearch.

### Settings to connect

Operate supports [basic authentication](https://www.elastic.co/guide/en/elasticsearch/reference/6.8/setting-up-authentication.html) for elasticsearch.
Set the appropriate username/password combination in the configuration to use it.

Either set `host` and `port` (deprecated) or `url` (recommended)

Name | Description | Default value
-----|-------------|--------------
camunda.operate.elasticsearch.clusterName | Clustername of Elasticsearch | elasticsearch
camunda.operate.elasticsearch.host | Hostname where Elasticsearch is running | localhost
camunda.operate.elasticsearch.port | Port of Elasticsearch REST API | 9200
camunda.operate.elasticsearch.url | URL of Elasticsearch REST API | http://localhost:9200
camunda.operate.elasticsearch.username | Username to access Elasticsearch REST API | -
camunda.operate.elasticsearch.password | Password to access Elasticsearch REST API | -

### Settings for shards and replicas

Operate creates the template with index settings named `operate-<version>_template` that Elasticsearch will use for all Operate indices.
These settings can be changed.

Following configuration parameters will define the settings:

Name|Description|Default value
----|-----------|--------------
camunda.operate.elasticsearch.numberOfShards| How many shards Elasticsearch uses for all Operate indices| 1
camunda.operate.elasticsearch.numberOfReplicas| How many replicas Elasticsearch uses for all Operate indices| 0

These values are applied only on first startup of Operate or during version upgrade. After Operate 
ELS schema is created, settings may be adjusted directly in ELS template and the new settings will be applied 
to indices created after adjustment.

### A snippet from application.yml:

```yaml
camunda.operate:
  elasticsearch:
    # Cluster name
    clusterName: elasticsearch
    # Host
    url: http://localhost:9200
```

## Zeebe Broker Connection

Operate needs a connection to Zeebe Broker to start the import and to execute user operations.

### Settings to connect

Name | Description | Default value
-----|-------------|--------------
camunda.operate.zeebe.brokerContactPoint | Broker contact point to zeebe as hostname and port | localhost:26500

### A snippet from application.yml:

```yaml
camunda.operate:
  zeebe:
    # Broker contact point
    brokerContactPoint: localhost:26500
```

## Zeebe Elasticsearch Exporter

Operate imports data from Elasticsearch indices created and filled in by [Zeebe Elasticsearch Exporter](https://github.com/zeebe-io/zeebe/tree/develop/exporters/elasticsearch-exporter).
Therefore settings for this Elasticsearch connection must be defined and must correspond to the settings on Zeebe side.

### Settings to connect and import:

Name | Description | Default value
-----|-------------|--------------
camunda.operate.zeebeElasticsearch.clusterName | Cluster name of Elasticsearch | elasticsearch
camunda.operate.zeebeElasticsearch.host | Hostname where Elasticsearch is running | localhost
camunda.operate.zeebeElasticsearch.port | Port of Elasticsearch REST API | 9200
camunda.operate.zeebeElasticsearch.prefix | Index prefix as configured in Zeebe Elasticsearch exporter | zeebe-record
camunda.operate.zeebeElasticsearch.username | Username to access Elasticsearch REST API | -
camunda.operate.zeebeElasticsearch.password | Password to access Elasticsearch REST API | -

### A snippet from application.yml:

```yaml
camunda.operate:
  zeebeElasticsearch:
    # Cluster name
    clusterName: elasticsearch
    # Host
    host: localhost
    # Transport port
    port: 9200
    # Index prefix, configured in Zeebe Elasticsearch exporter
    prefix: zeebe-record
```

## Operation Executor

Operations are user operations like Cancellation of workflow instance(s) or Updating the variable value. Operations are executed in multi-threaded manner.

Name | Description | Default value
-----|-------------|--------------
camunda.operate.operationExecutor.threadsCount| How many threads should be used | 3

### A snippet from application.yml

```yaml
camunda.operate:
  operationExecutor:
  	threadsCount: 3
```

## Monitoring Operate

Operate includes [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready) inside, that
provides number of monitoring possibilities.

Operate uses following Actuator configuration by default:
```yaml
# enable health check and metrics endpoints
management.endpoints.web.exposure.include: health,prometheus
# enable Kubernetes health groups:
# https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-kubernetes-probes
management.health.probes.enabled: true
```

With this configuration following endpoints are available for use out of the box:

```<server>:8080/actuator/prometheus``` Prometheus metrics

```<server>:8080/actuator/health/liveness``` Liveness probe

```<server>:8080/actuator/health/readiness``` Readiness probe


### Versions before 0.25.0

In versions before 0.25.0 management endpoints look differently, therefore we recommend to reconfigure for next versions.

|Name|Before 0.25.0| Starting with 0.25.0|
|----|-------------|--------|
|Readiness|/api/check|/actuator/health/readiness|
|Liveness|/actuator/health|/actuator/health/liveness|

## Logging

Operate uses Log4j2 framework for logging. In distribution archive as well as inside a Docker image `config/log4j2.xml` logging configuration files is included,
that can be further adjusted to your needs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">
  <Properties>
    <Property name="LOG_PATTERN">%clr{%d{yyyy-MM-dd HH:mm:ss.SSS}}{faint} %clr{%5p} %clr{${sys:PID}}{magenta} %clr{---}{faint} %clr{[%15.15t]}{faint} %clr{%-40.40c{1.}}{cyan} %clr{:}{faint} %m%n%xwEx</Property>
    <Property name="log.stackdriver.serviceName">${env:OPERATE_LOG_STACKDRIVER_SERVICENAME:-operate}</Property>
    <Property name="log.stackdriver.serviceVersion">${env:OPERATE_LOG_STACKDRIVER_SERVICEVERSION:-}</Property>
  </Properties>
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT" follow="true">
      <PatternLayout pattern="${LOG_PATTERN}"/>
    </Console>
    <Console name="Stackdriver" target="SYSTEM_OUT" follow="true">
      <StackdriverLayout serviceName="${log.stackdriver.serviceName}"
        serviceVersion="${log.stackdriver.serviceVersion}" />
    </Console>
  </Appenders>
  <Loggers>
    <Logger name="org.camunda.operate" level="info" />
    <Root level="info">
      <AppenderRef ref="${env:OPERATE_LOG_APPENDER:-Console}"/>
    </Root>
  </Loggers>
</Configuration>
```

By default Console log appender will be used.

#### JSON logging configuration

You can choose to output logs in JSON format (Stackdriver compatible). To enable it, define
the environment variable ```OPERATE_LOG_APPENDER``` like this:

```sh
OPERATE_LOG_APPENDER=Stackdriver
```

## An example of application.yml file

The following snippet represents the default Operate configuration, which is shipped with the distribution. It can be found inside the `config` folder (`config/application.yml`)
 and can be used to adjust Operate to your needs.

```yaml
# Operate configuration file

camunda.operate:
  # Set operate username and password.
  # If user with <username> does not exists it will be created.
  # Default: demo/demo
  #username:
  #password:
  # ELS instance to store Operate data
  elasticsearch:
    # Cluster name
    clusterName: elasticsearch
    # Host
    host: localhost
    # Transport port
    port: 9200
  # Zeebe instance
  zeebe:
    # Broker contact point
    brokerContactPoint: localhost:26500
  # ELS instance to export Zeebe data to
  zeebeElasticsearch:
    # Cluster name
    clusterName: elasticsearch
    # Host
    host: localhost
    # Transport port
    port: 9200
    # Index prefix, configured in Zeebe Elasticsearch exporter
    prefix: zeebe-record
```
