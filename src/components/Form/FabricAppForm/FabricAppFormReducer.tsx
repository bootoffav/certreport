import { FabricAppForm } from 'Task/Task.interface';

function FabricAppFormReducer(state: any, action: any) {
  // @ts-ignore
  const { type, payload } = action;

  function updater({ row, label, checked }: any) {
    const newState = [...state[type]];
    newState[row] = checked
      ? [...newState[row], label]
      : newState[row].filter((item: any) => item !== label);
    return newState;
  }

  switch (type) {
    case 'fromDB':
      return { ...action.payload };
    case 'otherStandard1':
      return {
        ...state,
        otherStandard1: payload.value,
      };
    case 'otherStandard2':
      return {
        ...state,
        otherStandard2: payload.value,
      };
    default:
      return {
        ...state,
        [type]: updater(payload),
      };
  }
}

export default FabricAppFormReducer;
