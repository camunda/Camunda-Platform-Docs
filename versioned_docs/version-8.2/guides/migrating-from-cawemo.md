---
id: migrating-from-cawemo
title: Migrating diagrams from Cawemo
description: "Migrating diagrams from Cawemo to Camunda Platform 8 Web Modeler"
---

This guide steps through how to migrate BPMN diagrams created in Cawemo to Camunda Platform 8 [Web Modeler](https://modeler.cloud.camunda.io/).

You should consider migrating diagrams from Cawemo to Camunda Platform 8 Web Modeler if:

- You want to continue working on your diagrams on the latest Camunda Platform version.
- You are exploring automating your processes.
- You are in need of certain features that can only be found in Camunda Platform 8 (e.g. [BPMN message buffering](https://docs.camunda.io/docs/components/concepts/messages/#message-buffering), big [multi-instance constructs](https://docs.camunda.io/docs/components/modeler/bpmn/multi-instance/), the [Connectors framework](https://docs.camunda.io/docs/components/connectors/introduction-to-connectors/), or the improved [collaboration features](https://docs.camunda.io/docs/components/modeler/web-modeler/collaboration/) in Web Modeler).

## Prerequisites

- Ensure you have a valid [Camunda Platform 8 account](https://docs.camunda.io/docs/guides/getting-started/), or sign up if you still need one.
- A BPMN diagram in your Cawemo account.

## Migrate your BPMN diagram

Take the following steps to migrate your BPMN diagram in Cawemo to Camunda Platform 8 [Web Modeler](https://docs.camunda.io/docs/components/modeler/web-modeler/launch-cloud-modeler/):

1. Log in to Cawemo.
2. Click the **Project** folder on the **Home** page of the BPMN diagram you want to transfer.
3. Click on the BPMN diagram you want to transfer.

:::caution
If the BPMN file has been uploaded to Cawemo from Desktop Modeler for execution on Camunda Platform 7, the file cannot be uploaded to Web Modeler.
:::

4. Click **Download** or **export**.
5. Click **Download as BPMN 2.0 XML**.
6. Log in to Camunda Platform 8.
7. Click **Modeler** to open Web Modeler.
8. Open the project you want to transfer your BPMN file to or create a new project by clicking **New project**.
9. Click **New** > **Upload files**.
10. Open the BPMN XML file downloaded from Cawemo.

:::note
While unsupported elements are imported in Web Modeler, they are not supported for deployment and will be highlighted in the error panel.
:::

## Additional resources

Not all elements in Cawemo are supported in Camunda Platform 8 Web Modeler. Find details on BPMN coverage in Camunda Platform 8 in the [BPMN coverage documentation](https://docs.camunda.io/docs/components/modeler/bpmn/bpmn-coverage/). We are investing in supporting the elements currently available on Camunda Platform 7.

## Next steps

Learn more about [migrating from Camunda 7 to Camunda 8](https://docs.camunda.io/docs/guides/migrating-from-camunda-platform-7/).

:::note
When you get the error `The following 1 file is invalid and can't be uploaded: ""` when uploading your BPMN file.

It means a BPMN file for execution on Camunda Platform 7 created with Desktop Modeler - or another BPM tool using BPMN to execute processes - has been uploaded to Cawemo. Find details in [Migrating from Camunda Platform 7 documentation under migration overview](https://docs.camunda.io/docs/guides/migrating-from-camunda-platform-7/#migration-overview) to solve the error.
:::
