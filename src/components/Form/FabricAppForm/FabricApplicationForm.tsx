import React from 'react';
import { useEffect, useReducer } from 'react';
import WashPreTreatment from './WashPretreatment';
import Footer from './Footer';
import TestRequirement from './TestRequirement';

import FabricAppFormReducer from './FabricAppFormReducer';
import { useParams } from 'react-router';

import './FabricApplicationForm.css';
import DB from 'backend/DBManager';
import { fabricAppFormInitState } from 'Task/emptyState';

type FabricAppFormProps = {
  updateParent: any;
  baseState: any;
};
export const DispatchContext = React.createContext<any>(null);

function FabricApplicationForm({
  baseState,
  updateParent,
}: FabricAppFormProps) {
  const [state, dispatch] = useReducer(
    FabricAppFormReducer,
    fabricAppFormInitState
  );
  const { taskId } = useParams<{ taskId: string }>();
  useEffect(() => {
    if (!baseState) {
      (async () => {
        if (taskId) {
          const data = await DB.getFabricAppFormState(taskId);
          updateParent(data);
          dispatch({ type: 'fromDB', payload: data });
        }
      })();
    } else {
      dispatch({ type: 'fromDB', payload: baseState });
    }
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  useEffect(() => updateParent(state), [state]);
  return (
    <DispatchContext.Provider value={dispatch}>
      <TestRequirement
        state={{
          ...state.testRequirement,
          otherStandard1: state.otherStandard1,
          otherStandard2: state.otherStandard2,
        }}
      />
      <WashPreTreatment
        state={{
          ...state.washPreTreatment,
          washTemp: state.washTemp,
          cycles: state.cycles,
        }}
      />
      <Footer state={state.footer} />
    </DispatchContext.Provider>
  );
}

export default FabricApplicationForm;
