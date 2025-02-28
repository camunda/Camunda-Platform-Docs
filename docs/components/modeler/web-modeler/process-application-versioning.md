---
id: process-application-versioning
title: Process application versioning
description: Process applications allow you to deploy multiple related files together in a single bundle.
---

:::note
With 8.7, "milestone" has been renamed to "version". To learn more about this change, see [the related announcement](/reference/announcements-release-notes/870/870-announcements.md#web-modeler-milestones-renamed-to-versions).
:::

Although you cannot version a process application itself, you can use [bulk version creation](versions.md#bulk-version-creation) and version tags to save a single snapshot of all the process application files in one action, instead of having to create separate versions for every file.

- When you create a version in any process application file, a version is also created with the same name (version tag) for all files currently available in the process application.

- This allows you to track a process application through the development lifecycle and ensure the correct version is called.

## A worked example

In this example, you have a process application that contains multiple files as well as the main process.

- You create a new version for the main process and enter "1.2" as the version tag.
- When you create this new version, a version is also created for every other file and named with the same "1.2" version tag.
- All files in the process application now have a "1.2" version.

![Diagram showing an example process application bulk version creation](img/process-applications/process-application-version-diagram.png)

## Create a bulk version

To create a bulk version for a process application:

1. Open any file in a process application and [create a version](versions.md#create-a-version).
1. Enter a **Version tag**.
1. Select **Create** to create the version for every file in the process application.

![Create a version screen](img/versions/web-modeler-version-create-versioned-milestone-highlight.png)

Now when you open the versions list for any file in the process application, you can use the file navigation header buttons to switch between files, and view their individual versions list. See [compare versions](/components/modeler/web-modeler/versions.md#compare-versions).

![Versions list with file navigation header buttons highlighted](img/versions/web-modeler-version-compare-process-application-files-highlight.png)

:::note

When naming your version with a version tag, you cannot edit or delete the created versions.

:::
