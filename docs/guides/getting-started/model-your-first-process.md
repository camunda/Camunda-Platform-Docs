---
id: model-your-first-process
title: Model your first process
description: "Use Modeler to design and deploy a process."
---

<span class="badge badge--beginner">Beginner</span>
<span class="badge badge--short">Time estimate: 10 minutes</span>

## Prerequisites

- Web Modeler or [Desktop Modeler](https://camunda.com/download/modeler/)

## Design and deploy a process

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

In Camunda Cloud, you have two options to design and deploy a process: Web Modeler and [Desktop Modeler](https://camunda.com/download/modeler/).

<Tabs groupId="modeler" defaultValue="web" values={
[
{label: 'Web Modeler', value: 'web', },
{label: 'Desktop Modeler', value: 'desktop', },
]
}>

<TabItem value='web'>

Using Web Modeler, processes are designed and deployed, and new instances are created directly from the console. Take the following steps:

1. Go to the **Modeler** tab at the top of the page.
2. Open any project from your Web Modeler home view.
3. Click the blue **New** button and choose **BPMN Diagram**.

![console-modeler](../../components/modeler/web-modeler/img/web-modeler-new-user-new-diagram-choose-bpmn.png)

3. Add an **EndEvent** to create a valid BPMN diagram.

![console-modeler-new-diagram-with-end-event](../../components/modeler/web-modeler/img/web-modeler-with-end-event.png)
![console-modeler-new-diagram-with-end-event](../../components/modeler/web-modeler/img/web-modeler-with-end-event2.png)

4. No need to save. Web Modeler will autosave every change you make

</TabItem>

<TabItem value='desktop'>

Using Desktop Modeler, processes are designed and deployed, and new instances are created.

Design a simple process with one start event and one end event, or download this [BPMN model](./bpmn/gettingstarted_quickstart.bpmn).

![zeebe-modeler](./img/zeebe-modeler.png)
</TabItem>
</Tabs>

## Next steps

- [Deploy and start your process instance](deploy-your-process-and-start-process-instance.md)
