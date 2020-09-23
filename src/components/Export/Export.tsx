import React from 'react';
import { AppFormExport } from './PDF/AppFormExport';

const Export = (props: any) =>
    <div id="toolbar" className="col-3 btn-group btn-group-toggle" data-toggle="buttons">
        <label
            className="btn btn-light btn-sm"
            onClick={(e: any) => {
                e.preventDefault();
                new AppFormExport(props).save();
            }}
        ><input type="radio" />Export Fabric Application Form to PDF</label>
    </div>

export default Export;