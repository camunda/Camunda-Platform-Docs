---
id: manage-users
title: Manage users of your organization
description: "Let's take a closer look at the rights and responsibilities of users in your organization."
---

## General rights concept

When a user signs up for Camunda Cloud, they receive a personal organization. Clusters the user creates in this organization are assigned to this organization.

If several users need access to the same Zeebe cluster, all users can be assigned to the same organization.

## Users

The first user in an organization is the owner of the organization. An owner has all rights in an organization and can manage all settings accordingly. An organization cannot have more than one owner.

To change the owner of the organization, utilize the user administration. The current owner selects another member of the organization, and selects **Assign as Owner** from the menu. In the dialog that appears, select which new roles are to be assigned to the current owner.

### Roles and permissions

In addition to the owner, the **Admin** role is available as a second role with comprehensive rights. The admin role has the same rights as the owner, with the difference that an admin cannot manage other admins.

The following roles are additionally available, providing dedicated rights for specific elements in Camunda Cloud.

- **Operations Engineer**: Full access to Console and Operate, except cluster deletion privileges
- **Analyst**: Full access to Optimize and read-only access to clusters
- **Task User**: Full access to Tasklist and read-only access to clusters
- **Developer**: Full access to Console, except deletion privileges; full access to Operate and Tasklist
- **Visitor**: Read-only access

Users can be assigned multiple roles. For example, a user can have the role of **Operations Engineer** and **Task User**, which gives them access to **Operate** and **Tasklist**.

Users are invited to a Camunda Cloud organization via their email address, which must be accepted by the user. As long as the invitation has not been accepted, the user remains in the `Pending` state.

People who do not yet have a Camunda Cloud account can also be invited to an organization. To access the organization, however, the invited individual must first create a Camunda Cloud account by following the instructions in the invitation email.
