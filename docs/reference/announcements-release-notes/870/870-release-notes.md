---
id: 870-release-notes
title: "Release notes"
description: "Release notes for 8.7, including alphas"
keywords:
  [
    "product development lifecycle",
    "software development lifecycle",
    "CI/CD",
    "AI",
  ]
---

These release notes identify the new features included in 8.7, including [alpha feature releases](/components/early-access/alpha/alpha-features.md).

## 8.7 minor

| Scheduled release date | Scheduled end of maintenance | Changelog(s) | Release blog | Update guide |
| ---------------------- | ---------------------------- | ------------ | ------------ | ------------ |
| 8 April 2025           | 13 October 2026              | -            | -            | -            |

## 8.7.0-alpha4

| Release date     | Changelog(s)                                                                                                                                                                               | Blog                                                                                  |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 11 February 2025 | <ul><li>[ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.7.0-alpha4)</li><li>[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.7.0-alpha4)</li></ul> | [Release blog](https://camunda.com/blog/2025/02/camunda-alpha-release-february-2025/) |

### BPMN Copilot <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

With the new BPMN Copilot for SaaS, go from 0 to 80% of a process diagram in minutes. Generate process diagrams from natural language descriptions, then collaborate on them with colleagues.

For more information, see the [BPMN Copilot documentation](/components/early-access/alpha/bpmn-copilot/bpmn-copilot.md).

<!-- https://github.com/camunda/product-hub/issues/2511 -->

### Ad-hoc subprocesses

A new [ad-hoc subprocess](/components/modeler/bpmn/ad-hoc/ad-hoc.md) BPMN element is now supported. This new kind of subprocess allows more flexible process flows with a compact visual representation. It is the first step towards dynamic processes and execution of ad-hoc activities.

<!-- https://github.com/camunda/product-hub/issues/2546 -->

## 8.7.0-alpha3

| Release date    | Changelog(s)                                                                                                                                                                                 | Blog                                                                                |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| 14 January 2025 | <ul><li>[ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.7.0-alpha3)</li><li>[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.7.0-alpha3.2)</li></ul> | [Release blog](https://camunda.com/blog/2025/01/camunda-alpha-release-january-2025) |

<!-- https://github.com/camunda/product-hub/issues/2473 -->

### Amazon OpenSearch Optimize support <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Optimize">Optimize</span>

:::note
This feature was originally released with 8.7.0-alpha3, and is no longer available in 8.7.0. Amazon OpenSearch Optimize support is now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-release-notes.md#amazon-opensearch-optimize-support-self-managedoptimize). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

Camunda 8 Self-Managed now fully supports the use of Amazon OpenSearch with Optimize.

<!-- https://github.com/camunda/product-hub/issues/2374 -->

### Camunda cluster update API <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--medium" title="This feature affects APIs">API</span>

You can now use the Camunda 8 SaaS [Administration API](/apis-tools/administration-api/administration-api-reference.md) to update a cluster to a new generation.

- This allows you to trigger automated simultaneous updates for multiple clusters via the API.
- Send a PUT request to the Administration API `Update cluster` endpoint.

### Connectors <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

New Connectors and enhancements are included in this release.

<!-- https://github.com/camunda/product-hub/issues/2552 -->

#### AWS S3 Connector

Use the new outbound Amazon S3 Connector to interact with [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/S3/) from your BPMN process.

This Connector supports the following operations:

- **Upload Document**: Upload a document to an AWS S3 bucket.
- **Download Document**: Download a document from an AWS S3 bucket.
- **Delete Document**: Delete a document from an AWS S3 bucket.

To learn more about this Connector, see [Amazon S3 Connector](/components/connectors/out-of-the-box-connectors/amazon-s3.md).

<!-- https://github.com/camunda/product-hub/issues/2399 -->

#### Box Connector

Use the new outbound Box Connector to interact with [Box.com](https://www.box.com/) account content from your BPMN process.

This Connector supports the following operations:

- **Download File**: Download files into the Camunda document store.
- **Upload File**: Upload files from Camunda to Box.
- **Delete File**: Delete file items in Box.
- **Move File**: Move files between folders in Box.
- **Create Folder**: Create new folders in your Box account.
- **Delete Folder**: Delete folders from your Box account.
- **Search**: Search file items using the Box search API.

To learn more about this Connector, see [Box Connector](/components/connectors/out-of-the-box-connectors/box.md).

<!-- https://github.com/camunda/product-hub/issues/2555 -->
<!-- https://github.com/camunda/product-hub/issues/2592 -->
<!-- https://github.com/camunda/connectors/pull/3751 -->
<!-- https://github.com/camunda/connectors/pull/3746 -->

### Document handling <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects APIs">API</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

New features are available as part of the enhanced document handling being delivered with the 8.7 release.

- The document store API supports uploading files in batches.
- The document reference is extended with a document hash as an additional security mechanism.
- The AWS S3 document store is implemented.
- User task attachments and a [document preview component](/components/modeler/forms/form-element-library/forms-element-library-document-preview.md) in forms are supported. This enhances document-centric human workflows with file preview and download support in forms, simplifying the handling of large data and documents.
- Document handling support is added to the [REST](/components/connectors/protocol/rest.md) and [Amazon Bedrock](/components/connectors/out-of-the-box-connectors/amazon-bedrock.md) Connectors.

<!-- https://github.com/camunda/product-hub/issues/2469 -->

### GitLab sync <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

Web Modeler now supports native integration between a process application and a branch of a GitLab repository.

Non-technical users in orgs running GitLab can now easily access the files in their source of truth, collaborate cross-platform with Desktop Modeler users, and contribute changes to a feature branch that can be easily merged and deployed.

To learn more about this feature, see [Git sync](/components/modeler/web-modeler/git-sync.md).

<!-- https://github.com/camunda/product-hub/issues/2502 -->

### Process instance migration <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Zeebe">Zeebe</span>

:::note
This feature was originally released with 8.7.0-alpha3, and is no longer available in 8.7.0. Process instance migration is now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-announcements.md#process-instance-migration-saasself-managedzeebe). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

Enhanced process instance migration now supports additional BPMN elements, enabling smoother transitions for your workflows and empowering operations teams to seamlessly migrate running process instances to updated process definitions without workarounds or manual intervention.

You can migrate running process instances containing the following elements:

- **Parallel Gateways**: Ensure smooth transitions for concurrent workflows.
- **Inclusive Gateways**: Migrate workflows that rely on inclusive logic.
- **Compensation and Escalation Events**: Maintain error-handling and recovery mechanisms.

To learn more about migration, see [process instance migration](/components/concepts/process-instance-migration.md).

<!-- https://github.com/camunda/product-hub/issues/1314 -->

### Replay scenarios <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

You can now use Play to quickly repeat manual test suites by recording and playing back process instances as scenarios.

For example, you can validate your process by creating and rerunning scenarios for different paths to check the process works as expected after any diagram changes are made.

- As you save completed instances as scenarios, Play calculates the percent of elements covered by the scenario suite.
- This is the first step towards bringing automated testing into Web Modeler, and enabling business and IT to collaborate on automated tests.

To learn more about this feature, see [Play scenarios](/components/modeler/web-modeler/play-your-process.md#scenarios).

<!-- https://github.com/camunda/product-hub/issues/2073 -->

### Unified deployment experience from Web Modeler <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

The deployment experience is further simplified for Enterprise customers running Web Modeler Self-Managed.

The predefined development stage cluster for the process application is also used when launching Play. This feature is already available in SaaS, and is now also available for Self-Managed as part of unifying the deployment experience.

<!-- https://github.com/camunda/product-hub/issues/1822 -->

### User task listeners <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span><span class="badge badge--medium" title="This feature affects Operate">Operate</span>

:::note
This feature was originally released with 8.7.0-alpha2, and is no longer available in 8.7.0. User task listeners are now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-release-notes.md#user-task-listeners-saasself-managedmodeleroperate). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

Task lifecycle management is enhanced with user task listeners, allowing users to react to specific user task lifecycle events.

- Process designers can now model task listeners for different events, such as `assigning` and `completing`.
- Developers can use the same job infrastructure to activate and complete task listener jobs.
- Operations engineers can easily check details of active and completed task listeners within instances, and efficiently resolve task listener incidents.

This enhancement streamlines operations and ensures smoother incident handling, improving time to unblock process execution.

<!-- https://github.com/camunda/product-hub/issues/2126 -->

### Zeebe user tasks modeling migration support <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

User task implementation type "Zeebe user task" is renamed to "Camunda user task", and set as the default implementation type.

:::note
As Job-worker user tasks managed by Camunda will be deprecated in Camunda 8.9, Camunda recommends you start using Camunda User Tasks (formerly known as Zeebe User Task) in your process definitions. To learn more, see [announcements](/reference/announcements-release-notes/870/870-announcements.md#deprecated-job-based-user-tasks-querying).
:::

## 8.7.0-alpha2

| Release date     | Changelog(s)                                                                                                                                                                                 | Blog                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 10 December 2024 | <ul><li>[ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.7.0-alpha2)</li><li>[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.7.0-alpha2.1)</li></ul> | [Release blog](https://camunda.com/blog/2024/12/camunda-alpha-release-december-2024/) |

<!-- https://github.com/camunda/camunda-platform-helm/issues/2662 -->

:::caution

This [alpha release](/reference/announcements-release-notes/release-policy.md) contains a known issue where Self-Managed customers using the 8.7.0-alpha2 Helm chart cannot login to Operate. This issue is due to key architecture refactoring and improvements, and will be resolved in the next release.

:::

<!-- https://github.com/camunda/product-hub/issues/2244 https://github.com/camunda/product-hub/issues/2245 -->

### Camunda 8 REST API Query API <span class="badge badge--medium" title="This feature affects APIs">API</span>

:::note
The Query API was promoted from an alpha feature to stable in 8.7.0-alpha2, but is now moved back to an alpha feature for the 8.7 release. The stable Query API is now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-release-notes.md#camunda-8-rest-api-query-api-api). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

You can now use a single Query API in the Camunda 8 REST API to find process and decision data instead of using multiple component APIs.

New Query API endpoints are added as follows:

- Decision definitions
- Decision instances
- Decision requirements
- Flownode instances
- Incidents
- Process definitions
- Process instances
- User tasks
- Variables

### Connectors <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

New Connectors and enhancements are included in this release.

#### AWS Amazon Comprehend Connector

The new Amazon Comprehend Connector allows you to integrate your BPMN service with Amazon Comprehend, a service which extracts insights about the content of documents, such as personal identifiable information (PII) and key phrases.

To learn more about this Connector, see [Amazon Comprehend Connector](/components/connectors/out-of-the-box-connectors/amazon-comprehend.md).

#### Email Connector attachments

The Email connector is enhanced as follows:

- Supports attachments stored in the document store.
- Supports custom headers.
- Messages can now be sent as plaintext, HTML, or in both formats.

To learn more about this Connector, see [Email Connector](/components/connectors/out-of-the-box-connectors/email.md).

#### Google Gemini Connector

The new Google Gemini Connector allows you to access Gemini multimodal models from Google, capable of understanding virtually any input, and combining different types of information in your BPMN process.

To learn more about this Connector, see [Google Gemini Connector](/components/connectors/out-of-the-box-connectors/google-gemini.md).

#### Webhook Connector document upload

Document upload is now supported by the Webhook Connector. Uploads can now be stored in the document store and are available for further processing for start and intermediate events.

- Use the `documents` object to access created documents in both the response expression and the result expression.
- The `documents` object contains the references for created documents.

To learn more about this feature, see [HTTP Webhook Connector](/components/connectors/protocol/http-webhook.md).

### Connector Runtime <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

#### Spring SDK and Camunda REST API Migration

:::note
This feature was originally released with 8.7.0-alpha3, and is no longer available in 8.7.0. The Camunda REST API migration is now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-announcements.md#spring-sdk-and-camunda-rest-api-migration). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

The Connectors experience is enhanced with the migration from the Spring Zeebe to the Camunda REST API, and the removal of dependency on the Operate client.

#### Testing Support migration

Connectors are supported in the Camunda Process Test (CPT) Java library you can use to test your BPMN processes and process application.

To learn more about this feature, see [Camunda Process Test getting started](/apis-tools/testing/getting-started.md).

<!-- https://github.com/camunda/product-hub/issues/2548 -->

### Cluster disk space cleared for paused trial clusters <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

Cluster disk space is cleared when a trial cluster is paused.

- You will need to redeploy processes to the cluster once it is resumed from a paused state.
- Cluster configuration settings (for example, API Clients, Connector secrets, and IP allowlists) are saved so you can easily resume a cluster.

<!-- https://github.com/camunda/product-hub/issues/2409 -->

### Document handling <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

New features are available as part of the enhanced document handling being delivered with the 8.7 release.

- A new Document API is available as part of the [Camunda 8 REST API](/apis-tools/camunda-api-rest/camunda-api-rest-overview.md).
- The [Java client](/apis-tools/java-client/index.md) is enhanced to support these new Document API methods.
- A document store concept is introduced and implemented as an in-memory and a GCP-based document store.
- A new Tasklist [Filepicker component](/components/modeler/forms/form-element-library/forms-element-library-filepicker.md) is added for uploading documents to the document store in a form.
- The [Connector SDK](/components/connectors/custom-built-connectors/connector-sdk.md) is enhanced to provide document support in property/variable bindings.
- The [Webhook connector](/components/connectors/protocol/http-webhook.md) supports Documents via the `documents` object.

<!-- https://github.com/camunda/product-hub/issues/2530 -->

### Export activity logs in Console <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--medium" title="This feature affects Console">Console</span>

You can export activity logs as JSON or CSV files from the Console UI or API.

- **UI:** On the Organization management **Activity** tab, click **Export activity**.
- **API:** Send a GET request to the Management API `GetJson` or `GetCsv` endpoint.

To learn more about this feature, see [view organization activity](/components/console/manage-organization/view-organization-activity.md).

<!-- https://github.com/camunda/camunda/issues/24374, https://github.com/camunda/camunda/issues/24385, https://github.com/camunda/camunda/issues/24377 -->

### Process instance migration <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Zeebe">Zeebe</span>

:::note
This feature was originally released with 8.7.0-alpha2, and is no longer available in 8.7.0. Process instance migration is now available in [8.8.0-alpha1](/reference/announcements-release-notes/880/880-release-notes.md#process-instance-migration-saasself-managedzeebe). For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

Enhanced process instance migration allows you to solve problems with process definitions and use the latest process improvements.

You can now migrate the following:

- Compensation boundary event subscriptions
- Escalation boundary events
- Escalation event subprocesses

<!-- https://github.com/camunda/product-hub/issues/2556 -->

### Singapore region available for SaaS <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

A new Singapore (asia-southeast1) region is available for SaaS clusters. Use this region to:

- Improve overall processing speed and reduce latency if you operate in Singapore and Southeast Asian (SEA) countries.
- Keep cluster data within Singapore to support your local data residency and compliance needs.

To learn more about supported SaaS regions, see [regions](/reference/regions.md).

<!-- https://github.com/camunda/product-hub/issues/2122 -->

### Tags and properties in Self-Managed Console <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Console">Console</span>

Use custom tags and properties in Self-Managed Console to improve your orchestration cluster management.

- Administrators can now assign tags such as `prod`, `dev`, or `test` to clusters for clear identification across environments.
- Tags are shown in the Console UI, and accessible via the Administration API to streamline usage reporting and cost allocation.
- Custom properties provide contextual information about each cluster. Administrators can add detailed descriptions, team names, and include links to resources such as Grafana dashboards or internal portals, shown in the Console **Cluster Details**.

This feature allows you to differentiate clusters, ensure configurations align with production standards (for example, check TLS is enabled, correct partition counts), and improve operational efficiency by making key information more visible.

<!-- https://github.com/camunda/product-hub/issues/2073 -->

### Unified deployment experience from Web Modeler <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

The deployment experience is further simplified for Enterprise customers running Web Modeler Self-Managed.

- User tokens are used for deployments instead of machine-to-machine (M2M) tokens generated from a client ID and secret.
- You no longer need to enter a client ID and secret in the deploy modal. Instead, simply choose a cluster (or stage for process applications) and deploy.

## 8.7.0-alpha1

| Release date     | Changelog(s)                                                                                                                                                                               | Blog                                                                                  |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 12 November 2024 | <ul><li>[ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.7.0-alpha1)</li><li>[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.7.0-alpha1)</li></ul> | [Release blog](https://camunda.com/blog/2024/11/camunda-alpha-release-november-2024/) |

### Activity log information in Console <span class="badge badge--medium" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/product-hub/issues/2528 -->

Console activity logs now contain information about changes made to secrets (add, update, remove), and Console user removals (unregistered organization users).

### Email Connector <span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2430 -->

The new Email Connector allows you to:

- Integrate your BPMN service with any email server using POP3, IMAP, or SMTP.
- Automate the retrieval, deletion, search, and organization of emails directly within your processes.

To learn more about this Connector, see [Email Connector](/components/connectors/out-of-the-box-connectors/email.md).

### Generate Connector templates (OpenAPI + Postman) <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2049 -->

You can now configure and automatically generate a custom Connector template in Web Modeler. This feature simplifies creating consistent, deployable templates, making Connector setup quicker and more flexible.

- You can start from a blank template or import an existing API definition such as an OpenAPI specification, Swagger specification, or a Postman collection.
- For example, download a Postman collection as a YAML file, import this into the generator, and choose which methods to include in the generated template.

To learn more about generating Connector templates, see [generate a Connector template](/components/connectors/custom-built-connectors/connector-template-generator.md).

### Monorepo Git sync <span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2503 -->

When configuring Git sync in Web Modeler, define the optional `/path` option to unlock new use cases.

- This option allows you to specify the path to the folder containing your process application files.
- Sync with your main branch to perform visual diffing, collaboration, and manual testing in Web Modeler. Remember not to make any changes in this branch.
- Edit the `/path` for multiple process applications to integrate Web Modeler with your existing monorepo and code assets.

To learn more about configuring Git sync, see [Git sync](/components/modeler/web-modeler/git-sync.md).

### Resize clusters on SaaS <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--medium" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/product-hub/issues/2515 -->

Enterprise customers can flexibly resize their clusters to adjust capacity and performance.

- Increase or decrease the cluster size at any time by adding or removing hosting packages.
- For example, increase the cluster size to improve performance and add capacity, or decrease the cluster size to free up reservations for another cluster.

To learn more about this feature, see [resize a cluster](/components/console/manage-clusters/manage-cluster.md#resize-a-cluster).

### Unified deployment experience for Web Modeler <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2073 -->

#### Deployment stages

Predefined deployment stages for process applications are now also available in Web Modeler Self-Managed.

- Select your dev, test, stage, and prod clusters to ensure process applications flow easily and predictably through your deployment pipeline.
- For added control, do not assign a stage or prod environment to enable rapid iteration in Web Modeler while still ensuring deployments run through your approved pipeline.

#### Simplified deployment

The deployment experience for Enterprise customers running Web Modeler Self-Managed is simplified.

- During Camunda installation, you can configure your Helm chart to decide which clusters are available from Web Modeler by default, and save their connection information.
- With this setup, you only need to select a cluster, and add secrets and a tenant ID as required.
