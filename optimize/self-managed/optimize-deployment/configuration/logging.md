---
id: logging
title: "Logging"
description: "Camunda Optimize provides logging facilities that are preconfigured to use INFO logging level which provides minimal output of information in log files."
---

Camunda Optimize provides logging facilities that are preconfigured to use
_INFO_ logging level which provides minimal output of information in log files.
This level can be adjusted using the `config/log4j2.xml` configuration file.

## Google Stackdriver (JSON) logging

To enable Google Stackdriver compatible JSON logging, set the environment variable `OPTIMIZE_LOG_APPENDER=Stackdriver` before starting Optimize.

## Default logging configuration

Although one could potentially configure logging levels for all packages, it
is recommended to set logging levels for the following three Optimize parts using only exact package
reference as follows:

- Optimize runtime environment:

```xml
<Logger name="io.camunda.optimize" level="info" />
```

- Communication to Elasticsearch:

```xml
<Logger name="org.elasticsearch" level="warn" />
```

If you are running Optimize with Docker, use the following environment variables to configure its logging levels:

- `OPTIMIZE_LOG_LEVEL`: Sets the logging level for the Optimize log.
- `ES_LOG_LEVEL`: Sets the logging level for Elasticsearch.

Whether using the configuration file or Docker environment variables, to define the granularity of the information shown in the log you can set one of the following log levels:

- **error**: Shows errors only.
- **warn**: Like **error**, but displays warnings as well.
- **info**: Logs everything from **warn** and the most important information about state changes or actions in Optimize.
- **debug**: In addition to **info**, writes information about the scheduling process, alerting as well as the import of the engine data.
- **trace**: Like **debug**, but in addition, writes all requests sent to the Camunda engine as well as all queries towards Elasticsearch to the log output.
