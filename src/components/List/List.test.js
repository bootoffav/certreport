import ReactDOM from 'react-dom';
import React from 'react';
import List from './List';


xit('renders to page without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<List />, div);
});

