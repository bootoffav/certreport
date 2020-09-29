import ReactDOM from 'react-dom';
import { Toolbar } from '../components/Toolbar/Toolbar';



import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });


it('can render Toolbar without crashing', () => {
  ReactDOM.render(<Toolbar onClick={() => { }} />, document.createElement('div'));

});

it('shallow rendering the ToolBar with proper labels', () => {
  const wrapper = shallow(<Toolbar />).find('label');
  expect(wrapper.at(0).text()).toBe('All');
  expect(wrapper.at(1).text()).toBe('0. Sample to be prepared');
  expect(wrapper.at(2).text()).toBe('1. Sample sent');
  expect(wrapper.at(3).text()).toBe('2. Sample arrived');
  expect(wrapper.at(4).text()).toBe('3. PI Issued');
  expect(wrapper.at(5).text()).toBe('4. Payment Done');
  expect(wrapper.at(6).text()).toBe('5. Testing is started');
  expect(wrapper.at(7).text()).toBe('6. Pre-treatment done');
  expect(wrapper.at(8).text()).toBe('7. Test-report ready');
  expect(wrapper.at(9).text()).toBe('8. Certificate ready');
  expect(wrapper.at(10).text()).toBe('Results');
  // expect(wrapper.at(11).text()).toBe('Overdue');
});


