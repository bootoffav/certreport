import { NavLink } from 'react-router-dom';
import { BrandFilter } from '../Filters/BrandFilter';
import { StandardFilter } from '../Filters/StandardFilter';
import { DateFilter } from '../Filters/DateFilter';
import { State } from './State';

interface INavBarProps {
  update: any;
  tasks: any[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  updated: boolean;
}

function NavBar({ startDate, endDate, update, updated }: INavBarProps) {
  return (
    <div className="px-1 mb-1 rounded-bottom navbar-light d-flex justify-content-between">
      <State updated={updated} />
      <div>
        <BrandFilter update={update} />
        <StandardFilter update={update} />
      </div>
      <DateFilter startDate={startDate} endDate={endDate} update={update} />

      <div
        className="d-flex justify-content-end align-items-center"
        style={{ fontSize: '16px' }}
      >
        <NavLink className="navbar-link" exact to="/dashboard">
          <p>Dashboard</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink className="navbar-link" to="/">
          <p>Certification tasks</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink className="navbar-link" to="/items">
          <p>Items</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink exact to="/add">
          <p>Add cert</p>
        </NavLink>
      </div>
    </div>
  );
}

export { NavBar };
