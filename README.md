# react-singularity

Ascetic shared state management library for React.

⚠ Work in progress, nothing to see here now :)

## Setup

```
npm i react-singularity
```

At the moment this library does not have React in dependencies, but relies on useState/useEffect hooks. You should pass them explicitly to create atom factory:

```typescript
import { createAtomFactory, createSingularityFactory } from 'react-singularity';

export const atom = createAtomFactory({ useState, useEffect });
export const singularity = createSingularityFactory({ useState, useEffect });
```

## Atom

Atom is a primitive store with `use` and `set` methods.

```typescript
const $count = atom(0);

const Component = () => {
  const onClick = useCallback(() => {
    $count.set((c) => c + 1);
  }, []);

  const count = $count.use();

  return <div onClick={onClick}>{count}</div>;
};
```

(atom also has `get` and `subscribe` methods for advanced usage, see [implementation](./src/atom.ts)).

## Singularity

Singularity is a set of atoms of the same type.

```typescript
const $colors = singularity(() => '#FFFFFF');

const Pixel = ({ x, y }) => {
  const key = `${x},${y}`;

  const onClick = useCallback(() => {
    $colors.set(key, () => '#000000');
  }, []);

  const color = $colors.use(key);

  return <div style={{ background: color }} className="pixel" onClick={onClick} />;
};
```

## Credits

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
