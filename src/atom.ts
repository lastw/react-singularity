import React from 'react'; // for types
import { subscription } from './subscription';

/* eslint-disable react-hooks/rules-of-hooks */

export const createAtomFactory = (params: {
  useState: typeof React.useState;
  useEffect: typeof React.useEffect;
}) => {
  const { useState, useEffect } = params;

  return <T>(def: T) => {
    let value = def;

    const get = () => value;
    const sub = subscription<T>();

    return {
      use: <U>(selector?: (value: T) => U) => {
        const [x, setX] = useState(selector ? selector(get()) : get());

        useEffect(() => sub.subscribe((v) => setX(selector ? selector(v) : v)), [selector]);

        return x;
      },

      get,

      set: (fn: (value: T) => T) => {
        value = fn(get());
        sub.notify(value);
      },
    };
  };
};
