---
id: orchestrate-human-tasks
title: Getting started with Human Task Orchestration
sidebar_label: Getting started with Human Task Orchestration
description: "Efficiently allocate work through user tasks."
keywords: [human tasks, orchestration, getting started, user guide]
---

Using [Camunda Platform 8](https://camunda.io), you can orchestrate human tasks by assigning them to users. Then, users can enter the necessary data to drive the business process.

When a process instance arrives at such a user task, a new job similar to a service task is created. The process instance stops at this point and waits until the job is completed. Applications like [Tasklist](../components/tasklist/introduction.md) can be used by humans to complete these tasks.

While it may originally seem like the goal of automating a process is to remove humans entirely, efficiently allocating work through user tasks can be even more beneficial.

In this guide, we’ll step through one way to create an automated process utilizing user tasks – all entirely executable in the browser.

## Create a cluster

import CreateCluster from './assets/react-components/create-cluster.md'

<CreateCluster/>

## Create an automated process with user tasks

To create an automated process with user tasks, take the following steps:

### Develop your automated process with user tasks

1. To create a BPMN diagram, navigate to Web Modeler via the **Modeler** tab, and click **New project**.
2. Name your project and select **New > BPMN Diagram > + Create blank**.
3. Give your model a descriptive name, and then give your model a descriptive id within the **General** tab inside the properties panel on the right side of the screen. In this case, we've named our model `Preparing dinner` with an id of `preparing-dinner`.
   ![modeler example](./img/modeler-example.png)
4. Use Web Modeler to design a BPMN flow with user tasks. Create a user task by dragging the task icon from the palette, or click the existing start event and the displayed task icon.
5. Change the task type by clicking the wrench icon. Select **User Task**.
6. Add a descriptive name using the properties panel. In this case, we've named ours `Decide what's for dinner`.
7. Assign this task to a user or group using the properties panel.
   - User tasks support specifying assignments, using the `zeebe:AssignmentDefinition` extension element. This can be used to define which user the task can be assigned to. One or both of the following attributes can be specified simultaneously:
   - `assignee`: Specifies the user assigned to the task. Tasklist will claim the task for this user.
   - `candidateGroups`: Specifies the groups of users that the task can be assigned to.
     ![user task example](./img/user-task-example.png)
8. Append a gateway to your user task by dragging it onto the dashboard from the palette on the left side of the screen, or by clicking on the user task `Decide what's for dinner` and clicking on the element you'd like to create next. In this case, we've selected the diamond icon to create a gateway.
9. Create two sequence flows (represented by the arrows) from the gateway and two new user tasks based on what the user decides to eat. In this case, we've named ours `Prepare chicken` and `Prepare salad`.

- Note that the sequence flows require [expressions](../components/concepts/expressions.md) to access variables from the form we'll create below to determine what to eat for dinner. To add an expression, click on the sequence flow to view the properties panel, and open the **Condition** tab to insert a conditional expression.

11. Attach an end event to the two user tasks.

<div bpmn="getting-started-guides/prepare-dinner.bpmn" />

:::note
Variables are part of a process instance and represent the data of the instance. To learn more about these values, variable scope, and input/output mappings, visit our documentation on [variables](../components/concepts/variables.md).
:::

### Implement a form

1. To add a form and decide what's for dinner, return to the **Modeler** homepage and click **New > Form**.
2. Name your form. In this case, we've named ours **Decide what's for dinner**.
3. Click and drag the **Select** element onto the palette. Give this **Select** field a description within the properties panel. We've described ours as **What's for dinner?**
4. Scroll down to the **Values** section of the properties panel to add your values. For our dinner, we've created two values: one labeled **Chicken**, and one labeled **Salad**.

:::note
As mentioned earlier, you'll need to insert the defined variable values into the appropriate sequence flows to execute your process. In this example, our sequence flows will now have the expressions of `= chicken=true` and `= salad=true`.
:::

5. You can add the form to your BPMN diagram in a few ways:
   1. Within your form, click the rectangular **Copy JSON** icon to copy the form JSON to your clipboard. Navigate to your BPMN diagram, and click the appropriate user task. Within the properties panel of the user task, navigate to the **Form** section, select a **Type** of **Camunda forms** and paste your JSON into the **Form JSON configuration** field.
   2. Within your BPMN diagram, click the appropriate user task, and click the blue square icon in the bottom right corner of your user task. Select the form you'd like to apply to your user task, and click **Import**.

### Start and view your process instance

1. To deploy your diagram to your cluster, click **Deploy diagram > Deploy**.
2. To officially start a new process instance, click **Start instance**.
3. Navigate to [Operate](../components/operate/index.md) by clicking the honeycomb icon next to the **Start instance** button.
4. Click **View process instances** to see your process instance alongside the green token waiting at the user task.

![token moving through process](./img/user-task-token-1.png)

### Complete a user task

Within this example, we've included a form to demonstrate the completion of a human task. To learn more about creating forms within your diagrams, visit our guide on [building forms with Modeler](../components/modeler/bpmn/user-tasks/user-tasks.md#user-task-forms).

1. Go back to your Camunda Platform 8 diagram and select the honeycomb icon and then **View user tasks** to take a look at your user tasks inside Tasklist.
2. Select the open user task on the left panel of **Tasks**. In our example below, this is **Decide what's for dinner**.
3. Next to **Assignee**, click **Claim** to claim the task.
4. Once finished entering the appropriate information, click **Complete Task**.
   ![complete a human task in Tasklist](./img/user-task-tasklist.png)
5. On the left panel of **Tasks**, filter by **Completed** tasks to see your task has been finished.

You can now navigate back to Operate and notice the process instance has continued, and the token has moved forward.

The token moves through the exclusive gateway (also called the XOR gateway), and is used to model the decision in the process. When the execution arrives at this gateway, all outgoing sequence flows are evaluated in the order in which they have been defined. The sequence flow which condition evaluates to ‘true’ (or which doesn’t have a condition set, conceptually having a ‘true’ value defined on the sequence flow) is selected for continuing the process.

:::note
Here, after implementing your gateway, is when [expressions](../components/concepts/expressions.md) will become useful in accessing [variables](../components/concepts/variables.md) and calculating their value to move forward in a process.
:::

In this case, the token will move through the gateway and (according to the conditional expressions we outlined earlier) to the selected dinner based on the **Decide what's for dinner** user task we completed. If we select **Chicken**, the token moves forward to **Prepare chicken**. If we select **Salad**, the token moves forward to **Prepare salad**.

## Additional resources and next steps

- [BPMN user tasks](../components/modeler/bpmn/user-tasks/user-tasks.md)
- [Building Forms with Modeler](./utilizing-forms.md)
- [Introduction to Operate](../components/operate/index.md)
- [Introduction to Tasklist](../components/tasklist/introduction.md)
- [Intermediate Modeler example](https://github.com/NPDeehan/Whos50GameCamundaCloud)
