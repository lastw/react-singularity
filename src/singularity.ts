import React from 'react'; // for types
import { createAtomFactory, Atom } from './atom';

/* eslint-disable react-hooks/rules-of-hooks */

type Key = number | string;

export interface Singularity<T> {
  use(key: Key): T;
  use<U>(key: Key, selector?: (value: T) => U): U;

  get(key: Key): T;
  set(key: Key, fn: (value: T) => T): void;
  dump: () => Record<Key, T>;
}

export const createSingularityFactory = (params: {
  useState: typeof React.useState;
  useEffect: typeof React.useEffect;
}) => {
  const atom = createAtomFactory(params);
  const { useState, useEffect } = params;

  return <T>(def: (key: Key) => T): Singularity<T> => {
    const atoms: Record<Key, Atom<T>> = {};

    const ensure = (key: Key) => (atoms[key] = atoms[key] || atom(def(key)));
    const get = (key: Key) => ensure(key).get();
    const identity = (x: T) => x;

    return {
      use: (key: Key, selector = identity) => {
        const [x, setX] = useState(() => selector(ensure(key).get()));
        const [prevKey, setPrevKey] = useState(key);

        useEffect(() => ensure(key).subscribe((v) => setX(selector(v))), [key, selector]);

        if (prevKey !== key) {
          setPrevKey(key);
          setX(selector(ensure(key).get()));
        }

        return x;
      },

      get,

      set: (key: Key, fn: (value: T) => T) => {
        ensure(key).set(fn);
      },

      dump: () => {
        const values: Record<Key, T> = {};

        for (const key in atoms) {
          values[key] = atoms[key].get();
        }

        return values;
      },
    };
  };
};
