---
id: expressions
title: "Expressions"
---

Expressions can be used to access variables and calculate values dynamically.

The following attributes of BPMN elements **require** an expression:

- Sequence flow on an exclusive gateway: [condition](/reference/bpmn-processes/exclusive-gateways/exclusive-gateways.md#conditions)
- Message catch event / receive task: [correlation key](/reference/bpmn-processes/message-events/message-events.md#messages)
- Multi-instance activity: [input collection](/reference/bpmn-processes/multi-instance/multi-instance.md#defining-the-collection-to-iterate-over), [output element](/reference/bpmn-processes/multi-instance/multi-instance.md#collecting-the-output)
- Input/output variable mappings: [source](variables.md#inputoutput-variable-mappings)

Additionally, the following attributes of BPMN elements can define an expression **optionally** instead of a static value:

- Timer catch event: [timer definition](/reference/bpmn-processes/timer-events/timer-events.md#timers)
- Message catch event / receive task: [message name](/reference/bpmn-processes/message-events/message-events.md#messages)
- Service task: [job type](/reference/bpmn-processes/service-tasks/service-tasks.md#task-definition), [job retries](/reference/bpmn-processes/service-tasks/service-tasks.md#task-definition)
- Call activity: [process id](/reference/bpmn-processes/call-activities/call-activities.md#defining-the-called-process)

## Expressions vs. static values

Some attributes of BPMN elements, like the timer definition of a timer catch event, can be defined either:

- as an expression (e.g. `= remaingTime`), or
- as a static value (e.g. `PT2H`).

Expressions always start with an _equal sign_ (e.g. `= order.amount > 100`). The text behind the equal sign is the actual expression (e.g. `order.amount > 100` checks whether the amount of the order is greater than 100).

If the element does not start with the prefix then it is used as a static value. A static value is used either as a string (e.g. job type) or as a number (e.g. job retries). A string value must not be enclosed in quotes.

Note that an expression can also define a static value by using literals (e.g. `= "foo"`, `= 21`, `= true`, `= [1,2,3]`, `= {x: 22}`, etc.).

## The expression language

An expression is written in **FEEL** (Friendly Enough Expression Language). FEEL is part of the OMG's DMN (Decision Model and Notation) specification. It is designed to have the following properties:

- Side-effect free
- Simple data model with JSON-like object types: numbers, dates, strings, lists, and contexts
- Simple syntax designed for business professionals and developers
- Three-valued logic (true, false, null)

Camunda Cloud integrates the [FEEL Scala](https://github.com/camunda/feel-scala) engine to evaluate FEEL expressions. The following sections cover common use cases in Zeebe. A complete list of supported expressions can be found in [FEEL Expressions](/reference/feel/what-is-feel.md).

### Access variables

A variable can be accessed by its name.

```feel
owner
// "Paul"

totalPrice
// 21.2

items
// ["item-1", "item-2", "item-3"]
```

If a variable is a JSON document/object then it is handled as a FEEL context. A property of the context (aka nested variable property) can be accessed by `.` (a dot) and the property name.

```feel
order.id
// "order-123"

order.customer.name
// "Paul"
```

### Boolean expressions

Values can be compared using the following operators:

<table>
  <tr>
    <th>Operator</th>
    <th>Description</th>
    <th>Example</th>
  </tr>

  <tr>
    <td>= (only <b>one</b> equal sign)</td>
    <td>equal to</td>
    <td>owner = "Paul"</td>
  </tr>

  <tr>
    <td>!=</td>
    <td>not equal to</td>
    <td>owner != "Paul"</td>
  </tr>

  <tr>
    <td>&#60;</td>
    <td>less than</td>
    <td>totalPrice &#60; 25</td>
  </tr>

  <tr>
    <td>&#60;=</td>
    <td>less than or equal to</td>
    <td>totalPrice &#60;= 25</td>
  </tr>

  <tr>
    <td>&#62;</td>
    <td>greater than</td>
    <td>totalPrice &#62; 25</td>
  </tr>

  <tr>
    <td>&#62;=</td>
    <td>greater than or equal to</td>
    <td>totalPrice &#62;= 25</td>
  </tr>

   <tr>
    <td>between [X] and [Y]</td>
    <td>same as <i>(v &#62;= [X] and v &#60;= [Y]])</i></td>
    <td>totalPrice between 10 and 25</td>
   </tr>

</table>

Multiple boolean values can be combined as disjunction (`and`) or conjunction (`or`).

```feel
orderCount >= 5 and orderCount < 15

orderCount > 15 or totalPrice > 50
```

### Null Checks

If a variable or a nested property can be `null` then it can be compared to the `null` value. Comparing `null` to a value different from `null` results in `false`.

```feel
order = null
// true - if "order" is null or doesn't exist

order.id = null
// true - if "order" is null, "order" doesn't exist,
//           "id" is null, or "order" has no property "id"
```

In addition to the comparison with `null`, the built-in function `is defined()` can be used to differentiate between a value that is `null` and a value that doesn’t exist.

```feel
is defined(order)
// true - if "order" has any value or is null

is defined(order.id)
// false - if "order" doesn't exist or it has no property "id"
```

### String Expressions

A string value must be enclosed in double quotes. Multiple string values can be concatenated using the `+` operator.

```feel
"foo" + "bar"
// "foobar"
```

Any value can be transformed into a string value using the `string()` function.

```feel
"order-" + string(orderId)
// "order-123"
```

More functions for string values are available as [built-in String functions](/reference/feel/builtin-functions/feel-built-in-functions-string.md) (e.g. contains, matches, etc.).

### Temporal Expressions

The current date and date-time can be accessed using the built-in functions `today()` and `now()`. In order to store the current date or date-time in a variable, it must be converted to a string using the built-in function `string()`.

```feel
now()
// date and time("2020-04-06T15:30:00@UTC")

today()
// date("2020-04-06")

string(today())
// "2020-04-06"
```

The following operators can be applied on temporal values:

<table>
  <tr>
    <th>Temporal Type</th>
    <th>Examples</th>
    <th>Operators</th>
  </tr>

  <tr>
    <td>date</td>
    <td>date("2020-04-06")</td>
    <td>
      <li>date + duration</li>
      <li>date - date</li>
      <li>date - duration</li>
    </td>
  </tr>

  <tr>
    <td>time</td>
    <td>
      time("15:30:00"),<br/>
      time("15:30:00+02:00"),<br/>
      time("15:30:00@Europe/Berlin")
    </td>
    <td>
      <li>time + duration</li>
      <li>time - time</li>
      <li>time - duration</li>
    </td>
  </tr>

  <tr>
    <td>date-time</td>
    <td>
      date and time("2020-04-06T15:30:00"),<br/>
      date and time("2020-04-06T15:30:00+02:00"),<br/>
      date and time("2020-04-06T15:30:00@UTC")
    </td>
    <td>
      <li>date-time + duration</li>
      <li>date-time - date-time</li>
      <li>date-time - duration</li>
    </td>
  </tr>

  <tr>
    <td>duration</td>
    <td>duration("P12H"),<br/> duration("P4Y")</td>
    <td>
      <li>duration + duration</li>
      <li>duration + date</li>
      <li>duration + time</li>
      <li>duration + date-time</li>
      <li>duration - duration</li>
      <li>date - duration</li>
      <li>time - duration</li>
      <li>date-time - duration</li>
      <li>duration * number</li>
      <li>duration / duration</li>
      <li>duration / number</li>
    </td>
  </tr>

  <tr>
    <td>cycle</td>
    <td>cycle(3, duration("PT1H")),<br/> cycle(duration("P7D"))</td>
    <td> </td>
  </tr>

</table>

A temporal value can be compared in a boolean expression with another temporal value of the same type.

The `cycle` type is different from the other temporal types because it is not supported in the FEEL type system. Instead, it is defined as a function that returns the definition of the cycle as a string in the ISO 8601 format of a recurring time interval. The function expects two arguments: the number of repetitions and the recurring interval as duration. If the first argument is `null` or not passed in then the interval is unbounded (i.e. infinitely repeated).

```feel
cycle(3, duration("PT1H"))
// "R3/PT1H"

cycle(duration("P7D"))
// "R/P7D"
```

### List Expressions

An element of a list can be accessed by its index. The index starts at `1` with the first element (**not** at `0`). A negative index starts at the end by `-1`. If the index is out of the range of the list then `null` is returned instead.

```feel
["a","b","c"][1]
// "a"

["a","b","c"][2]
// "b"

["a","b","c"][-1]
// "c"
```

A list value can be filtered using a boolean expression. The result is a list of elements that fulfill the condition. The current element in the condition is assigned to the variable `item`.

```feel
[1,2,3,4][item > 2]
// [3,4]
```

The operators `every` and `some` can be used to test if all elements or at least one element of a list fulfill a given condition.

```feel
every x in [1,2,3] satisfies x >= 2
// false

some x in [1,2,3] satisfies x > 2
// true
```

### Invoke Functions

A function can be invoked by its name followed by the arguments. The arguments can be assigned to the function parameters either by their position or by defining the parameter names.

```feel
floor(1.5)
// 1

count(["a","b","c"])
// 3

append(["a","b"], "c")
// ["a","b","c"]

contains(string: "foobar", match: "foo")
// true
```

FEEL defines several built-in functions:

- [Conversion Functions](/reference/feel/builtin-functions/feel-built-in-functions-conversion.md)
- [Boolean Functions](/reference/feel/builtin-functions/feel-built-in-functions-boolean.md)
- [String Functions](/reference/feel/builtin-functions/feel-built-in-functions-string.md)
- [Numeric Functions](/reference/feel/builtin-functions/feel-built-in-functions-numeric.md)
- [List Functions](/reference/feel/builtin-functions/feel-built-in-functions-list.md)
- [Context Functions](/reference/feel/builtin-functions/feel-built-in-functions-context.md)
- [Temporal Functions](/reference/feel/builtin-functions/feel-built-in-functions-temporal.md)

## Additional Resources

- [FEEL](/reference/feel/what-is-feel.md)
- [FEEL Data Types](/reference/feel/language-guide/feel-data-types.md)
- [FEEL Expressions](/reference/feel/language-guide/feel-expression.md)
- [DMN Specification](https://www.omg.org/spec/DMN/About-DMN/)
