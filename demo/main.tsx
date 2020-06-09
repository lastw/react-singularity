import React from 'react';
import ReactDOM from 'react-dom';
import { SimpleCounterApp } from './examples/simple-counter';
import { InteractiveGridApp } from './examples/interactive-grid';
import { InteractiveGridAtomPerPixelApp } from './examples/interactive-grid-atom-per-pixel';
import { config, buildQuery } from './utils';

const { concurrent, example } = config;

const Example = (() => {
  switch (example) {
    case 'interactive-grid-atom-per-pixel':
      return InteractiveGridAtomPerPixelApp;
    case 'simple-counter':
      return SimpleCounterApp;
    default:
      return InteractiveGridApp;
  }
})();

const Nav = () => (
  <header>
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

if (concurrent) {
  // @ts-ignore
  ReactDOM.unstable_createRoot(document.querySelector('#root')).render(<App />);
} else {
  ReactDOM.render(<App />, document.querySelector('#root'));
}
