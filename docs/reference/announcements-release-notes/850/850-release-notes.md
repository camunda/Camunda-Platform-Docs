---
id: 850-release-notes
title: "Release notes"
description: "Release notes for 8.5, including alphas"
---

## 8.5 minor

| Release date | End of maintenance | Changelog(s)                                                                                                                                                                                                                                                | Release blog                                                          | Update guide                                                                             |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 9 April 2024 | 14 October 2025    | -[ Camunda 8 Core ](https://github.com/camunda/camunda-platform/releases/tag/8.5.0) <br /> -[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.5.0) <br /> - [ Optimize ](https://github.com/camunda/camunda-optimize/releases/tag/3.13.0) | [Release blog](https://camunda.com/blog/2024/04/camunda-8-5-release/) | [Self-Managed update guide](/self-managed/operational-guides/update-guide/840-to-850.md) |

### Role Support for Web Modeler with OIDC in Self-Managed <span class="badge badge--long" title="This feature affects Modeler">Modeler</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/2162 -->

You can now use Role-Based Access Control (RBAC) with your own OIDC Identity provider (such as Entra ID) and Web Modeler without relying on Keycloak. [This extends RBAC and role mapping support](/self-managed/setup/guides/connect-to-an-oidc-provider.md#component-specific-configuration) that is available for other components to Web Modeler.

### Introductory UI header for processes page

<!-- https://github.com/camunda/product-hub/issues/2156 -->

The process overview page was redesigned for clarity and ease-of-use.

### Fully supported Spring Zeebe SDK <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/2148 -->

Use supported [Spring Zeebe SDK](/apis-tools/spring-zeebe-sdk/getting-started.md) in your Spring or Spring Boot projects to interact with the Zeebe API and build process applications. Spring Zeebe SDK works with Zeebe gRPC and the new Zeebe REST API.

### Modeler-only role in Camunda 8 SaaS <span class="badge badge--long" title="This feature affects Modeler">Modeler</span> <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

<!-- https://github.com/camunda/product-hub/issues/2140 -->

In Camunda 8 SaaS, you can now assign users a [Modeler role](/components/console/manage-organization/manage-users.md#roles-and-permissions) which allows them to only have access to Modeler and view-only access to cluster information in Console, but no actual cluster components.

### Expression component <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2134 -->

Form developers can now add [expression components](/components/modeler/forms/form-element-library/forms-element-library-expression.md) to forms to calculate and store values and reuse them in other components, allowing you to break down complex expressions into multiple steps, and to return calculated values as form output.

### Task context description MVP <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2099 -->

Developers can now define a custom description on user tasks that appears on the task tile in Tasklist. The description can differ per task instance. To set the description, the variable [`taskContextDisplayName`](/components/concepts/variables.md#context-variable) must be defined as an input variable.

### Desktop Modeler is supported when OIDC / EntraID is used <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2089 -->

You can now use Desktop Modeler with your own OIDC Identity provider (such as Entra ID) without relying on Keycloak. This means when you have configured your own Identity provider in Camunda 8, Desktop Modeler can authenticate using Client ID and Secret when deploying or starting process instances.

### Ad-hoc task filters <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2087 -->

Tasklist users can now filter tasks using custom filter settings. The filter settings are stored in the browser and preserved across Tasklist sessions.

### Indicate task assignees <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2076 -->

Assigned users are now indicated in the task tiles by a label and an icon. Tasks assigned to the logged-in user are labeled `Me`, while other assignees are indicated by their name. Unassigned tasks are indicated accordingly.

### Show due, follow up, and completion dates conditionally in task tiles <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2075 -->

Due date, follow-up, and completion dates are now conditionally displayed in the task tiles depending on the selected sort criteria.

### Show "completed by" info in completed tasks <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2074 -->

Completed tasks are now indicated by a corresponding label in the task details.

### Highlight overdue task tiles <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2069 -->

Overdue tasks are now highlighted with an indicator.

### Show invalidation message when required fields are empty on submit <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2067 -->

Users now receive an invalidation message if required fields are empty or the field input is invalid when submitting a form.

### Simple browser notification <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2061 -->

Tasklist users can now receive a [browser notification](/components/tasklist/userguide/using-tasklist.md#work-on-assigned-tasks) when new tasks are assigned to them. This requires Tasklist to run in the background.

### HTML viewer component <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2052 -->

Developers can now add an [HTML viewer component](/components/modeler/forms/form-element-library/forms-element-library-html.md) to forms to render custom HTML with CSS. The HTML can be templated with process/form variables using expressions, which are sanitized to prevent XSS and clickjacking attacks. The CSS is scoped to the component, and does not impact the remaining form or embedding application.

### Reports on task assignment <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

The first iteration of this feature brings back existing features from Camunda 7 to Camunda 8. It is now possible to aggregate the duration of user tasks in the states `Assigned` and `Unassigned` for a `User Task` or `Assignee`. The evaluation per `Assignee` can be switched off via a configuration. See the new options in the user task report.

### Zeebe REST API infrastructure to build user task API <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/2039 -->

The first step to offer an intuitive and consistent experience via a single, [unified Camunda 8 REST API](https://camunda.com/blog/2024/03/streamlining-camunda-apis-zeebe-rest-api/) is to provide the Zeebe REST API. With this release, developers can use the Zeebe REST API to manage [Zeebe user tasks](/apis-tools/migration-manuals/migrate-to-camunda-user-tasks.md), enabling immediate task state changes. The Zeebe REST API includes support for Identity authentication and multi-tenancy, ensuring parity to the Zeebe gRPC API.

### Refactoring suggestions <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/2010 -->

Introducing AI-driven [refactoring suggestions](/components/modeler/web-modeler/advanced-modeling/refactoring-suggestions.md) in our modeling canvas, designed to refine your BPMN models based on task descriptions. Enter a description, like `Send a message`, and immediately receive a practical suggestion, such as implementing it through a Slack Connector. This feature aims to streamline your workflow, offering intuitive, actionable advice for transforming descriptions into efficient BPMN tasks.

### Frontend developer documentation <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2004 -->

Developers now find [documentation](/apis-tools/frontend-development/01-task-applications/01-introduction-to-task-applications.md) about how to build custom frontends using Camunda's APIs and tools, including form-js.

### KPI Report Wizard framework <span class="badge badge--long" title="This feature affects Optimize">Optimize</span>

<!-- https://github.com/camunda/product-hub/issues/2001 -->

The [KPI Wizard]($optimize$/components/userguide/process-KPIs) is the new way to build a KPI report quickly. The Wizard already contains predefined KPIs that can be selected. It guides the users through the needed customization and allows them to activate an alert that allows passive monitoring. The list of predefined KPIs will be extended with upcoming releases. Start setting up a first process KPI now.

### Use secrets in hybrid mode <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/1999 -->

You are now able to consume the [secrets](/guides/use-connectors-in-hybrid-mode.md#using-saas-secrets) from the console in your own custom Connector connected to our Camunda 8 SaaS platform.

### Multi-region: Productize the two regions, Active-Active, Self-Managed setup (Zeebe, Operate, Tasklist) <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1963 -->

You can now run Zeebe, Operate, and Tasklist across [two geographical regions](/self-managed/concepts/multi-region/dual-region.md). This allows Camunda 8 to run in a mix of active-active and active-passive setups, resulting in an overall **active-passive** setup. You will find installation and failover guides to help you recover quickly and safely from whole region failures.

:::note
Optimize, Identity, and Connectors are not supported in dual-region setups yet.
:::

### REST Postman collection to Connector template converter <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/1947 -->

Via a command line tool, you can now generate your Connector template based on our REST Connector from a Postman collection. This supports multiple operations and splitting up the body into single fields.

### SOAP SDK support (Self-Managed + Hybrid) <span class="badge badge--long" title="This feature affects Connectors">Connectors</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

You can now connect to a SOAP service via our Camunda Connector. The first iteration of this Connector will only be available in SM and as hybrid setup.

### Process blueprint import via link <span class="badge badge--long" title="This feature affects Marketplace">Marketplace</span>

<!-- https://github.com/camunda/product-hub/issues/1843 -->

You can directly use process blueprints from our [marketplace](https://marketplace.camunda.com/) in your SaaS Web Modeler by clicking **For SAAS**. The blueprint will be downloaded to Web Modeler and is ready to use.

### Process instance migration II <span class="badge badge--long" title="This feature affects Operate">Operate</span>

<!-- https://github.com/camunda/product-hub/issues/1829 -->

Operations engineers now have enhanced capabilities to [migrate process instances](/components/concepts/process-instance-migration.md) to solve problems with process definitions and utilize the latest process improvements. Operators can migrate running instances with active user tasks, embedded subprocesses, and target activities with boundary message events. This applies to instances with active and incident states.

### Provide additional lifecycle events (parity to Tasklist today) in the event stream <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/1823 -->

Zeebe becomes the only component responsible for managing the state of the user task with the introduction of the new user task type. With simplified application architecture, developers benefit from a more consistent experience in finding all state modification APIs in Zeebe. This centralized approach streamlines development efforts, making it easier to implement unit tests and assert user task states effectively.

### (Appdirect) Public marketplace supports process blueprints <span class="badge badge--long" title="This feature affects Marketplace">Marketplace</span>

<!-- https://github.com/camunda/product-hub/issues/1790 -->

Our marketplace now supports process blueprints as well. You can discover a wide range of Camunda, partner, and community blueprints in our [marketplace](https://marketplace.camunda.com/).

### Console Self-Managed <span class="badge badge--long" title="This feature affects Console">Console</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1376 -->

We are excited to announce the release of a new Camunda 8 component - [Camunda Console Self-Managed](/self-managed/console-deployment/overview.md), the new console has been developed to enhance the management and monitoring of Camunda 8 installations within an enterprise installation. It facilitates a clear and concise overview of the Camunda platform as deployed within Kubernetes environments, making operational tasks more streamlined and efficient.

### Rolling updates for Zeebe Self-Managed <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/256 -->

Zeebe now supports rolling updates, which means you can update Zeebe to the latest patch or minor version without downtime of the whole cluster.

Follow our instructions in the update guides to update one broker after the other one.

:::note
You cannot update alpha versions.
:::

### BPMN compensation events and handlers <span class="badge badge--long" title="This feature affects Zeebe">Zeebe</span>

<!-- https://github.com/camunda/product-hub/issues/219 -->

In process orchestration, executed tasks may need to be canceled later under certain circumstances. BPMN compensation events and handlers allow you to undo or reverse the effects of activities in case of errors, exceptions, or cancelations, ensuring consistency, reliability, and compliance in complex business scenarios. Compensation supports the [Saga pattern](https://blog.bernd-ruecker.com/saga-how-to-implement-complex-business-transactions-without-two-phase-commit-e00aa41a1b1b), and Zeebe as Saga Coordinator helps to solve transactions without two-phase-commit in distributed systems.

### Create a (REST-based) Connector From a OpenAPI/Swagger specification <span class="badge badge--long" title="This feature affects Connectors">Connectors</span>

<!-- https://github.com/camunda/product-hub/issues/137 -->

Via a command line tool, you can now generate your Connector template based on our REST Connector from an OpenAPI specification. We are supporting multiple operations and splitting up the body to single fields.

## 8.5.0-alpha2

| Release date  | Changelog(s)                                                                                                                                                                         |                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 12 March 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda-platform/releases/tag/8.5.0-alpha2) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.5.0-alpha2) | [Release blog](https://camunda.com/blog/2024/03/camunda-alpha-release-march-2024/) |

### Allow multiple candidate groups in TaskSearchRequest <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2118 -->

Developers can now filter for multiple candidate groups, users, or assignees in the same call when searching for tasks via the API. See search tasks.

### Indicate processes that have a start form in processes page <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2032 -->

Process tiles in Tasklist now indicate when a form must be submitted in order to start the process. The tiles can be filtered based on this property.

### User group management for Tasklist <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span> <span class="badge badge--long" title="This feature affects SaaS">SaaS</span>

<!-- https://github.com/camunda/product-hub/issues/1978 -->

By default, task users can now only access the tasks for which they are authorized (either assigned to the task or part of a candidate group). Admins can change this behavior per cluster, for example, to deactivate these restrictions in development clusters. See [user task access restrictions](/components/concepts/access-control/user-task-access-restrictions.md).

### Multi-tenancy support with other OIDC providers <span class="badge badge--long" title="This feature affects Identity">Identity</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1976 -->

You can now use multi-tenancy with your own OIDC Identity provider (such as Entra ID) and Camunda 8 without relying on Keycloak. Create tenants and define mapping rules within Identity.
Mapping rules allow you to automatically assign users or client credentials to specific tenants or roles based on authentication token claims.

### Role management with OIDC in Self-Managed <span class="badge badge--long" title="This feature affects Identity">Identity</span> <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1971 -->

You can now use Role-Based Access Control (RBAC) with your own OIDC Identity Provider (i.e. Entra ID) and Camunda 8 web applications without relying on Keycloak.

Create roles within Identity, assign component-specific permissions (such as view-only Operate) to the roles. Then, create [mapping rules](/self-managed/concepts/mapping-rules.md) to automatically assign users to specific roles based on authentication token claim values.
Role Mapping is not yet supported for Web Modeler, but will follow.

### Intuitive modeling <span class="badge badge--long" title="This feature affects Modeler">Modeler</span>

<!-- https://github.com/camunda/product-hub/issues/1652 -->

This update introduces a new context pad, designed to make modeling actions like appending elements, connecting them, and adjusting properties more intuitive and accessible. Ideal for both new and seasoned modelers, it brings familiar UX patterns to your fingertips, simplifying your modeling workflow for greater efficiency and ease of use.

## 8.5.0-alpha1

| Release date     | Changelog(s)                                                                                                                                                                         | Release blog                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 13 February 2024 | - [ Camunda 8 core ](https://github.com/camunda/camunda-platform/releases/tag/8.5.0-alpha1) <br /> - [ Connectors ](https://github.com/camunda/connectors/releases/tag/8.5.0-alpha1) | [Release blog](https://camunda.com/blog/2024/02/camunda-alpha-release-february-2024/) |

### Deep link to process with start form in Tasklist <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2035 -->

Users can now share processes with start forms with users inside their organization via Tasklist.

The shared processes require Tasklist authorization to be started, in contrast to public forms. See [starting processes](/components/tasklist/userguide/starting-processes.md).

### Autopick next task <span class="badge badge--long" title="This feature affects Tasklist">Tasklist</span>

<!-- https://github.com/camunda/product-hub/issues/2026 -->

Users now have the option to [automatically select](/components/tasklist/userguide/using-tasklist.md#auto-select-first-available-task) the next available task in Tasklist to speed up task workflows.

### Hot backups: Azure Cloud Storage support <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

<!-- https://github.com/camunda/product-hub/issues/1785 -->

Zeebe Hot Backups can now be stored in Azure Cloud Storage. This means you can now take a [Hot Backup](/self-managed/operational-guides/backup-restore/backup-and-restore.md) with your Azure Cloud Storage for Zeebe, Operate, Tasklist and Optimize since Elasticsearch supports Azure Cloud Storage as well.
