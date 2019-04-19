import React from 'react';
import { inherits } from 'util';

const Standards: React.FunctionComponent<{
  standards: string;
  standardsResult: {
    [key: string]: string;
  }
  resultChange: (el: React.SyntheticEvent) => void;
}> = (props) => {

  if (props.standards === '') {
    return <div className="d-flex justify-content-center align-items-center h-100">
      <h5 className="text-uppercase">No standards choosen</h5>
    </div>;
    }
  
    const standards = props.standards.split(', ');
    
    /**
     * Return JSX element for standard in form of accordion
     * @param standard string represantation of Standard
     * @param i used as key for React
   * @returns {JSX}
   */
  const renderStandard = (standard: string, i: any) => {
    const id = standard.replace(/\s/g, '');
    return <div key={i}>
      <div className="card">
        <div className="card-header" id={`heading_${id}`}>
          <button className="btn btn-link" onClick={(e) => e.preventDefault()} data-toggle="collapse" data-target={`#collapse_${id}`} aria-expanded="true" aria-controls={`collapse_${id}`}>
            {standard}
          </button>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              checked={props.standardsResult[standard] === 'fail'}
              onChange={props.resultChange}
              name={`radioOptions${id}`}
              data-standard={standard}
              id={`radioFail${id}`}
              value="fail"
              />
            <label className="form-check-label"><span className="oi oi-circle-x"></span></label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              checked={props.standardsResult[standard] === 'pass'}
              onChange={props.resultChange}
              name={`radioOptions${id}`}
              data-standard={standard}
              id={`radioPass${id}`}
              value="pass"
            />
            <label className="form-check-label"><span className="oi oi-thumb-up"></span></label>
          </div>
        </div>

        <div id={`collapse_${id}`} className="collapse show" aria-labelledby={`heading_${id}`} data-parent="#accordionStandards">
          <div className="card-body">
            Здесь будут тесты
          </div>
        </div>
      </div>
    </div>;
  }

  return <>
    {/* <span className="d-flex flex-row-reverse">
      <button className="btn btn-sm btn-light toggle-accordion active mb-2" accordion-id="#accordion"></button>
    </span> */}
    <div className="accordion" id="accordionStandards">{standards.map(renderStandard)}</div>
    </>;
}

const Tests = {
  'EN 11611': [
    'Flame spread - Face ignition(Fabrics /Seams/Accessories)',
    'Flame spread - Button ignition(Fabrics /Seams/Accessories)',
    'Tensile strength(woven fabrics)',
    'Busting strength(knitted fabrics)',
    'Tearing strength(for coated fabrics or laminates)',
    'Impact spatter',
    'Radiant heat',
    'Electrical Resistance',
    'pH',
    'Dimensional stability - After 5 washes',
    'Seam Strength',
    'Industrial washes/Tumble dry - 50 cycles',
  ],
  'EN 11612': [
    'Heat Resistance at 180º(Fabrics/Seams/Accessories)',
    'Flame spread - A1 - Face ignition(Fabrics /Seams/Accessories)',
    'Flame spread - A2 (optional test) - Bottom ignition(Fabrics /Seams/Accessories)',
    'Dimensional stability - After 5 washes',
    'Busting strength(knitted fabrics)',
    'Tearing strength',
  ],
  'EN 1149-3': [],
  'EN 13034': [
    'Seams Tear Stregnht - All types of seams',
    'Abrasion Resistance',
    'Tear Resistance',
    'Tensile Strength',
    'Puncture Resistance',
    'Penetration - Chemical Resistant4 chemicals products',
    'Penetration - Chemical Resistant - GarmentTest',
    'Report Handling Cost/ Test report Emission',
  ]
}


export default Standards;