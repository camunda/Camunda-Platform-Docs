---
title: "Handling data in processes"
tags:
  - BPMN Data Object
  - Variable
  - Serialization
description: "When using Camunda, you have access to a dynamic map of process variables, which lets you associate data to every single process instance."
---

When using Camunda, you have access to a dynamic map of process variables, which lets you associate data to every single process instance (and local scopes in case of user tasks or parallel flows). Ensure you use these mechanisms in a lightweight and meaningful manner, storing just the relevant data in the process instance.

Depending on your programming language, consider accessing your process variables in a type safe way, centralizing (simple and complex) type conversion and using constants for process variable names.

## Understanding data handling in Camunda

When reading and interpreting a business process diagram, you quickly realize there is always data necessary for tasks, but also to drive the process through gateways to the correct next steps.

Examine the following tweet approval process example:

<div bpmn="best-practices/handling-data-in-processes-assets/TwitterDemoProcess.bpmn" callouts="start_event_new_tweet,user_task_review_tweet,gateway_approved,service_task_publish_on_twitter" />

<span className="callout">1</span>

The process instance starts with a freshly written `tweet` we need to remember.

<span className="callout">2</span>

We need to present this `tweet` so that the user can decide whether to `approve` it.

<span className="callout">3</span>

The gateway needs to have access to this information: was the tweet `approved`?

<span className="callout">4</span>

To publish the tweet, the service task again needs the `tweet` itself!

Therefore, the tweet approval process needs two variables:

| Variable name | Variable type | Sample value     |
| ------------- | ------------- | ---------------- |
| `tweet`       | String        | "@Camunda rocks" |
| `approved`    | Boolean       | true             |

In Camunda 8, [values are stored as JSON](/components/concepts/variables.md#variable-values).

:::caution Camunda 7 handles variables slightly differently
This best practice describes variable handling within Camunda 8. Process variables are handled slightly differently with Camunda 7. Consult the [Camunda 7 documentation](https://docs.camunda.org/manual/latest/user-guide/process-engine/variables/) for details. In essence, variable values are not handled as JSON and thus there are [different values](https://docs.camunda.org/manual/latest/user-guide/process-engine/variables/#supported-variable-values) supported.
:::

You can dynamically create such variables by assigning an object of choice to a (string typed) variable name; for example, by passing a `Map<String, Object>` when [completing](apis-tools/tasklist-api-rest/specifications/complete-task.api.mdx) the "Review tweet" task via the API:

```
// TODO: Double check!
completeTask(
    taskId: "547811"
    variables: [
        {
            name: "approved"
            value: true
        }
    ]
)
```

In Camunda, you do _not_ declare process variables in the process model. This allows for a lot of flexibility. Refer to recommendations below on how to overcome possible disadvantages of this approach.

Consult the [docs about variables](/components/concepts/variables.md#variable-values) to learn more.

Camunda does not treat BPMN **data objects** (<img src="/img/bpmn-elements/data-object.svg" width="60" />) as process variables. We recommend using them occasionally _for documentation_, but you need to [avoid excessive usage of data objects](../../modeling/creating-readable-process-models#avoiding-excessive-usage-of-data-objects).

## Storing just the relevant data

Do not excessively use process variables. As a rule of thumb, store _as few variables as possible_ within Camunda.

Please note the [technical limitations of variables sizes](/components/concepts/variables.md#variable-size-limitation).

### Storing references only

If you have leading systems already storing the business relevant data...

![Hold references only](handling-data-in-processes-assets/hold-references-only.svg)

...then we suggest you store references only (e.g. ID's) to the objects stored there. So instead of holding the `tweet` and the `approved` variable, the process variables would now, for example, look more like the following:

| Variable name | Variable type | Value |
| ------------- | ------------- | ----- |
| `tweetId`     | Long          | 8213  |

### Use cases for storing payload

Store _payload_ (actual business data) as process variables, if you....

- ...have data only of interest within the process itself (e.g. for gateway decisions).

In case of the tweet approval process, even if you are using a tweet domain object, it might still be meaningful to hold the approved value explicitly as a process variable, because it serves the purpose to guide the gateway decision in the process. It might not be true if you want to keep track in the tweet domain objects regarding the approval.

| Variable name | Variable type | Value |
| ------------- | ------------- | ----- |
| `tweetId`     | Long          | 8213  |
| `approved`    | Boolean       | true  |

- ...communicate in a _message oriented_ style. For example, retrieving data from one system and handing it over to another system via a process.

When receiving external messages, consider storing just those parts of the payload relevant for you, and not the whole response. This not only serves the goal of having a lean process variables map, it also makes you more independent of changes in the service's message interface.

- ...want to use the process engine as kind of _cache_. For example, you cannot query relevant customer data in every step for performance reasons.

- ...need to _postpone data changes_ in the leading system to a later step in the process. For example, you only want to insert the Tweet in the Tweet Management Application if it is approved.

- ...want to track the _historical development_ of the data going through your process.

- ...don't have a leading system for this data.

## Using constants and data accessors

Avoid the copy/paste of string representations of your process variable names across your code base. Collect the variable names for a process definition in _constants_. For example, in Java:

```java
public interface TwitterDemoProcessConstants {
  String VAR_NAME_TWEET = "tweet";
  String VAR_NAME_APPROVED = "approved";
}
```

This way, you have much more security against typos and can easily make use of refactoring mechanisms offered by your IDE.

However, if you also want to solve necessary type conversions (casting) or probably even complex serialization logic, we recommend that you use a **Data Accessor** class. It comes in two flavors:

- A **Process Data Accessor**: Knows the names and types of all process variables of a certain process definition. It serves as the central point to declare variables for that process.
- A **Process Variable Accessor**: Encapsulates the access to exactly one variable. This is useful if you reuse certain variables in different processes.

Consider, for example, the BPMN "Publish on Twitter" task in the Tweet Approval Process:

<div bpmn="best-practices/handling-data-in-processes-assets/TwitterDemoProcess.bpmn" callouts="service_task_publish_on_twitter" />

<span className="callout">1</span>

We use a **TweetPublicationDelegate** to implement the "Publish on Twitter" task:

```java
public class PublishTweetJobHandler implements JobHandler  {
    public void handle(JobClient client, ActivatedJob job) throws Exception {
        String tweet = job.getVariablesAsType(TwitterDemoProcessVariables.class).getTweet();
        // ...
```

The `tweet` variable is accessed in a type safe way.

This reusable **Process Data Accessor** class could, for example, be a simple object. The Java client API can automatically deserialize the process variables as JSON into this object, while all process variables that are not found in that class are ignored.

```java
public class TwitterDemoProcessVariables {

    private String tweet;
    private boolean approved;

    public String getTweet() {
        return tweet;
    }

    public void setTweet(String tweet) {
        this.tweet = tweet;
    }
}
```

The getters and setters could further take care of additional serialization and deserialization logic for complex objects.

Your specific implementation approach might differ depending on the programming language and framework you are using.

## Complex data as entities

There are some use cases when it is clever to _introduce entities alongside the process_ to store complex data in a relational database. You can observe this logically as _typed process context_ where you create custom tables for your custom process deployment. Then, you can even use **Data** **Accessor** classes to access these entities in a convenient way.

You will only store a reference to the entity's primary key (typically an artificial UUID) as real process variable within Camunda.

Some people refer to this as **externalized process context**.

There are a couple of advantages of this approach:

- You can do very _rich queries_ on structured process variables via typical SQL.
- You can apply custom _data migration strategies_ when deploying new versions of your process or services, which require data changes.
- Data can be designed and modeled properly, even graphically by, for example, leveraging UML.

It requires additional complexity by adding the need for a relational database and code to handle this.
