---
id: web-modeler-settings
title: Web Modeler settings
description: Configure email notifications and process application deployment policies in the Web Modeler settings.
---

import WebModelerSettings from './img/web-modeler-settings/web-modeler-settings.png'
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

Navigate to the Web Modeler settings by clicking on your user icon in the top right corner of the Web Modeler and selecting **Settings**. Here, you can configure email notifications and the process application deployment policy.

<img src={WebModelerSettings} alt="Web Modeler settings" />

## Email notifications

Configure the projects for which you will receive email notifications when a collaborator mentions you in a comment.

To do this, select the top right **Open Settings** user icon in Web Modeler and click **Settings**. Here under **Email notifications**, toggle on or off the options to receive email notifications when you are mentioned in a comment for all projects and new projects.

## Process application deployment

Organization admins can configure the deployment policy for process applications in the Web Modeler settings.

<Tabs groupId="deployment-permissions" defaultValue="saas" queryString values={
[
{label: 'SaaS', value: 'saas' },
{label: 'Self-Managed', value: 'self-managed' },
]}>

<TabItem value='saas'>

By default, only organization administrators can deploy process applications to clusters marked as
[production stages](/components/modeler/web-modeler/process-application-pipeline.md#deployment-pipeline-stages) from Web Modeler.

You can change this in the **Process application deployment** settings. To get there, select the top right **Open Settings** user icon in Web Modeler and click **Settings**. Then, select **Process application deployment**.

Here, you can permit non-admin users with deployment permissions to deploy process application versions to production stage clusters
after a collaborator has reviewed and approved the process application version using the
[process application review](/components/modeler/web-modeler/process-application-pipeline.md#review) feature.
This setting can only be configured by organization admins and applies to all process applications in the organization.

</TabItem>

<TabItem value='self-managed'>

By default, only users with the **Web Modeler Admin** role can deploy process applications to
clusters marked as [production stages](/components/modeler/web-modeler/process-application-pipeline.md#deployment-pipeline-stages) from Web Modeler.

You can change this in the **Process application deployment** settings. To get there, select the top right **Open Settings** user icon in Web Modeler and click **Settings**. Then, select **Process application deployment**.

Here, you can permit non-admin users with deployment permissions to deploy process application versions to production stage clusters
after a collaborator has reviewed and approved the process application version using the
[process application review](/components/modeler/web-modeler/process-application-pipeline.md#review) feature.
This setting can only be configured by users with the **Web Modeler Admin** role and applies to all process applications.

If the **Web Modeler Admin** role is not pre-existing, it can be created with the following permissions:

- Web Modeler Internal API - `write:*`
- Web Modeler Internal API - `admin:*`
- Web Modeler Internal API - `admin:*`
- Camunda Identity Resource Server - `read:users`

Refer to the documentation pages about [assigning roles](../../../self-managed/identity/user-guide/roles/add-assign-role.md) and [adding permissions](../../../self-managed/identity/user-guide/roles/add-assign-permission.md) for detailed instructions.

</TabItem>

</Tabs>

:::info
The deployment policy applies only to deployments of **process applications** made from Web Modeler.
Deployments made from Desktop Modeler and deployments of single BPMN files, for example, are not affected by this setting.
:::
