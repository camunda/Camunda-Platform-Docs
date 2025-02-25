---
id: glossary
title: "Glossary"
description: "This section defines common terminology referenced within the documentation."
---

### Automation cluster

See [orchestration cluster](#orchestration-cluster).

### Bridge

Synonym to "[Connector](#connector)".

### Broker

The [Zeebe Broker](#zeebe-broker) is the distributed workflow engine that tracks the state of active process instances. However, a Zeebe deployment often consists of more than one broker. Brokers can be partitioned for horizontal scalability and replicated for fault tolerance.

- [Architecture](/components/zeebe/technical-concepts/architecture.md)

### Client

A client interacts with the Zeebe Broker on behalf of the business application. Clients poll for work from the broker.

- [Architecture](/components/zeebe/technical-concepts/architecture.md#clients)

### Cluster

A cluster represents a configuration of one or more brokers collaborating to execute processes. Each broker in a cluster acts as a leader or a follower.

- [Clustering](/components/zeebe/technical-concepts/clustering.md)

### Command

A command represents an action to be taken or executed. Example commands include: deploy a process, execute a process, etc.

- [Internal processing](/components/zeebe/technical-concepts/internal-processing.md#events-and-commands)

### Connector

A reusable building block that performs the integration with an external system and works out of the box.

The Connector might be uni or bidirectional and possibly include a [job worker](#job-worker).

The boundary between Connectors and job workers can be fuzzy, but in general, Connectors connect to other active pieces of software. [Outbound](#outbound-connector), [inbound](#inbound-connector), or [protocol](#protocol-connector) Connectors are types of Connectors.

### Correlation

Correlation refers to the act of matching a message with an inflight process instance.

- [Message correlation](/components/concepts/messages.md)

### Correlation key

A correlation is an attribute within a message used to match this message against a certain variable within an inflight process instance. If the value of the correlation key matches the value of the variable within the process instance, the message is matched to this process instance.

- [Message correlation](/components/concepts/messages.md)

### Deployment

A process cannot execute unless it is known by the broker. Deployment is the process of pushing or deploying processes to the broker.

- [Zeebe Deployment](/apis-tools/zeebe-api/gateway-service.md#deployresource-rpc)

### Event

An event represents a state change associated with an aspect of an executing process instance. Events capture variable changes, state transition in process elements, etc. An event is represented by a timestamp, the variable name, and variable value. Events are stored in an append-only log.

- [Internal processing](/components/zeebe/technical-concepts/internal-processing.md#events-and-commands)

### Execution listener

An execution listener is a mechanism that allows users to execute custom logic at specific points during workflow execution. Execution listeners can be attached to BPMN elements to react to lifecycle events, such as when an element starts or ends. This feature facilitates pre-processing and post-processing tasks without cluttering the BPMN model, functioning similarly to job workers by leveraging the same infrastructure.

- [Execution listeners](/components/concepts/execution-listeners.md)

### Exporter

An exporter represents a sink to which Zeebe will submit all records within the log. This gives users of Zeebe an opportunity to persist records with the log for future use as this data will not be available after log compaction.

- [Exporter](/self-managed/concepts/exporters.md)

### Follower

In a clustered environment, a broker which is not a leader is a follower of a given partition. A follower can become the new leader when the old leader is no longer reachable.

- [Clustering](/components/zeebe/technical-concepts/clustering.md#raft-consensus-and-replication-protocol)

### Human task

Camunda 8 allows you to orchestrate processes with human tasks, which may be [user tasks](#user-task) or [manual tasks](#manual-task).

- [Human task orchestration](/guides/getting-started-orchestrate-human-tasks.md)

### Hybrid mode

Hybrid mode, or a hybrid Self-Managed distribution, allows you to run a separate instance of the Connectors runtime in a Self-Managed or local fashion. This instance can be attached to either a SaaS cluster, or another Self-Managed cluster with its own Connector runtime.

For example, this is useful when working with services that must be isolated within a private network and cannot be exposed to the public internet, or if infrastructure amendments need to be applied to the Connector runtime, such as SSL certificates or mounted volumes.

- [Use Connectors in hybrid mode](/guides/use-connectors-in-hybrid-mode.md)

### Inbound Connector

Inbound [Connectors](#connector) in Camunda 8 enable workflows to receive data or messages from external systems or services, making it possible to integrate workflows into a wider business process or system architecture.

Inbound Connectors include three subtypes - [webhooks](#webhook), [subscriptions](#subscription), and [polling](#polling).

Unlike [outbound Connectors](#outbound-connector), inbound Connectors are **stateful**. The Java code of the inbound Connector has a lifecycle suitable for long-running operations, such as listening for messages on a queue or waiting for a webhook to be called.
Each element referencing an inbound Connector will lead to the creation of one inbound Connector instance. A process definition with one webhook start event and two additional webhooks as intermediate catch events would therefore lead to the creation of three inbound connector instances.

### Incident

An incident represents an error condition which prevents Zeebe from advancing an executing process instance. Zeebe will create an incident if there was an uncaught exception thrown in your code and the number of retries of the given step is exceeded.

- [Incident](/components/concepts/incidents.md)

### Ingress

An Ingress is a Kubernetes object that manages external access to the services within a Kubernetes cluster. An **Ingress controller** is required to route traffic to your services according to the rules defined on the Ingress.

- [Ingress setup](/self-managed/setup/guides/ingress-setup.md)

### Job

A job represents a distinct unit of work within a business process. Service tasks represent such
jobs in your process and are identified by a unique id. A job has a type to allow specific job
workers to find jobs that they can work on.

- [Job workers](/components/concepts/job-workers.md)

### Job activation timeout

This is the amount of time the broker will wait for a complete or fail response from the job worker. This comes after a job has been submitted to the job worker for processing and before it marks the job as available again for other job workers.

- [Job workers](/components/concepts/job-workers.md#requesting-jobs)

### Job worker

A special type of client that polls for and executes available jobs. An uncompleted job prevents Zeebe from advancing process execution to the next step.

- [Job workers](/components/concepts/job-workers.md)

### Leader

In a clustered environment, one broker (the leader) is responsible for process execution and housekeeping of data within a partition. Housekeeping includes taking snapshots, replication, and running exports.

- [Clustering](/components/zeebe/technical-concepts/clustering.md#raft-consensus-and-replication-protocol)

### Log

The log is comprised of an ordered sequence of records written to persistent storage. The log is appended-only and is stored on disk within the broker.

- [Partitions](/components/zeebe/technical-concepts/partitions.md#partition-data-layout)

### Manual task

A manual task defines a task that requires human interaction but no external tooling or UI interface. For example, a user reviewing a document or completing a physical task.

Manual tasks are part of [human task orchestration](/guides/getting-started-orchestrate-human-tasks.md), but differ from [user tasks](/components/modeler/bpmn/user-tasks/user-tasks.md) which define an actionable task assisted by a business process execution engine or software application.

- [Manual tasks](/components/modeler/bpmn/manual-tasks/manual-tasks.md)

### Message

A message contains information to be delivered to interested parties during execution of a process instance. Messages can be published via Kafka or Zeebe’s internal messaging system. Messages are associated with timestamp and other constraints such as time-to-live (TTL).

- [Messages](/components/concepts/messages.md)

### Orchestration cluster

An orchestration cluster includes Zeebe, Operate, Tasklist, Optimize, and Connectors. Previously [automation cluster](#automation-cluster).

### Orchestration core

An orchestration core or orchestration cluster core includes Zeebe, Operate, Tasklist, Optimize, and Identity.

### Outbound Connector

Outbound [Connectors](#connector) in Camunda 8 allow workflows to trigger with external systems or services, making it possible to integrate workflows with other parts of a business process or system architecture.

### Partition

A partition represents a logical grouping of data in a Zeebe Broker. This data includes process instance variables stored in RocksDB, commands, and events generated by Zeebe stored in the log. The number of partitions is defined by configuration.

- [Partitions](/components/zeebe/technical-concepts/partitions.md)

### Polling Connector

An inbound polling Connector to periodically poll an external system or service for new data using HTTP polling.

A Camunda workflow uses this type of Connector to retrieve data from a remote system that does not support real-time notifications or webhooks, but instead requires the client to periodically request updates.

### Process

A process is a defined sequence of distinct steps representing your business logic. Examples of a
process could be an e-commerce shopping experience or onboarding a new employee. In Zeebe,
process are identified by a unique process id. The process is usually also referred to as the
BPMN model.

- [Processes](/components/concepts/processes.md)

### Process instance

While a process represents a defined sequence of distinct steps representing your business logic, a process instance represents a currently executing or completed process. For a single process, there could be many associated process instances in various stages of their executing lifecycle. Process instances are identified by process instance ids. Executing process instances are also sometimes referred to as inflight processes.

- [Processes](/components/concepts/processes.md)

### Process instance variable

A process instance variable represents the execution state (i.e data) of a process instance. These variables capture business process parameters which are the input and output of various stages of the process instance and which also influence process flow execution.

- [Variables](/components/concepts/variables.md)
- [Data flow](/components/modeler/bpmn/data-flow.md)

### Protocol Connector

Protocol Connectors are a type of [Connector](#connector) in Camunda that can serve as either [inbound](#inbound-connector) or [outbound](#outbound-connector) Connectors, supporting a variety of technical protocols. These Connectors are highly generic, designed to provide a flexible and customizable means of integrating with external systems and services.

Protocol Connectors can be customized to meet the needs of specific use cases using element templates, with no additional coding or deployment required. Examples of protocol Connectors include HTTP REST, SOAP, GraphQL, as well as message queue Connectors.

### Record

A record represents a command or an event. For example, a command to create a new process instance, or a state transition of an executing process instance representing an event at a given point in time would result to generation of a record. During the execution lifecycle of a process instance, numerous records are generated to capture various commands and events generated. Records are stored in the log.

- [Internal processing](/components/zeebe/technical-concepts/internal-processing.md#events-and-commands)

### Replication

Replication is the act of copying data in a partition from a leader to its followers within a clustered Zeebe installation. After replication, the leader and followers of a partition will have the exact same data. Replication allows the system to be resilient to brokers going down.

- [Clustering](/components/zeebe/technical-concepts/clustering.md#raft-consensus-and-replication-protocol)

### Replication factor

This is the number of times data in a partition are copied. This depends on the number of brokers in a cluster. A cluster with one leader and two followers have a replication factor of three, as data in each partition needs to have three copies.

We recommend running an odd replication factor.

- [Partitions](/components/zeebe/technical-concepts/partitions.md#replication)

### Request timeout

This is how long a client waits for a response from the broker after the client submits a request. If a response is not received within the client request timeout, the client considers the broker unreachable.

- [Zeebe API (gRPC)](/apis-tools/zeebe-api/grpc.md)

### Segment

The log consists of one or more segments. Each segment is a file containing an ordered sequence records. Segments are deleted when the log is compacted.

- [Resource planning](/self-managed/zeebe-deployment/operations/resource-planning.md#event-log)

### Snapshot

The state of all active process instances, (these are also known as inflight process instances) are stored as records in an in-memory database called RocksDB. A snapshot represents a copy of all data within the in-memory database at any given point in time. Snapshots are binary images stored on disk and can be used to restore execution state of a process. The size of a snapshot is affected by the size of the data. Size of the data depends on several factors, including complexity of the model or business process, the size and quantity of variables in each process instance, and the total number of executing process instances in a broker.

- [Resource planning](/self-managed/zeebe-deployment/operations/resource-planning.md#snapshots)

### Soft pause exporting

Soft pause exporting is a feature that allows you to continue exporting records from Zeebe, but without deleting those records (log compaction) from Zeebe. This is particularly useful during hot backups.

- [Exporting API](/self-managed/zeebe-deployment/operations/management-api.md)
- [Backup and restore](/self-managed/operational-guides/backup-restore/zeebe-backup-and-restore.md)

### Subscription inbound Connector

An [inbound Connector](#inbound-connector) that subscribes to a message queue.

This way, a Camunda workflow can receive messages from an external system or service (like Kafka or RabbitMQ) using message queuing technology. This type of inbound Connector is commonly used in distributed systems where different components of the system need to communicate with each other asynchronously.

### User task

A user task is used to model work that needs to be done by a human and is assisted by a business process execution engine or software application. This differs from [manual tasks](/components/modeler/bpmn/manual-tasks/manual-tasks.md), which are not assisted by external tooling.

With 8.7, Camunda offers job worker-based user tasks managed by Camunda, also known as Camunda user tasks (and formerly known as Zeebe user tasks). Note that you may still see references of **Zeebe user tasks** in your XML, but this is the same thing as Camunda user tasks.

Camunda recommends using Camunda user tasks in your process definitions. With 8.7, **job-worker** user tasks are available for querying, but Camunda Modeler automatically applies the **Camunda user task** and shows a warning message for each job worker user task.

- [User tasks](/components/modeler/bpmn/user-tasks/user-tasks.md)
- [Migrate to Camunda user tasks](/apis-tools/migration-manuals/migrate-to-camunda-user-tasks.md)

### Webhook Connector

Webhooks are a subtype of [inbound Connector](#inbound-connector).

A webhook is a way for web applications to send real-time notifications or data to other applications or services when certain events occur. When a webhook is set up, the application sends a POST request containing data to a pre-configured URL, which triggers a workflow.

### Worker

A worker executes a job. In the Zeebe nomenclature, these are also referred to as job workers.

- [Job workers](/components/concepts/job-workers.md)

### Workflow

See [process](#process).

### Workflow instance

See [process instance](#process-instance).

### Workflow instance variable

See [process instance variable](#process-instance-variable).

## Zeebe Broker

The [Zeebe Broker](/components/zeebe/technical-concepts/architecture.md#brokers) is the distributed workflow engine that tracks the state of active process instances. The Zeebe Broker is the main part of the Zeebe cluster, which does all the heavy work like processing, replicating, exporting, and everything based on partitions.

### Zeebe Gateway

The Zeebe Gateway is a component of the Zeebe cluster; it can be considered the contact point for the Zeebe cluster which allows Zeebe clients to communicate with Zeebe brokers inside a Zeebe cluster.

- [Zeebe Gateway overview](/self-managed/zeebe-deployment/zeebe-gateway/zeebe-gateway-overview.md)
