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

  return <T>(def: (key: Key) => T): Singularity<T> => {
    const atoms: Record<Key, Atom<T>> = {};

    const ensure = (key: Key) => (atoms[key] = atoms[key] || atom(def(key)));

    const get = (key: Key) => ensure(key).get();

    return {
      use: <U>(key: Key, selector?: (value: T) => U) => {
        return ensure(key).use(selector);
      },

      get,

      set: (key: Key, fn: (value: T) => T) => {
        const atom = ensure(key);
        atom.set(fn);
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
