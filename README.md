React Flyd
===

Minimal React bindings for [Flyd](https://github.com/paldepind/flyd).

Installation
---

```bash
npm install gitusp/react-flyd --save
```

Requirements
---

This library depends on [React Hooks API](https://reactjs.org/docs/hooks-intro.html).
React version should be higher than 16.8.

Tutorial
---

### Stream Connection

Streams are connected to a component state with `connect` function.
A connected state will be updated automatically when the stream emits a new value.

```ts
import * as flyd from "flyd";
import * as every from "flyd/module/every";
import * as React from "react";
import { render } from "react-dom";
import { connect } from "react-flyd";

// An example stream which updates every second.
const everySecond = every(1000);
const stream = flyd.scan(n => n + 1, 0, everySecond);

// A container which connects to the stream.
const Container = () => {
  const state = {
    count: connect(stream)
  };
  return <View {...state} />;
};

// A view which displays the count.
const View = ({ count }: { count: number }) => <p>{count}</p>;

// Mount the sample app.
render(<Container />, document.getElementById("app"));
```

### Lifecycle Optimization

`connect` accepts "dependency values" as React's `useEffect` does.
Passing appropriate deps might be an efficient manner.
In most cases, connecting once when a component is mounted is enough.
Passing `[IDENTICAL]` as a second argument skips all the subsequent connection after mount.

```ts
import { connect, IDENTICAL } from "react-flyd";

// Using `[IDENTICAL]` as deps skips all the subsequent connection.
const Container = () => {
  const state = {
    count: connect(
      stream,
      [IDENTICAL]
    )
  };
  return <View {...state} />;
};
```
