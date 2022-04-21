import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.signUp || initialState;

export const selectSignUp = createSelector([selectSlice], state => state);
