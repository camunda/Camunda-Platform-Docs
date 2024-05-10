---
id: install-and-start
title: Installation
description: "Let's get started with Connectors by installing and running them."
---

The concept of a [Connector](/components/connectors/introduction.md) consists of two parts:

- The business logic is implemented by a [Connector function](/components/connectors/custom-built-connectors/connector-sdk.md#outbound-connector-runtime-logic)
  and executed by a [Connector runtime environment](/components/connectors/custom-built-connectors/connector-sdk.md#runtime-environments).
- The user interface during modeling is provided using a [Connector template](/components/connectors/custom-built-connectors/connector-templates.md).

## Connector runtime and function

The Connector runtime environment can be installed using the supported [deployment options](/self-managed/platform-deployment/overview.md#deployment-options).

Currently, we support an installation of Connectors with [Docker](/self-managed/platform-deployment/docker.md#connectors),
[Docker Compose](/self-managed/platform-deployment/docker.md#docker-compose), [Helm charts](/self-managed/platform-deployment/helm-kubernetes/overview.md), and the [manual setup](/self-managed/platform-deployment/manual.md#run-connectors).

:::note
Inbound Connectors require Operate to be deployed as part of your Camunda Self-Managed installation.
If you don't use Operate with your cluster, you can still use Outbound Connectors.
:::

## Connector templates

For the modeling interface, you need to [provide Connector templates](/components/connectors/custom-built-connectors/connector-templates.md#providing-and-using-connector-templates).

For the [out-of-the-box Connectors](/components/connectors/out-of-the-box-connectors/available-connectors-overview.md) provided by Camunda,
the Connectors Bundle project provides a set of all Connector templates related to one [release version](https://github.com/camunda/connectors-bundle/releases).
If you use the [Docker Compose](/self-managed/platform-deployment/docker.md#docker-compose) installation, you can thus fetch all Connector templates that match the versions of the Connectors used in the backend.

Alternatively, you can fetch the JSON templates from the respective Connector's releases at respective connectors folder in the [bundle repository](https://github.com/camunda/connectors-bundle)
at `connectors/{connector name}/element-templates`:

| Connector                      | License                             |
| ------------------------------ | ----------------------------------- |
| Asana Connector                | [Camunda Self-Managed Free Edition] |
| Automation Anywhere Connector  | [Camunda Self-Managed Free Edition] |
| Amazon SNS Connector           | [Camunda Self-Managed Free Edition] |
| Amazon SQS Connector           | [Camunda Self-Managed Free Edition] |
| AWS Lambda Connector           | [Camunda Self-Managed Free Edition] |
| Camunda Operate Connector      | [Camunda Self-Managed Free Edition] |
| Easy Post Connector            | [Camunda Self-Managed Free Edition] |
| GitHub Connector               | [Camunda Self-Managed Free Edition] |
| GitHub Webhook Connector       | [Camunda Self-Managed Free Edition] |
| GitLab Connector               | [Camunda Self-Managed Free Edition] |
| Google Drive Connector         | [Camunda Self-Managed Free Edition] |
| Google Maps Platform Connector | [Camunda Self-Managed Free Edition] |
| GraphQL Connector              | [Camunda Self-Managed Free Edition] |
| HTTP Webhook Connector         | [Camunda Self-Managed Free Edition] |
| Kafka Consumer Connector       | [Camunda Self-Managed Free Edition] |
| Kafka Producer Connector       | [Camunda Self-Managed Free Edition] |
| Microsoft Teams Connector      | [Camunda Self-Managed Free Edition] |
| OpenAI Connector               | [Camunda Self-Managed Free Edition] |
| Power Automate Connector       | [Camunda Self-Managed Free Edition] |
| RabbitMQ Connector             | [Camunda Self-Managed Free Edition] |
| REST Connector                 | [Apache 2.0]                        |
| SendGrid Connector             | [Camunda Self-Managed Free Edition] |
| Slack Connector                | [Camunda Self-Managed Free Edition] |
| UiPath Connector               | [Camunda Self-Managed Free Edition] |

You can use the Connector templates as provided or modify them to your needs as described in our [Connector templates guide](/components/connectors/custom-built-connectors/connector-templates.md).

Review our [Connectors Awesome List](https://github.com/camunda-community-hub/camunda-8-connectors/tree/main) to find more Connectors.
