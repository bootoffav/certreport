import { NavLink } from 'react-router-dom';
import { BrandFilter } from '../Filters/BrandFilter';
import DateFilter from '../Filters/DateFilter';

interface INavBarProps {
  update: any;
  tasks: any[];
  startDate: Date | undefined;
  endDate: Date | undefined;
}

function NavBar({ tasks, startDate, endDate, update }: INavBarProps) {
  return (
    <div className="pl-1 mb-1 rounded-bottom navbar-light d-flex justify-content-start">
      <BrandFilter tasks={tasks} update={update} />
      <DateFilter startDate={startDate} endDate={endDate} update={update} />
      <div className="container">
        <div
          className="d-flex h-100 justify-content-end align-items-center"
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

          <NavLink className="navbar-link" to="/articles">
            <p>Items</p>
          </NavLink>
          <span className="vl"></span>

          <NavLink exact to="/add">
            <p>Add cert</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export { NavBar };
