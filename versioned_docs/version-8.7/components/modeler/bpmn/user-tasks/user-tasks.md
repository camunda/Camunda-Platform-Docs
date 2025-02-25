---
id: user-tasks
title: "User tasks"
description: "A user task is used to model work that needs to be done by a human actor."
---

A user task is used to model work that needs to be done by a human and is assisted by a business process execution engine or software application. This differs from [manual tasks](/components/modeler/bpmn/manual-tasks/manual-tasks.md), which are not assisted by external tooling.

When the process instance arrives at a user task, a new user task instance is created at Zeebe.
The process instance stops at this point and waits until the user task instance is completed.
When the user task instance is completed, the process instance continues.

![user-task](assets/user-task.png)

## User task implementation types

A default user task implementation type is the **Camunda user task** with the `zeebe:userTask` extension element.
It is the recommended implementation type that is introduced on Camunda version 8.6.

Alternatively, user tasks can be implemented with **Job workers** by removing the `zeebe:userTask` extension element.
Refer to the [Job worker implementation](#job-worker-implementation) section for details.

## Camunda user tasks

Camunda user tasks support assignments, scheduling, task updates, variable mappings, and a form for a user task as detailed in the following sections.

:::note
The Camunda user task implementation type was previously referred to as the **Zeebe user task**.
:::

### Assignments

User tasks support specifying assignments, using the `zeebe:AssignmentDefinition` extension element.
This can be used to define which user the task can be assigned to. One or all of the following
attributes can be specified simultaneously:

- `assignee`: Specifies the user assigned to the task. [Tasklist](/components/tasklist/introduction-to-tasklist.md) will claim the task for this user.
- `candidateUsers`: Specifies the users that the task can be assigned to.
- `candidateGroups`: Specifies the groups of users that the task can be assigned to.

:::info
The assignee attribute must adhere to the userId field’s case-sensitivity requirements.
Note that in SaaS, all user IDs are converted to lowercase by default, as they are based on email addresses.
:::

:::info
Assignment resources can also be used for set user task restrictions ([SaaS](/components/concepts/access-control/user-task-access-restrictions.md)/[Self-Managed](docs/self-managed/concepts/access-control/user-task-access-restrictions.md)), where users will see only the tasks they have authorization to work on.
:::

Typically, the assignee, candidate users, and candidate groups are defined as [static values](/components/concepts/expressions.md#expressions-vs-static-values) (e.g. `some_username`, `some_username, another_username` and
`sales, operations`), but they can also be defined as
[expressions](/components/concepts/expressions.md) (e.g. `= book.author` and `= remove(reviewers, book.author)` and `= reviewer_roles`). The expressions are evaluated on activating the user task and must result in a
`string` for the assignee and a `list of strings` for the candidate users and a `list of strings` for the candidate groups.

For [Tasklist](/components/tasklist/introduction-to-tasklist.md) to claim the task for a known Tasklist user,
the value of the `assignee` must be the user's **unique identifier**.
The unique identifier depends on the authentication method used to login to Tasklist:

- Camunda 8 (login with email, Google, GitHub): `email`
- Default Basic Auth (Elasticsearch): `username`
- IAM: `username`

These assignees are not related to user restrictions, which is related to the visibility of the task in Tasklist for Self-Managed. For more information, see [Tasklist Authentication](/self-managed/tasklist-deployment/tasklist-authentication.md).

:::note
For example, say you log into Tasklist using Camunda 8 login with email using your email address `foo@bar.com`. Every time a user task activates with `assignee` set to value `foo@bar.com`, Tasklist automatically assigns it to you. You'll be able to find your new task under the task dropdown option `Assigned to me`.
:::

### Scheduling

User tasks support specifying a task schedule using the `zeebe:taskSchedule` extension element.
This can be used to define **when** users interact with a given task. One or both of the following
attributes can be specified simultaneously:

- `dueDate`: Specifies the due date of the user task.
- `followUpDate`: Specifies the follow-up date of the user task.

:::note
For example, you can use the `followUpDate` to define the latest time a user should start working on a task, and then
use the `dueDate` to provide a deadline when the user task should be finished.
:::

You can define the due date and follow-up date as static values (e.g. `2023-02-28T13:13:10+02:00`), but you can also use
[expressions](/components/concepts/expressions.md) (e.g. `= schedule.dueDate` and `= now() + duration("PT15S")`). The
expressions are evaluated on activating the user task and must result in a `string` conforming to an ISO 8601 combined
date and time representation.

import ISO8601DateTime from '../assets/react-components/iso-8601-date-time.md'

:::info
<ISO8601DateTime/>
:::

### Define user task priority

You can use the `zeebe:priorityDefinition` extension element to specify the priority of a user task.

This allows you to prioritize the user task relative to other tasks within the same process, as well as across different processes.

To set the priority of a user task, specify the priority in the `priority` attribute.

- The priority must be an integer between `0` and `100`. If no value is provided, the default value is `50`.
- A higher priority value indicates higher importance.
- You can set the priority either as a static integer value or by using an [expression](/components/concepts/expressions.md). Expressions are evaluated when the user task is activated and must result in an integer within the specified range.

### Variable mappings

By default, all Camunda user task variables are merged into the process instance. This
behavior can be customized by defining an output mapping at the user task.

Input mappings can be used to transform the variables into a different format.

### User task forms

A user task typically includes a form. A form contains work instructions for the user and captures the resulting information in a structured way.

However, user tasks are not limited to forms. User tasks can also be used to refer users to other applications or redirect them to a website.

You can use [Camunda Forms](/guides/utilizing-forms.md) that offer visual editing of forms directly in Camunda Modeler, or use your own forms.
Forms can either be displayed in [Tasklist](/components/tasklist/introduction-to-tasklist.md), or handled by a custom application.

To use a form, a user task requires a form reference.
Depending on your use case, two different types of form references can be used:

1. **Camunda Forms** provide a flexible way of linking a user task to a Camunda Form via the form ID.
   Forms linked this way can be deployed together with the referencing process models.
   To link a user task to a Camunda Form, you have to specify the ID of the Camunda Form as the `formId` attribute
   of the task's `zeebe:formDefinition` extension element (see the [XML representation](#camunda-form)).

   The `bindingType` attribute determines which version of the linked form is used:

   - `latest`: The latest deployed version at the moment the user task is activated.
   - `deployment`: The version that was deployed together with the currently running version of the process.
   - `versionTag`: The latest deployed version that is annotated with the version tag specified in the `versionTag` attribute.

   To learn more about choosing binding types, see [choosing the resource binding type](/components/best-practices/modeling/choosing-the-resource-binding-type.md).

   :::note
   If the `bindingType` attribute is not specified, `latest` is used as the default.
   :::

   You can read more about Camunda Forms in the [Camunda Forms guide](/guides/utilizing-forms.md) or the [Camunda Forms reference](/components/modeler/forms/camunda-forms-reference.md)
   to explore all configuration options for form elements.

2. A **custom form reference** can specify any custom identifier in the user task using the `externalReference`
   attribute of the task's `zeebe:formDefinition` extension element (see the [XML representation](#camunda-form-linked)).
   How the identifier is interpreted depends on your implementation.
   You can use it to associate a custom form, route to a custom application, or a URL to a web page, for example.
   A custom form reference will not be shown in Tasklist.

:::info
For user tasks with a [job worker implementation](#job-worker-implementation), the custom form references are defined on the `formKey` attribute
of the `zeebe:formDefinition` extension element instead of the `externalReference` attribute.

Furthermore, there is a third form option for job worker-based user tasks: embedded Camunda Forms. You can use them to
embed a form's JSON configuration directly into the BPMN process XML as a `zeebe:UserTaskForm` extension element of the
process element. The embedded form can then be referenced via the `formKey` attribute (see [XML representation](#camunda-form-embedded)).
:::

### Task headers

A user task can define an arbitrary number of `taskHeaders`; they are static
metadata stored with the user task in Zeebe. The headers can be used as
configuration parameters for tasklist applications.

## Job worker implementation

A user task does not have to be managed by Zeebe. You can implement custom user task logic using Job workers.

To define a Job worker implementation for a user task, simply remove the `zeebe:userTask` extension element from the task. User tasks implemented via Job workers behave similarly to service tasks, with two key differences:

- Visual representation: The visual marker distinguishes user tasks from service tasks.
- Model semantics: The interpretation and purpose in the process model differ.

:::info
The job worker implementation for user tasks is deprecated. We recommend using [Camunda user tasks](#camunda-user-tasks) instead for enhanced functionality and adherence to best practices. For a detailed comparison of task implementation types and guidance on migrating to Camunda user tasks, see the [migration guide](/apis-tools/migration-manuals/migrate-to-camunda-user-tasks.md).
:::

When a process instance reaches a user task with a Job worker implementation:

1. Zeebe creates a corresponding job and waits for its completion.
2. A Job worker processes jobs of the type io.camunda.zeebe:userTask.
3. Once the job is completed, the process instance resumes execution.

Use [task headers](/components/modeler/bpmn/service-tasks/service-tasks.md#task-headers) to pass static parameters to the job
worker.

Define [variable mappings](/components/concepts/variables.md#inputoutput-variable-mappings)
the [same way as a service task does](/components/modeler/bpmn/service-tasks/service-tasks.md#variable-mappings)
to transform the variables passed to the job worker, or to customize how the variables of the job merge.

### Limitations

User tasks implemented using Job workers come with significant limitations when compared to [Camunda user tasks](#camunda-user-tasks):

1. **API compatibility**:
   You cannot use the [Camunda 8 API](/docs/apis-tools/camunda-api-rest/camunda-api-rest-overview.md) to manage user tasks based on job workers. These tasks are restricted to the functionality provided for [service tasks](/components/modeler/bpmn/service-tasks/service-tasks.md).

2. **Lifecycle management**:
   The Zeebe engine provides no visibility into lifecycle and state management features of Job worker-based user tasks. This means that you must handle these aspects in your custom application, outside the engine. Consider this approach only if your use case requires a highly specific user task implementation that cannot be achieved with Camunda user tasks.

3. **Reduced metrics and reporting**:
   Metrics and reporting for such user tasks are limited to the capabilities available for service tasks. This means you lose access to user task-specific insights provided by the Zeebe engine.

4. **Task-specific operations**:
   Assignments, scheduling, and other user task-specific details are included in the job as [task headers](/components/modeler/bpmn/service-tasks/service-tasks.md#task-headers). These must be handled in your custom implementation. Advanced user task features offered by Camunda are not available for Job worker-based user tasks.

## Additional resources

### XML representations

#### Camunda Form

A user task with a linked Camunda Form that does not specify the binding type (`latest` is used implicitly) as well as an assignment definition and a task schedule:

```xml
<bpmn:userTask id="configure" name="Configure">
  <bpmn:extensionElements>
    <zeebe:formDefinition formId="configure-control-process" />
    <zeebe:assignmentDefinition assignee="= default_controller"
                                candidateGroups="controllers, auditors" />
    <zeebe:taskSchedule dueDate="= task_finished_deadline"
                        followUpDate="= now() + duration(&#34;P12D&#34;)" />
    <zeebe:userTask />
  </bpmn:extensionElements>
</bpmn:userTask>
```

A user task with a linked Camunda Form that uses the `deployment` binding type:

```xml
<bpmn:userTask id="configure" name="Configure">
  <bpmn:extensionElements>
    <zeebe:formDefinition formId="configure-control-process" bindingType="deployment" />
    <zeebe:userTask />
  </bpmn:extensionElements>
</bpmn:userTask>
```

A user task with a linked Camunda Form that uses the `versionTag` binding type:

```xml
<bpmn:userTask id="configure" name="Configure">
  <bpmn:extensionElements>
    <zeebe:formDefinition formId="configure-control-process"
                          bindingType="versionTag" versionTag="v1.0" />
    <zeebe:userTask />
  </bpmn:extensionElements>
</bpmn:userTask>
```

#### Custom form reference

A user task with an external task form referenced by a custom form reference:

```xml
<bpmn:userTask id="configure" name="Configure">
  <bpmn:extensionElements>
    <zeebe:formDefinition externalReference="custom-key" />
    <zeebe:userTask />
  </bpmn:extensionElements>
</bpmn:userTask>
```

:::info
If you choose the [job worker
implementation](#job-worker-implementation) for a user task, the custom form reference needs to be set to the `formKey` attribute instead of
the `externalReference` attribute.
:::

#### Camunda Form (embedded)

:::info
This is only supported if you choose the [job worker implementation](#job-worker-implementation) for a user task.
:::

A job-based user task with an embedded Camunda Form:

```xml
<bpmn:process id="controlProcess" name="Control Process" isExecutable="true">
  <bpmn:extensionElements>
    <zeebe:userTaskForm id="userTaskForm_configure-control-process">
      <!-- Task Form Content -->
    </zeebe:userTaskForm>
  </bpmn:extensionElements>
  <bpmn:userTask id="configure" name="Configure">
    <bpmn:extensionElements>
      <zeebe:formDefinition formKey="camunda-forms:bpmn:userTaskForm_configure-control-process" />
    </bpmn:extensionElements>
  </bpmn:userTask>
</bpmn:process>
```

### References

- [Tasklist](/components/tasklist/introduction-to-tasklist.md)
- [Form linking in Modeler](/components/modeler/web-modeler/advanced-modeling/form-linking.md)
- [Job handling](/components/concepts/job-workers.md)
- [Variable mappings](/components/concepts/variables.md#inputoutput-variable-mappings)
