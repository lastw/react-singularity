import React from 'react';
import ReactDOM from 'react-dom';
import { InteractiveGridApp } from './examples/interactive-grid';
import { config } from './utils';

const { concurrent } = config;

const App = InteractiveGridApp;

if (concurrent) {
  // @ts-ignore
  ReactDOM.unstable_createRoot(document.querySelector('#root')).render(<App />);
} else {
  ReactDOM.render(<App />, document.querySelector('#root'));
}
