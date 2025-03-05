---
id: email
title: Email Connector
sidebar_label: Email
description: The Email Connector allows you to connect your BPMN service with different email protocols such as SMTP, POP3 or IMAP.
---

import Tabs from "@theme/Tabs"; import TabItem from "@theme/TabItem";

<Tabs groupId="email" defaultValue="outbound" queryString
values={[{label: 'Email Outbound Connector', value: 'outbound' }, {label: 'Email Inbound Connector', value: 'inbound' }]}>

<TabItem value='outbound'>

The **Email Connector** is an outbound Connector that allows you to connect your BPMN service with any email POP3, IMAP
or SMTP server.

## Prerequisites

To use the **Email Connector**, you must have an SMTP, POP3 or IMAP server available to connect to.

:::note
Use Camunda secrets to avoid exposing your sensitive data as plain text.
See [managing secrets](/components/console/manage-clusters/manage-secrets.md).
:::

## Authentication

You can authenticate to a mail server as follows.

### Simple Authentication

This method allows the user to connect to any SMTP, POP3 or IMAP server using an email address and password.

| Parameter  | Description                                                                                                                                                                |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username` | Enter your full email address (for example, user@example.com) or the username provided by your email service. This is used to authenticate your access to the mail server. |
| `password` | Enter the password for your email account. Keep your password secure and do not share it with others.                                                                      |

## POP3

The Post Office Protocol version 3 (POP3) is an Internet standard protocol used by local email clients to retrieve
emails from a remote server over a TCP/IP connection. POP3 allows users to download messages from their email server to
their local computer, where they can be read, managed, or archived even without an internet connection. It operates on a
simple download-and-delete model, meaning emails are typically removed from the server once they are retrieved.

| Field                    | Description                                                                                            |
| :----------------------- | :----------------------------------------------------------------------------------------------------- |
| `POP3 host`              | The host URL of the POP3 server.                                                                       |
| `POP3 port`              | The host port of the POP3 server.                                                                      |
| `Cryptographic protocol` | Defines how the connection to the server is secured, `TLS`, `SSL` or `None`. Default is typically TLS. |

### List Emails

Allow users to fetch a list of emails from the `INBOX` folder, with customizable sorting and limitation options.

#### Parameters

| Parameter            | Description                                                                                                                                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Max Emails to read` | Specify the maximum number of emails to retrieve. This parameter determines the cap on the number of emails the task will return.                                                                                                                 |
| `Sort emails by`     | <p>Choose the field by which to sort the emails. Supported sorting fields are:</p><p><ul><li>`Sent date`: Sorts emails by the date and time they were sent.</li><li>`Size`: Sorts emails by the size of the email.</li></ul></p>                  |
| `Sort order`         | <p>Define the sort order:</p><p><ul><li>`ASC`: Ascending order, from the oldest or smallest value to the most recent or largest.</li><li>`DESC`: Descending order, from the most recent or largest value to the oldest or smallest.</li></ul></p> |

#### Sorting and Limiting Behavior

Emails are initially sorted based on the specified sorting field and order. The list is then limited to the number of
emails as defined by the Max Emails to read parameter. For example, if you sort by Sent date in descending order (DESC)
with a limit of one email, the task will return the most recently sent email.

#### Response Structure

The task returns a list of emails in JSON format. Each email object contains the following information:

- `messageId`: A unique identifier for the email message.
- `fromAddress`: The email addresses of the sender.
- `subject`: The subject line of the email.
- `size`: The size of the email (in bytes).

#### Example Response

Example of a returned JSON array:

```json
[
  {
    "messageId": "RandomId",
    "fromAddress": "msa@communication.microsoft.com",
    "subject": "Example",
    "size": 99865
  },
  {
    "messageId": "RandomId2",
    "fromAddress": "example@camunda.com",
    "subject": "Example",
    "size": 48547
  }
]
```

### Read Email

Retrieve the contents of an email, using the unique `messageId` associated with the email message.

:::danger
Reading an email using POP3 protocol will delete the email
:::

#### Parameters

| Parameter   | Description                                                                                                 |
| :---------- | :---------------------------------------------------------------------------------------------------------- |
| `MessageId` | The identifier of the email message you wish to read. Provide this to locate and return the specific email. |

#### Response Structure

The task returns a JSON object containing detailed information about the email:

- `messageId`: The unique identifier corresponding to the email message.
- `fromAddress`: The email addresses of the sender.
- `headers` : A list containing the email's headers
- `subject`: The subject line of the email.
- `size`: The size of the email in bytes.
- `plainTextBody`: The plain text version of the email's content.
- `htmlBody`: The HTML version of the email's content (if content exists).
- `attachments`: A list of all the email's attachments, provided as a document reference.
- `receivedDateTime`: The email's reception datetime

:::note
Starting from version 8.7.0, the outbound email Connector supports sending Camunda documents as attachments.

For example, the **Attachment** field in the properties panel may look as `=[ document1, document2]`.

See additional details and limitations in [document handling](/components/concepts/document-handling.md).
:::

#### Example Response

Below is an example of the JSON response returned when a specific email is read:

```json
{
  "messageId": "MessageId",
  "fromAddress": "example@camunda.com",
  "subject": "Example Subject",
  "size": 99865,
  "plainTextBody": "Any text content",
  "htmlBody": "<html>Any Html Content</html>",
  "headers": [
    {
      "header": "header1",
      "value": "example"
    },
    {
      "header": "header2",
      "value": "test"
    }
  ],
  "attachments": [
    {
      "storeId": "in-memory",
      "documentId": "20f1fd6a-d8ea-403b-813c-e281c1193495",
      "metadata": {
        "contentType": "image/webp; name=305a4816-b3df-4724-acd3-010478a54add.webp",
        "size": 311032,
        "fileName": "305a4816-b3df-4724-acd3-010478a54add.webp"
      },
      "documentType": "camunda"
    }
  ],
  "receivedDateTime": "2024-08-19T06:54:28Z"
}
```

### Delete Email

Delete (remove) an email from the server, using the specific `messageId` assigned to the email message.

#### Parameters

| Parameter   | Description                                    |
| :---------- | :--------------------------------------------- |
| `MessageId` | The identifier of the email message to delete. |

#### Response Structure

After the deletion task is performed, a JSON object is returned to confirm the action:

- `deleted`: A boolean value that indicates whether the deletion was successful (true) or not (false).
- `messageId`: The identifier of the email message that was attempted to be deleted.

#### Example Response

The following JSON response shows the result of a successful deletion request:

```json
{
  "deleted": true,
  "messageId": "MessageId"
}
```

### Search Emails

Enable users to perform advanced searches within an email inbox, by constructing a criteria-based query using a JSON
object. Supports complex queries that can combine multiple conditions using logical operators.

#### Parameters

A search query is represented as a JSON object. The following is an example of a JSON object that represents a search
criteria
using an AND and OR operator to combine multiple conditions:

```json
{
  "operator": "AND",
  "criteria": [
    {
      "field": "FROM",
      "value": "example@camunda.com"
    },
    {
      "operator": "OR",
      "criteria": [
        {
          "field": "SUBJECT",
          "value": "urgent"
        },
        {
          "field": "SUBJECT",
          "value": "important"
        }
      ]
    }
  ]
}
```

This example query returns emails from "example@camunda.com" with a subject containing either "urgent" or "important".

A simpler query without logical operators might look like the following example:

```json
{
  "field": "FROM",
  "value": "example@camunda.com"
}
```

Search supports the following logical operators:

- **AND**: Returns emails that match **all** the specified criteria.
- **OR**: Returns emails that match **any of** the specified criteria.

The following email fields can be used to set search criteria:

- **BODY**: The content of the email body.
- **SUBJECT**: The subject line of the email.
- **FROM**: The email address of the sender.

:::note

When using an operator such as AND or OR, you must also define a criteria array. This array contains the individual
conditions that the search will evaluate against the emails. Each condition within the criteria array is itself a JSON
object with a field and a value.

- If an operator is set, the criteria array must also be defined.
- Each criterion within the criteria array is applied to the specified field based on the value associated with it.

:::

#### Example Response

The following is an example of a returned response:

```json
[
  { "messageId": "MessageId", "subject": "Important" },
  { "messageId": "MessageId2", "subject": "Urgent" }
]
```

## SMTP

Simple Mail Transfer Protocol (SMTP) is the standard communication protocol for sending emails across the Internet. It
facilitates mail transfer from a client's email application to the outgoing mail server and between servers for relaying
email messages to their final destination. SMTP operates on a push model, where the sending server pushes the message to
the receiving server for delivery to the appropriate mailbox.

| Field                    | Description                                                                                            |
| :----------------------- | :----------------------------------------------------------------------------------------------------- |
| `SMTP host`              | The host URL of the SMTP server.                                                                       |
| `SMTP port`              | The host port of the SMTP server.                                                                      |
| `Cryptographic protocol` | Defines how the connection to the server is secured, `TLS`, `SSL` or `None`. Default is typically TLS. |

### Send Email

Allow users to send an email from the connected email account.

#### Parameters

| Parameter            | Description                                                                                                                                                                                                                                                                                   |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `From`               | Specify the sender's email address(es). This can be a single email address (for example, 'example@camunda.com'), a comma-separated list of addresses, or a Friendly Enough Expression Language (FEEL) expression returning a list of email addresses (for example, =["example@camunda.com"]). |
| `To`                 | Defines the email recipient(s). Similar to the `From` parameter, this can be a single email address, a comma-separated list, or a FEEL expression (for example, =["example@camunda.com"]).                                                                                                    |
| `Cc`                 | (Optional) Specify the email address(es) to include in the **Carbon Copy (CC)** field. The format is the same as the **From** and **To** fields, and can include a single address, a list, or a FEEL expression.                                                                              |
| `Bcc`                | (Optional) Specify the email address(es) to include in the **Blind Carbon Copy (BCC)** field. It follows the same format as the **CC** field and ensures that BCC recipients are not visible to other recipients.                                                                             |
| `Headers`            | Feel expression containing all the desired headers to be added to the email's headers. cf. `{ "customHeaders" : "new header value" }`                                                                                                                                                         |
| `Subject`            | The email subject line.                                                                                                                                                                                                                                                                       |
| `Content Type`       | The content type of the email.                                                                                                                                                                                                                                                                |
| `Email Text Content` | The text content of the email. This must only be provided if the `Content Type` is `PLAIN` or `HTML & PlainText`.                                                                                                                                                                             |
| `Html Text Content`  | The HTML content of the email. This must only be provided if the `Content Type` is `HTML` or `HTML & PlainText`.                                                                                                                                                                              |
| `Attachment`         | The document reference, either for a single document or as a list for multiple documents.                                                                                                                                                                                                     |

:::info
To learn more about Friendly Enough Expression Language (FEEL) expression,
see [what is FEEL?](/components/modeler/feel/what-is-feel.md).
:::

#### Response Structure

Upon successfully sending the email, the following JSON response is returned:

- `subject`: Echoes back the subject of the sent email.
- `sent`: A boolean value indicating the success status of the email being sent (true for success, false for failure).

#### Example Response

The following is an example of a successful send email operation:

```json
{
  "subject": "Example Subject",
  "sent": true
}
```

In this response:

- `sent: true` confirms that the email with the specified subject "Example Subject" was successfully sent.
- `sent: false` indicates the email failed to send.

## IMAP

The Internet Message Access Protocol (IMAP) is a protocol used by email clients to access messages stored on a mail
server, allowing users to view and manage their emails from multiple devices. Unlike POP3, IMAP supports both online and
offline modes, synchronizes email across devices, and allows manipulation of mailboxes (create, delete, and rename) as
well as messages (read, delete, or flag) directly on the server.

| Field                    | Description                                                                                            |
| :----------------------- | :----------------------------------------------------------------------------------------------------- |
| `IMAP host`              | The host URL of the IMAP server.                                                                       |
| `IMAP port`              | The host port of the IMAP server.                                                                      |
| `Cryptographic protocol` | Defines how the connection to the server is secured, `TLS`, `SSL` or `None`. Default is typically TLS. |

### List Emails

Allow users to fetch a list of emails from a specified folder, with customizable sorting and limitation options.

#### Parameters

| Parameter            | Description                                                                                                                                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Max Emails to read` | Specify the maximum number of emails to retrieve. This parameter determines the cap on the number of emails the task will return.                                                                                                                 |
| `Sort emails by`     | <p>Choose the field by which to sort the emails. Supported sorting fields are:</p><p><ul><li>`Sent date`: Sorts emails by the date and time they were sent.</li><li>`Size`: Sorts emails by the size of the email.</li></ul></p>                  |
| `Sort order`         | <p>Define the sort order:</p><p><ul><li>`ASC`: Ascending order, from the oldest or smallest value to the most recent or largest.</li><li>`DESC`: Descending order, from the most recent or largest value to the oldest or smallest.</li></ul></p> |
| `Folder`             | (Optional) the folder to list emails from, default is `INBOX`. For subfolders, use `.` or `/` separated path (ex: `inside/folder` or `inside.folder`)                                                                                             |

#### Sorting and Limiting Behavior

- Emails are initially sorted based on the specified sorting field and order.
- The list is then limited to the number of emails as defined by the Max Emails to read parameter.

For example, sort by Sent date in descending order (DESC) with a limit of one email, to return the most recently sent
email.

#### Response Structure

The task returns a list of emails in JSON format. Each email object contains the following information:

- `messageId`: A unique identifier for the email message.
- `fromAddress`: the email addresses of the sender.
- `subject`: The subject line of the email.
- `size`: The size of the email in bytes.

#### Example Response

Example of a returned JSON array:

```json
[
  {
    "messageId": "RandomId",
    "fromAddress": "msa@communication.microsoft.com",
    "subject": "Example",
    "size": 99865
  },
  {
    "messageId": "RandomId2",
    "fromAddress": "example@camunda.com",
    "subject": "Example",
    "size": 48547
  }
]
```

### Read Email

Retrieve an email's details based on the specified `messageId`.

#### Parameters

| Parameter   | Description                                                                                                                                                                                                      |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessageId` | The unique identifier of the email that must be read.                                                                                                                                                            |
| `Folder`    | (Optional) Specifies the folder from which the email should be retrieved. If not provided, the default folder is `INBOX`. For subfolders, use `.` or `/` separated path (ex: `inside/folder` or `inside.folder`) |

#### Response Structure

The task returns a JSON object containing detailed information about the email:

- `messageId`: The unique identifier of the email message.
- `fromAddress`: The email addresses of the sender.
- `headers` : A list of the email headers.
- `subject`: The subject line of the email.
- `size`: The size of the email (in bytes).
- `plainTextBody`: The plain text version of the email content.
- `htmlBody`: The HTML version of the email content, if it exists.
- `attachments`: A list of all the email's attachments, provided as a document reference.
- `receivedDateTime`: The date and time the email was received.

#### Example Response

The following JSON structure shows an expected response after a successful email retrieval:

```json
{
  "messageId": "MessageId",
  "fromAddress": "example@camunda.com",
  "subject": "Example Subject",
  "size": 99865,
  "plainTextBody": "Any text content",
  "htmlBody": "<html>Any Html Content</html>",
  "headers": [
    {
      "header": "header1",
      "value": "example"
    },
    {
      "header": "header2",
      "value": "test"
    }
  ],
  "attachments": [
    {
      "storeId": "in-memory",
      "documentId": "20f1fd6a-d8ea-403b-813c-e281c1193495",
      "metadata": {
        "contentType": "image/webp; name=305a4816-b3df-4724-acd3-010478a54add.webp",
        "size": 311032,
        "fileName": "305a4816-b3df-4724-acd3-010478a54add.webp"
      },
      "documentType": "camunda"
    }
  ],
  "receivedDateTime": "2024-08-19T06:54:28Z"
}
```

### Delete Email

Delete an email from a specified folder, using the email's unique `messageId`.

#### Parameters

| Parameter   | Description                                                                                                                                                                                                                                    |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessageId` | The identifier of the email message to delete.                                                                                                                                                                                                 |
| `Folder`    | (Optional) Specifies the folder from which the email should be deleted. If this parameter is not supplied, the default folder is assumed to be `INBOX`. For subfolders, use `.` or `/` separated path (ex: `inside/folder` or `inside.folder`) |

#### Response Structure

The task provides a JSON object in the response, indicating the outcome of the deletion request:

- `deleted`: A boolean value that signifies whether the email was successfully deleted (true) or not (false).
- `messageId`: Reiterates the `messageId` of the email that was targeted for deletion.

#### Example Response

The following is an example of the JSON response confirming successful email deletion:

```json
{
  "deleted": true,
  "messageId": "MessageId"
}
```

### Search Emails

Enable users to perform advanced searches within an email inbox by constructing a criteria-based query using a JSON
object. Search supports complex queries that can combine multiple conditions using logical operators.

#### Parameters

A search query is represented as a JSON object. Below is an example of a JSON object that represents a search criteria
using an AND and OR operator to combine multiple conditions:

- `Folder`: (Optional) Specifies the folder from which the email should be deleted. If this parameter is not supplied,
  the default folder is assumed to be `INBOX`. For subfolders, use `.` or `/` separated path (ex: `inside/folder` or
  `inside.folder`)
- `Criteria`: _See below_

```json
{
  "operator": "AND",
  "criteria": [
    {
      "field": "FROM",
      "value": "example@camunda.com"
    },
    {
      "operator": "OR",
      "criteria": [
        {
          "field": "SUBJECT",
          "value": "urgent"
        },
        {
          "field": "SUBJECT",
          "value": "important"
        }
      ]
    }
  ]
}
```

This example query returns emails from "example@camunda.com" with a subject containing either "urgent" or "important".

A simpler query without logical operators might look like the following example:

```json
{
  "field": "FROM",
  "value": "example@camunda.com"
}
```

Search supports the following logical operators:

- **AND**: Returns emails that match all the specified criteria.
- **OR**: Returns emails that match any of the specified criteria.

The following email fields can be used to set search criteria:

- **BODY**: The content of the email body.
- **SUBJECT**: The subject line of the email.
- **FROM**: The email address of the sender.

:::note

When using an operator such as AND or OR, you must also define a criteria array. This array contains the individual
conditions that the search will evaluate against the emails. Each condition within the criteria array is itself a JSON
object with a field and a value.

- If an operator is set, the criteria array must also be defined.
- Each criterion within the criteria array is applied to the specified field based on the value associated with it.

:::

#### Example Response

The following is an example returned response:

```json
[
  { "messageId": "MessageId", "subject": "Important" },
  { "messageId": "MessageId2", "subject": "Urgent" }
]
```

### Move Email

Enable users to transfer an email from one folder to another, streamlining inbox organization.

#### Parameters

| Parameter       | Description                                                                                                                                                                                                                                                     |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessageId`     | The identifier of the email that needs to be moved.                                                                                                                                                                                                             |
| `Source folder` | (Optional) The folder from which the email will be moved. If not specified, the default is INBOX. For subfolders, use `.` or `/` separated path (ex: `inside/folder` or `inside.folder`)                                                                        |
| `Target folder` | The destination folder where the email is placed. To specify a new folder or a nested hierarchy, use `.` or `/` separated path (for example, 'Archive/test' or 'Projects.2023.January'). The system automatically creates any non-existent folders in the path. |

#### Response Structure

Upon successful completion of the move operation, the response contains a JSON object with the following details:

- `messageId`: The `messageId` of the email that was moved.
- `from`: The source folder from which the email was moved.
- `to`: The target folder to which the email has been moved.

#### Example Response

The example below shows the expected JSON response after an email has been successfully moved:

```json
{
  "messageId": "VE1P191MB1101730EEA31B2FEAB320143919A2@VE1P191MB1101.EURP191.PROD.OUTLOOK.COM",
  "from": "INBOX",
  "to": "TEST"
}
```

</TabItem>

<TabItem value='inbound'>

The Email Inbound Connector is an inbound Connector that allows you to connect your BPMN service with any email IMAP
server.

:::caution
This inbound connector only supports working with IMAP server.
:::

## Prerequisites

To use the **Email Inbound Connector**, you must have an IMAP server available to connect to.

:::note
Use Camunda secrets to avoid exposing your sensitive data as plain text.
See [managing secrets](/components/console/manage-clusters/manage-secrets.md).
:::

## Authentication

You can authenticate to a mail server as follows.

### Simple Authentication

This method allows the user to connect to any IMAP server using an email address and password.

#### Parameters

| Parameter  | Description                                                                                                                                                                |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username` | Enter your full email address (for example, user@example.com) or the username provided by your email service. This is used to authenticate your access to the mail server. |
| `password` | Enter the password for your email account. Keep your password secure and do not share it with others.                                                                      |

## Listener information

This inbound connector creates a new process each time a new email is received.

| Parameter               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Folder`                | <p>(Optional) Define the folder the inbound connector will monitor.</p><p><ul><li>If not specified, the default folder is set to `INBOX`.</li><li>For subfolders, use `.` or `/` separated path (for example, `inside/folder` or `inside.folder`)</li></ul></p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Polling Wait Time`     | Set the interval between each polling operation. See [timer events](/docs/components/modeler/bpmn/timer-events/timer-events.md#time-duration) for more information on time duration and correct format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Polling Configuration` | <p>This section contains settings related to the polling behavior of the connector.</p><p><ul><li><code>Poll All Emails</code>: Poll every email found in the specified folder.<ul><li><p><code>Move to Another Folder After Processing</code>: Move processed emails to a specific folder.</p><ul><li><p><code>Folder</code>: Specify the target folder to move processed emails to. To specify a new folder or a nested hierarchy, use a `.` or `/` separated path (for example, <code>Archive/test</code> or <code>Projects.2023.January</code>). Non-existent folders in the path are automatically created.</p></li></ul></li><li><p><code>Delete After Processing</code>: Permanently delete each email after processing.</p></li></ul></li></ul><ul><li>`Poll Unseen Emails`: Poll only emails not marked as read in the specified folder.<ul><li><p>`Move to Another Folder After Processing`: Move processed unseen emails to a specific folder.</p><ul><li>`Folder`: Specify the target folder to move processed unseen emails to. To specify a new folder or a nested hierarchy, use a `.` or `/` separated path (for example, <code>Archive/test</code> or <code>Projects.2023.January</code>). Non-existent folders in the path are automatically created.</li></ul></li><li><p>`Delete After Processing`: Permanently delete unseen emails from the folder after processing.</p></li><li><p>`Mark as Read After Processing`: Mark each unseen email as read after it is processed.</p></li></ul></li></ul></p> |

## Response Structure

The task returns a JSON object containing detailed information about the email:

- `messageId`: The unique identifier of the email message.
- `fromAddress`: The email addresses of the sender.
- `headers` : A list of the email headers.
- `subject`: The subject line of the email.
- `size`: The size of the email (in bytes).
- `plainTextBody`: The plain text version of the email content.
- `htmlBody`: The HTML version of the email content, if it exists.
- `attachments` A list of document reference
- `receivedDateTime`: The date and time the email was received.

#### Example Response

The following example JSON response shows the data structure produced when an email triggers the creation of a process
instance:

```json
{
  "messageId": "messageId",
  "fromAddress": "example@camunda.com",
  "subject": "Urgent Test",
  "size": 65646,
  "plainTextBody": "Hey how are you?\r\n",
  "htmlBody": "<html>Hello</html>",
  "headers": [
    {
      "header": "header1",
      "value": "example"
    },
    {
      "header": "header2",
      "value": "test"
    }
  ],
  "attachments": [
    {
      "storeId": "in-memory",
      "documentId": "20f1fd6a-d8ea-403b-813c-e281c1193495",
      "metadata": {
        "contentType": "image/webp; name=305a4816-b3df-4724-acd3-010478a54add.webp",
        "size": 311032,
        "fileName": "305a4816-b3df-4724-acd3-010478a54add.webp"
      },
      "documentType": "camunda"
    }
  ],
  "receivedDateTime": "2024-08-19T06:54:28Z"
}
```

This response includes essential email details such as the `messageId`, sender addresses, subject, size, and the content
of the email both in plain text and HTML format. This information can be used by the process for various workflows, such
as prioritizing tasks, content analysis, and automated responses.

## Activation condition

The optional **Activation condition** field allows you to specify a Friendly Enough Expression
Language ([FEEL](/components/modeler/feel/what-is-feel.md)) expression to control when this Connector should trigger a
process instance. This condition acts as a filter, allowing the process to be initiated only when certain criteria are
met by the incoming email.

For example, the FEEL expression `subject = "urgent"` ensures that the process is only triggered if the
subject of the incoming email matches "urgent". If this field is left blank, the process is triggered for every email
received by the connector.

## Correlation

The **Correlation** section allows you to configure the message correlation parameters.

### Correlation key

- **Correlation key (process)** is a FEEL expression that defines the correlation key for the subscription. This
  corresponds to the **Correlation key** property of a regular **message intermediate catch event**.
- **Correlation key (payload)** is a FEEL expression used to extract the correlation key from the incoming message. This
  expression is evaluated in the Connector Runtime and the result is used to correlate the message.

For example, given that your correlation key is defined with `myCorrelationKey` process variable, and the incoming email
message contains `value:{correlationKey:myValue}`, your correlation key settings will look like this:

- **Correlation key (process)**: `=myCorrelationKey`
- **Correlation key (payload)**: `=message.plainTextBody.correlationKey`

You can also use the key of the message to accomplish this in the **Correlation key (payload)** field with `=key`.

:::info
To learn more about correlation keys, see [messages](../../../concepts/messages).
:::

### Message ID expression

The optional **Message ID expression** field allows you to extract the message ID from the incoming message.

- The message ID serves as a unique identifier for the message and is used for message correlation.
- This expression is evaluated in the Connector Runtime and the result used to correlate the message.

In most cases, you do not need to configure the **Message ID expression**. However, it is useful if you want to ensure
message deduplication or achieve a specific message correlation behavior.

:::info
To learn more about how message IDs influence message correlation,
see [messages](../../../concepts/messages#message-correlation-overview).
:::

For example, if you want to set the message ID to the value of the `messageId` field in the incoming message, you can
configure the **Message ID expression** as follows:

```
= message.messageId
```

### Message TTL

The optional **Message TTL** field allows you to set the time-to-live (TTL) for the correlated messages.

- TTL defines the time for which the message is buffered in Zeebe before being correlated to the process instance (if it
  cannot be correlated immediately).
- The value is specified as an ISO 8601 duration. For example, `PT1H` sets the TTL to one hour.

:::info
To learn more about TTL in Zeebe, see [message correlation](../../../concepts/messages#message-buffering).
:::

## Deduplication

The **Deduplication** section allows you to configure the Connector deduplication parameters.

- **Connector deduplication** is a mechanism in the Connector Runtime that determines how many email listeners are
  created if there are multiple occurrences of the **Email Listener Connector** in a BPMN diagram. This is different to
  **message deduplication**.

- By default, the Connector runtime deduplicates Connectors based on properties, so elements with the same subscription
  properties only result in one subscription.

To customize the deduplication behavior, select the **Manual mode** checkbox and configure the custom deduplication ID.

:::info
To learn more about deduplication, see [deduplication](../use-connectors/inbound.md#connector-deduplication).
:::

</TabItem>

</Tabs>
