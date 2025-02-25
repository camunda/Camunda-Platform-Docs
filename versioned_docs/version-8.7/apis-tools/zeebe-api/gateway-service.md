---
id: gateway-service
title: "Zeebe API RPCs"
slug: /apis-tools/zeebe-api/gateway-service
sidebar_position: 2
description: "The Zeebe client gRPC API is exposed through a single gateway service."
---

The Zeebe client gRPC API is exposed through a single gateway service. The current version of the protocol buffer file
can be found in
the [Zeebe repository](https://github.com/camunda/camunda/blob/main/zeebe/gateway-protocol/src/main/proto/gateway.proto).

## `ActivateJobs` RPC

Iterates through all known partitions round-robin, activates up to the requested
maximum, and streams them back to the client as they are activated.

### Input: `ActivateJobsRequest`

```protobuf
message ActivateJobsRequest {
  // the job type, as defined in the BPMN process (e.g. <zeebe:taskDefinition
  // type="payment-service" />)
  string type = 1;
  // the name of the worker activating the jobs, mostly used for logging purposes
  string worker = 2;
  // a job returned after this call will not be activated by another call until the
  // timeout (in ms) has been reached
  int64 timeout = 3;
  // the maximum jobs to activate by this request
  int32 maxJobsToActivate = 4;
  // a list of variables to fetch as the job variables; if empty, all visible variables at
  // the time of activation for the scope of the job will be returned
  repeated string fetchVariable = 5;
  // The request will be completed when at least one job is activated or after the requestTimeout (in ms).
  // if the requestTimeout = 0, a default timeout is used.
  // if the requestTimeout < 0, long polling is disabled and the request is completed immediately, even when no job is activated.
  int64 requestTimeout = 6;
  // a list of IDs of tenants for which to activate jobs
  repeated string tenantIds = 7;
}
```

### Output: `ActivateJobsResponse`

```protobuf
message ActivateJobsResponse {
  // list of activated jobs
  repeated ActivatedJob jobs = 1;
}

message ActivatedJob {
  // the key, a unique identifier for the job
  int64 key = 1;
  // the type of the job (should match what was requested)
  string type = 2;
  // the job's process instance key
  int64 processInstanceKey = 3;
  // the bpmn process ID of the job process definition
  string bpmnProcessId = 4;
  // the version of the job process definition
  int32 processDefinitionVersion = 5;
  // the key of the job process definition
  int64 processDefinitionKey = 6;
  // the associated task element ID
  string elementId = 7;
  // the unique key identifying the associated task, unique within the scope of the
  // process instance
  int64 elementInstanceKey = 8;
  // a set of custom headers defined during modelling; returned as a serialized
  // JSON document
  string customHeaders = 9;
  // the name of the worker which activated this job
  string worker = 10;
  // the amount of retries left to this job (should always be positive)
  int32 retries = 11;
  // when the job can be activated again, sent as a UNIX epoch timestamp
  int64 deadline = 12;
  // JSON document, computed at activation time, consisting of all visible variables to
  // the task scope
  string variables = 13;
  // the ID of the tenant that owns the job
  string tenantId = 14;
}
```

### Errors

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- Type is blank (empty string, null)
- Worker is blank (empty string, null)
- Timeout less than 1 (ms)
- maxJobsToActivate is less than 1
- If multi-tenancy is enabled, and `tenantIds` is empty (empty list)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantIds` is not empty (empty list), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `BroadcastSignal` RPC

Broadcasts a [signal](/components/concepts/signals.md).

### Input: `BroadcastSignalRequest`

```protobuf
message BroadcastSignalRequest {
  // The name of the signal
  string signalName = 1;
  // the signal variables as a JSON document; to be valid, the root of the document must be an
  // object, e.g. { "a": "foo" }. [ "foo" ] would not be valid.
  string variables = 2;
  // the ID of the tenant that owns the signal.
  string tenantId = 3;
}
```

### Output: `BroadcastSignalResponse`

```protobuf
message BroadcastSignalResponse {
  // the unique ID of the signal that was broadcasted.
  int64 key = 1;
  // the tenant ID of the signal that was broadcasted.
  string tenantId = 2;
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

- If multi-tenancy is enabled, and `tenantId` is blank (empty string, null)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantId` is not blank (empty string, null), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `CancelProcessInstance` RPC

Cancels a running process instance.

### Input: `CancelProcessInstanceRequest`

```protobuf
message CancelProcessInstanceRequest {
  // the process instance key (as, for example, obtained from
  // CreateProcessInstanceResponse)
  int64 processInstanceKey = 1;
}
```

### Output: `CancelProcessInstanceResponse`

```protobuf
message CancelProcessInstanceResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No process instance exists with the given key. Note that since process instances are removed once they are finished, it could mean the instance did exist at some point.
- No process instance exists with the given key for the tenants the user is authorized to work with.

## `CompleteJob` RPC

Completes a job with the given payload, which allows completing the associated service task.

### Input: `CompleteJobRequest`

```protobuf
message CompleteJobRequest {
  // the unique job identifier, as obtained from ActivateJobsResponse
  int64 jobKey = 1;
  // a JSON document representing the variables in the current task scope
  string variables = 2;
}
```

### Output: `CompleteJobResponse`

```protobuf
message CompleteJobResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No job exists with the given job key. Note that since jobs are removed once completed, it could be that this job did exist at some point.
- No job exists with the given job key for the tenants the user is authorized to work with.

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- The job was marked as failed. In that case, the related [incident](/components/concepts/incidents.md) must be resolved before the job can be activated again and completed.

## `CreateProcessInstance` RPC

Creates and starts an instance of the specified process. The process definition to use
to create the instance can be specified either using its unique key (as returned by
DeployProcess), or using the BPMN process ID and a version. Pass -1 as the version to
use the latest deployed version.

:::note
Only processes with none start events can be started through this command.
:::

:::note
Start instructions have the same [limitations as process instance modification](/components/concepts/process-instance-modification.md#limitations), e.g., it is not possible to start at a sequence flow.
:::

### Input: `CreateProcessInstanceRequest`

```protobuf
message CreateProcessInstanceRequest {
  // the unique key identifying the process definition (e.g. returned from a process
  // in the DeployProcessResponse message)
  int64 processDefinitionKey = 1;
  // the BPMN process ID of the process definition
  string bpmnProcessId = 2;
  // the version of the process; set to -1 to use the latest version
  int32 version = 3;
  // JSON document that will instantiate the variables for the root variable scope of the
  // process instance; it must be a JSON object, as variables will be mapped in a
  // key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
  // "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
  // valid argument, as the root of the JSON document is an array and not an object.
  string variables = 4;
  // List of start instructions. If empty (default) the process instance
  // will start at the start event. If non-empty the process instance will apply start
  // instructions after it has been created
  repeated ProcessInstanceCreationStartInstruction startInstructions = 5;
  // the tenant id of the process definition
  string tenantId = 6;
}

message ProcessInstanceCreationStartInstruction {

  // future extensions might include
  // - different types of start instructions
  // - ability to set local variables for different flow scopes

  // for now, however, the start instruction is implicitly a
  // "startBeforeElement" instruction

  // element ID
  string elementId = 1;
}
```

### Output: `CreateProcessInstanceResponse`

```protobuf
message CreateProcessInstanceResponse {
  // the key of the process definition which was used to create the process instance
  int64 processDefinitionKey = 1;
  // the BPMN process ID of the process definition which was used to create the process
  // instance
  string bpmnProcessId = 2;
  // the version of the process definition which was used to create the process instance
  int32 version = 3;
  // the unique identifier of the created process instance; to be used wherever a request
  // needs a process instance key (e.g. CancelProcessInstanceRequest)
  int64 processInstanceKey = 4;
  // the tenant identifier of the created process instance
  string tenantId = 5;
}
```

## `CreateProcessInstanceWithResult` RPC

Similar to `CreateProcessInstance` RPC, creates and starts an instance of the specified process.
Unlike `CreateProcessInstance` RPC, the response is returned when the process is completed.

:::note
Only processes with none start events can be started through this command.
:::

:::note
Start instructions have the same [limitations as process instance modification](/components/concepts/process-instance-modification.md#limitations), e.g., it is not possible to start at a sequence flow.
:::

### Input: `CreateProcessInstanceWithResultRequest`

```protobuf
message CreateProcessInstanceWithResultRequest {
  CreateProcessInstanceRequest request = 1;
  // timeout (in ms). the request will be closed if the process is not completed
  // before the requestTimeout.
  // if requestTimeout = 0, uses the generic requestTimeout configured in the gateway.
  int64 requestTimeout = 2;
  // list of names of variables to be included in `CreateProcessInstanceWithResultResponse.variables`
  // if empty, all visible variables in the root scope will be returned.
  repeated string fetchVariables = 3;
}
```

### Output: `CreateProcessInstanceWithResultResponse`

```protobuf
message CreateProcessInstanceWithResultResponse {
  // the key of the process definition which was used to create the process instance
  int64 processDefinitionKey = 1;
  // the BPMN process ID of the process definition which was used to create the process
  // instance
  string bpmnProcessId = 2;
  // the version of the process definition which was used to create the process instance
  int32 version = 3;
  // the unique identifier of the created process instance; to be used wherever a request
  // needs a process instance key (e.g. CancelProcessInstanceRequest)
  int64 processInstanceKey = 4;
  // JSON document
  // consists of visible variables in the root scope
  string variables = 5;
  // the tenant identifier of the process definition
  string tenantId = 6;
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No process with the given key exists (if processKey was given).
- No process with the given process ID exists (if bpmnProcessId was given but version was -1).
- No process with the given process ID and version exists (if both bpmnProcessId and version were given).

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- The process definition does not contain a none start event; only processes with none
  start event can be started manually.

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- The given variables argument is not a valid JSON document; it is expected to be a valid
  JSON document where the root node is an object.
- If multi-tenancy is enabled, and `tenantId` is blank (empty string, null)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantId` is not blank (empty string, null), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `EvaluateDecision` RPC

Evaluates a decision. You specify the decision to evaluate either by
using its unique KEY (as returned by DeployResource), or using the decision
ID. When using the decision ID, the latest deployed version of the decision
is used.

:::note
When you specify both the decision ID and KEY, the ID is used to find the decision to be evaluated.
:::

### Input: `EvaluateDecisionRequest`

```protobuf
message EvaluateDecisionRequest {
  // the unique key identifying the decision to be evaluated (e.g. returned
  // from a decision in the DeployResourceResponse message)
  int64 decisionKey = 1;
  // the ID of the decision to be evaluated
  string decisionId = 2;
  // JSON document that will instantiate the variables for the decision to be
  // evaluated; it must be a JSON object, as variables will be mapped in a
  // key-value fashion, e.g. { "a": 1, "b": 2 } will create two variables,
  // named "a" and "b" respectively, with their associated values.
  // [{ "a": 1, "b": 2 }] would not be a valid argument, as the root of the
  // JSON document is an array and not an object.
  string variables = 3;
  // the tenant identifier of the decision
  string tenantId = 4;
}
```

### Output: `EvaluateDecisionResponse`

```protobuf
message EvaluateDecisionResponse {
  // the unique key identifying the decision which was evaluated (e.g. returned
  // from a decision in the DeployResourceResponse message)
  int64 decisionKey = 1;
  // the ID of the decision which was evaluated
  string decisionId = 2;
  // the name of the decision which was evaluated
  string decisionName = 3;
  // the version of the decision which was evaluated
  int32 decisionVersion = 4;
  // the ID of the decision requirements graph that the decision which was
  // evaluated is part of.
  string decisionRequirementsId = 5;
  // the unique key identifying the decision requirements graph that the
  // decision which was evaluated is part of.
  int64 decisionRequirementsKey = 6;
  // JSON document that will instantiate the result of the decision which was
  // evaluated; it will be a JSON object, as the result output will be mapped
  // in a key-value fashion, e.g. { "a": 1 }.
  string decisionOutput = 7;
  // a list of decisions that were evaluated within the requested decision evaluation
  repeated EvaluatedDecision evaluatedDecisions = 8;
  // an optional string indicating the ID of the decision which
  // failed during evaluation
  string failedDecisionId = 9;
  // an optional message describing why the decision which was evaluated failed
  string failureMessage = 10;
  // the tenant identifier of the evaluated decision
  string tenantId = 11;
  // the unique key identifying this decision evaluation
  int64 decisionInstanceKey = 12;
}

message EvaluatedDecision {
  // the unique key identifying the decision which was evaluated (e.g. returned
  // from a decision in the DeployResourceResponse message)
  int64 decisionKey = 1;
  // the ID of the decision which was evaluated
  string decisionId = 2;
  // the name of the decision which was evaluated
  string decisionName = 3;
  // the version of the decision which was evaluated
  int32 decisionVersion = 4;
  // the type of the decision which was evaluated
  string decisionType = 5;
  // JSON document that will instantiate the result of the decision which was
  // evaluated; it will be a JSON object, as the result output will be mapped
  // in a key-value fashion, e.g. { "a": 1 }.
  string decisionOutput = 6;
  // the decision rules that matched within this decision evaluation
  repeated MatchedDecisionRule matchedRules = 7;
  // the decision inputs that were evaluated within this decision evaluation
  repeated EvaluatedDecisionInput evaluatedInputs = 8;
  // the tenant identifier of the evaluated decision
  string tenantId = 9;
}

message EvaluatedDecisionInput {
  // the id of the evaluated decision input
  string inputId = 1;
  // the name of the evaluated decision input
  string inputName = 2;
  // the value of the evaluated decision input
  string inputValue = 3;
}

message EvaluatedDecisionOutput {
  // the ID of the evaluated decision output
  string outputId = 1;
  // the name of the evaluated decision output
  string outputName = 2;
  // the value of the evaluated decision output
  string outputValue = 3;
}

message MatchedDecisionRule {
  // the ID of the matched rule
  string ruleId = 1;
  // the index of the matched rule
  int32 ruleIndex = 2;
  // the evaluated decision outputs
  repeated EvaluatedDecisionOutput evaluatedOutputs = 3;
}
```

### Errors

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- No decision with the given key exists (if decisionKey was given).
- No decision with the given decision ID exists (if decisionId was given).
- Both decision ID and decision KEY were provided, or are missing.
- If multi-tenancy is enabled, and `tenantId` is blank (empty string, null)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantId` is not blank (empty string, null), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `DeployResource` RPC

Deploys one or more resources (e.g. processes, decision models or forms) to Zeebe.
Note that this is an atomic call, i.e. either all resources are deployed, or none of them are.

### Input: `DeployResourceRequest`

```protobuf
message DeployResourceRequest {
  // list of resources to deploy
  repeated Resource resources = 1;
  // the tenant id of the resources to deploy
  string tenantId = 2;
}

message Resource {
  // the resource name, e.g. myProcess.bpmn or myDecision.dmn
  string name = 1;
  // the file content as a UTF8-encoded string
  bytes content = 2;
}
```

### Output: `DeployResourceResponse`

```protobuf
message DeployResourceResponse {
  // the unique key identifying the deployment
  int64 key = 1;
  // a list of deployed resources, e.g. processes
  repeated Deployment deployments = 2;
  // the tenant id of the deployed resources
  string tenantId = 3;
}

message Deployment {
  // each deployment has only one metadata
  oneof Metadata {
    // metadata of a deployed process
    ProcessMetadata process = 1;
    // metadata of a deployed decision
    DecisionMetadata decision = 2;
    // metadata of a deployed decision requirements
    DecisionRequirementsMetadata decisionRequirements = 3;
    // metadata of a deployed form
    FormMetadata form = 4;
  }
}

message ProcessMetadata {
  // the bpmn process ID, as parsed during deployment; together with the version forms a
  // unique identifier for a specific process definition
  string bpmnProcessId = 1;
  // the assigned process version
  int32 version = 2;
  // the assigned key, which acts as a unique identifier for this process
  int64 processDefinitionKey = 3;
  // the resource name (see: ProcessRequestObject.name) from which this process was
  // parsed
  string resourceName = 4;
  // the tenant id of the deployed process
  string tenantId = 5;
}

message DecisionMetadata {
  // the dmn decision ID, as parsed during deployment; together with the
  // versions forms a unique identifier for a specific decision
  string dmnDecisionId = 1;
  // the dmn name of the decision, as parsed during deployment
  string dmnDecisionName = 2;
  // the assigned decision version
  int32 version = 3;
  // the assigned decision key, which acts as a unique identifier for this
  // decision
  int64 decisionKey = 4;
  // the dmn ID of the decision requirements graph that this decision is part
  // of, as parsed during deployment
  string dmnDecisionRequirementsId = 5;
  // the assigned key of the decision requirements graph that this decision is
  // part of
  int64 decisionRequirementsKey = 6;
  // the tenant id of the deployed decision
  string tenantId = 7;
}

message DecisionRequirementsMetadata {
  // the dmn decision requirements ID, as parsed during deployment; together
  // with the versions forms a unique identifier for a specific decision
  string dmnDecisionRequirementsId = 1;
  // the dmn name of the decision requirements, as parsed during deployment
  string dmnDecisionRequirementsName = 2;
  // the assigned decision requirements version
  int32 version = 3;
  // the assigned decision requirements key, which acts as a unique identifier
  // for this decision requirements
  int64 decisionRequirementsKey = 4;
  // the resource name (see: Resource.name) from which this decision
  // requirements was parsed
  string resourceName = 5;
  // the tenant id of the deployed decision requirements
  string tenantId = 6;
}

message FormMetadata {
  // the form ID, as parsed during deployment; together with the
  // versions forms a unique identifier for a specific form
  string formId = 1;
  // the assigned form version
  int32 version = 2;
  // the assigned key, which acts as a unique identifier for this form
  int64 formKey = 3;
  // the resource name
  string resourceName = 4;
  // the tenant id of the deployed form
  string tenantId = 5;
}
```

### Errors

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- No resources given.
- At least one resource is invalid. A resource is considered invalid if:
  - The resource type is not supported (e.g. supported resources include BPMN and DMN files)
  - The content is not deserializable (e.g. detected as BPMN, but it's broken XML)
  - The content is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
- If multi-tenancy is enabled, and `tenantId` is blank (empty string, null)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantId` is not blank (empty string, null), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `FailJob` RPC

Marks the job as failed. If the retries argument is positive and no retry back off is set, the job is immediately
activatable again. If the retry back off is positive the job becomes activatable once the back off timeout has passed.
If the retries argument is zero or negative, an incident is raised, tagged with the given errorMessage, and the job is
not activatable until the incident is resolved. If the variables argument is set, the variables are merged into the process at the local scope of the job's associated task.

### Input: `FailJobRequest`

```protobuf
message FailJobRequest {
  // the unique job identifier, as obtained when activating the job
  int64 jobKey = 1;
  // the amount of retries the job should have left
  int32 retries = 2;
  // an optional message describing why the job failed
  // this is particularly useful if a job runs out of retries and an incident is raised,
  // as it this message can help explain why an incident was raised
  string errorMessage = 3;
  // the backoff timeout (in ms) for the next retry
  int64 retryBackOff = 4;
  // JSON document that will instantiate the variables at the local scope of the
  // job's associated task; it must be a JSON object, as variables will be mapped in a
  // key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
  // "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
  // valid argument, as the root of the JSON document is an array and not an object.
  string variables = 5;
}
```

### Output: `FailJobResponse`

```protobuf
message FailJobResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No job was found with the given key.
- No job was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- The job was not activated.
- The job is already in a failed state, i.e. ran out of retries.

## `ModifyProcessInstance` RPC

Modifies a running process instance. The command can contain multiple instructions to activate an element of the
process, or to terminate an active instance of an element.

Use the command to repair a process instance that is stuck on an element or took an unintended path. For example,
because an external system is not available or doesn't respond as expected.

### Input: `ModifyProcessInstanceRequest`

```protobuf
message ModifyProcessInstanceRequest {
  // the key of the process instance that should be modified
  int64 processInstanceKey = 1;
  // instructions describing which elements should be activated in which scopes,
  // and which variables should be created
  repeated ActivateInstruction activateInstructions = 2;
  // instructions describing which elements should be terminated
  repeated TerminateInstruction terminateInstructions = 3;

  message ActivateInstruction {
    // the ID of the element that should be activated
    string elementId = 1;
    // the key of the ancestor scope the element instance should be created in;
    // set to -1 to create the new element instance within an existing element
    // instance of the flow scope
    int64 ancestorElementInstanceKey = 2;
    // instructions describing which variables should be created
    repeated VariableInstruction variableInstructions = 3;
  }

  message VariableInstruction {
    // JSON document that will instantiate the variables for the root variable scope of the
    // process instance; it must be a JSON object, as variables will be mapped in a
    // key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
    // "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
    // valid argument, as the root of the JSON document is an array and not an object.
    string variables = 1;
    // the ID of the element in which scope the variables should be created;
    // leave empty to create the variables in the global scope of the process instance
    string scopeId = 2;
  }

  message TerminateInstruction {
    // the ID of the element that should be terminated
    int64 elementInstanceKey = 1;
  }
}
```

### Output: `ModifyProcessInstanceResponse`

```protobuf
message ModifyProcessInstanceResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No process instance exists with the given key, or it is not active.
- No process instance was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- At least one activate instruction is invalid. An activate instruction is considered invalid if:
  - The process doesn't contain an element with the given ID.
  - A flow scope of the given element can't be created.
  - The given element has more than one active instance of its flow scope.
- At least one variable instruction is invalid. A variable instruction is considered invalid if:
  - The process doesn't contain an element with the given scope ID.
  - The given element doesn't belong to the activating element's flow scope.
  - The given variables are not a valid JSON document.
- At least one terminate instruction is invalid. A terminate instruction is considered invalid if:
  - No element instance exists with the given key, or it is not active.
- The instructions would terminate all element instances of a process instance that was created by a call activity in
  the parent process.

## `MigrateProcessInstance` RPC

Migrates a process instance to a new process definition. The command can contain multiple mapping instructions
to define mapping between the active process instance's elements and target process definition elements.

Use the command to upgrade a process instance to a new version of a process or to a different process definition.
E.g. keep your running instances up-to-date with the latest process improvements.

### Input: `MigrateProcessInstanceRequest`

```protobuf
message MigrateProcessInstanceRequest {
  // key of the process instance to migrate
  int64 processInstanceKey = 1;
  // the migration plan that defines target process and element mappings
  MigrationPlan migrationPlan = 2;

  message MigrationPlan {
    // the key of process definition to migrate the process instance to
    int64 targetProcessDefinitionKey = 1;
    // the mapping instructions describe how to map elements from the source process definition to the target process definition
    repeated MappingInstruction mappingInstructions = 2;
  }

  message MappingInstruction {
    // the element ID to migrate from
    string sourceElementId = 1;
    // the element ID to migrate into
    string targetElementId = 2;
  }
}
```

### Output: `MigrateProcessInstanceResponse`

```protobuf
message MigrateProcessInstanceResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No process instance exists with the given key, or it is not active
- No process definition exists with the given target definition key
- No process instance exists with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- A `sourceElementId` does not refer to an element in the process instance's process definition
- A `targetElementId` does not refer to an element in the target process definition
- A `sourceElementId` is mapped by multiple mapping instructions.
  For example, the engine cannot determine how to migrate a process instance when the instructions are: [A->B, A->C].

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- Not all active elements in the given process instance are mapped to the elements in the target process definition
- A mapping instruction changes the type of an element or event
- A mapping instruction changes the implementation of a task
- A mapping instruction refers to an unsupported element (i.e. some elements will be supported later on)
- A mapping instruction refers to element in unsupported scenarios.
  (i.e. migrating active elements with event subscriptions will be supported later on)
- A mapping instruction detaches a boundary event from an active element
- Multiple mapping instructions refer to the same catch event
- A mapping instruction changes a parallel multi-instance body to a sequential multi-instance body or vice versa

## `PublishMessage` RPC

Publishes a single message. Messages are published to specific partitions computed from their
correlation keys.

### Input: `PublishMessageRequest`

```protobuf
message PublishMessageRequest {
  // the name of the message
  string name = 1;
  // the correlation key of the message
  string correlationKey = 2;
  // how long the message should be buffered on the broker, in milliseconds
  int64 timeToLive = 3;
  // the unique ID of the message; can be omitted. only useful to ensure only one message
  // with the given ID will ever be published (during its lifetime)
  string messageId = 4;
  // the message variables as a JSON document; to be valid, the root of the document must be an
  // object, e.g. { "a": "foo" }. [ "foo" ] would not be valid.
  string variables = 5;
  // the tenant id of the message
  string tenantId = 6;
}
```

### Output: `PublishMessageResponse`

```protobuf
message PublishMessageResponse {
  // the unique ID of the message that was published
  int64 key = 1;
  // the tenant id of the message
  string tenantId = 2;
}
```

### Errors

#### GRPC_STATUS_ALREADY_EXISTS

Returned if:

- A message with the same ID was previously published (and is still alive).

#### GRPC_STATUS_NOT_FOUND

- If multi-tenancy is enabled, and `tenantId` is blank (empty string, null)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantId` is not blank (empty string, null), or has an ID other than `<default>`

#### GRPC_STATUS_PERMISSION_DENIED

- If multi-tenancy is enabled, and an unauthorized tenant ID is provided

## `ResolveIncident` RPC

Resolves a given incident. This simply marks the incident as resolved; most likely a call to
UpdateJobRetries or SetVariables will be necessary to actually resolve the
problem, followed by this call.

### Input: `ResolveIncidentRequest`

```protobuf
message ResolveIncidentRequest {
  // the unique ID of the incident to resolve
  int64 incidentKey = 1;
}
```

### Output: `ResolveIncidentResponse`

```protobuf
message ResolveIncidentResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No incident with the given key exists.
- No incident with the given key was found for the tenants the user is authorized to work with.

## `SetVariables` RPC

Updates all the variables of a particular scope (e.g. process instance, flow element instance) from the given JSON document.

### Input: `SetVariablesRequest`

```protobuf
message SetVariablesRequest {
  // the unique identifier of a particular element; can be the process instance key (as
  // obtained during instance creation), or a given element, such as a service task (see
  // elementInstanceKey on the job message)
  int64 elementInstanceKey = 1;
  // a JSON serialized document describing variables as key value pairs; the root of the document
  // must be an object
  string variables = 2;
  // if true, the variables will be merged strictly into the local scope (as indicated by
  // elementInstanceKey); this means the variables is not propagated to upper scopes.
  // for example, let's say we have two scopes, '1' and '2', with each having effective variables as:
  // 1 => `{ "foo" : 2 }`, and 2 => `{ "bar" : 1 }`. if we send an update request with
  // elementInstanceKey = 2, variables `{ "foo" : 5 }`, and local is true, then scope 1 will
  // be unchanged, and scope 2 will now be `{ "bar" : 1, "foo" 5 }`. if local was false, however,
  // then scope 1 would be `{ "foo": 5 }`, and scope 2 would be `{ "bar" : 1 }`.
  bool local = 3;
}
```

### Output: `SetVariablesResponse`

```protobuf
message SetVariablesResponse {
  // the unique key of the set variables command
  int64 key = 1;
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No element with the given `elementInstanceKey` exists.
- No element with the given `elementInstanceKey` was found for the tenants the user is authorized to work with.

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- The given payload is not a valid JSON document; all payloads are expected to be
  valid JSON documents where the root node is an object.

## `ThrowError` RPC

`ThrowError` reports a business error (i.e. non-technical) that occurs while processing a job.

The error is handled in the process by an error catch event. If there is no error catch event with the specified `errorCode`, an incident is raised instead.

Variables can be passed along with the thrown error to provide additional details that can be used in the process.

### Input: `ThrowErrorRequest`

```protobuf
message ThrowErrorRequest {
  // the unique job identifier, as obtained when activating the job
  int64 jobKey = 1;
  // the error code that will be matched with an error catch event
  string errorCode = 2;
  // an optional error message that provides additional context
  string errorMessage = 3;
  // JSON document that will instantiate the variables at the local scope of the
  // error catch event that catches the thrown error; it must be a JSON object, as variables will be mapped in a
  // key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
  // "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
  // valid argument, as the root of the JSON document is an array and not an object.
  string variables = 4;
}
```

### Output: `ThrowErrorResponse`

```protobuf
message ThrowErrorResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No job was found with the given key.
- No job was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- The job is already in a failed state, i.e. ran out of retries.

## `Topology` RPC

Obtains the current topology of the cluster the gateway is part of.

### Input: `TopologyRequest`

```protobuf
message TopologyRequest {
}
```

### Output: `TopologyResponse`

```protobuf
message TopologyResponse {
  // list of brokers part of this cluster
  repeated BrokerInfo brokers = 1;
  // how many nodes are in the cluster
  int32 clusterSize = 2;
  // how many partitions are spread across the cluster
  int32 partitionsCount = 3;
  // configured replication factor for this cluster
  int32 replicationFactor = 4;
  // gateway version
  string gatewayVersion = 5;
}

message BrokerInfo {
  // unique (within a cluster) node ID for the broker
  int32 nodeId = 1;
  // hostname of the broker
  string host = 2;
  // port for the broker
  int32 port = 3;
  // list of partitions managed or replicated on this broker
  repeated Partition partitions = 4;
  // broker version
  string version = 5;
}

message Partition {
  // Describes the Raft role of the broker for a given partition
  enum PartitionBrokerRole {
    LEADER = 0;
    FOLLOWER = 1;
    INACTIVE = 2;
  }

  // Describes the current health of the partition
  enum PartitionBrokerHealth {
    HEALTHY = 0;
    UNHEALTHY = 1;
    DEAD = 2;
  }

  // the unique ID of this partition
  int32 partitionId = 1;
  // the role of the broker for this partition
  PartitionBrokerRole role = 2;
  // the health of this partition
  PartitionBrokerHealth health = 3;
}
```

### Errors

No specific errors.

## `UpdateJobRetries` RPC

Updates the number of retries a job has left. This is mostly useful for jobs that have run out of
retries, should the underlying problem be solved.

### Input: `UpdateJobRetriesRequest`

```protobuf
message UpdateJobRetriesRequest {
  // the unique job identifier, as obtained through ActivateJobs
  int64 jobKey = 1;
  // the new amount of retries for the job; must be positive
  int32 retries = 2;
}
```

### Output: `UpdateJobRetriesResponse`

```protobuf
message UpdateJobRetriesResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No job exists with the given key.
- No job was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- Retries is not greater than 0.

## `UpdateJobTimeout` RPC

Updates the deadline of a job using the timeout (in milliseconds) provided. This can be used for extending or shortening
the job deadline. The new deadline will be calculated from the current time, adding the timeout provided.

### Input: `UpdateJobTimeoutRequest`

```protobuf
message UpdateJobTimeoutRequest {
  // the unique job identifier, as obtained from ActivateJobsResponse
  int64 jobKey = 1;
  // the duration of the new timeout in ms, starting from the current moment
  int64 timeout = 2;
}
```

### Output: `UpdateJobTimeoutResponse`

```protobuf
message UpdateJobTimeoutResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No job exists with the given key.
- No job was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_INVALID_STATE

Returned if:

- The job is not active.

## `DeleteResource` RPC

### Input `DeleteResourceRequest`

```protobuf
message DeleteResourceRequest {
  // The key of the resource that should be deleted. This can either be the key
  // of a process definition, the key of a decision requirements definition or the key of a form.
  int64 resourceKey = 1;
}
```

### Output: `DeleteResourceResponse`

```protobuf
message DeleteResourceResponse {
}
```

### Errors

#### GRPC_STATUS_NOT_FOUND

Returned if:

- No resource exists with the given key.
- No resource was found with the given key for the tenants the user is authorized to work with.

#### GRPC_STATUS_FAILED_PRECONDITION

Returned if:

- The deleted resource is a process definition, and there are running instances for this process definition.

## `StreamActivatedJobs` RPC

Opens a long living stream for the given job type, worker name, job timeout, and fetch variables. This will cause available
jobs in the engine to be activated and pushed down this stream.

See the [job worker's technical reference](/components/concepts/job-workers.md) for more on this.

### Input `StreamActivatedJobsRequest`

```protobuf
message StreamActivatedJobsRequest {
  // the job type, as defined in the BPMN process (e.g. <zeebe:taskDefinition
  // type="payment-service" />)
  string type = 1;
  // the name of the worker activating the jobs, mostly used for logging purposes
  string worker = 2;
  // a job returned after this call will not be activated by another call until the
  // timeout (in ms) has been reached
  int64 timeout = 3;
  // a list of variables to fetch as the job variables; if empty, all visible variables at
  // the time of activation for the scope of the job will be returned
  repeated string fetchVariable = 5;
  // a list of identifiers of tenants for which to stream jobs
  repeated string tenantIds = 6;
}
```

### Output: a stream of `ActivatedJob`

```protobuf
message ActivatedJob {
  // the key, a unique identifier for the job
  int64 key = 1;
  // the type of the job (should match what was requested)
  string type = 2;
  // the job's process instance key
  int64 processInstanceKey = 3;
  // the bpmn process ID of the job process definition
  string bpmnProcessId = 4;
  // the version of the job process definition
  int32 processDefinitionVersion = 5;
  // the key of the job process definition
  int64 processDefinitionKey = 6;
  // the associated task element ID
  string elementId = 7;
  // the unique key identifying the associated task, unique within the scope of the
  // process instance
  int64 elementInstanceKey = 8;
  // a set of custom headers defined during modelling; returned as a serialized
  // JSON document
  string customHeaders = 9;
  // the name of the worker which activated this job
  string worker = 10;
  // the amount of retries left to this job (should always be positive)
  int32 retries = 11;
  // when the job can be activated again, sent as a UNIX epoch timestamp
  int64 deadline = 12;
  // JSON document, computed at activation time, consisting of all visible variables to
  // the task scope
  string variables = 13;
  // the ID of the tenant that owns the job
  string tenantId = 14;
}
```

### Errors

#### GRPC_STATUS_INVALID_ARGUMENT

Returned if:

- Type is blank (empty string, null)
- Timeout less than 1 (ms)
- If multi-tenancy is enabled, and `tenantIds` is empty (empty list)
- If multi-tenancy is enabled, and an invalid tenant ID is provided. A tenant ID is considered invalid if:
  - The tenant ID is blank (empty string, null)
  - The tenant ID is longer than 31 characters
  - The tenant ID contains anything other than alphanumeric characters, dot (.), dash (-), or underscore (\_)
- If multi-tenancy is disabled, and `tenantIds` is not empty (empty list), or has an ID other than `<default>`
