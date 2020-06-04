import React from 'react';
import './Filters.css';

const BrandFilter: React.FunctionComponent<{
    tasks: any,
    update: any
}> = ({ tasks, update }) => {

    function filter(
        e: React.SyntheticEvent<HTMLButtonElement>,
    ) {
        let brandFiltered;
        const brand = e.currentTarget.innerText;
        const brandButton = document.getElementById('brandFilter');
        if (brandButton !== null) brandButton.innerText = `Brand: ${brand}`;

        switch (brand) {
            case 'All':
                brandFiltered = tasks;
                break;
            case 'No brand':
                brandFiltered = tasks.filter((task: any) => !Boolean(task.state.brand));
                break;
            default:
                brandFiltered = tasks.filter((task: any) => task.state.brand === brand);
        }
        update({
            brandFiltered,
            stage: 'All',
            visibleData: brandFiltered
        });
    }

    return (
      <div className="dropdown">
            <button
                className="btn btn-success dropdown-toggle"
                type="button"
                id="brandFilter"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >Brand: All</button>
        <div className="dropdown-menu">
            <button className="dropdown-item" onClick={filter}>All</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={filter}>XMT</button>
            <button className="dropdown-item" onClick={filter}>XMS</button>
            <button className="dropdown-item" onClick={filter}>XMF</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={filter}>No brand</button>
        </div>
    </div>);
}

export default BrandFilter;