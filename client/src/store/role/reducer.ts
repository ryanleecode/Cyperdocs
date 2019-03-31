import produce from 'immer';
import * as fromActions from './actions';
import { Role } from './types';

export const initialState = {
  role: 'Alice' as Role,
};

export type State = typeof initialState;

export const reducer = (
  state = initialState,
  action: fromActions.Actions,
): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_ROLE: {
        draft.role = action.payload;
      }
      default:
        break;
    }
  });
