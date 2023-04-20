---
id: managing-user-access
title: "Managing user access to Identity"
sidebar_label: "Managing user access"
---

In this guide, you will learn about the different access levels users can receive within the Identity application.

## Permissions supported by Identity

Identity implements the following permissions:

- `read`: Users can access all pages in Identity. They _cannot_ create, modify, or delete any data.
- `read:users`: Users can access only the **Users** page and related subpages.
- `write`: Users have access to all pages. They can create, modify, and delete data.

You can [assign the above permissions to users as part of a role](assigning-a-role-to-a-user.md).
This gives the user access to the Identity application.

## Assign Identity permissions to a user

Users are always able to use Identity to login to the components.
However they are unable to access the Identity UI without at least one of the permissions listed above.

To grant a user access to the UI, you need to assign at least one Identity permission as part of a role to the user. This can be achieved in one of the following ways:

### Use our component presets

When you start Identity with our pre-configured Keycloak container, Identity creates the `Identity` role automatically.
The role contains the necessary permissions to give a user full read and write access to Identity.

[Assign the `Identity` role to a user](assigning-a-role-to-a-user.md) to enable the user to access the Identity UI.

### Create a custom role

When using an existing Keycloak instance, or if you want to create your own set of permissions, follow our guides to
[create a new role](adding-a-role.md) and [assign it to users](assigning-a-role-to-a-user.md).
