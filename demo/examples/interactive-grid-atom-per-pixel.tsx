import React, { useCallback, useMemo, useEffect } from 'react';
import { atom, config, buildQuery, singularity } from '../utils';

const { size, replicas } = config;

const $hcol = atom(-1); // highlighted column index
const $hrow = atom(-1); // highlighted row index
const $cursor = atom(-1); // highlighted cell index

const $cells = singularity(() => [false, false]); // isCursor, isHighlighted

export const InteractiveGridAtomPerPixelApp = () => {
  useEffect(() => {
    function step() {
      $cells.set($cursor.get(), ([_, h]) => [false, h]);

      $cursor.set((c) => (c + 1) % (size * size));

      $cells.set($cursor.get(), ([_, h]) => [true, h]);

      window.requestAnimationFrame(step);
    }

    step();
  }, []);
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
      <p style={{ color: '#933' }}>Atom per pixel: {size * size} atoms total, +3 for:</p>
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
    const hcol = $hcol.get();
    const hrow = $hrow.get();

    // naive (and buggy) solution:
    // unhighlight previous column/row, highlight current
    for (let i = 0; i < size; i++) {
      if (hcol !== column && i !== row) {
        $cells.set(i * size + hcol, ([c, _]) => [c, false]);
        $cells.set(i * size + column, ([c, _]) => [c, true]);
      }

      if (hrow !== row && i !== column) {
        $cells.set(hrow * size + i, ([c, _]) => [c, false]);
        $cells.set(row * size + i, ([c, _]) => [c, true]);
      }
    }

    $hcol.set(() => column);
    $hrow.set(() => row);
  }, []);

  const [isCursor, isHighlighted] = $cells.use(index);

  const className = useMemo(() => {
    if (isCursor) {
      return '_cursor';
    }

    if (isHighlighted) {
      return '_highlighted';
    }

    return undefined;
  }, [isCursor, isHighlighted]);

  return <i onMouseEnter={onMouseEnter} className={className} />;
};
