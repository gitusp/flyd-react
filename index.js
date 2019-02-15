import flyd from "flyd";
import takeUntil from "flyd/module/takeuntil";
import { useState, useEffect } from "react";

export const connect = (stream, deps) => {
  const [state, setState] = useState(stream());
  useEffect(() => {
    const end = flyd.stream();
    takeUntil(stream, end).map(setState);
    return () => {
      end(true);
    };
  }, deps);
  return state;
};

export const IDENTICAL = {};
