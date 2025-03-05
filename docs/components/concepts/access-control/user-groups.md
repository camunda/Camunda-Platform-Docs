---
id: user-groups
title: "User groups"
sidebar_label: "User groups"
description: "Control the level of access a user or group has to perform tasks in the system via user task access restrictions."
---

User groups are a way to organize users in the system. Use them to manage access to user tasks via [user task restrictions](user-task-access-restrictions.md).

## Creating a group

To create a group, navigate to the **Organization** section of Console and click on the **Groups** tab.

![Groups Management](../assets/access-control/group-management.png)

Click **Create a group** and enter the name of the group.

![Create a group](../assets/access-control/create-group.png)

## Adding users to a group

To add users to a group, navigate to the **Organization** section of Console and click **Users > Assign members**.

![Groups Members](../assets/access-control/group-members.png)

Select the user you want to add to a group and click **Assign**.

![Assign a Member](../assets/access-control/assign-member.png)

## User task access restrictions

User task access restrictions allow you to restrict access of user tasks in [Tasklist](/components/tasklist/introduction-to-tasklist.md) to users or groups where they are assignees or candidates.

For example, if a task has a candidate group named `Team A` and a candidate user named `example`, only the users that belong to `Team A` and the user `example` will have access to the task.

To learn more, visit the [user task access restrictions documentation](/components/concepts/access-control/user-task-access-restrictions.md).
