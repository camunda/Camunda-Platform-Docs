---
id: process-application-pipeline
title: Process application development lifecycle
description: You can use Web Modeler to quickly develop and progress low-risk process application releases through the stages of a typical development lifecycle.
---

import DeployProcessApplicationDiagramImg from './img/process-applications/diagram-process-application-pipeline.png'
import DeployStagesImg from './img/process-applications/define-stages.png'
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

You can use Web Modeler to quickly develop and progress low-risk process application releases through the stages of a typical development lifecycle.

<p><img src={DeployProcessApplicationDiagramImg} alt="Process application file list" /></p>

:::caution
For business-critical and higher-risk processes that require strict governance and/or quality requirements, you can [integrate Web Modeler into your CI/CD pipelines](/guides/devops-lifecycle/integrate-web-modeler-in-ci-cd.md).
:::

## Model

During the modeling stage, you will typically:

- [Create a process application](create-a-process-application.md) and select a default development cluster to deploy to.
- Invite other users to collaborate on the process application.
- Define and set up the clusters and deployment stages you will use in your development pipeline.
- Model your diagrams and associated resources, and fix errors shown in the modeler.
- Use [token simulation](token-simulation.md) to correct and optimize your process flow.

### Deployment pipeline stages

You can use the provided Web Modeler deployment pipeline to manage your application process deployment. The deployment pipeline has four stages named **Development**, **Testing**, **Staging**, and **Production**.

| Stage       | Description                                                                                                     |
| :---------- | :-------------------------------------------------------------------------------------------------------------- |
| Development | Use to create and test new software features and changes.                                                       |
| Testing     | Use for quality checks, ensuring software meets defined standards before release.                               |
| Staging     | Use for controlled testing where changes are validated before deployment to production.                         |
| Production  | The live system with the latest software. Only administrators and organization owners can deploy to this stage. |

To define your deployment pipeline stages:

1. Open the [main process](create-a-process-application.md#main-process).
1. Select **Deploy** to open the **Deploy process application** modal.
1. Select **Define stages** to open the **Define stages** modal.
   <p><img src={DeployStagesImg} alt="Define stage for deployment modal" /></p>
1. Select and assign a cluster to each deployment stage that you want to use in your deployment pipeline.
1. Select **Save** to save your changes and close the modal.

:::note

- An administrator must define the cluster to deploy to for each stage.
- During deployment, the next stage is not automatically selected. You must select the stage you want to promote to.
- You must select a cluster for at least one stage to be able to deploy. An **Undefined stages** warning is shown if no cluster is selected for at least one stage.

:::

## Validate

When your process application is ready for validation you can deploy it to your development cluster.

- Use [Play mode](play-your-process.md) to quickly validate the process behavior and play different scenarios.
- Validate that all files and resources are correctly deployed.

:::note
Play is being rebuilt and progressively rolled out to more users. See [Play limitations and availability](/docs/components/modeler/web-modeler/play-your-process.md#limitations-and-availability) for Play limitations and why you might not see the **Play** tab.
:::

## Review

After validation is complete, you can [create a new version of your process application](/components/modeler/web-modeler/process-application-versioning.md#create-a-bulk-version) and request a review:

1. Use [process application versioning](process-application-versioning.md) to create a version for all files in the process application. You can [compare versions](/components/modeler/web-modeler/versions.md#compare-versions) to visually review changes between two versions of a BPMN file, or view code changes for other files.
2. Request a review for the newest version of the process application from the version history page of the process application. Collaborators with edit permission in your project will see a notification on the process diagram page once you have requested a review.
3. Reviewers can view the changes, comment, request changes, or approve the process application version.
4. After a user has submitted their review, the process application version is marked as reviewed and the review status is shown in the version history.
   1. Users can go back and edit the review at any point in time to update their assessment.
   2. Any changes to the review status of a version are logged in the comment section of the main process diagram.
5. If the reviewer has marked the version with "changes requested", you can address the feedback by performing the requested changes, creating a new version, and requesting a review for the new version.

This review capability is most useful for reviews on a business level.
For technical reviews, you may instead use [Git Sync](git-sync.md) to put changes into a technical context with related code changes.

:::info
To ensure proper evaluation, users (except organization administrators) cannot review versions they create.
:::

## Promote

After the review is complete, you can promote the versioned process application to the next stage(s) of the deployment pipeline. For example, promote to your testing cluster/stage, then to staging, and finally to production.

:::info
If you want to use your own deployment pipeline after the review is complete, you can use [Git Sync](git-sync.md) at this point to deploy and promote the process application through your own pipeline.
:::

### Deployment policy

By default, only organization administrators can deploy process applications to the `prod` tagged clusters.
Organization administrators can change this policy in the [process application deployment settings](/components/modeler/web-modeler/web-modeler-settings.md#process-application-deployment).

From these settings, you can enable non-admin users with deployment permissions to deploy process applications to prod after a collaborator has approved the process app version using the [process application version review](process-application-pipeline.md#review).

## Process governance

The Web Modeler development lifecycle provides the following process governance:

| Governance         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change control     | Reviews cannot be performed by the user who created the process application version unless the user is an organization administrator. Reviews can be edited, but changes will be logged in the comment thread of the main process.                                                                                                                                                                                                               |
| Deployment control | <p><ul><li><p>Deployments can only be made to the pre-defined set of approved clusters.</p></li><li>Only users with correct privileges can deploy. Depending on the [deployment settings](/#deployment-settings), organization administrators can deploy to `prod` tagged clusters, or only approved versions can be deployed.</li><li>Each deployment action is logged with information on the user and stage it was deployed to.</li></ul></p> |
