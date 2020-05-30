# Singularity [WIP]

Ascetic shared state management library for React.

## Setup

```typescript
const atom = createAtomFactory({ useState, useEffect });
```

## Usage

```typescript
const counter = atom(0);

const Component = () => {
  const onClick = useCallback(() => {
    counter.set((c) => c + 1);
  }, []);

  const value = counter.use();

  return <div onClick={onClick}>{value}</div>;
};
```

## Credits

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
