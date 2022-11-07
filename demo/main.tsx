import React from 'react';
import { createRoot } from 'react-dom/client';
import { SingularityApp } from './examples/singularity';
import { SimpleCounterApp } from './examples/simple-counter';
import { InteractiveGridApp } from './examples/interactive-grid';
import { InteractiveGridAtomPerPixelApp } from './examples/interactive-grid-atom-per-pixel';
import { config, buildQuery } from './utils';

const { example } = config;

const Example = (() => {
  switch (example) {
    case 'interactive-grid-atom-per-pixel':
      return InteractiveGridAtomPerPixelApp;
    case 'simple-counter':
      return SimpleCounterApp;
    case 'singularity':
      return SingularityApp;
    default:
      return InteractiveGridApp;
  }
})();

const Nav = () => (
  <header>
    <a href={buildQuery({ example: 'singularity' })}>Simple singularity</a>,{' '}
    <a href={buildQuery({ example: 'simple-counter' })}>Simple counter</a>,{' '}
    <a href={buildQuery({ example: 'interactive-grid' })}>Interactive grid</a>,{' '}
    <a href={buildQuery({ example: 'interactive-grid-atom-per-pixel' })}>
      Interactive grid (atom per pixel)
    </a>
  </header>
);

const App = () => (
  <>
    <Nav />
    <Example />
  </>
);

const root = createRoot(document.querySelector('#root')!);
root.render(<App />);
