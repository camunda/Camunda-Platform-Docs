---
id: amazon-s3
sidebar_label: AWS S3
title: Amazon S3 Connector
description: Interact with Amazon S3 services from your BPMN process.
---

The **Amazon S3 Connector** is an outbound Connector that allows you to interact
with [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/S3/) from your BPMN process.

## Prerequisites

To use the **Amazon S3 Connector**, you will need an AWS account with an access key and secret key.

The key will need the following permissions:

- `GetObject`
- `DeleteObject`
- `PutObject`

Learn more about Amazon S3 in the [Amazon Simple Storage Service Documentation](https://docs.aws.amazon.com/s3/).

:::note
Use Camunda secrets to store credentials and avoid exposing sensitive information from the process.
See [managing secrets](/components/console/manage-clusters/manage-secrets.md).
:::

## Create an Amazon S3 Connector task

import ConnectorTask from '../../../components/react-components/connector-task.md'

<ConnectorTask/>

## Authentication

Select an authentication type from the **Authentication** dropdown.

- **Credentials** (SaaS/Self-Managed): Select this option if you have a valid pair of access and secret keys provided by
  your AWS account administrator. This option is supported for both SaaS and Self-Managed users.

- **Default Credentials Chain** (Hybrid/Self-Managed only): Select this option if your system is
  configured as an implicit authentication mechanism, such as role-based authentication, credentials supplied via
  environment variables, or files on target host. This option is only supported for Self-Managed or hybrid
  distributions. This approach uses
  the [Default Credential Provider Chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html)
  to resolve required credentials.

If you select **Credentials**, you must supply the appropriate
credentials:

- **Access key**: Provide an access key of a user with permissions to the Amazon S3 actions.
- **Secret key**: Provide the secret key of the user with the access key provided above.

:::note
The **Access key** and the **Secret key** are required properties and must be provided to use the Connector.
:::

## Region

In the **Region** field, enter the region of the deployed endpoint.

## Action

The Amazon S3 Connector supports the following actions:

- `Upload Document`
- `Download Document`
- `Delete Document`

### Upload Document

Upload a document. The incoming document must be a reference from the previous process.

#### Parameters

| Parameter    | Description                                                                                                                                      |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `AWS bucket` | The targeted AWS S3 bucket where the document should be uploaded.                                                                                |
| `AWS key`    | (Optional) The key of the document that uniquely identifies the object in an Amazon S3 bucket. Will fallback to the document filename if not set |
| `Document`   | The document that should be uploaded to S3, provided as a FEEL expression with the document reference.                                           |

:::info
To learn more about Friendly Enough Expression Language (FEEL) expressions,
see [what is FEEL?](/components/modeler/feel/what-is-feel.md).
:::

#### Response Structure

The following JSON response is returned after a successful document upload operation:

- `bucket`: Echoes back the bucket of the uploaded document.
- `key`: Echoes back the unique key of the uploaded document.
- `link`: The document link.

:::note
Starting from version 8.7.0, the Amazon S3 Connector supports uploading documents from (or downloading documents to) the Camunda document store. Review the **Document** field in the properties panel where the document reference can be provided. See additional details and limitations in [document handling](/components/concepts/document-handling.md).
:::

#### Example Response

The following example shows a successful send upload operation response:

```json
{
  "bucket": "Example Subject",
  "key": true,
  "link": "https://mybucket.s3.amazonaws.com/test"
}
```

### Download Document

Download the document from AWS S3.

#### Parameters

| Parameter         | Description                                                                                                                 |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `AWS bucket`      | The targeted AWS S3 bucket that the document should be downloaded from.                                                     |
| `AWS key`         | The key of the document that uniquely identifies the object in an Amazon S3 bucket.                                         |
| `Create document` | Either `false` or `true`. If `false`, no document is created and the output is inserted as JSON, text, or base64 raw bytes. |

:::info
To learn more about Friendly Enough Expression Language (FEEL) expressions,
see [what is FEEL?](/components/modeler/feel/what-is-feel.md).
:::

#### Response Structure

The following JSON response is returned after a successful document download operation:

- `bucket`: Echoes back the bucket of the uploaded document.
- `key`: Echoes back the unique key of the uploaded document.
- `element`: Represents the document in the workflow. The behavior changes based on the `Create document` setting:
  - If `Create document` is set to `false`:
    - For `String` content type: `element` will contain the string content of the document.
    - For `Json` content type: `element` will contain the JSON content of the document.
    - For other content types: `element` will contain the raw bytes of the document, encoded in base64.
  - If `Create document` is set to `true`:
    - `element` will contain a document reference, rather than the document content itself.

#### Example Response

The following examples show a successful download operation response:

```json
{
  "bucket": "Example Subject",
  "key": true,
  "document": {
    "storeId": "in-memory",
    "documentId": "20f1fd6a-d8ea-403b-813c-e281c1193495",
    "metadata": {
      "contentType": "image/webp; name=305a4816-b3df-4724-acd3-010478a54add.webp",
      "size": 311032,
      "fileName": "305a4816-b3df-4724-acd3-010478a54add.webp"
    },
    "camunda.document.type": "camunda"
  },
  "content": null
}
```

or

```json
{
  "bucket": "Example Subject",
  "key": true,
  "document": null,
  "content": {
    "json": {
      "testKey": "testValue"
    }
  }
}
```

### Delete Document

Delete the document from AWS S3.

#### Parameters

| Parameter    | Description                                                                         |
| :----------- | :---------------------------------------------------------------------------------- |
| `AWS bucket` | The targeted AWS S3 bucket that the document should be deleted from.                |
| `AWS key`    | The key of the document that uniquely identifies the object in an Amazon S3 bucket. |

:::info
To learn more about Friendly Enough Expression Language (FEEL) expressions,
see [what is FEEL?](/components/modeler/feel/what-is-feel.md).
:::

#### Response Structure

The following JSON response is returned after a successful document deletion operation:

- `bucket`: Echoes back the bucket of the uploaded document.
- `key`: Echoes back the unique key of the uploaded document.

#### Example Response

The following example shows a successful deletion operation response:

```json
{
  "bucket": "Example Subject",
  "key": "document.txt"
}
```
