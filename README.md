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

Since this library depends on [React Hooks API](https://reactjs.org/docs/hooks-intro.html), React version should be higher than 16.8.

Tutorial
---

### Stream Connection

`connect` function connects a stream to a component state internally and returns current value of the state.
The connected state will be updated automatically when the stream emits a new value.

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

// Mount the container.
render(React.createElement(Container), document.getElementById("app"));
```

### Lifecycle Optimization

#### IDENTICAL

`connect` accepts "dependency values" as React's `useEffect` does.
Passing appropriate deps might be effective when it is in a performance critical case.
For most streams, connecting once when a component is mounted is enough.
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

#### Selective Stream

In the following example, passing `[streamKey]` as deps only reconnects when `streamKey` changes.
Note that passing `[IDENTICAL]` will cause problems in this case because given that deps, `connect` skips reconnecting to a new stream even when a new `streamKey` is set.

```js
import { connect } from "flyd-react";

const streams = {
  one: flyd.stream(1),
  two: flyd.stream(2)
};

const Container = ({ streamKey }) => {
  const childProps = {
    count: connect(
      streams[streamKey],
      [streamKey]
    )
  };
  return React.createElement(View, childProps);
};
```
