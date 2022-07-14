import { NavLink } from 'react-router-dom';
import { BrandFilter } from '../Filters/BrandFilter';
import { StandardFilter } from '../Filters/StandardFilter';
import DateFilter from '../Filters/DateFilter';
import { TestingCompanyFilter } from '../Filters/TestingCompanyFilter';
import State from './State';

const NavBar = () => (
  <>
    <div className="d-flex">
      <State />
      <div className="my-auto">
        <DateFilter />
      </div>
      <div className="ml-auto d-flex">
        <NavLink className="navbar-link" exact to="/dashboard">
          <p>Dashboard</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink className="navbar-link" to="/">
          <p>Certification tasks</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink className="navbar-link" to="/expiringcerts">
          <p>Expiring Certificates</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink className="navbar-link" to="/items">
          <p>Items</p>
        </NavLink>
        <span className="vl"></span>

        <NavLink to="/add">
          <p>Add cert</p>
        </NavLink>
      </div>
    </div>
    <div className="d-flex justify-content-start">
      <BrandFilter />

      <div className="pl-1">
        <TestingCompanyFilter />
      </div>

      <div className="pl-1">
        <StandardFilter />
      </div>
    </div>
  </>
);

export default NavBar;
