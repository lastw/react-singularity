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
  useSyncExternalStore: typeof React.useSyncExternalStore;
}) => {
  const atom = createAtomFactory(params);
  const { useSyncExternalStore } = params;

  return <T>(def: (key: Key) => T): Singularity<T> => {
    const atoms: Record<Key, Atom<T>> = {};

    const ensure = (key: Key) => (atoms[key] = atoms[key] || atom(def(key)));
    const get = (key: Key) => ensure(key).get();
    const identity = (x: T) => x;

    return {
      use: (key: Key, selector = identity) => {
        return useSyncExternalStore(ensure(key).subscribe, () => selector(get(key)));
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
