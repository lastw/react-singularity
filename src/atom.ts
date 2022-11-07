import React from 'react'; // for types
import { subscription, Listener } from './subscription';

/* eslint-disable react-hooks/rules-of-hooks */

export interface Atom<T> {
  use(): T;
  use<U>(selector?: (value: T) => U): U;

  get(): T;
  set(fn: (value: T) => T): void;
  subscribe(fn: Listener<T>): () => void;
}

export const createAtomFactory = (params: {
  useSyncExternalStore: typeof React.useSyncExternalStore;
}) => {
  const { useSyncExternalStore } = params;

  return <T>(def: T): Atom<T> => {
    let value = def;

    const get = () => value;
    const sub = subscription<T>();
    const identity = (x: T) => x;

    return {
      use: (selector = identity) => {
        return useSyncExternalStore(sub.subscribe, () => selector(get()));
      },

      get,

      set: (fn) => {
        value = fn(get());
        sub.notify(value);
      },

      subscribe: sub.subscribe,
    };
  };
};
