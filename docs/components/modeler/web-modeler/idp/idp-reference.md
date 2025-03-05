---
id: idp-reference
title: IDP reference
description: "Technical reference information for intelligent document processing (IDP), such as technical architecture, supported document file formats, and document storage."
---

import IdpArchitectureImg from './img/idp-architecture-diagram.png';
import IdpSecretsImg from './img/idp-connector-secrets.png';
import IdpIconPassImg from './img/idp-validation-icon-pass.png';
import IdpIconCautionImg from './img/idp-validation-icon-caution.png';
import IdpIconFailImg from './img/idp-validation-icon-fail.png';
import IdpValidationExampleImg from './img/idp-validation-example.png';

Technical reference information for IDP, including technical architecture, supported documents, and known limitations.

## Technical architecture {#architecture}

IDP offers a composable architecture that allows you to customize and extend IDP capabilities as needed. This flexibility enables you to adapt quickly to evolving business needs while maintaining a streamlined and manageable system.

IDP allows you to create, configure, and publish a **document extraction template**. This is a type of [connector template](/components/connectors/custom-built-connectors/connector-templates.md).

<img src={IdpArchitectureImg} alt="Architecture diagram of IDP" width="500px" style={{border: 'none', padding: '0', marginTop: '0', backgroundColor: 'transparent'}}/>

The document extraction template integrates with Camunda document handling connectors and APIs such as [Amazon S3](/components/connectors/out-of-the-box-connectors/amazon-s3.md), [Amazon Textract](/components/connectors/out-of-the-box-connectors/amazon-textract.md), [Amazon Comprehend](/components/connectors/out-of-the-box-connectors/amazon-comprehend.md), and [Amazon Bedrock](/components/connectors/out-of-the-box-connectors/amazon-bedrock.md) to retrieve, analyze, and process documents.

1. **Document upload**: The template accepts uploaded documents as input. These documents can be uploaded to a local document store, and their references used in the extraction process. For example, the connector uploads the document to an Amazon S3 bucket for extraction.

1. **Amazon Textract**: Uploaded documents are analyzed by Amazon Textract, which extracts text data and returns the results. The template configuration includes specifying the document, the S3 bucket name for temporary storage during Amazon Textract analysis, and other required parameters such as extraction fields and Amazon Bedrock Converse parameters.

1. **Amazon Bedrock**: Your [extraction field](idp-key-concepts.md#extraction-fields) prompts are used by Amazon Bedrock to extract data from the document. The extracted content is mapped to process variables, and the results stored in a specified result variable.

:::note

- You may encounter errors during extraction and validation if you have not added your Amazon AWS IAM account `access key` and `secret key` as a [connector secret](/components/console/manage-clusters/manage-secrets.md) to your cluster. See [configuring IDP](idp-configuration.md).
- Learn more about [Camunda document handling](/components/concepts/document-handling.md).

:::

### Document storage {#storage}

IDP stores documents as follows during the different extraction stages:

- Web Modeler: [Uploaded sample documents](idp-unstructured-extraction.md#upload-documents) are stored within Web Modeler itself (SaaS) or the database (Self-Managed).
- Cluster: During [extraction testing](idp-unstructured-extraction.md#extract-fields) (for example, when you click **Extract document**) the document is briefly stored in the cluster.
- Extraction: Finally, when you extract content using a document extraction template, it is stored in an [Amazon AWS S3 bucket](idp-configuration.md#prerequisites), where it can be accessed by AWS Textract.

## Document file formats {#file-formats}

IDP currently only supports data extraction from the following uploaded document file formats.

| File format | Description                                                                                                                                                                                                                                                                                                           |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p>PDF</p>  | <p><ul><li>PDF documents must not be password protected.</li><li><p>Maximum document file size is 4MB for test extraction.</p></li><li><p>Both text and image content can be extracted from a PDF document. For example, data can be extracted from a scanned image that has been converted to PDF.</p></li></ul></p> |

## Document language support {#languages}

IDP supports data extraction and processing of documents in multiple languages.

IDP integrates with [Amazon Textract](/components/connectors/out-of-the-box-connectors/amazon-textract.md), which supports multilingual text extraction and is capable of detecting and extracting text in multiple languages. This ensures that the extracted text can be accurately mapped to process variables and used within your workflows, regardless of document language.

:::info
For example, as of February 2025, Amazon Textract can detect printed text and handwriting from the Standard English alphabet and ASCII symbols, and can extract printed text, forms and tables in English, German, French, Spanish, Italian and Portuguese. Refer to [Amazon Textract FAQs](https://aws.amazon.com/textract/faqs/) for currently supported languages.
:::

## Extraction field data types {#data-types}

Specify the [extraction field](idp-key-concepts.md#extraction-fields) data type to indicate to the LLM what type of data it should be trying to extract. This helps the LLM more accurately analyze and extract the correct data.

For example, if you want to extract an expected numeric value (such as a monetary value), select the `Number` data type for the extraction field.

### Supported data types

You can specify the following extraction field data types.

| Data type | Description                                                         |
| :-------- | :------------------------------------------------------------------ |
| Boolean   | The LLM should expect a true or false value, such as "yes" or "no". |
| Number    | The LLM should expect to extract a numeric value.                   |
| String    | The LLM should expect to extract a sequence of characters.          |

## Extraction models {#extraction-models}

You can choose from the following supported LLM extraction models during [data extraction](idp-unstructured-extraction.md#extract-fields).

| Extraction model     | Model provider                             | Documentation                                                                                           |
| :------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| Claude 3.5 Sonnet    | [Anthropic](https://www.anthropic.com/)    | [Anthropic's Claude in Amazon Bedrock](https://aws.amazon.com/bedrock/claude/)                          |
| Claude 3 Sonnet      | [Anthropic](https://www.anthropic.com/)    | [Anthropic's Claude in Amazon Bedrock](https://aws.amazon.com/bedrock/claude/)                          |
| Claude 3 Haiku       | [Anthropic](https://www.anthropic.com/)    | [Anthropic's Claude in Amazon Bedrock](https://aws.amazon.com/bedrock/claude/)                          |
| Llama 3 70B Instruct | [Meta](https://www.meta.com/gb/)           | [Meta's Llama in Amazon Bedrock](https://aws.amazon.com/bedrock/llama/)                                 |
| Llama 3 8B Instruct  | [Meta](https://www.meta.com/gb/)           | [Meta's Llama in Amazon Bedrock](https://aws.amazon.com/bedrock/llama/)                                 |
| Titan Text Premier   | [Amazon AWS](https://docs.aws.amazon.com/) | [Amazon Titan Text models](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-text-models.html) |

## Validation status {#status}

During validation, a validation status is shown for extraction fields to indicate the accuracy of the extracted data.

| Icon                                                                        | Status  | Description                                                                                                                     |
| :-------------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------ |
| <img src={IdpIconPassImg} alt="Pass icon" className="inline-image" />       | Pass    | The document validation passed with accurate and expected results.                                                              |
| <img src={IdpIconCautionImg} alt="Caution icon" className="inline-image" /> | Caution | A test case is missing for comparison. Click **Save test case** to create a test case for this field.                           |
| <img src={IdpIconFailImg} alt="Fail icon" className="inline-image" />       | Fail    | The validation results do not match the expected output for the document. Click **Review document** to investigate and resolve. |

### Example

The following example shows the results of a partially successful extraction against three documents.

<img src={IdpValidationExampleImg} alt="Example validation results table" />

The expanded `contract_start_date` field shows that each document returned different validation results.

- The first document passed the validation, with the **Extracted value** matching the **Expected test case output**.
- The second document could not be validated as a test case was not found for comparison. Click **Save test case** to create a test case for the document.
- The third document failed validation as the **Extracted value** did not match the **Expected test case output**. Click **Review document** to open the document again and check the prompt for this field.

<!-- ## Known limitations

Content -->
