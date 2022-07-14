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
        <NavLink className="ml-3 navbar-link" exact to="/dashboard">
          <p>Dashboard</p>
        </NavLink>

        <NavLink className="ml-3 navbar-link" to="/">
          <p>Certification tasks</p>
        </NavLink>

        <NavLink className="ml-3 navbar-link" to="/expiringcerts">
          <p>Expiring Certificates</p>
        </NavLink>

        <NavLink className="ml-3 navbar-link" to="/items">
          <p>Items</p>
        </NavLink>

        <NavLink className="ml-3" to="/add">
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
