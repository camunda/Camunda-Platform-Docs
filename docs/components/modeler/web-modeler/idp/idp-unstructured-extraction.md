---
id: idp-unstructured-extraction
title: Extract unstructured data
description: "Unstructured data extraction allows you to extract data from unstructured documents."
---

import IdpUnstructuredDataExtractionImg from './img/idp-unstructured-data-extraction-screen.png';
import IdpUploadDocumentsUnstructuredImg from './img/idp-upload-documents-unstructured.png';
import IdpExtractionFieldsImg from './img/idp-extraction-fields-unstructured.png';
import IdpValidationResultsImg from './img/idp-validation-results.png';
import IdpPublishProjectImg from './img/idp-publish-unstructured-project.png';
import IdpPublishProjectModalImg from './img/idp-publish-modal.png';
import IdpExtractionFieldsDetailsImg from './img/idp-extraction-fields.png';
import IdpValidationResultsDetailImg from './img/idp-validation-results-detail.png';
import IdpValidationResultsSummaryImg from './img/idp-summary.png';
import IdpVersionsImg from './img/idp-versions.png';

Use this extraction method to extract data from [unstructured documents](idp-key-concepts.md#unstructured-documents).

## Data extraction steps {#date-extraction}

Complete the following steps to configure and publish an unstructured data document extraction template:

1. [Upload documents](#upload-documents): Upload a set of sample documents to use for training the extraction model.
1. [Extract fields](#extract-fields): Add and configure the [extraction fields](idp-key-concepts.md#fields) you want to use to extract data.
1. [Validate extraction](#validate-extraction): Test and evaluate the data extraction results, and publish the document extraction template.

## Step 1: Upload documents {#upload-documents}

Start by uploading a set of sample PDF documents that represent the specific document type you want to extract data from. You will use these documents throughout the data extraction process.

<img src={IdpUploadDocumentsUnstructuredImg} alt="Unstructured data extraction screen" />

To upload your sample document(s):

1. Click **Upload documents** to browse for and upload your sample document(s).
1. Once you have finished uploading your sample document(s) and want to start testing data extraction, either:
   - Select the **Extract fields** tab.
   - Click the **Extract** icon for the document you want to extract data from.

### Document upload guidelines {#document-upload-guidelines}

Start by uploading a sample document that contains all the data fields you want to extract for this type of document.

- If a single document does not include all the data fields you require, upload multiple documents to cover all variations of the document type. The number and range of documents you need to upload depends on the complexity of your unstructured data and your requirements.

- For example, you must upload at least one sample document for each variation of a document type. This should provide enough extraction accuracy if it is an exact representation of the specific type of document, with no variations in layout or content. However, it is more likely that you will need to upload multiple documents to ensure acceptable extraction accuracy.

- When choosing your sample documents, variation is important to ensure the system captures the full range of document types it will encounter. As a general guideline, Camunda recommends starting with three to five documents, and uploading more as needed to represent the full range of possible data types.

## Step 2: Extract fields {#extract-fields}

On the **Extract fields** tab, add the data [extraction fields](idp-key-concepts.md#fields) you want to populate with data from your document(s).

<img src={IdpExtractionFieldsImg} alt="Unstructured data extraction screen" />

- Add a separate field for each piece of information you want to extract. For example, for an invoice, add a field for the invoice ID, date, customer name, amount, and so on.
- You can then extract data from your sample document(s) using your chosen LLM foundation model, edit and refine your fields, and save the extracted data as a test case to compare outcomes across different LLM models.

### Add extraction fields {#add-fields}

Add an extraction field for each piece of data you want to extract from your document(s).

<img src={IdpExtractionFieldsDetailsImg} alt="Data extraction fields" width="650px"/>

1. **Field name**: Enter a descriptive name for the field.
   - Example: "invoice_id” or "invoiceId".
   - The name format should follow [FEEL naming convention](/components/modeler/feel/language-guide/feel-variables.md#variable-names), for example it is case sensitive and should not include spaces.
   - The **Field name** is used as an output variable in a BPMN process.
1. **Type**: Select the data type you want/expect the field to be populated with. This helps the LLM more accurately extract data.
   - Example: “Number” for a monetary field (“invoice_amount”).
   - See [extraction field data types](idp-reference.md#data-types).
1. **Prompt**: Enter a clear and specific prompt to guide the LLM in accurately extracting data.
   - Example: For an "invoice_date" field, you might use "The date when the invoice was issued".
   - Try and describe the expected outcome in the prompt in clear and concise terms. For guidance and best practice when writing prompts, refer to the official documentation for your chosen LLM.
1. Click **Add** to add the field.
1. Repeat the process until you have added all required extraction fields.

:::note
You can edit and delete extraction fields at any time. Click the three vertical dots next to the field to open the Options menu.
:::

### Extract data and save as test case {#extract-data}

Once you have added your extraction fields, select an LLM model and test the data extraction.

1. **Extraction model**: Select the LLM model you want to use.
1. Select the document you want to test the data extraction against.
1. Click **Extract document**.
1. The **Extraction fields** are populated with the extracted document data.
   - Check the extracted data is accurate and matches what you require from the document.
   - For incorrect field results, edit the field **Prompt** and retry the data extraction until the results are accurate.
   - Add additional fields as required during testing.
1. Click **Save as test case** to save the results as a test case.
   - The **Expected output** for each field is now shown below the actual extracted value.
   - Any unexpected extraction results for the field are highlighted.
1. (Optional) Test different LLM models with this test case to compare results and determine which model produces the most accurate extraction.
1. Repeat the process of creating and evaluating a test case for your other uploaded sample documents.
1. Once you are ready to validate your data extraction configuration, select the **Validate extraction** tab.

:::tip

- You will achieve different results using different [extraction models](idp-reference.md#extraction-models). Test different models until you find the one that best suits your budget and accuracy requirements.
- You can save and overwrite a test case at any time with your latest results.

:::

## Step 3: Validate extraction {#validate-extraction}

On the **Validate extraction** tab, test and validate the configured data extraction against your uploaded documents. This step evaluates the data extraction results produced by the LLM model using your extraction fields and prompts.

<img src={IdpValidationResultsImg} alt="Validate extraction screen" />

### Validate extraction

To validate the data extraction:

1. Select the **Project extraction model** you want to use for validation.
1. Click **Test documents** to run the extraction validation against your uploaded sample documents.
1. The extraction validation results are shown in the **Test Case Results** column.
   <img src={IdpValidationResultsDetailImg} alt="Extraction validation results" />
   - The [validation status](idp-reference.md#status) is shown for each field to indicate the accuracy of the data extracted from each document. For example, if the extracted value matches the expected test case output, it is shown as a “Pass”.
   - Click on a field to expand the detailed results for each individual document.
   - A **Field extraction summary** shows a summary percentage value for the overall extraction accuracy to allow you to quickly compare extraction accuracy between different LLM extraction models.
     <img src={IdpValidationResultsSummaryImg} alt="Extraction results summary" />
1. Perform any actions required due to the validation results such as saving missing test cases or reviewing documents. If your validation results remain unsatisfactory, try the following before rerunning the validation:
   - Change the extraction model to try and obtain more accurate results with a different model.
   - Edit your extraction field prompts. Select the three vertical dots on a field to open the actions menu, and select **Edit**.
   - Go back to a previous step and edit your data extraction configuration, or upload more sample documents.
1. Once you are satisfied with the extraction accuracy and extraction model, publish the project.

### Publish document extraction template {#publish-template}

Publish the document extraction template to make it available for [integration into your processes](idp-integrate.md)<!-- and [document automation](idp-document-automation.md) projects -->.

1. Click **Publish** and select either:

   - **Publish to project**: Only users in the Web Modeler project can access the document extraction template.
   - **Publish to organization**: The document extraction template is made available as a shared resource within your organization. This option is only available for organization owners or users with the Admin role.

1. On the **Publish Extraction Project** dialog, configure the publish settings.
   <img src={IdpPublishProjectModalImg} width="500px" alt="Validate extraction screen" />

   - **Version name**: Enter a version for the published document extraction template.
   - **Version description**: Enter a description for the published document extraction template version.
   - **Extraction model**: Select the extraction model you want to use for the published document extraction template.

1. Click **Publish** to make the document extraction template available for [integration into your processes](idp-integrate.md)<!--  and [document automation](idp-document-automation.md) projects -->.

:::note

- The most recent **Field extraction summary** results are shown for your chosen **Extraction model**.

:::

## Versions {#versions}

Click **Versions** to view, compare, rename, restore, and delete published document extraction template versions.

<img src={IdpVersionsImg} alt="Unstructured data extraction screen" />

### Compare versions

You can compare the change history between two template versions as JSON code in the diff layout.

1. Ensure that the sidebar **Show changes** toggle is turned on.
1. Select the version that you want to compare. The previous version is automatically selected for comparison.

The JSON for the previous version is shown on the left, with the currently selected version shown on the right.
Differences between the versions are highlighted in the JSON. For example, if an extraction field was added, this change is highlighted in green.

### Restore a version

You can restore a version to revert to a previous snapshot of a document extraction template.

1. In the sidebar **Versions** list, hover over the version you want to restore.
1. Select the three vertical dots to open the actions menu.
1. Select **Restore as latest**.

### Rename a version

You can rename a version at any time.

1. In the sidebar **Versions** list, hover over the version you want to rename.
1. Select the three vertical dots to open the actions menu.
1. Select **Edit name** and enter a new name for the version.

### Delete a version

You can permanently delete a document extraction template version.

1. In the sidebar **Versions** list, hover over the version you want to rename.
1. Select the three vertical dots to open the actions menu.
1. Select **Delete**.
1. You are prompted to confirm the deletion.
   - Select **Delete version** to permanently delete the version.
   - Select **Cancel** to cancel the deletion and return to the versions list.

:::caution
Deleting a document extraction template version is permanent. You cannot access a deleted version, and it is removed from the versions list.
:::
