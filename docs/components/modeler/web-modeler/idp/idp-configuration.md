---
id: idp-configuration
title: Configure IDP
description: "Set up and configure intelligent document processing (IDP) in Camunda 8 SaaS and Self-Managed."
---

import IdpSecretsImg from './img/idp-connector-secrets.png';
import TickImg from '/static/img/icon-list-tick.png';
import CrossImg from '/static/img/icon-list-cross.png';

Configure IDP for your Camunda 8 setup and make sure IDP can access the required components and credentials.

## Prerequisites

The following prerequisites are required for IDP:

| Prerequisite              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon Web Services (AWS) | <ul><li><p>Create a valid [AWS Identity and Access Management (IAM) user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html) with permissions configured to allow access to Amazon Bedrock, AWS S3, and Amazon Textract (for example, `AmazonBedrockFullAccess`).</p></li><li><p>Obtain and store the [access key pair](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) (_access key_ and _secret access key_) for this IAM user. These are required during IDP configuration.</p></li><li><p>Create an [Amazon AWS S3 bucket](https://aws.amazon.com/s3/) named `idp-extraction-connector` that can be used by IDP for document storage during document analysis and extraction.</p></li></ul> |
| Web Modeler               | <ul><li><p>Web Modeler is required to create, manage, publish, and integrate [IDP applications](idp-applications.md) and [document extraction](idp-document-extraction.md) templates.</p></li><li><p>IDP does not support Desktop Modeler.</p></li><li><p>**Camunda 8 Self-Managed**: Check you have [installed](/self-managed/modeler/web-modeler/installation.md) and [configured](/self-managed/modeler/web-modeler/configuration/configuration.md) Web Modeler.</p></li></ul>                                                                                                                                                                                                                                                              |
| Connectors                | <ul><li><p>The following connectors are required by IDP:<ul><li><p>[Amazon S3](/components/connectors/out-of-the-box-connectors/amazon-s3.md): Used for document storage during analysis and extraction.</p></li><li><p>[Amazon Textract](/components/connectors/out-of-the-box-connectors/amazon-textract.md): Used to extract text from documents.</p></li><li><p>[Amazon Bedrock](/components/connectors/out-of-the-box-connectors/amazon-bedrock.md): Used to extract data from documents.</p></li></ul></p></li><li><p>**Camunda 8 Self-Managed**: Check you have [installed and deployed](/self-managed/connectors-deployment/install-and-start.md) these connectors.</p></li></ul>                                                      |

:::note
As Web Modeler is required by IDP, Camunda 8 Run is not currently supported for use with IDP. To use IDP in a non-SaaS Camunda setup, [install](/self-managed/modeler/web-modeler/installation.md) and [configure](/self-managed/modeler/web-modeler/configuration/configuration.md) Web Modeler with Camunda 8 Self-Managed.
:::

## Configure IDP

Once you have completed all the required prerequisites, configure IDP in a `dev` cluster as follows:

### Add AWS connector secrets to cluster {#aws-secrets}

Add your Amazon AWS IAM user _access key_ and _secret key_ as [connector secrets](/components/console/manage-clusters/manage-secrets.md) to the cluster, using the following names:

- _Access key_: `IDP_AWS_ACCESSKEY`
- _Secret key_: `IDP_AWS_SECRETKEY`

<img src={IdpSecretsImg} alt="Connector secrets" style={{width: '750px'}} />

:::note
You can rename these connector secrets if you want to change the testing bucket used in other environments (such as `test`, `stage` or `prod`). If you do this, you must also change these names to match within the **Authentication** section of the Properties panel for any related published document extraction templates.
:::
