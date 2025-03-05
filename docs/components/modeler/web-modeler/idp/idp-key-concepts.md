---
id: idp-key-concepts
title: IDP concepts
description: "Key intelligent document processing (IDP) concepts and terms, such as the difference between structured and unstructured documents."
---

import IdpStructuredDocumentImg from './img/idp-structured-document.png';
import IdpUnstructuredDocumentImg from './img/idp-unstructured-document.png';
import IdpExtractionFieldImg from './img/idp-extraction-field.png';

When using IDP it is helpful to understand the following key concepts and terms.

## Structured and unstructured documents {#documents}

<!-- Your choice of extraction method depends on whether your documents contain structured or unstructured data. -->

Documents are typically classified as containing either structured or unstructured data.

### Structured documents {#structured}

<div class="double-column-container">
<div class="double-column-left"  style={{marginRight: '30px'}}>

<img src={IdpStructuredDocumentImg} alt="Example structured document" width="600px" style={{border: 'none', padding: '0', marginTop: '0', backgroundColor: 'transparent'}}/>

</div>
<div class="double-column-right">

Structured documents have a predefined, consistent layout and fixed format, such as rows and columns in a database or spreadsheet, or fields in a standardized form.

Data in a structured document has a fixed location. For example, the ID, date, and company name are always located in the same place.

Example structured documents include:

- Invoices/ customer records
- Forms
- Identity documents

<!-- Use [structured data extraction](idp-structured-extraction.md) to extract data from this type of document. -->

</div>
</div>

### Unstructured documents {#unstructured}

<div class="double-column-container">
<div class="double-column-left"  style={{marginRight: '30px'}}>

<img src={IdpUnstructuredDocumentImg} alt="Example unstructured document" width="600px" style={{border: 'none', padding: '0', marginTop: '0', backgroundColor: 'transparent'}}/>

</div>
<div class="double-column-right">

Unstructured documents have a less defined, free-form layout that can be more difficult to extract structured data from, such as free-text paragraphs where key information is located in unpredictable places.

IDP uses an [LLM foundation model](#llms) to extract data from this document type.

Example unstructured documents include:

- Emails
- Reports
- Memos

<!-- Use [unstructured data extraction](idp-unstructured-extraction.md) to extract data from this document type. -->

</div>
</div>

## Document classification {#classification}

Document classification is performed as part of document automation.

<!-- Document classification is performed as part of [document automation](idp-document-automation.md). -->

- Documents are analyzed, classified, and assigned to the relevant [document extraction](idp-document-extraction.md) template, based on the document content.

- Classification ensures that documents processed through IDP are organized into the correct type, so that extracted data is assigned/mapped to the correct property.
- Classification accuracy is improved with a well-defined taxonomy (set of extraction fields) and a set of example documents that accurately represents each type of document you want to process.

## Extraction model/Large Language Models (LLM) {#llms}

LLM Foundation models are large-scale, pre-trained AI models that can be adapted for various document processing tasks without extensive retraining.

- For IDP, these models serve as a powerful base for extracting, understanding, and processing data from diverse document types. Algorithms are used to learn document patterns and to improve data extraction accuracy over time.

- IDP allows you to work with and test different extraction models until you find the model that best suits your budget and accuracy requirements.

- See [extraction models](idp-reference.md#extraction-models) for a list of currently supported LLM extraction models.

## Extraction fields {#fields}

Extraction fields are the data fields you want to extract from a document, such as an invoice ID, date, customer name, and so on.

- You must add a separate field for each piece of information you want to extract from a document.
- For example, for an invoice, add a separate field for the invoice ID, date, customer name, invoice amount, and so on.

<img src={IdpExtractionFieldImg} alt="Example structured document" width="800px"/>

:::info
To learn more about data types, see [extraction field data types](idp-reference.md#data-types).
:::
