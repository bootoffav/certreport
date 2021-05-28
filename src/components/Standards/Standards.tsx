import * as React from 'react';
import { StandardResult } from './StandardResult';
import { Price } from '../Form/FormFields';
import { useState, useEffect } from 'react';
import { DB } from '../../backend/DBManager';
import { EN11612Detail } from './EN11612Detail';
import { Requirements } from './Requirements';
import './Standards.css';
import { localizePrice } from '../../helpers';

type StandardsProps = {
  initStandards: string[];
  taskId: string;
  setState: any;
};

const StandardContext = React.createContext({} as any);

function Standards(props: StandardsProps) {
  let standards: any;
  let setStandards: any;
  const initSt: any = {};
  for (let st of props.initStandards) {
    initSt[st] = {};
  }
  [standards, setStandards] = useState(initSt);
  const [totalPrice, setTotalPrice] = useState<number | ''>('');

  useEffect(() => {
    props.taskId &&
      DB.getStandards(props.taskId).then((newSt) => {
        setStandards((state: any) => ({ ...state, ...newSt }));
      });
  }, [props.taskId, setStandards]);

  if (standards === '') {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <h5 className="text-uppercase">No standard chosen</h5>
      </div>
    );
  }

  const updateStandardPrice = ({ standard, price }: any) => {
    DB.updateInstance(props.taskId, {
      standards: {
        [standard]: {
          price,
        },
      },
    });

    // update locally
    setStandards((state: any) => {
      const newState = { ...state };
      newState[standard].price = price;
      return newState;
    });
  };

  const updateStandardResult = ({ standard, result, reset }: any) => {
    // update in DB
    DB.updateInstance(props.taskId, {
      standards: {
        [standard]: {
          result: reset ? null : result,
        },
      },
    });

    // update locally
    setStandards((state: any) => {
      const newState = {
        ...state,
        [standard]: {
          ...state[standard],
        },
      };
      reset
        ? delete newState[standard].result
        : (newState[standard].result = result);

      return newState;
    });
  };

  /**
   * Return JSX element for standard in form of accordion
   * @param standard string represantation of Standard
   * @param i used as key for React
   * @returns {JSX}
   */
  function renderStandard(standard: string, i: any) {
    const id = standard.replace(/\s/g, '');
    return (
      <div key={i}>
        <div className="card">
          <div className="card-header" id={`heading_${id}`}>
            <div className="container-fluid row align-items-center">
              <div className="col-6">
                <button
                  className="btn btn-link"
                  onClick={(e) => e.preventDefault()}
                  data-toggle="collapse"
                  data-target={`#collapse_${id}`}
                  aria-expanded="true"
                  aria-controls={`collapse_${id}`}
                >
                  {standard}
                </button>
                <StandardResult
                  result={standards[standard].result}
                  standard={standard}
                  reset={() => updateStandardResult({ standard, reset: true })}
                  updateResult={(result: string) =>
                    updateStandardResult({
                      standard,
                      result,
                    })
                  }
                  id={id}
                />
              </div>
              <div className="col-3">
                <Price
                  value={standards[standard].price}
                  label=""
                  handleChange={(e: any) => {
                    updateStandardPrice({ standard, price: +e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div
            id={`collapse_${id}`}
            className={standard === 'EN 11612' ? 'show' : 'collapse'}
            aria-labelledby={`heading_${id}`}
            data-parent="#accordionStandards"
          >
            <div className="card-body">
              {standard === 'EN 11612' && (
                <>
                  <EN11612Detail taskId={props.taskId} />
                  <hr />
                </>
              )}
              <Requirements standard={standard} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const context = {
    setTotalPrice: () => {
      const total = Array.from(document.querySelectorAll('.subTotal')).reduce(
        (acc: number, el: any) =>
          acc +
          +el
            .innerHTML!.replaceAll('&nbsp;', '')
            .replaceAll(',', '.')
            .slice(0, -1),
        0
      );
      setTotalPrice(total);
    },
  };

  return (
    <StandardContext.Provider value={context}>
      <div className="float-right font-weight-bold">
        Total price (all selected tests): {localizePrice(totalPrice)}
      </div>
      <div className="accordion" id="accordionStandards">
        {Object.keys(standards).map(renderStandard)}
      </div>
    </StandardContext.Provider>
  );
}

export { StandardContext, Standards };
