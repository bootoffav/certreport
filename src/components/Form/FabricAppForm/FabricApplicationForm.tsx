import { without } from 'lodash';
import {
  useEffect,
  useState,
  useReducer,
  Reducer,
  ReducerAction,
  ReducerState,
} from 'react';
// import WashPreTreatmentRequirement from './WashPretreatment';
import Footer from './Footer';
import TestRequirement from './TestRequirement';
import { AppFormExport } from '../../Export/PDF/AppFormExport';
import FabricAppFormReducer from './FabricAppFormReducer';
import { useParams } from 'react-router';

import './FabricApplicationForm.css';
import DB from 'backend/DBManager';
import { emptyState } from 'Task/emptyState';

type FabricAppFormProps = {
  // appForm: any;
  updateParent: any;
};

function FabricApplicationForm({ updateParent }: FabricAppFormProps) {
  const [state, dispatch] = useReducer(FabricAppFormReducer, {
    ...emptyState.FabricAppForm,
  });

  const { id: taskId } = useParams<{ id: string }>();
  useEffect(() => {
    (async () => {
      const data = await DB.getFabricAppFormState(taskId);
      dispatch({ type: 'fromDB', payload: data });
    })();
  }, []);

  useEffect(() => updateParent(state), [state]);
  return (
    <>
      <TestRequirement
        dispatch={dispatch}
        state={{
          ...state.testRequirement,
          otherStandard1: state.otherStandard1,
          otherStandard2: state.otherStandard2,
        }}
      />
      {/* <WashPreTreatmentRequirement /> */}
      <Footer dispatch={dispatch} state={state.footer} />
    </>
  );
}

export default FabricApplicationForm;
