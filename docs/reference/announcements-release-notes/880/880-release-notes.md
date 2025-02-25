---
id: 880-release-notes
title: "Release notes"
description: "Release notes for 8.8, including alphas"
keywords:
  [
    "product development lifecycle",
    "software development lifecycle",
    "CI/CD",
    "AI",
  ]
---

These release notes identify the new features included in 8.8, including [alpha feature releases](/components/early-access/alpha/alpha-features.md).

## 8.8 minor

| Scheduled release date | Scheduled end of maintenance | Changelog(s) | Release blog | Update guide |
| ---------------------- | ---------------------------- | ------------ | ------------ | ------------ |
| 14 October 2025        | 13 April 2027                | -            | -            | -            |

## 8.8.0-alpha1

| Release date     | Changelog(s)                                                                                                                                                                               | Blog                                                                                  |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 11 February 2025 | <ul><li>[ Camunda 8 core ](https://github.com/camunda/camunda/releases/tag/8.8.0-alpha1)</li><li>[ Connectors ](https://github.com/camunda/connectors/releases/tag/8.8.0-alpha1)</li></ul> | [Release blog](https://camunda.com/blog/2025/02/camunda-alpha-release-february-2025/) |

:::note
Some features available in 8.8.0-alpha1 were originally released in [8.7.0 alphas](/reference/announcements-release-notes/870/870-release-notes.md). These features are longer planned for release in 8.7.0. For more information, see the Camunda 8.7 and 8.8 [release update blog](https://camunda.com/blog/2025/01/camunda-87-88-release-update/).
:::

### User task listeners <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Modeler">Modeler</span><span class="badge badge--medium" title="This feature affects Operate">Operate</span>

Task lifecycle management is enhanced with user task listeners, allowing users to react to specific user task lifecycle events.

- Process designers can now model task listeners for different events, such as `assigning` and `completing`.
- Developers can use the same job infrastructure to activate and complete task listener jobs.
- Operations engineers can easily check details of active and completed task listeners within instances, and efficiently resolve task listener incidents.

This enhancement streamlines operations and ensures smoother incident handling, improving time to unblock process execution.

To learn more about this feature, see [user task listeners](/components/concepts/user-task-listeners.md).

<!-- https://github.com/camunda/product-hub/issues/2126 -->

### Camunda 8 REST API Query API <span class="badge badge--medium" title="This feature affects APIs">API</span>

You can now use a single Query API in the Camunda 8 REST API to find process and decision data instead of using multiple component APIs.

For example, send a request to the [Query decision definitions](/apis-tools/camunda-api-rest/specifications/find-decision-definitions.api.mdx) endpoint to search for decision definitions.

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

To learn more about these endpoints, see the [Camunda 8 REST API](/apis-tools/camunda-api-rest/camunda-api-rest-overview.md#query-api) documentation.

### Amazon OpenSearch Optimize support <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Optimize">Optimize</span>

Camunda 8 Self-Managed now fully supports the use of Amazon OpenSearch with Optimize.

<!-- https://github.com/camunda/product-hub/issues/2473 -->

### Process instance migration <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Zeebe">Zeebe</span>

Enhanced process instance migration allows you to solve problems with process definitions and use the latest process improvements.

You can now migrate the following:

- Compensation boundary event subscriptions
- Escalation boundary events
- Escalation event subprocesses

To learn more about migration, see [process instance migration](/components/concepts/process-instance-migration.md).

<!-- https://github.com/camunda/product-hub/issues/1314 -->

### Camunda Exporter <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

A new Camunda Exporter brings the importer and archiving logic of web components (Tasklist and Operate) closer to the distributed platform (Zeebe). The index schema is also being harmonized.

To learn more about this feature, see the [Camunda Exporter documentation](/self-managed/zeebe-deployment/exporters/camunda-exporter.md).

### Backup and restore improvements <span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span>

Camunda backups have been improved and made easier to use. The web application backups are now merged together under one endpoint.

<!-- https://github.com/camunda/camunda/issues/24456 -->

### Connector Runtime <span class="badge badge--long" title="This feature affects SaaS">SaaS</span><span class="badge badge--long" title="This feature affects Self-Managed">Self-Managed</span><span class="badge badge--medium" title="This feature affects Connectors">Connectors</span>

#### Spring SDK and Camunda REST API Migration

The Connectors experience is enhanced with the migration from the Spring Zeebe to the Camunda REST API, and the removal of dependency on the Operate client.
