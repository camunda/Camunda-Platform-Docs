---
id: idp
title: Intelligent document processing
description: "Use intelligent document processing (IDP) to integrate automated document processing into your end-to-end processes."
---

import IdpOverviewImg from './img/idp-overview-diagram.png';
import IdpSecretsImg from './idp/img/idp-connector-secrets.png';

Use intelligent document processing (IDP) to integrate automated document processing into your end-to-end processes.

## About IDP

IDP uses artificial intelligence (AI) and machine learning (ML) to identify, extract, and organize data from your structured and unstructured documents into a structured format you can use in your processes.

For example, you can use IDP to extract data from invoices and other document types in your document processing workflow.

<img src={IdpOverviewImg} alt="An overview of intelligent document processing" style={{border: 'none', padding: '0', marginTop: '0', backgroundColor: 'transparent'}} />

## Configure IDP

[Configure IDP](idp/idp-configuration.md) for your Camunda 8 setup to make sure IDP can access the required components and credentials.

For example, IDP requires Web Modeler to be able to create and manage IDP applications and document extraction projects.

## Get started with IDP

Once configured, you can start using IDP in your processes:

1. Create an [IDP application](idp/idp-applications.md) in which to store and manage a set of related IDP projects.

1. Create and publish a [document extraction](idp/idp-document-extraction.md) template for each type of document you want to extract data from.

1. [Integrate your published document extraction template](idp/idp-integrate.md) into your processes in Web Modeler.

<!-- 1. Create and publish your IDP projects in your IDP application folder:

   - Create a [document extraction](idp/idp-document-extraction.md) project to identify and extract data from a single type of document (for example, an invoice).

   - Create a [document automation](idp/idp-document-automation.md) project to automatically extract data from larger, more complex documents (for example, a multi-page PDF document made up of many types of documents and data). This project type is based on and requires one or more linked document extraction project(s). -->

:::info
New to IDP? See [IDP concepts](idp/idp-key-concepts.md) to learn about key IDP concepts and terms.
:::
