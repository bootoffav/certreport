import React, { useState, useEffect } from 'react';
import './Filters.css';

const BrandFilter: React.FunctionComponent<{
    tasks: any,
    update: any
}> = ({ tasks, update }) => {

    function filter(
        activeBrands: []
    ) {
        let brandFiltered: any;
        // console.log(activeBrands);

        // @ts-ignore
        brandFiltered = tasks.filter((task: any) => activeBrands.includes(task.state.brand));
        console.log(brandFiltered);
        // switch (brand) {
        //     case 'All':
        //         brandFiltered = tasks;
        //         break;
        //     case 'No brand':
        //         brandFiltered = tasks.filter((task: any) => !Boolean(task.state.brand));
        //         break;
        //     default:
        //         brandFiltered = tasks.filter((task: any) => task.state.brand === brand);
        // }
        update({
            // brandFiltered,
            startDate: undefined,
            endDate: undefined,
            stage: 'all',
            visibleData: brandFiltered
        });
    }

    const [XMTState, setXMTState] = useState(true);
    const [XMSState, setXMSState] = useState(true);

    const handleChange = (e: any, brand: string) => {
        switch (brand) {
            case 'XMT':
                setXMTState(e.checked);
                break;
            case 'XMS':
                setXMSState(e.checked);
        }
        // document.querySelectorAll('.btn-group input').forEach(({ checked, value }: any) => {
        //     if (checked) activeBrands.push(value);
        //     setXMTState(checked);
        // });
        // console.log(activeBrands);
        // filter(activeBrands);
        
        e.stopPropagation();
    }
    
    useEffect(() => {
        let activeBrands: any = [];
        for (let [active, br] of [[XMSState, 'XMS'], [XMTState, 'XMT']]) {
            console.log(active, br);
            if (active) activeBrands.push(br);
        }
        console.log(activeBrands);
    });

    return (
        <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-secondary" onClick={(e) => handleChange(e, 'XMT')}>
                <input
                    type="checkbox"
                    value="XMT"
                    checked={XMTState}
                    onClick={(e) => handleChange(e, 'XMT')}
                    /> XMT
            </label>
            <label className="btn btn-secondary" onClick={(e) => handleChange(e, 'XMT')}>
                <input
                    type="checkbox"
                    value="XMS"
                    checked={XMSState}
                    onClick={(e) => handleChange(e, 'XMT')}
                /> XMS
            </label>
           {/* <label className="btn btn-secondary">
                <input
                    type="checkbox"
                    value="XMF"
                    checked
                    // @ts-ignore
                    onClick={handleChange}
                /> XMF
            </label>
            <label className="btn btn-secondary">
                <input
                    type="checkbox"
                    value="No brand"
                    checked
                    // @ts-ignore
                    onClick={handleChange}
                /> No brand
            </label> */}
        </div>
    );
}

export default BrandFilter;













    // return (
    //   <div className="dropdown">
    //         <button
    //             className="btn btn-success dropdown-toggle"
    //             type="button"
    //             id="brandFilter"
    //             data-toggle="dropdown"
    //             aria-haspopup="true"
    //             aria-expanded="false"
    //         >Brand: All</button>
    //     <div className="dropdown-menu">
    //         <button className="dropdown-item" onClick={filter}>All</button>
    //         <div className="dropdown-divider"></div>
    //         <button className="dropdown-item" onClick={filter}>XMT</button>
    //         <button className="dropdown-item" onClick={filter}>XMS</button>
    //         <button className="dropdown-item" onClick={filter}>XMF</button>
    //         <div className="dropdown-divider"></div>
    //         <button className="dropdown-item" onClick={filter}>No brand</button>
    //     </div>
    //     </div>);