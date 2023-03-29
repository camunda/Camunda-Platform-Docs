---
id: creating-authorizations-for-a-group
title: "Creating autorizations for a group"
sidebar_label: "Groups are a way to apply a set of roles and authorizations to users. Use Identity to create authorizations for a group."
---

In this guide we will show you how to use Identity to create authorizations for a group.

:::caution Write access needed
To create an authorization for a group, you must have write access to Identity. Read our [guide on managing user access](../managing-user-access.md) to learn more.
:::

1. Log in to the Identity UI and navigate to the **Groups** tab. Select the group you would like to create an authorization for from the table, and click on the **Authorizations** tab:

![create-authorization-for-group-tab](../img/create-authorization-for-group-tab.png)

2. Click **Create resource authorization** and a modal will open:

![create-authorization-for-group-modal-1](../img/create-authorization-for-group-modal-1.png)

3. Select the type of resource you are creating an authorization for, and click **Next**:

![create-authorization-for-group-modal-2](../img/create-authorization-for-group-modal-2.png)

4. Input the ID of the resource you would like to create an authorization for, select the resource from the list, and click **Next**:

![create-authorization-for-group-modal-3](../img/create-authorization-for-group-modal-3.png)

5. Select the permissions you would like to assign and click **Create**:

![create-authorization-for-group-modal-4](../img/create-authorization-for-group-modal-4.png)

On confirmation, the modal closes, the table updates, and your authorization is shown:

![create-authorization-for-group-refreshed-modal](../img/create-authorization-for-group-refreshed-table.png)
