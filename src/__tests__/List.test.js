import ReactDOM from 'react-dom';
import React from 'react';
import List from '../components/List/List';
import { configure, shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('shallow rendering the List', () => {
  const wrapper = shallow(<List />);
});

it('renders to page without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<List />, div);
});

it('can correctly determine overdue state', () => {
  
});
