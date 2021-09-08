---
id: overview
title: Overview and example use case
---

## What can I do with Tasklist?

Tasklist shows you all user tasks that appeared in processes; those processes are running in Zeebe.

User tasks need an interaction from the user. This can be updating, adding variables, filling out a Camunda Form, or simply completion of the task. The user must first claim a task or unclaim an already claimed task.

If the user claimed a task, the task is completable. Different task status filters help the user choose the desired task.

## Example use case 

If you've successfully logged in, you'll see a screen similar to the following:

![tasklist-start-screen](../img/tasklist-start-screen_light.png)

On the left side of the screen, you can see tasks. On the right side of the screen, you can see details of the current selected task.

Change the list of tasks by applying filters. You can also collapse and expand the task list.

You can choose which tasks you want to see: 

* All open
* Claimed by me
* Unclaimed
* Completed

Initially, we have no **Claimed by me** tasks.

![tasklist-claimed-by-me-empty](img/tasklist-claimed-by-me-empty_light.png)

### Claimed by me tasks

Select the **Unclaimed** list and claim a task using the **Claim** button on the details panel:

![tasklist-claim](img/tasklist-claim_light.png)

### Claim a task

Select the **Claimed by me** list to see if you claimed the task:

![tasklist-claimed-by-me-list](img/tasklist-claimed-by-me-list_light.png)

### Complete a task

Once you've claimed a task, you can complete the task by adding and updating variables, and using the **Complete Task** button:

![tasklist-claimed-by-me](img/tasklist-claimed-by-me_light.png)

Always choose a list of tasks with a specified status and then select the task you want to work on.

Complete the task and check if it is shown in the **Completed** list.

Change variables as needed and begin completion with **Complete Task**.

#### Add and update variables

![tasklist-complete-task](img/tasklist-complete-task_light.png)

### Completed tasks

You will now see the completed task by selecting the **Completed** task list:

![tasklist-task-completed](img/tasklist-task-completed_light.png)
