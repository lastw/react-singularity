import React, { useCallback } from 'react';
import { atom } from '../utils';

const $counter = atom(0);

export const SimpleCounterApp = () => {
  return (
    <div>
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
    </div>
  );
};

export const Component = () => {
  const onClick = useCallback(() => {
    $counter.set((c) => c + 1);
  }, []);

  const value = $counter.use();

  return (
    <p>
      <button onClick={onClick}>Counter value: {value} (click to increment)</button>
    </p>
  );
};
