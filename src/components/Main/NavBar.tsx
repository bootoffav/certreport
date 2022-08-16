import { NavLink } from 'react-router-dom';
import { BrandFilter } from '../Filters/BrandFilter';
import StandardFilter from '../Filters/StandardFilter';
import DateFilter from '../Filters/DateFilter';
import TestingCompanyFilter from '../Filters/TestingCompanyFilter';

const NavBar = () => (
  <>
    <div className="d-flex">
      <div className="my-auto">
        <DateFilter />
      </div>
      <div className="ml-auto d-flex">
        <MainNavigation />
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

function MainNavigation() {
  const addresses = [
    ['/dashboard', 'Dashboard'],
    ['/', 'Certification tasks'],
    ['/expiringcerts', 'Expiring Certificates'],
    ['/items', 'Items'],
    ['/add', 'Add cert'],
  ];
  return (
    <>
      {addresses.map(([to, LinkText]) => (
        <NavLink className="p-1" to={to} key={to}>
          {({ isActive }) => (
            <p style={isActive ? { fontWeight: 'bolder' } : {}}>{LinkText}</p>
          )}
        </NavLink>
      ))}
    </>
  );
}
export default NavBar;
