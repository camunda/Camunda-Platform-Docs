---
id: amazon-bedrock
sidebar_label: Amazon Bedrock
title: Amazon Bedrock Connector
description: Interact with the Amazon Bedrock Connector from your BPMN process.
---

The **Amazon Bedrock Connector** is an outbound Connector that allows you to interact with
[Amazon Bedrock](https://aws.amazon.com/bedrock/) from your BPMN process.

## Prerequisites

To use the **Amazon Bedrock Connector**, you need to have an AWS account with an access key and secret key to
execute [`InvokeModel`](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html) or
[`Converse`](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) actions.

The necessary models must be enabled beforehand on the region you are operating from. See more about
this [in the Amazon Bedrock user guide](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html).

Learn more about Amazon bedrock in
the [official Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html).

:::note
Use Camunda secrets to store credentials and avoid exposing sensitive information directly from the process. Refer
to [managing secrets](/components/console/manage-clusters/manage-secrets.md) to learn more.
:::

## Create an Amazon Bedrock Connector task

import ConnectorTask from '../../../components/react-components/connector-task.md'

<ConnectorTask/>

## Authentication

Choose an applicable authentication type from the **Authentication** dropdown. Learn more about authentication types in
the related [appendix entry](#aws-authentication-types).

There are two options to authenticate the Connector with AWS:

- Choose **Credentials** in the **Authentication** dropdown if you have a valid pair of access and secret keys provided by your AWS account administrator. This option is applicable for both SaaS and Self-Managed users.
- Choose **Default Credentials Chain (Hybrid/Self-Managed only)** in the **Authentication** dropdown if your system is configured as an implicit authentication mechanism, such as role-based authentication, credentials supplied via environment variables, or files on target host. This option is applicable only for Self-Managed or hybrid distributions. This approach uses the [Default Credential Provider Chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html) to resolve required credentials.

If you select **Credentials** to access the **Amazon Bedrock Connector**, the Connector requires the appropriate
credentials. The following authentication options are available:

- **Access key**: Provide an access key of a user with permissions to the Amazon SageMaker `InvokeModel` and/or `Converse` actions.
- **Secret key**: Provide the secret key of the user with the access key provided above.

The **Access key** and the **Secret key** are required properties and must be provided to use the Connector.

For more information on authentication and security in Amazon Bedrock, refer to
the [Amazon Bedrock security and privacy documentation](https://aws.amazon.com/bedrock/security-compliance/).

## Region

In the **Region** field write the region of the deployed endpoint.

## Action

There are two possible actions with the Amazon Bedrock Connector: `InvokeModel` and `Converse`.

### InvokeModel

This action is meant to invoke a model with a raw payload.

A model ID must be specified. Find all the available options for Amazon
Bedrock [in the model ID documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html).

:::note
Ensure the model is available in your region, that your model can invoke the `Invoke Model` action, and you are a user with adequate rights.
:::

The payload is dependent on the model used, and you can find the different
payloads [in the model parameters documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html).

1. Use **Result Variable** to store the response in a process variable. For example, `myResultVariable`.
2. Use **Result Expression** to map fields from the response into process variables.

The response is dependent on the model used, and you can find the different
responses [in the model parameters documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html).

#### Example

If using the model `Jamba-instruct` with model ID `ai21.jamba-instruct-v1:0`, and looking at the [model parameters Jamba documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-jamba.html), the payload could be as follows:

```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "max_tokens": 256,
  "top_p": 0.8,
  "temperature": 0.7
}
```

The FEEL mapping could be as follows:

```
{ response : body.choices.message.content[1] }
```

### Converse

This action is meant to start or continue a conversation with a model.

A model ID must be specified. Find all available model IDs for Amazon
Bedrock [in the model ID documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html).

:::note
Ensure the model is available in your region, that your model can invoke the `Converse` action, and you are a user with adequate rights.
:::

- `New Message` is either the first message (to start a conversation) or is the next message from an already started conversation.
- `Documents` is a list of documents to include as part of your **new message**.
  - To work with documents you must upload them first, [using the REST API](/apis-tools/camunda-api-rest/specifications/create-document.api.mdx) for example.
  - Only .txt documents are currently supported. To use other text file formats (such as .ts, .yaml, .bpmn), convert them to a .txt file.
  - The result of the endpoint must then be assigned to a variable in **Start Process Instance** so you can use the list of these variables in the **Documents** field.
- `Message History` is the history of the conversation that should always be passed. If not set, this will be a new conversation.

1. Use **Result Variable** to store the response in a process variable. For example, `myResultVariable`.
2. Use **Result Expression** to map fields from the response into process variables.

The **Response** is a list of consecutive messages of the user and the assistant.

:::info important
The current implementation supports the assistant's responses only in text format.
:::

Ideally, the message's history must transit within the process and be the input of this `Converse` task with the new message.

:::note
Starting from version 8.7.0, the Amazon Bedrock Connector supports consuming documents as inputs for conversations. Review the **Document** field in the properties panel where the document reference can be provided. See additional details and limitations in [document handling](/components/concepts/document-handling.md).
:::
