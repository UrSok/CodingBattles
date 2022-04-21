import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.exception || initialState;

export const select = createSelector([selectSlice], state => state);
