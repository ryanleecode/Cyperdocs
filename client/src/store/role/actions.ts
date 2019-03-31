import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Role } from './types';

export const SET_ROLE = 'SET_ROLE';

export const Actions = {
  setRole: (role: Role) => createAction(SET_ROLE, role),
};

export type Actions = ActionsUnion<typeof Actions>;
