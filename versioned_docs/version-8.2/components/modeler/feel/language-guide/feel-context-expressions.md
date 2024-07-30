---
id: feel-context-expressions
title: Context expressions
description: "This document outlines context expressions and examples."
---

### Literal

Creates a new context with the given entries. Each entry has a key and a value. The key is either a
name or a string. The value can be any type.

See the [naming conventions](./feel-variables.md#variable-names) for valid key names.

```feel
{
  a: 1,
  b: 2
}
// {a:1, b:2}

{
  "a": 1,
  "b": 2
}
// {a:1, b:2}
```

Inside the context, the previous entries can be accessed.

```feel
{
  a: 2,
  b: a * 2
}
// {a:2, b:4}
```

A context value can embed other context values.

```feel
{
  a: 1,
  b: {
    c: 2
  }
}
// {a:1, b:{c:2}}
```

### Get entry/path

```feel
a.b
```

Accesses the entry with the key `b` of the context `a`. The path is separated by `.`.

If the value of the entry `b` is also a context, the path can be chained (i.e. `a.b.c`).

```feel
{
  a: 2
}.a
// 2

{
  a: {
    b: 3
  }
}.a
// {b: 3}

{
  a: {
    b: 3
  }
}.a.b
// 3
```

### Filter

Filters a list of context elements. It is a special kind of the [filter expression](/docs/components/modeler/feel/language-guide/feel-list-expressions#filter) for lists.

While filtering, the entries of the current context element can be accessed by their key.

```feel
[
  {
    a: "p1",
    b: 5
  },
  {
    a: "p2",
    b: 10
  }
][b > 7]
// [{a: "p2", b: 10}]
```

### Projection

Extracts the entries of a list of context elements by a given key (i.e. a projection). It returns a
list containing the values of the context elements for the given key.

```feel
[
  {
    a: "p1",
    b: 5
  },
  {
    a: "p2",
    b: 10
  }
].a
// ["p1", "p2"]
```
