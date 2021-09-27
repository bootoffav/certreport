import { NavLink } from 'react-router-dom';
import { BrandFilter } from '../Filters/BrandFilter';
import { StandardFilter } from '../Filters/StandardFilter';
import { DateFilter } from '../Filters/DateFilter';
import { TestingCompanyFilter } from '../Filters/TestingCompanyFilter';
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
    <div className="container-fluid rounded-bottom navbar-light mb-1">
      <div className="d-flex">
        <State updated={updated} />
        <DateFilter startDate={startDate} endDate={endDate} update={update} />

        <div className="ml-auto d-flex justify-content-end align-items-center">
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

      <div className="d-flex justify-content-start">
        <BrandFilter update={update} />

        <div className="pl-1">
          <TestingCompanyFilter update={update} />
        </div>

        <div className="pl-1">
          <StandardFilter update={update} />
        </div>
      </div>
    </div>
  );
}

export { NavBar };
