import flyd from "flyd";
import { useState, useEffect } from "react";

export const connect = (stream, deps) => {
  const [state, setState] = useState(stream());
  useEffect(() => {
    const s = flyd.on(setState, stream);
    return () => {
      s.end(true);
    };
  }, deps);
  return state;
};
