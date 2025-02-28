---
id: 860-release-notes
title: "Release notes"
description: "Release notes for 8.6, including alphas"
keywords:
  [
    "product development lifecycle",
    "software development lifecycle",
    "CI/CD",
    "AI",
  ]
---

These release notes identify the new features included in 8.6, including [alpha feature releases](/components/early-access/alpha/alpha-features.md).

## 8.6 minor

| Release date   | End of maintenance | Changelog(s)                                                                                                                                                  | Release blog                                                          | Update guide                                                                            |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 8 October 2024 | 14 April 2026      | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0) | [Release blog](https://camunda.com/blog/2024/10/camunda-8-6-release/) | [Self-Managed update guide](self-managed/operational-guides/update-guide/850-to-860.md) |

### Advanced SaaS offering <span class="badge badge--long" title="This feature affects SaaS">SaaS</span> <span class="badge badge--long" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/product-hub/issues/2377 -->

Enterprise customers can now choose to use our advanced SaaS offering for automation clusters. This increases uptime guarantees to 99.9% and reduces RTO (Recovery Time Objective) and RPO (Recovery Point Objective) to under one hour for single-region outages.

When [creating a cluster](/components/console/manage-clusters/create-cluster.md) in SaaS, you can now choose the cluster type and size to meet your organization's availability and scalability needs, and to provide control over cluster performance, uptime, and disaster recovery guarantees.

- Cluster type: Defines the level of availability and uptime for the cluster. Choose from basic, Standard, or Advanced.
- Cluster size: Defines the cluster performance and capacity. Choose from four cluster sizes: 1x, 2x, 3x, and 4x.

To learn more about this feature, see [clusters](/components/concepts/clusters.md).

:::note

- To learn more about migrating your existing clusters to the newer model, contact your Customer Success Manager.
- Prior to 8.6, clusters were configured by hardware size (S, M, L).

:::

### Automatically onboard organization users via external IDP login<span class="badge badge--long" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/product-hub/issues/2385 -->

Default organizations for an external identity provider are available for organizations on an Enterprise plan.

- When setting up an external identity provider, you can configure up to 10 default organizations.
- A user logging in with the configured connection is automatically assigned to these organizations with the corresponding role.

:::note

You must add the following information into the ticket for the support team to configure the default organizations:

- Organization Id
- Default organization roles

:::

### Business Knowledge Models (BKM) in DMN <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/1858 -->

Business Knowledge Models (BKM) can now be implemented in a decision model.

- Users can extract and reuse expressions in their DMN diagrams.
- When writing an expression in a decision, the BKM name autocompletes together with the required parameters.

:::note
Viewing a BKM in Operate is not supported yet.
:::

### Deprecate zbctl and GO client <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/2438 -->

The Go and zbctl clients are moved to the [Camunda Community Hub](https://github.com/camunda-community-hub) following the introduction of the Camunda 8 REST API for Process Management.

- These clients are no longer officially supported by Camunda, as [announced on our blog](https://camunda.com/blog/2024/09/deprecating-zbctl-and-go-clients/).
- Use the REST API for easier interaction with the Zeebe engine, and work with it in the same way as any other REST service.
- Use the OpenAPI definition, the supported Postman collection, or cURL to get started implementing API requests in your code. We also recommend trying the new clients and SDKs.

:::note
Interested in maintaining these community projects? Contact us by completing the [Maintainer Proposal form](https://github.com/Camunda-Community-Hub/community/issues/new/choose) in the Camunda Community Hub.
:::

### Email Connector <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2430 -->

The new Email Connector allows you to integrate your BPMN service with any email server using POP3, IMAP, or SMTP. You can use this Connector to automate the retrieval, deletion, search, and organization of emails directly within your processes.

### Encryption at rest <span class="badge badge--long" title="This feature affects SaaS">SaaS</span> <span class="badge badge--long" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/issues/issues/801 -->

You can now use advanced encryption key mechanisms on Camunda 8 SaaS when creating new clusters.

- By default, Camunda 8 SaaS cluster data at rest is protected with a provider-managed encryption key using Google Cloud Platform (GCP) encryption. The encryption key is owned and managed by GCP.
- Enterprise customers requiring a higher level of protection can select a dedicated Camunda-managed software or hardware (HSM) encryption key when creating a new cluster. The encryption key is managed by Camunda using Google Cloud Key Management Service (KMS).
- You can configure encryption keys on a per-cluster basis so that each cluster has a dedicated encryption key.

To learn more about this feature, see [encryption at rest](/components/concepts/encryption-at-rest.md).

### Execution listener support<span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/2102 -->

Execution listeners are introduced, allowing you to respond to transitions within a process instance effectively, such as when needing to add pre- and post-processing logic for specific elements in the process definition without bloating the diagram.

- You can add execution listeners to any activity, including process instances.
- Developers can use the existing job worker concept to efficiently handle listener jobs, passing additional variables as needed and using typical job properties such as retries or job type.

### Investigate and resolve incidents with execution listeners <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- https://github.com/camunda/product-hub/issues/2103 -->

You can now easily check details of active and completed execution listeners for process activities and process instances.

- Operations engineers can efficiently resolve execution listener incidents.
- This enhancement streamlines operations and ensures smoother handling of incidents, ultimately improving time taken to unblock process execution.

### Play Camunda Cluster Integration <span class="badge badge--long" title="This feature affects Play">Play</span>

<!-- https://github.com/camunda/product-hub/issues/1029 -->

The Play architecture now uses your own Camunda cluster (running 8.6 or higher).

You can now develop and test any process in the Modeler, and Play processes at all maturity stages, from early prototypes with mocks to live UI demos.

- Use your existing infrastructure, API clients, secrets, and cluster applications such as Operate and Tasklist.
- Architects benefit from a streamlined architecture and secure environment, and developers benefit from BPMN and feature parity with their production environment and the ability to debug the integration with their custom applications.

:::note
With this change, the alpha Play infrastructure hosted in our SaaS environment is deprecated. SaaS users will see this change immediately. Self-Managed users running Web Modeler versions 8.5 or below will lose Play access after the January 8.7 release.
:::

### Process management endpoints migrated to Camunda 8 REST API <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/2040 -->

Zeebe endpoints are integrated into the Camunda 8 REST API to make building process applications easier.

- Installation and onboarding to Camunda 8 is improved as gRPC is no longer required. Introducing Zeebe endpoints in the REST API eliminates the need for gRPC, making adoption easier than ever.
- Developers can now seamlessly transition from gRPC to REST with the assurance of using the same endpoints.
- For easy migration use the officially supported Camunda SDKs.

### Version Migration: Auto-mapping for process activities during migration <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- https://github.com/camunda/product-hub/issues/1831 -->

Auto-mapping simplifies the process of migrating complex and lengthy process definitions.

- Operations engineers can quickly map source activities to their corresponding target activities, reducing manual effort and making it easier to focus on changes.
- Users can manually add mapping instructions for new activities and track migration details directly within the instance.

## 8.6.0-alpha5

| Release date      | Changelog(s)                                                                                                                                                                |                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 10 September 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0-alpha5) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0-alpha5) | [Release blog](https://camunda.com/blog/2024/09/camunda-alpha-release-september-2024/) |

### Auto-pause <span class="badge badge--long" title="This feature affects SaaS">SaaS</span> <span class="badge badge--long" title="This feature affects Console">Console</span>

<!-- https://github.com/camunda/product-hub/issues/2419 -->

`dev` tagged clusters on free plans now automatically pause after 8 hours to conserve resources.

- No data is lost, although it takes a few minutes to restart them in Modeler or Console.
- To avoid auto-pausing, add a `test`, `stage`, or `prod` tag to your cluster, or [upgrade to a Starter or Enterprise plan](https://camunda.com/pricing/).

This change allows Camunda to continue to offer dedicated, private clusters to our trial users.

### Customize Tasklist user interface in Self-Managed <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span> <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2177 -->

You can customize the Tasklist user interface (UI) to visually align it with your organization's brand identity. You can adjust the appearance of various UI elements, such as backgrounds, layers, controls, buttons, and text.

### Data viewer modeling interface<span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2011 -->

You can use the new **variables view** to track variables defined in a process diagram.

- This view shows you where a variable was created, which elements write to the variable, and the variable’s scope.
- You can use this view to see which variables are available for use in an element, and to troubleshoot problems with variables.

### Get started with microservice orchestration <span class="badge badge--long" title="This feature affects Help Center">Help Center</span>

<!-- https://github.com/camunda/product-hub/issues/2463 -->

The [Help Center](/reference/help-center.md) now features a step-by-step guide to complete our microservice orchestration tutorial.

### Get started with human task orchestration <span class="badge badge--long" title="This feature affects Help Center">Help Center</span> <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2395 -->

The [Help Center](/reference/help-center.md) now features a step-by-step guide to complete our human task orchestration (HTO) tutorial, explaining the critical features that every developer interested in human task orchestration needs to know.

- Users get a glimpse into the user experience for at-scale adoption.
- Enterprise architects get a picture of how Camunda's out-of-the-box Tasklist fits into their architecture.

### Internationalization (I18n) for Tasklist <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2378 -->

When creating a process for a local (non-English) region, you can design forms in the local language and have the Tasklist interface in the same language.

- By default, Tasklist supports four languages: English, French, German, and Spanish.
- The interface language is automatically determined by the user device's language settings.
- The interface defaults to English if the device's language is not supported.

### Message correlation with result <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/1818 -->

The Camunda 8 REST API provides an [endpoint for synchronous message correlation](/apis-tools/camunda-api-rest/specifications/correlate-message.api.mdx), enabling external systems to immediately determine the success or failure of message correlation. This enhancement allows external systems to take prompt and appropriate actions based on the correlation result, improving overall efficiency and reducing response times.

### Public Marketplace blueprint support for HTO & DMN <span class="badge badge--long" title="This feature affects Web Modeler">Web Modeler</span> <span class="badge badge--long" title="This feature affects Marketplace">Marketplace</span>

<!-- https://github.com/camunda/product-hub/issues/2333 -->

Web Modeler now supports DMN models and Forms inside [Marketplace blueprints](https://marketplace.camunda.com/en-US/listing?pl=3082&cat=107793&locale=en-US).

- These blueprints can now showcase even more ways to implement common business processes, and illustrate best practices for process modeling and implementation.
- To learn more about browsing Marketplace blueprints, see [browse marketplace blueprints](/components/modeler/web-modeler/camunda-marketplace.md#browse-marketplace-blueprints).

### Share Connectors within the project and organization in Self-Managed <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/2223 -->

Organization administrators can now share connectors within project and organization levels, enabling easy reuse of shared assets.

### Super user mode available in Self-Managed <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1116 -->

Organization administrators can now govern and access all projects in Web Modeler Self-Managed using a new "super user" mode.

:::note
This feature has already been released in SaaS.
:::

### User Task priority field <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/217 -->

Organizations often face challenges in ensuring that teams focus on the most important tasks within complex workflows. To address this, the task priority feature allows you to define and manage task priorities within a BPMN process, ensuring that important assignments receive the attention they deserve.

- User Task priority is an integer value that determines the importance of a task within a workflow.
- The supported priority values range from 0 to 100, with a default value of 50. A higher priority value indicates higher importance.

### Version tag binding for linked resources support <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/435 -->

You can now pin dependent files using a user-generated version tag. By specifying a version tag like "1.3.4", you can ensure that the right version of a dependent BPMN, DMN, or Form file is always used, regardless of future deployments. This feature is ideal for managing external or shared dependencies.

### Write rate limiting based on exporting rate <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/1426 -->

A new Zeebe unified flow control mechanism can limit user commands and rate limit writes of new records in general. By default, Zeebe tries to achieve 200ms response times for user commands. You can use this new feature to prevent the buildup of an excessive exporting backlog.

To limit the write rate, you can either set a static limit or enable throttling that dynamically adjusts the write rate based on the exporting backlog and rate.
If activated, you might see more backpressure in cases where exporters are not exporting fast enough, so that a backlog builds up. The backpressure error message contains information to explain what is happening, and you can also refer to the documentation to understand what to do in such cases.

- SaaS: The new write limit is automatically applied to Saas default hosting packages.
- Self-Managed: Limiting is disabled by default. If required, you can
  activate and tune the write limit. See the [operational guide](/self-managed/operational-guides/configure-flow-control/configure-flow-control.md) for more
  information.

## 8.6.0-alpha4

| Release date   | Changelog(s)                                                                                                                                                                |                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 12 August 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0-alpha4) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0-alpha4) | [Release blog](https://camunda.com/blog/2024/08/camunda-alpha-release-august-2024/) |

### Using Camunda 8 Connectors in Desktop Modeler <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2253 -->

Modeler now offers templates in BPMN diagrams for pre-built Camunda 8 Connectors. This ensures you can easily connect to a growing list of services and protocols, out of the box.

- To learn more about this feature, see [use Connectors](/components/modeler/desktop-modeler/use-connectors.md).
- To disable this feature, configure the [`disable-connector-templates` flag](/components/modeler/desktop-modeler/flags/flags.md#disable-connector-templates).

<!-- Via https://github.com/camunda/camunda-docs/pull/4187 -->

### Get started with human task orchestration <span class="badge badge--long" title="This feature affects Help Center">Help Center</span> <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2395 -->

The Help Center now features a step-by-step guide to complete our [human task orchestration (HTO) tutorial](/guides/getting-started-orchestrate-human-tasks.md), explaining the critical features that every developer interested in HTO needs to know.

- Users get a glimpse into the user experience for at-scale adoption.
- Enterprise architects get a picture of how Camunda's out-of-the-box Tasklist fits into their architecture.

### Amazon AWS Bedrock Connector <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2404 -->

This new Connector allows you to leverage the power of the Amazon AWS Bedrock LLM service, allowing users to:

- Make a customized request to any models available in the region using the Amazon `InvokeModel` function.
- Create a full conversation using the **Converse** method.

### `Deployment` version binding for forms, processes, and decisions

<!-- https://github.com/camunda/product-hub/issues/1920 -->

Version binding is now supported for bundled deployments through process applications or the Camunda API.

- Apply the "deployment" option to a dependent BPMN, DMN, or Form file to pin the dependency so you can deploy future versions of these files without disrupting ongoing process instances.
- This feature is ideal for self-contained projects without external or shared dependencies.

### Git sync

<!-- https://github.com/camunda/product-hub/issues/2036 -->

You can now synchronize process applications with GitHub using a native integration.

- After an admin approves and configures the basic integration, you can select a path to synchronize with in a GitHub repository.
- You can pull changes from GitHub to integrate contributions from Desktop Modeler users, make changes, and begin the process to make a pull request so every change is properly reviewed and approved.

Do you use another tool such as GitLab or Bitbucket? [Contact us](/reference/contact.md) to make your request. Until then, you can use our Connectors system and the CI/CD blueprint on the Marketplace.

### Persist data across sessions

<!-- https://github.com/camunda/product-hub/issues/1310 -->

Don't Repeat Yourself (DRY). Play now supports an end-to-end journey for saving and reusing example data.

- Save example data to the BPMN diagram while playing your process so anyone can use it.
- Any user can use this example data in their sessions, eliminating the need for tedious form-fills or copy-pasting.
- Connector example data is now available to help define output variables or mock Connectors.

### Out-of-the-box (OOTB) product development lifecycle (PDLC) happy path <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2355 -->

Web Modeler is building a lightweight, out-of-the-box (OOTB) product development lifecycle (PDLC) to enable business users to review changes, promote them through changes, and maintain visibility into their journey.

### Console Self-Managed: OIDC support <span class="badge badge--long" title="This feature affects Console">Console</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/2092 -->

We are excited to announce a new Console Self-Managed feature to enhance your authentication capabilities. You can now use OpenID Connect (OIDC) to authenticate with Console Self-Managed, allowing seamless integration with enterprise Identity Providers (IdPs).

### Console Self-Managed: Administration API <span class="badge badge--long" title="This feature affects Console">Console</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/2121 -->

We are excited to announce the release of the new Administration API for the Camunda platform.

- The Administration API empowers you to collect detailed information across your organization about your automation clusters and their usage statistics.
- You can use this API to automate various operational management tasks and seamlessly integrate the Camunda platform with your internal tools and systems.

### Hourly backup option on Camunda 8 SaaS <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

<!-- https://github.com/camunda/product-hub/issues/2211 -->

On Camunda 8 SaaS, you can now configure hourly backup intervals. Simply head to Console and adjust your backup interval.

### Improved visual indication of the executed path in a process <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- https://github.com/camunda/product-hub/issues/274 -->

In Operate, the visualization of the executed path of a process instance is improved. Both executed sequence flows and flow nodes are highlighted, allowing you to display how often each flow node was executed.

## 8.6.0-alpha3

| Release date | Changelog(s)                                                                                                                                                                |                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 02 July 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0-alpha3) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0-alpha3) | [Release blog](https://camunda.com/blog/2024/07/camunda-alpha-release-july-2024/) |

### Encrypted inter-component communication for Web Modeler <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/web-modeler/issues/9730 -->

You can now [enable TLS-encrypted communication](/self-managed/modeler/web-modeler/configuration/ssl.md) between Web Modeler, the REST API, and websockets.

### API orchestration getting started journey <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2348 -->

New platform users interested in orchestrating API endpoints now have a high-level in-product explanation of Camunda's Connector functionality.

### Remove "Cloud" as a user-facing term <span class="badge badge--long" title="This feature affects Modeler">Modeler</span><span class="badge badge--long" title="This feature affects Console">Console</span> <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

<!-- https://github.com/camunda/product-hub/issues/1989 -->

"Cloud" has been removed from the URLs in SaaS versions of Modeler and Console for conciseness.

### Incident copilot alpha <span class="badge badge--long" title="This feature affects Play">Play</span>

<!-- https://github.com/camunda/product-hub/issues/2349 -->

Let AI teach you how to prevent and fix the incidents you run into while playing your process.

- Auto-generated prompt including incident information
- Advice on how to update your model to prevent issues while developing
- An open conversation to continue asking more questions

## 8.6.0-alpha2

| Release date | Changelog(s)                                                                                                                                                                  |                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 11 June 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0-alpha2) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0-alpha2.1) | [Release blog](https://camunda.com/blog/2024/06/camunda-alpha-release-june-2024/) |

### API orchestration getting started journey <span class="badge badge--long" title="This feature affects Help Center">Help Center</span>

<!-- https://github.com/camunda/product-hub/issues/2348 -->

The Help Center now features a step-by-step guide to complete the [API orchestration tutorial](/guides/getting-started-orchestrate-apis.md). To use this guide, you must have cookies enabled.

### Message queue inbound Connectors message acknowledgement configuration <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2157 -->

Enhance BPMN workflow reliability with selective message acknowledgement, enabling precise error handling and notification for unmatched messages through RabbitMQ's dead letter queue configuration. Control the message acknowledgement process so acknowledgements are sent only if the message is both correlated to a process instance and meets the activation condition.

### New inbound intermediate element template property - `Message TTL` <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/connectors/issues/1406 -->

Time-to-live (TTL) is now configurable for inbound Connectors via a property in all inbound intermediate element templates called `Message TTL`. The new default value for TTL is 0. Read more about [message buffering](/components/concepts/messages.md#message-buffering) and [message correlation](/components/concepts/messages.md#message-correlation-overview).

### Incident copilot alpha <span class="badge badge--long" title="This feature affects Play">Play</span>

<!-- https://github.com/camunda/product-hub/issues/2349 -->

Let AI teach you how to prevent and fix the incidents you run into while playing your process.

- Auto-generated prompt including incident information
- Advice on how to update your model to prevent issues while developing
- An open conversation to continue asking more questions

### MS SQL, MySQL, and PostgreSQL outbound JDBC Connector <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2213 -->

Offering seamless data exchange between Camunda 8 and databases, the [new database Connector](/components/connectors/out-of-the-box-connectors/sql.md) for Camunda 8 simplifies data exchange with MySQL, MS SQL, and PostgreSQL databases, allowing you to read and write data directly within your Camunda processes.

This integration enables a wide range of process blueprints and use cases to be executed on the Camunda platform without any additional installation or development. With the new Camunda Connector, you can now seamlessly integrate database operations into your workflows. This feature reduces complexity, enhances security, and lowers maintenance costs by providing a robust and efficient method for data exchange directly within the Camunda platform.

### Create Camunda Wizard <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2053 -->

Camunda's Docs AI is now available while you're modeling.

Beyond the standard built-in guidance like tooltips, users who opt-in to AI features will be able to ask complex questions about how to develop their processes without leaving Modeler. The AI tool pulls best practices and technical instructions from our docs, forum posts, and blog, so you can spend less time searching for information and more time developing.

### Web Modeler Self-Managed Developer Edition (Local) <span class="badge badge--long" title="This feature affects Modeler">Modeler</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/2139 -->

Web Modeler Self Managed is now free to use for anyone. Now packaged as part of Camunda's Docker distribution, you can test out Camunda's collaborative modeling and development lifecycle features before making the decision to get a license.

There is one limitation: each Modeler project can have up to five users.

### Amazon SageMaker <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/2325 -->

Integrate ML cases in your existing processes with [Amazon SageMaker](/components/connectors/out-of-the-box-connectors/amazon-sagemaker.md).

You can now effortlessly integrate machine learning functionalities into your workflows with the release of the Amazon SageMaker Connector. With this new Connector, directly harness Amazon SageMaker's machine learning services within Camunda, streamlining the process and allowing for greater focus on process enhancement and innovation.

### Process application MVP <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/1983 -->

The [process application](/components/modeler/web-modeler/process-applications.md) is a special type of folder in Web Modeler that enables bulk actions like deploying all assets together. This reduces the risk of having a broken deployment at runtime, and makes it more convenient to deploy related files.

## 8.6.0-alpha1

| Release date | Changelog(s)                                                                                                                                                                | Release blog                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 14 May 2024  | - [ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.6.0-alpha1) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.6.0-alpha1) | [Release blog](https://camunda.com/blog/2024/05/camunda-alpha-release-may-2024/) |

### Process development lifecycle (PDLC) blueprint <span class="badge badge--long" title="This feature affects Marketplace">Marketplace</span>

<!-- https://github.com/camunda/product-hub/issues/2014 -->

Developing and releasing Camunda processes in compliance with your organization's policies often creates a long-running, sometimes complex process across many endpoints - a great use case for an orchestrator like Camunda. Camunda is taking the first steps to orchestrate the development lifecycle using its own engine, relevant Connectors, and a [customizable blueprint](https://marketplace.camunda.com/en-US/apps/439170/cicd-pipeline) that you can modify to fit your needs.

### Process application MVP (SaaS only) <span class="badge badge--long" title="This feature affects Modeler">Modeler</span> <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

<!-- https://github.com/camunda/product-hub/issues/1983 -->

The [process application](/components/modeler/web-modeler/process-applications.md) is a special type of folder in Web Modeler that enables bulk actions like deploying all assets together. This reduces the risk of having a broken deployment at runtime and makes it more convenient to deploy related files.

### Instance modification as batch <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- Link to main page in https://github.com/camunda/camunda-docs/pull/3747 -->

With the new release operating mass incidents is easier with [batch instance modification](/components/operate/userguide/process-instance-batch-modification.md). If there was an issue in process execution that caused you to enter the wrong process branch or data was corrupted, you can select multiple process instances and move them to the correct place in the process.

### Relative dates in task tiles <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- No docs available -->

Creation, due, and follow-up dates are now shown as relative dates in task tiles (e.g. "Tomorrow" instead of "10 April 2024 - 13:34 PM").

### Anti CSRF token for Tasklist <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2196 -->

Tasklist sessions are now protected via an [anti CSRF token](/self-managed/tasklist-deployment/tasklist-configuration.md#cross-site-request-forgery-protection).

### Instance Modification as Batch <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- https://github.com/camunda/product-hub/issues/1815 -->

With the new release operating mass incidents is easier with Batch Instance Modification. If there was an issue in process execution that caused you to enter the wrong process branch or data was corrupted, you can select multiple process instances and move them to the correct place in the process.
