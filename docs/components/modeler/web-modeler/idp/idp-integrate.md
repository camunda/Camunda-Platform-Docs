---
id: idp-integrate
title: Integrate IDP into your processes
description: "Integrate IDP into your end-to-end processes in Modeler."
---

import IdpElementImg from './img/idp-diagram-element.png';

You can integrate your published IDP projects into your end-to-end processes in Modeler.

## Create and configure an IDP task

You can apply a published IDP project as an IDP extraction connector to a task or event via the append menu. For example:

<img src={IdpElementImg} alt="An overview of intelligent document processing" style={{border: 'none', padding: '0', marginTop: '0', backgroundColor: 'transparent'}} />

- **From the canvas:** Select an element and click the **Change element** icon to change an existing element, or use the append feature to add a new element to the diagram.
- **From the properties panel:** Navigate to the **Template** section and click **Select**.
- **From the side palette:** Click the **Create element** icon.

You can then configure the IDP extraction connector in the properties panel, via the following sections.

## Input message data

### Document

Specify the `document` object variable used for handling documents in your Amazon AWS S3 bucket, provided as a [FEEL expression](/components/modeler/feel/what-is-feel.md) with the document reference.

### AWS S3 Bucket name

Specify the name of the Amazon AWS S3 bucket where documents can be temporarily stored during Amazon Textract analysis.

For example, a typical IDP configuration requires an Amazon AWS S3 bucket named `idp-extraction-connector` for document storage during test extraction.

## Output mapping

Specify the process variables that you want to map and export the IDP extraction connector response into.

:::info
To learn more about output mapping, see [variable/response mapping](/components/connectors/use-connectors/index.md#variableresponse-mapping).
:::

### Result variable

You can export the complete IDP extraction connector response into a dedicated variable that you can then access anywhere in a process. To do this, enter a unique dedicated variable name in the **Result variable** field.

For example, ...

### Result expression

In addition, you can choose to unpack the content of the response into multiple process variables using the **Result expression** field, as a [FEEL Context Expression](/components/concepts/expressions/).

For example:

`Code block`

## Error handling

If an error occurs, the IDP extraction connector throws an error and includes the error response in the error variable in Operate.

The following example shows the error variable in an error response:

`Code block`

### Error expression

You can handle an IDP extraction connector error using an Error Boundary Event and the following error expression:

`Code block`

:::info
To learn more about error handling using error expressions, see [error expression](/components/connectors/use-connectors/index.md#error-expression).
:::

## Retries

### Retries

Specify the number of times the IDP extraction connector repeats execution if it fails.

### Retry backoff

Specify a custom **Retry backoff** interval between retries instead of the default behavior of retrying immediately.

:::info
To learn more about customizing retries and retry backoff values, see [retries](/components/connectors/use-connectors/outbound.md#retries).
:::

## Execution listeners

Add and manage [execution listeners](/components/concepts/execution-listeners.md) to allow users to react to various events in the workflow execution lifecycle by executing custom logic.

For example, ...
