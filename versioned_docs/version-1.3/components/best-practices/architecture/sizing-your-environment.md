---
id: sizing-your-environment
title:  Sizing your environment
tags:
    - Database
    - Performance
    - Hardware
    - Sizing
---

In order to define and size your environment for Camunda Cloud appropriately, you need to understand the factors that influence hardware requirements. Then you can apply this knowledge to select the appropriate Camunda Cloud SaaS hardware package or size your self-managed Kubernetes cluster.

:::caution Camunda Cloud only
This best practice targets Camunda Cloud only! If you are looking at Camunda Plaform, please visit [Sizing your Camunda Platform 7 environment](../sizing-your-environment-c7/).
:::


## Understanding influencing factors

Let's understand the important numbers.

### Throughput 

Throughput defines, how many process instances can be executed in a certain timeframe. 

It is typically easy to estimate the number of **process instances per day** you need to execute. If you only know the number of process instances per year, we recommend to divide this number by the 250 (average number of working days in a year). 

But the hardware sizing depends more on the **number of BPMN tasks** in a process model. For example, you will have a much higher throughput for processes with one service task than for processes with 30 service tasks. 

If you already know your future process model, you can use this to count the number of tasks for your process. For example, the following onboarding process contains five service tasks in a typical execution.

<div bpmn="best-practices/sizing-your-environment-assets/customer_onboarding.bpmn" callouts="task1,task2,task3,task4,task5" />

If you don't yet know the number of service tasks, we recommend to assume 10 service tasks as a rule of thumb.

The number of tasks per process allows you to calculate the required number of **tasks per day (tasks/day)** which can also be converted into **tasks per second (tasks/s)** (devide by 24 hours \* 60 minutes \* 60 seconds). 


**Example:**

| Indicator | Number | Calculation method | Comment |
| :- |-: | :-: | :- | 
| Onboarding instances per year | 5,000,000 |  | Business input |
| Process instances per business day | 20,000 | / 250 | average number of working days in a year |
| Tasks per day | 4,000 | / 5 | Tasks in the process model as counted above |
| Tasks per second | 0.05 | / (24\*60\*60) | Seconds per day |

In most cases, we define throughput per day, as this time frame is easier to understand. But in high-performance use cases you might need to define the throughput per second.


### Peak loads

In most scenarios, your load will be volatile and not constant. For example, your company might start 90% of their monthly process instances in the same day of the month. The **ability to handle those peaks is the more crucial requirement and should drive your decision** instead of looking at the average load.

In the above example, that one day with the peak load defines your overall throughput requirements.

Sometimes, looking at peaks might also mean, that you are not looking at all 24 hours of a day, but only 8 business hours, or probably the busiest 2 hours of a day, depending on your typical workload.


### Latency and cycle time

In some use cases, the cycle time of a process (or sometimes even the cycle time of single tasks) matter. For example, you want to provide a REST endpoint, that starts a process instance to calculate a score for a customer. This process needs to execute four service tasks, but the REST request should return a response synchronously, no later than 250 milliseconds after the request. 

While the cycle time of service tasks depends very much on what you do in these tasks, the overhead of the workflow engine itself can be measured. In an experiment with Camunda Cloud 1.2.4, running all worker code in in the same GCP zone as Camunda Cloud, we measured around 10ms processing time per process node and approximately 50 ms latency to process service tasks in remote workers. Hence, to execute 4 service tasks results in 240 ms workflow engine overhead. 

The closer you push throughput to the limits, the more latency you will get. This is basically, because the different requests compete for hardware resources, especially disk write operations. As a consequence, whenever cycle time and latency matters to you, you should plan for hardware buffer to not utilize your cluster too much. This makes sure, your latency does not go up because of resource contention. A good rule of thumb is to multiply your average load by 20. This means, you cannot only accomodate unexpected peak loads, but also have more free resources on average, keeping latency down.

| Indicator | Number | Calculation method | Comment |
| :- |-: | :-: | :- | 
| Onboarding instances per year | 5,000,000 |  | Business input, but irrelevant |
| Expected process instances on peak day | 150,000 |  | Business input |
| Tasks per second within business hours on peak day | 5.20 | / (8\*60\*60) | Only looking at seconds of the 8 business hours of a day |
| Tasks per second including buffer | 104.16 | \* 20 | Adding some buffer is recommended in critical high-performance or low-latency use cases |


### Disk space

The workflow engine itself will store data along every process instance, especially to keep the current state persistent. This is unavoidable. In case there are human tasks, data is also sent to Tasklist and kept there, until tasks are completed. 

Furthermore, data is also sent Operate and Optimize, which store data in Elasticsearch. These tools keep historical audit data for some time. The total amount of disk space can be reduced by using **data retention settings**. We typically delete data in Operate after 30 to 90 days, but keep it in Optimize for a longer period of time to allow more analysis. A good rule of thumb is something between 6 and 18 months.

The data you attach to a process instance (process variables) will influence disk space requirements. For example, it makes a big difference if you only add one or two strings (requiring ~ 1kb of space) to your process instances, or a full JSON document containing 1MB.

Assuming a [typical payload of 15 process variables (simple strings, numbers or booleans)](https://github.com/camunda/camunda/blob/1.3.14/benchmarks/project/src/main/resources/bpmn/typical_payload.json) we measured the following approximations for disk space requirements using Camunda Cloud SaaS 1.2.4. Please note, that these are not exact numbers, but they might give you an idea what to expect:

* Zeebe: 75 kb / PI
* Operate: 57 kb / PI
* Optimize: 21 kb / PI
* Tasklist: 21 kb / PI
* Sum: 174 kb / PI

Using your throughput and retention settings, you can now calculate the required disk space for your scenario. Example:

| Indicator  | Calculation method            | Value | Comments |
| :------------------------- | :-----------: | ------------: | :-------------------------------------------------------------------------------------------------- |
| Process instances per day  |             | 20,000        |                                                                                                    |
| **Runtime**                    |             |              |                                                                                                    |
| Typical process cycle time | \* 5 days   | 100,000       | How long is a process instance typically active? Determines the number of active process instances |
| Disk space for Zeebe       | \* 75 kib    | 7.15 GiB  | (Converted into GB by / 1024 / 1024)                                                               |
| Disk space for Tasklist    | \* 21 kib     | 0.67 GiB |                                                                                                    |
| **Operate**                    |             |              |                                                                                                    |
| PI in retention time             | \* 30 day   | 600,000       |                                                                                                    |
| Disk space                 | \* 57 kib    | 32.62 GiB |                                                                                                    |
| **Optimize**                   |             |              |                                                                                                    |
| PI in retention time             | \* 6 months | 3,600,000      |                                                                                                    |
| Disk space                 | \* 21 kib     | 72.10 GiB  |                                                                                                    |
| **Sum**                        |             | **113.87 GiB**  |                                                                                                    |


## Understanding sizing and scalability behavior

Spinning up a Camunda Cloud Cluster means you run multiple components that all need resources in the background, like the Zeebe broker, Elasticsearch (as the database for Operate, Tasklist, and Optimize), Operate, Tasklist, and Optimize. All those components need to be equiped with resources.

All components are clustered to provide high-availability, fault-tolerance and resiliency. 

Zeebe scales horizontally by adding more cluster nodes (pods). This is limited by the so-called partition size of a Zeebe cluster, as the work within one partition cannot be parallelized by design. Hence, you need to define enough partitions to utilize your cluster or to have some buffer if your load increases later on. The number of partitions cannot be changed after the cluster was initially provisioned (at least not yet), so elastic scalability of cluster nodes is (not yet) possible.

Camunda Cloud runs on Kubernetes. Every component is operated as a so-called pod, that gets resources assigned. These resources can be vertically scaled (=get more or less hardware resources assigned dynamically) within certain limits. Note that vertically scaling not always results in more throughput, as the various components have dependencies on each other. This is a complex topic and requires running experiments with benchmarks. In general, we recommend to start with the minimalistic hardware package as described below. If you have further requirements, you use this as a starting point to increase resources.

Note that Camunda licensing does not depend on the provisioned hardware resources, making it easy to size according to your needs.


## Sizing your runtime environment 

First, calculate your requirements using the information provided above, taking the example calculations from above:

* Throughput: 20,000 process instances / day
* Disk space: 114 GB

Now you can select a hardware package that can cover these requirements. In this example this fits well into a cluster of size S.

### Camunda Cloud SaaS

Camunda Cloud defines three fixed hardware packages you can select from. The table below gives you an indication what requirements you can fullfill with these. If your requirements are above the mentioned numbers, please contact us to discuss a customized sizing.

| **\***                                       | S                               | M                               | L                                |
| :------------------------------------------- | ------------------------------: | ------------------------------: | -------------------------------: |
| Max Throughput **Tasks/day**                 | 5.9 M                           | 23 M                            | 43 M                             |
| Max Throughput **Tasks/second**              | 65                              | 270                             | 500                              |
| Max Throughput **Process Instances/day**     | 0.5 M                           | 2.3 M                           | 15 M                              |
| Max Total Number of Process Instances        | 5.4 M                           | 5.4 M                            |                                  |
| Approx resources provisioned **\*\***        | 15 vCPU, 20 GB mem, 640 GB disk | 28 vCPU, 50 GB mem, 640 GB disk | 56 vCPU, 85 GB mem, 1320 GB disk |

**\*** The numbers in the table where measured using Camunda Cloud 1.2.4 and [the official benchmark project](https://github.com/camunda/camunda/tree/1.3.14/benchmarks). It uses a [ten task process](https://github.com/camunda/camunda/blob/1.3.14/benchmarks/project/src/main/resources/bpmn/ten_tasks.bpmn). To calculate day-based metrics, a equal distribution over 24 hours is assumed.


**\*\***  These are the resource limits configured in the Kubernetes cluster and are always subject to change.


### Camunda Cloud self-managed

Provisioning Camunda Cloud onto your self-managed Kubernetes cluster might depend on various factors. For example, most customes already have own teams providing Elasticsearch for them as a service. 

However, the following example shows the current configuration of a cluster of size S in Camunda Cloud SaaS, which can serve as a starting point for your own sizing. As you can see in the table above, such a cluster can serve 500,000 process instances / day and store up to 5.4 million process instances (in-flight and history).

|                    |                     | request | limit |
| ------------------ | ------------------- | ------- | ----- |
| **Zeebe**              |                     |         |       |
| \# brokers         | 3     |
| \# partitions      | 3     |
| replication factor | 3     |
|                    | vCPU \[cores\]      | 0.8     | 0.96  |
|                    | Mem \[GB\]          | 0.25    | 1.92  |
|                    | Disk \[GB\]         | 32      | 192   |
| #gateway           | 2     |
|                    | vCPU \[cores\]      | 0.4     | 0.4   |
|                    | Mem \[GB\] limit    | 0.45    | 0.45  |
| **Operate**            |                     |         |       |
| #importer          | 1     |
|                    | vCPU \[cores\]      | 0.3     | 1     |
|                    | Mem \[GB\] limit    | 0.2     | 1     |
| #webapp            | 2     |
|                    | vCPU \[cores\]      | 0.3     | 1     |
|                    | Mem \[GB\] limit    | 0.2     | 1     |
| **Tasklist**           |                     |         |       |
| #importer          | 1     |
|                    | vCPU \[cores\]      | 0.4     | 1     |
|                    | Mem \[GB\] limit    | 1       | 2     |
| #webapp            | 2     |
|                    | vCPU \[cores\]      | 0.4     | 1     |
|                    | Mem \[GB\] limit    | 1       | 2     |
| **Optimize**           |                     |         |       |
| #importer          | 1     |
|                    | vCPU \[cores\]      | 0.3     | 1     |
|                    | Mem \[GB\] limit    | 0.4     | 1     |
| #webapp            |  2     |
|                    | vCPU \[cores\]      | 0.3     | 1     |
|                    | Mem \[GB\] limit    | 0.4     | 1     |
| **Elastic**            |                     |         |       |
| #statefulset       | 1     |
|                    | vCPU \[cores\]      | 1       | 2     |
|                    | Mem \[GB\] limit    | 1       | 2     |
|                    | Disk \[GB\] request | 64      | 64    |
| **Other** (Worker, Analytics, ...) |
| #                   |  1     |
|                    | vCPU \[cores\]      | 0.4     | 0.4   |
|                    | Mem \[GB\] limit    | 0.45    | 0.45  |
| **Total resources**    |
|                    | vCPU \[cores\]      | 0.4     | 15.08 |
|                    | Mem \[GB\]          | 0.45    | 21.11 |
|                    | Disk \[GB\]         | 0       | 640   |

## Planning non-production environments

All clusters can be used for development, testing, integration, Q&A, and production. In Camunda Cloud SaaS, production and test environments are organized via separate organizations within Camunda Cloud to ease the management of clusters, while also minimizing the risk to accidentally accessing a production cluster.

Note that functional unit tests that are written in Java and use [zeebe-proces-test](https://github.com/camunda-cloud/zeebe-process-test/), will use an in-memory broker in unit tests, so no development cluster is needed for this use case. 

For typical integration or functional test environments, you can normally just deploy a small cluster, like the one shown above, even if your production environment is sized bigger. This is typically sufficient, as functional tests typically run much smaller workloads.

Load or performance tests ideally run on the same sizing configuration as your production instance to yield reliable results. 

A typical customer set-up consists of: 

* 1 Production cluster
* 1 Integration or pre-prod cluster (equal in size to your anticipated production cluster if you want to run load tests or benchmarks)
* 1 Test cluster 
* Multiple developer clusters

Ideally, every active developer runs its own cluster, so that the workflow engine does not need to be shared amongst developers. Otherwise clusters are not isolated, which can lead to errors if for example developer A deploys a new version of the same process as developer B. Typically, developer clusters can be deleted when they are no longer used, as no data needs to be kept, so you might not need one cluster per developer that works with Camunda Cloud at some point in time. And using in-memory unit tests further reduces the contention on developer clusters. 

However, some customers do share a Camunda Cloud cluster amongst various developers for economic reasons. This can work well if everybody is aware of the problems that can arise.

## Running experiments and benchmarks

If you are in doubt about which package to choose, you can do a load test with a representative workload with the target hardware package. This will help you decide if the specific package can serve your needs. 

This is recommended if you exceed the above numbers of three million process instances per day.

You can look at the [Zeebe benchmark project](https://github.com/camunda/camunda/blob/1.3.14/benchmarks/setup/README.md#benchmarking-camunda-cloud-saas). While this project will not run out-of-the-box (e.g. you need need to build starter and worker code yourself and use self-created docker images), you can use it as a starting point for own endavours.
