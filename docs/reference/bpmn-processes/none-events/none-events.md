---
id: none-events
title: "None events"
---
None events are unspecified events, also called "blank" events.

![process](assets/none-events.png)

## None start events

A process can have at most one none start event (besides other types of start events).

A none start event is where the process instance or a subprocess starts when the process or the subprocess is activated.

## None end events

A process or subprocess can have multiple none end events. When a none end event is entered then the current execution path ends. If the process instance or subprocess has no more active execution paths then it is completed.

If an activity has no outgoing sequence flow then it behaves the same as it would be connected to a none end event. When the activity is completed then the current execution path ends.

## Additional resources

### XML Representation
A none start event:

```xml
<bpmn:startEvent id="order-placed" name="Order Placed" />
```

A none end event:
```xml
<bpmn:endEvent id="order-delivered" name="Order Delivered" />
```
