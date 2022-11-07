import React, { useCallback, useMemo } from 'react';
import { atom, config, buildQuery } from '../utils';

const { size, replicas } = config;

/**
 * Not the most performant solution:
 * Every component subscribes to 3 shared atoms.
 */
const $hcol = atom(-1); // highlighted column index
const $hrow = atom(-1); // highlighted row index
const $cursor = atom(-1); // highlighted cell index

function step() {
  $cursor.set((c) => (c + 1) % (size * size));

  window.requestAnimationFrame(step);
}

step();

export const InteractiveGridApp = () => {
  return (
    <div className="app">
      <Header />
      {Array.from({ length: replicas }).map((_, index) => (
        <div className="grid" style={{ width: size * 10 }} key={index}>
          {Array.from({ length: size * size }).map((_, index) => (
            <Cell index={index} key={index} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Header = () => {
  const hc = $hcol.use();
  const hr = $hrow.use();
  const c = $cursor.use();

  return (
    <div>
      <p>
        Size: {size}×{size}, Replicas: {replicas} (total components: {size * size * replicas})
      </p>
      <p style={{ color: '#393' }}>3 atoms:</p>
      <p>
        Highlighted column: {hc}, Highlighted row: {hr}, Cursor: {c}
      </p>
      <p>
        Presets:
        <a href={buildQuery({ size: 40, replicas: 2 })}>40×40×2</a>,{' '}
        <a href={buildQuery({ size: 50, replicas: 3 })}>50×50×3</a>,{' '}
        <a href={buildQuery({ size: 80, replicas: 5 })}>80×80×5</a>,{' '}
        <a href={buildQuery({ size: 160, replicas: 1 })}>160×160×1</a> (you can set any other values
        via URL)
      </p>
    </div>
  );
};

const Cell = (props: { index: number }) => {
  const { index } = props;

  const [column, row] = useMemo(() => {
    return [index % size, Math.floor(index / size)];
  }, [index]);

  const onMouseEnter = useCallback(() => {
    $hcol.set(() => column);
    $hrow.set(() => row);
  }, []);

  const isColumnHighlighted = $hcol.use(useCallback((v) => v === column, []));
  const isRowHighlighted = $hrow.use(useCallback((v) => v === row, []));
  const isCursor = $cursor.use(useCallback((v) => v === index, []));

  const className = useMemo(() => {
    if (isCursor) {
      return '_cursor';
    }

    if (isColumnHighlighted || isRowHighlighted) {
      return '_highlighted';
    }

    return undefined;
  }, [isColumnHighlighted, isRowHighlighted, isCursor]);

  return <i onMouseEnter={onMouseEnter} className={className} />;
};
