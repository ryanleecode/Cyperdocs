import { combineReducers } from 'redux';

import { combineEpics } from 'redux-observable';
import { epic as documentEpic, reducer as documentReducer } from './document';
import { reducer as roleReducer } from './role';

export interface AppState {
  document: ReturnType<typeof documentReducer>;
  role: ReturnType<typeof roleReducer>;
}

export const rootReducer = combineReducers<AppState>({
  document: documentReducer,
  role: roleReducer,
});

export const rootEpic = combineEpics(documentEpic);
