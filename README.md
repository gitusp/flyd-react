Flyd React
===

Minimal React bindings for [Flyd](https://github.com/paldepind/flyd).

Installation
---

```bash
npm install flyd-react --save
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

```js
import flyd from "flyd";
import every from "flyd/module/every";
import React from "react";
import { render } from "react-dom";
import { connect } from "flyd-react";

// An example stream which updates every second.
const everySecond = every(1000);
const stream = flyd.scan(n => n + 1, 0, everySecond);

// A container which connects to the stream.
const Container = () => {
  const childProps = {
    count: connect(stream)
  };
  return React.createElement(View, childProps);
};

// A view which displays the count.
const View = ({ count }) => <p>{count}</p>;

// Mount the sample app.
render(React.createElement(Container), document.getElementById("app"));
```

### Lifecycle Optimization

`connect` accepts "dependency values" as React's `useEffect` does.
Passing appropriate deps might be an efficient manner.
In most cases, connecting once when a component is mounted is enough.
Passing `[IDENTICAL]` as a second argument skips all the subsequent connection after mount.

```js
import { connect, IDENTICAL } from "flyd-react";

// Using `[IDENTICAL]` as deps skips all the subsequent connection.
const Container = () => {
  const childProps = {
    count: connect(
      stream,
      [IDENTICAL]
    )
  };
  return React.createElement(View, childProps);
};
```
