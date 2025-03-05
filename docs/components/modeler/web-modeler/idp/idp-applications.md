---
id: idp-applications
title: IDP applications
description: "Create and manage your intelligent document processing document extraction templates in an IDP application folder."
---

import IdpApplicationImg from './img/idp-application.png';
import IdpApplicationModalImg from './img/idp-application-modal.png';

Create and manage your IDP document extraction templates in an **IDP application**.

<img src={IdpApplicationImg} alt="IDP application screen" />

## Create an IDP application

To create an IDP application:

1. In a Web Modeler project, select **Create new** > **IDP application** to open the **Create an IDP application** modal.
   <img src={IdpApplicationModalImg} alt="IDP application screen" width="550px"/>
   - **Name**: Enter a name for the IDP application.
   - **Select a cluster**: Select the cluster you want to use for modeling and testing your document extraction.
1. Click **Create** to create the IDP application.

1. You can now create [document extraction](idp-document-extraction.md) templates inside your IDP application folder.

<!-- 1. You can now create [document extraction](idp-document-extraction.md) and [document automation](idp-document-automation.md) projects inside your IDP application folder. -->

:::note
Camunda recommends using a development (dev) cluster for your IDP applications.
:::

## IDP application clusters

The following requirements and limitations apply to IDP application clusters:

| Note              | Description                                                                                                                                                                                                                              |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster health    | IDP applications and projects are only fully operational when linked to a healthy, active cluster. You can select an unstable or unhealthy cluster when first creating an IDP application, and change to a stable cluster when required. |
| Document handling | When creating an IDP application folder, you can only select a cluster that supports Camunda document handling. For example, a cluster that is version 8.7 or higher.                                                                    |
| Changing cluster  | You cannot change the cluster used by an IDP application once it has been created.                                                                                                                                                       |
